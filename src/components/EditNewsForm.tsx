import { useState } from 'react';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import { newsService, NewsItem } from '../services/newsService';
import toast from 'react-hot-toast';

export default function EditNewsForm({ item, onClose, onSuccess, coverImage, setCoverImage }: {
  item: NewsItem;
  onClose: () => void;
  onSuccess: () => void;
  coverImage: File | null;
  setCoverImage: (file: File | null) => void;
}) {
  const [title, setTitle] = useState(item.title);
  const [content, setContent] = useState(item.content);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      await newsService.updateNews(item.id, {
        title,
        content,
        originalLang: item.originalLang,
      });
      toast.success('News updated!');
      onSuccess();
    } catch (error) {
      toast.error('Failed to update news');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-gray-700">Title</label>
        <input
          type="text"
          value={title}
          onChange={e => setTitle(e.target.value)}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
          required
        />
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700">Content</label>
        <ReactQuill value={content} onChange={setContent} className="h-40" />
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700">Cover Image</label>
        <input
          type="file"
          accept="image/*"
          onChange={e => setCoverImage(e.target.files ? e.target.files[0] : null)}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
        />
      </div>
      <div className="flex justify-end space-x-2">
        <button
          type="button"
          onClick={onClose}
          className="btn-secondary"
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