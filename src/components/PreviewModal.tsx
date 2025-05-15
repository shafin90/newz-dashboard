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
        <div className="p-2 border-b sticky top-0 bg-white flex justify-between items-center">
          <h2 className="text-lg font-semibold">Preview</h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Content */}
        <div className="overflow-y-auto flex-1 p-4">
          <article className="max-w-none">
            {/* Cover Image */}
            {coverImage && (
              <img
                src={coverImage.startsWith('http') ? coverImage : `${BASE_URL}${coverImage}`}
                alt="Cover"
                className="w-full h-40 object-cover rounded-lg mb-3"
              />
            )}

            {/* Title */}
            <h1 className="text-xl font-bold mb-2">{title}</h1>

            {/* Content */}
            <div 
              dangerouslySetInnerHTML={{ __html: content }}
              className="text-base [&>*]:mb-1.5 [&_p]:leading-normal [&_p]:text-gray-600
                [&_h1]:text-xl [&_h1]:font-bold [&_h1]:mb-2
                [&_h2]:text-lg [&_h2]:font-semibold [&_h2]:mb-2
                [&_h3]:text-base [&_h3]:font-semibold [&_h3]:mb-1.5
                [&_ul]:list-disc [&_ul]:pl-4 [&_ul]:mb-1.5
                [&_ol]:list-decimal [&_ol]:pl-4 [&_ol]:mb-1.5
                [&_li]:mb-0.5
                [&_blockquote]:pl-4 [&_blockquote]:border-l-4 [&_blockquote]:border-gray-200 [&_blockquote]:italic [&_blockquote]:my-2
                [&_pre]:bg-gray-50 [&_pre]:p-2 [&_pre]:rounded [&_pre]:my-2
                [&_img]:rounded [&_img]:my-2
                [&_a]:text-blue-600 [&_a]:hover:underline"
            />
          </article>
        </div>
      </div>
    </div>
  );
} 