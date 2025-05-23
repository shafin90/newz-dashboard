import api from '../config/api';

export interface NewsItem {
  _id: string;
  id?: string;
  title: { [key: string]: string };
  content: { [key: string]: string };
  originalLang: string;
  coverImage?: string;
  translations: {
    [key: string]: {
      title: string;
      content: string;
    };
  };
  createdAt: string;
  updatedAt: string;
  views: number;
}

export interface CreateNewsData {
  title: string;
  content: string;
  originalLang: string;
}

export interface UpdateNewsData {
  title?: { [key: string]: string };
  content?: { [key: string]: string };
  originalLang?: string;
}

export interface PaginatedNewsResponse {
  data: NewsItem[];
  totalPages: number;
}

export const newsService = {
  // Get all news items
  getAllNews: async (page = 1): Promise<PaginatedNewsResponse> => {
    const response = await api.get(`/news?page=${page}`);
    return response.data;
  },

  // Get a single news item
  getNewsById: async (id: string): Promise<NewsItem> => {
    const response = await api.get(`/news/${id}`);
    return response.data;
  },

  // Create a new news item
  createNews: async (data: FormData): Promise<NewsItem> => {
    const response = await api.post('/news', data, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    });
    return response.data;
  },

  // Update a news item
  updateNews: async (id: string, data: FormData | UpdateNewsData): Promise<NewsItem> => {
    const response = await api.put(`/news/${id}`, data, {
      headers: data instanceof FormData ? {
        'Content-Type': 'multipart/form-data'
      } : {
        'Content-Type': 'application/json'
      }
    });
    return response.data;
  },

  // Delete a news item
  deleteNews: async (id: string): Promise<void> => {
    await api.delete(`/news/${id}`);
  },

  // Update a specific translation
  updateTranslation: async (
    id: string,
    lang: string,
    data: { title: string; content: string }
  ): Promise<NewsItem> => {
    const response = await api.put(`/news/${id}/translation/${lang}`, data);
    return response.data;
  },
}; 