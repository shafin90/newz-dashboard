import React from 'react';
import { BASE_URL } from '../config/api';

interface PreviewModalProps {
  title: string;
  content: string;
  coverImage?: string;
  onClose: () => void;
}

export default function PreviewModal({ title, content, coverImage, onClose }: PreviewModalProps) {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg w-full max-w-4xl max-h-[90vh] overflow-hidden flex flex-col">
        {/* Header */}
        <div className="p-4 border-b sticky top-0 bg-white flex justify-between items-center">
          <h2 className="text-xl font-semibold">Preview</h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Content */}
        <div className="overflow-y-auto flex-1 p-6">
          <article className="prose prose-lg max-w-none">
            {/* Cover Image */}
            {coverImage && (
              <img
                src={coverImage.startsWith('http') ? coverImage : `${BASE_URL}${coverImage}`}
                alt="Cover"
                className="w-full h-64 object-cover rounded-lg mb-6"
              />
            )}

            {/* Title */}
            <h1 className="text-3xl font-bold mb-6">{title}</h1>

            {/* Content */}
            <div dangerouslySetInnerHTML={{ __html: content }} />
          </article>
        </div>
      </div>
    </div>
  );
} 