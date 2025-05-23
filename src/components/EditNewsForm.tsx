import { useState } from 'react';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import { newsService, NewsItem } from '../services/newsService';
import { BASE_URL } from '../config/api';
import toast from 'react-hot-toast';
import PreviewModal from './PreviewModal';

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

interface EditNewsFormProps {
  item: NewsItem;
  onClose: () => void;
  onSuccess: () => void;
}

export default function EditNewsForm({ item, onClose, onSuccess }: EditNewsFormProps) {
  const [selectedLang, setSelectedLang] = useState(item.originalLang || 'en');
  const [title, setTitle] = useState(item.title?.[selectedLang] || '');
  const [content, setContent] = useState(item.content?.[selectedLang] || '');
  const [coverImage, setCoverImage] = useState<File | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showPreview, setShowPreview] = useState(false);
  const [previewImage, setPreviewImage] = useState<string | undefined>(item.coverImage);

  const handleLanguageChange = (lang: string) => {
    setSelectedLang(lang);
    setTitle(item.title?.[lang] || '');
    setContent(item.content?.[lang] || '');
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setCoverImage(file);
      setPreviewImage(URL.createObjectURL(file));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !content.trim()) {
      toast.error('Please fill in all fields');
      return;
    }

    setIsSubmitting(true);
    try {
      const formData = new FormData();
      
      // Create title and content objects with all languages
      const titleObj = { ...item.title };
      const contentObj = { ...item.content };

      // Update the selected language content
      titleObj[selectedLang] = title;
      contentObj[selectedLang] = content;

      formData.append('title', JSON.stringify(titleObj));
      formData.append('content', JSON.stringify(contentObj));
      formData.append('originalLang', selectedLang);
      
      if (coverImage) {
        formData.append('coverImage', coverImage);
      }

      await newsService.updateNews(item._id, formData);
      toast.success('News updated successfully');
      onSuccess();
    } catch (error) {
      console.error('Update error:', error);
      toast.error('Failed to update news');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="space-y-6">
        <div>
          <label htmlFor="language" className="block text-sm font-medium text-gray-700">
            Select Language
          </label>
          <select
            id="language"
            value={selectedLang}
            onChange={(e) => handleLanguageChange(e.target.value)}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
          >
            {languages.map((lang) => (
              <option key={lang.code} value={lang.code}>
                {lang.name}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">
            Title
          </label>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">
            Content
          </label>
          <div className="mt-1">
            <ReactQuill
              theme="snow"
              value={content}
              onChange={setContent}
              className="h-64 mb-12"
              modules={{
                toolbar: [
                  [{ 'header': [1, 2, 3, 4, 5, 6, false] }],
                  [{ 'size': ['small', 'normal', 'large', 'huge'] }],
                  [{ 'font': [] }],
                  ['bold', 'italic', 'underline', 'strike'],
                  [{ 'color': [] }, { 'background': [] }],
                  [{ 'align': [] }],
                  [{ 'list': 'ordered'}, { 'list': 'bullet' }],
                  ['blockquote', 'code-block'],
                  ['link', 'image'],
                  ['clean']
                ],
              }}
              formats={[
                'header',
                'size',
                'font',
                'bold', 'italic', 'underline', 'strike',
                'color', 'background',
                'align',
                'list', 'bullet',
                'blockquote', 'code-block',
                'link', 'image'
              ]}
            />
          </div>
        </div>

        <div className="mt-8">
          <label className="block text-sm font-medium text-gray-700">
            Cover Image
          </label>
          <input
            type="file"
            accept="image/*"
            onChange={handleImageChange}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
          />
          {previewImage && !coverImage && (
            <img
              src={`${BASE_URL}${previewImage}`}
              alt="Current cover"
              className="mt-2 h-32 w-auto object-cover rounded"
            />
          )}
          {coverImage && previewImage && (
            <img
              src={previewImage}
              alt="New cover"
              className="mt-2 h-32 w-auto object-cover rounded"
            />
          )}
        </div>
      </div>

      <div className="flex justify-between items-center gap-2 pt-6">
        <button
          type="button"
          onClick={() => setShowPreview(true)}
          className="px-4 py-2 text-sm font-medium text-blue-600 bg-blue-50 border border-transparent rounded-md hover:bg-blue-100"
        >
          Preview
        </button>
        
        <div className="flex gap-2">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={isSubmitting}
            className="px-4 py-2 text-sm font-medium text-white bg-blue-600 border border-transparent rounded-md hover:bg-blue-700 disabled:bg-blue-400"
          >
            {isSubmitting ? 'Saving...' : 'Save Changes'}
          </button>
        </div>
      </div>

      {showPreview && (
        <PreviewModal
          title={title}
          content={content}
          coverImage={previewImage}
          onClose={() => setShowPreview(false)}
        />
      )}
    </form>
  );
} 