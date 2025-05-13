import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar } from 'recharts';

const dailyViewsData = [
  { date: '2024-03-01', views: 1200 },
  { date: '2024-03-02', views: 1500 },
  { date: '2024-03-03', views: 1800 },
  { date: '2024-03-04', views: 1600 },
  { date: '2024-03-05', views: 2000 },
  { date: '2024-03-06', views: 2200 },
  { date: '2024-03-07', views: 1900 },
];

const topNewsData = [
  { title: 'Breaking News 1', views: 5000 },
  { title: 'Breaking News 2', views: 4500 },
  { title: 'Breaking News 3', views: 4000 },
  { title: 'Breaking News 4', views: 3500 },
  { title: 'Breaking News 5', views: 3000 },
];

export default function Analytics() {
  return (
    <div className="space-y-8">
      <h1 className="text-2xl font-semibold text-gray-900">Analytics Dashboard</h1>
      
      {/* Summary Cards */}
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
        <div className="card p-6">
          <h3 className="text-sm font-medium text-gray-500">Total Views Today</h3>
          <p className="mt-2 text-3xl font-semibold text-gray-900">2,200</p>
          <p className="mt-1 text-sm text-green-600">↑ 15% from yesterday</p>
        </div>
        <div className="card p-6">
          <h3 className="text-sm font-medium text-gray-500">Total News Articles</h3>
          <p className="mt-2 text-3xl font-semibold text-gray-900">156</p>
          <p className="mt-1 text-sm text-green-600">↑ 5 new today</p>
        </div>
        <div className="card p-6">
          <h3 className="text-sm font-medium text-gray-500">Average Views per Article</h3>
          <p className="mt-2 text-3xl font-semibold text-gray-900">1,450</p>
          <p className="mt-1 text-sm text-green-600">↑ 8% from last week</p>
        </div>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 gap-8 lg:grid-cols-2">
        <div className="card p-6">
          <h3 className="text-lg font-medium text-gray-900">Daily News Views</h3>
          <div className="mt-6 h-80">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={dailyViewsData}>
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
              <BarChart data={topNewsData}>
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
    </div>
  );
} 