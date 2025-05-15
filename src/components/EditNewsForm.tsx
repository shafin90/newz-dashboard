import { useState, useEffect } from 'react';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import { newsService, NewsItem } from '../services/newsService';
import toast from 'react-hot-toast';

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

export default function EditNewsForm({ item, onClose, onSuccess, coverImage, setCoverImage }: {
  item: NewsItem;
  onClose: () => void;
  onSuccess: () => void;
  coverImage: File | null;
  setCoverImage: (file: File | null) => void;
}) {
  // Initialize state with existing data
  const [title, setTitle] = useState<{ [key: string]: string }>({});
  const [content, setContent] = useState<{ [key: string]: string }>({});
  const [selectedLang, setSelectedLang] = useState(item.originalLang || 'en');
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Load existing data when component mounts
  useEffect(() => {
    if (item) {
      // Handle both string and object formats
      const titleData = typeof item.title === 'object' ? item.title : { [item.originalLang]: item.title };
      const contentData = typeof item.content === 'object' ? item.content : { [item.originalLang]: item.content };
      
      setTitle(titleData);
      setContent(contentData);
      setSelectedLang(item.originalLang || 'en');
    }
  }, [item]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    try {
      // Only send the fields that have been modified
      const updateData: any = {
        originalLang: item.originalLang // Always send originalLang
      };
      
      // Only include title if it's been modified
      if (Object.keys(title).length > 0) {
        updateData.title = title;
      }
      
      // Only include content if it's been modified
      if (Object.keys(content).length > 0) {
        updateData.content = content;
      }

      await newsService.updateNews(item.id, updateData);
      toast.success('News updated successfully!');
      onSuccess();
    } catch (error) {
      console.error('Update error:', error);
      toast.error('Failed to update news');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Select Language</label>
        <select
          value={selectedLang}
          onChange={e => setSelectedLang(e.target.value)}
          className="mb-4 block w-full rounded-md border-gray-300 shadow-sm"
        >
          {languages.map(lang => (
            <option key={lang.code} value={lang.code}>{lang.name}</option>
          ))}
        </select>
      </div>
      
      <div>
        <label className="block text-xs font-medium text-gray-600 mb-1">
          Title ({languages.find(l => l.code === selectedLang)?.name})
        </label>
        <input
          type="text"
          value={title[selectedLang] || ''}
          onChange={e => setTitle({ ...title, [selectedLang]: e.target.value })}
          className="mb-2 block w-full rounded-md border-gray-300 shadow-sm text-base h-12"
        />
      </div>

      <div>
        <label className="block text-xs font-medium text-gray-600 mb-1">
          Content ({languages.find(l => l.code === selectedLang)?.name})
        </label>
        <ReactQuill
          value={content[selectedLang] || ''}
          onChange={val => setContent({ ...content, [selectedLang]: val })}
          className="h-40 mb-2"
        />
      </div>

      <div style={{ position: 'relative', zIndex: 10, background: 'white' }}>
        <label className="block text-sm font-medium text-gray-700">Cover Image</label>
        <input
          type="file"
          accept="image/*"
          onChange={e => setCoverImage(e.target.files ? e.target.files[0] : null)}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm bg-white"
          style={{ background: 'white', zIndex: 10, position: 'relative' }}
        />
      </div>

      <div className="flex justify-end space-x-2">
        <button
          type="button"
          onClick={onClose}
          className="btn-secondary"
          tabIndex={0}
        >
          Cancel
        </button>
        <button
          type="submit"
          disabled={isSubmitting}
          className="btn-primary"
        >
          {isSubmitting ? 'Saving...' : 'Save'}
        </button>
      </div>
    </form>
  );
} 