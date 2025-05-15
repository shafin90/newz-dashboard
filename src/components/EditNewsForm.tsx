import { useState } from 'react';
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

// Step 1: Language Selection Modal
const LanguageSelectionModal = ({ 
  item, 
  onLanguageSelect, 
  onClose 
}: { 
  item: NewsItem;
  onLanguageSelect: (lang: string) => void;
  onClose: () => void;
}) => {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg p-6 w-full max-w-md">
        <h2 className="text-xl font-semibold mb-4">Select Language to Edit</h2>
        
        {/* Original Language Info */}
        <div className="mb-4 p-3 bg-gray-50 rounded-md">
          <p className="text-sm text-gray-600">
            Original Language: <span className="font-semibold">{languages.find(l => l.code === item.originalLang)?.name}</span>
          </p>
        </div>

        {/* Language Selection */}
        <div className="space-y-2">
          {languages.map(lang => (
            <button
              key={lang.code}
              onClick={() => onLanguageSelect(lang.code)}
              className={`w-full p-3 text-left rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-indigo-500 ${
                lang.code === item.originalLang ? 'opacity-50 cursor-not-allowed' : ''
              }`}
              disabled={lang.code === item.originalLang}
            >
              <span className="font-medium">{lang.name}</span>
              {lang.code === item.originalLang && (
                <span className="ml-2 text-sm text-gray-500">(Original)</span>
              )}
            </button>
          ))}
        </div>

        <button
          onClick={onClose}
          className="mt-4 w-full p-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
        >
          Cancel
        </button>
      </div>
    </div>
  );
};

// Step 2: Content Edit Modal
const ContentEditModal = ({
  item,
  selectedLang,
  onSave,
  onClose
}: {
  item: NewsItem;
  selectedLang: string;
  onSave: () => void;
  onClose: () => void;
}) => {
  const [translatedTitle, setTranslatedTitle] = useState(item.title[selectedLang] || '');
  const [translatedContent, setTranslatedContent] = useState(item.content[selectedLang] || '');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      await newsService.updateTranslation(item.id, selectedLang, {
        title: translatedTitle.trim(),
        content: translatedContent.trim()
      });

      toast.success(`${languages.find(l => l.code === selectedLang)?.name} translation updated!`);
      onSave();
    } catch (error) {
      console.error('Update error:', error);
      toast.error('Failed to update translation');
    } finally {
      setIsSubmitting(false);
    }
  };

  const selectedLanguage = languages.find(l => l.code === selectedLang)?.name;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg p-6 w-full max-w-4xl max-h-[90vh] overflow-y-auto">
        <h2 className="text-xl font-semibold mb-4">
          Edit {selectedLanguage} Translation
        </h2>

        {/* Original Content Reference */}
        <div className="mb-6 p-4 bg-gray-50 rounded-lg">
          <h3 className="text-sm font-medium text-gray-700 mb-2">Original Content ({languages.find(l => l.code === item.originalLang)?.name})</h3>
          <div className="space-y-2">
            <p className="text-sm font-medium text-gray-600">Title:</p>
            <p className="p-2 bg-white rounded border border-gray-200">{item.title[item.originalLang]}</p>
            <p className="text-sm font-medium text-gray-600">Content:</p>
            <div className="p-2 bg-white rounded border border-gray-200 prose max-w-none" dangerouslySetInnerHTML={{ __html: item.content[item.originalLang] }} />
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              {selectedLanguage} Title
            </label>
            <input
              type="text"
              value={translatedTitle}
              onChange={e => setTranslatedTitle(e.target.value)}
              className="w-full p-2 border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500"
              placeholder={`Enter ${selectedLanguage} title`}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              {selectedLanguage} Content
            </label>
            <ReactQuill
              value={translatedContent}
              onChange={setTranslatedContent}
              className="bg-white border border-gray-300 rounded-md"
              theme="snow"
              placeholder={`Enter ${selectedLanguage} content`}
            />
          </div>

          <div className="flex justify-end space-x-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 disabled:bg-gray-400"
            >
              {isSubmitting ? 'Saving...' : 'Save Translation'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

// Main Component
export default function EditNewsForm({ item, onClose, onSuccess }: {
  item: NewsItem;
  onClose: () => void;
  onSuccess: () => void;
}) {
  const [selectedLang, setSelectedLang] = useState<string>('');
  const [step, setStep] = useState<'language' | 'content'>('language');

  const handleLanguageSelect = (lang: string) => {
    setSelectedLang(lang);
    setStep('content');
  };

  const handleSave = () => {
    onSuccess();
    onClose();
  };

  if (step === 'language') {
    return (
      <LanguageSelectionModal
        item={item}
        onLanguageSelect={handleLanguageSelect}
        onClose={onClose}
      />
    );
  }

  return (
    <ContentEditModal
      item={item}
      selectedLang={selectedLang}
      onSave={handleSave}
      onClose={onClose}
    />
  );
} 