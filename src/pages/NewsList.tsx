import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  PencilIcon,
  TrashIcon,
} from '@heroicons/react/24/outline';
import { newsService, NewsItem } from '../services/newsService';
import toast from 'react-hot-toast';
import EditNewsForm from '../components/EditNewsForm';
import PreviewModal from '../components/PreviewModal';

const languages = [
  { code: 'en', name: 'English' },
  { code: 'de', name: 'German' },
  { code: 'es', name: 'Spanish' },
  { code: 'fr', name: 'French' },
  { code: 'it', name: 'Italian' },
  { code: 'ru', name: 'Russian' },
  { code: 'ar', name: 'Arabic' },
  { code: 'tr', name: 'Turkish' },
];

export default function NewsList() {
  const [news, setNews] = useState<NewsItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [editItem, setEditItem] = useState<NewsItem | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [selectedLang, setSelectedLang] = useState('en');
  const [showPreview, setShowPreview] = useState(false);
  const [previewItem, setPreviewItem] = useState<NewsItem | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    fetchNews(currentPage);
  }, [currentPage]);

  const fetchNews = async (page = 1) => {
    setIsLoading(true);
    try {
      const response = await newsService.getAllNews(page);
      setNews(response.data);
      setTotalPages(response.totalPages || 1);
    } catch (error) {
      toast.error('Failed to fetch news');
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (window.confirm('Are you sure you want to delete this news item?')) {
      try {
        await newsService.deleteNews(id);
        toast.success('News deleted successfully');
        fetchNews(currentPage);
      } catch (error) {
        toast.error('Failed to delete news');
      }
    }
  };

  function openEditModal(item: NewsItem) {
    setEditItem(item);
    setIsEditOpen(true);
  }

  function closeEditModal() {
    setIsEditOpen(false);
    setEditItem(null);
  }

  function openPreviewModal(item: NewsItem) {
    setPreviewItem(item);
    setShowPreview(true);
  }

  function closePreviewModal() {
    setShowPreview(false);
    setPreviewItem(null);
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-lg text-gray-600">Loading...</div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold text-gray-900">News List</h1>
        <div className="flex gap-2">
          <select
            value={selectedLang}
            onChange={(e) => setSelectedLang(e.target.value)}
            className="rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
          >
            {languages.map((lang) => (
              <option key={lang.code} value={lang.code}>
                {lang.name}
              </option>
            ))}
          </select>
          <button
            className="btn-secondary"
            onClick={() => fetchNews(currentPage)}
          >
            Refresh
          </button>
          <button
            className="btn-primary"
            onClick={() => navigate('/dashboard/add-news')}
          >
            Add New Article
          </button>
        </div>
      </div>

      <div className="card">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Title
                </th>
                <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Content
                </th>
                <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Original Language
                </th>
                <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Views
                </th>
                <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Published Date
                </th>
                <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {news.map((item) => (
                <tr key={item._id}>
                  <td className="px-4 py-3 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900 leading-relaxed">
                      {item.title?.[selectedLang] || ''}
                    </div>
                  </td>
                  <td className="px-4 py-3 whitespace-nowrap">
                    <div
                      className="text-sm text-gray-500 leading-relaxed"
                      dangerouslySetInnerHTML={{ 
                        __html: item.content?.[selectedLang] ? 
                          item.content[selectedLang].substring(0, 100) + '...' : 
                          '' 
                      }}
                    />
                  </td>
                  <td className="px-4 py-3 whitespace-nowrap">
                    <div className="text-sm text-gray-500 leading-relaxed">
                      {languages.find(lang => lang.code === item.originalLang)?.name || ''}
                    </div>
                  </td>
                  <td className="px-4 py-3 whitespace-nowrap">
                    <div className="text-sm text-gray-500 leading-relaxed">{item.views}</div>
                  </td>
                  <td className="px-4 py-3 whitespace-nowrap">
                    <div className="text-sm text-gray-500 leading-relaxed">
                      {new Date(item.createdAt).toLocaleDateString()}
                    </div>
                  </td>
                  <td className="px-4 py-3 whitespace-nowrap text-sm font-medium space-x-2">
                    <button
                      onClick={() => openPreviewModal(item)}
                      className="text-blue-600 hover:text-blue-900"
                    >
                      Preview
                    </button>
                    <button
                      onClick={() => openEditModal(item)}
                      className="text-blue-600 hover:text-blue-900"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDelete(item._id)}
                      className="text-red-600 hover:text-red-900"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {/* Pagination Controls */}
        <div className="flex justify-center items-center gap-2 py-4">
          {Array.from({ length: totalPages }, (_, i) => (
            <button
              key={i + 1}
              className={`px-4 py-2 rounded ${
                currentPage === i + 1
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
              onClick={() => setCurrentPage(i + 1)}
              disabled={currentPage === i + 1}
            >
              {i + 1}
            </button>
          ))}
        </div>
      </div>

      {isEditOpen && editItem && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-30 p-4">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-4xl max-h-[90vh] overflow-hidden">
            <div className="px-6 py-4 border-b border-gray-200">
              <h2 className="text-xl font-bold text-gray-900">Edit News</h2>
            </div>
            <div className="p-6 overflow-y-auto" style={{ maxHeight: 'calc(90vh - 10rem)' }}>
              <EditNewsForm
                item={editItem}
                onClose={closeEditModal}
                onSuccess={() => {
                  closeEditModal();
                  fetchNews();
                }}
              />
            </div>
          </div>
        </div>
      )}

      {showPreview && previewItem && (
        <PreviewModal
          title={previewItem.title[selectedLang] || ''}
          content={previewItem.content[selectedLang] || ''}
          coverImage={previewItem.coverImage}
          onClose={closePreviewModal}
        />
      )}
    </div>
  );
} 