import { useEffect, useState } from 'react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar } from 'recharts';
import api from '../config/api';

export default function Analytics() {
  const [data, setData] = useState<any>({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchAnalytics() {
      try {
        const res = await api.get('/news/admin/analytics');
        setData(res.data);
      } catch (err) {
        // handle error
      } finally {
        setLoading(false);
      }
    }
    fetchAnalytics();
  }, []);

  const analytics = Array.isArray(data.analytics) ? data.analytics : [];
  const topNews = Array.isArray(data.topNews) ? data.topNews : [];
  const dailyViews = Array.isArray(data.dailyViews) ? data.dailyViews : [];

  const totalViews = analytics.reduce((sum, item) => sum + (item.views || 0), 0);
  const avgViews = analytics.length > 0 ? Math.round(totalViews / analytics.length) : 0;

  return (
    <div className="space-y-8">
      <h1 className="text-2xl font-semibold text-gray-900">Analytics Dashboard</h1>
      {loading ? (
        <div>Loading...</div>
      ) : (
        <>
          {/* Summary Cards */}
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            <div className="card p-6">
              <h3 className="text-sm font-medium text-gray-500">Total Views Today</h3>
              <p className="mt-2 text-3xl font-semibold text-gray-900">{data.totalViewsToday ?? 0}</p>
            </div>
            <div className="card p-6">
              <h3 className="text-sm font-medium text-gray-500">Total News Articles</h3>
              <p className="mt-2 text-3xl font-semibold text-gray-900">{data.total ?? 0}</p>
              <p className="mt-1 text-sm text-green-600">↑ {data.newArticlesToday ?? 0} new today</p>
            </div>
            <div className="card p-6">
              <h3 className="text-sm font-medium text-gray-500">Average Views per Article</h3>
              <p className="mt-2 text-3xl font-semibold text-gray-900">{data.avgViews ?? 0}</p>
            </div>
          </div>

          {/* Charts */}
          <div className="grid grid-cols-1 gap-8 lg:grid-cols-2">
            <div className="card p-6">
              <h3 className="text-lg font-medium text-gray-900">Daily News Views</h3>
              <div className="mt-6 h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={dailyViews}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="date" />
                    <YAxis />
                    <Tooltip />
                    <Area type="monotone" dataKey="views" stroke="#0ea5e9" fill="#e0f2fe" />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </div>
            <div className="card p-6">
              <h3 className="text-lg font-medium text-gray-900">Top News Articles</h3>
              <div className="mt-6 h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={topNews}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="title" />
                    <YAxis />
                    <Tooltip />
                    <Bar dataKey="views" fill="#0ea5e9" />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
} 