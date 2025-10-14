import React, { useEffect, useState } from 'react';
import { FiTrash2, FiRefreshCcw } from 'react-icons/fi';
import api from '../../apiClient';
import { showToast } from '../ui/Toast';

const AdminItemsPage = () => {
  const [lost, setLost] = useState([]);
  const [found, setFound] = useState([]);
  const [loading, setLoading] = useState(true);

  const load = async () => {
    try {
      setLoading(true);
      const [l, f] = await Promise.all([
        api.get('/api/admin/lost', { headers: { 'X-Role': 'ADMIN' } }),
        api.get('/api/admin/found', { headers: { 'X-Role': 'ADMIN' } })
      ]);
      setLost(l.data || []);
      setFound(f.data || []);
    } catch (e) {
      console.error(e);
      showToast.error('Failed to load items');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { load(); }, []);

  const removeLost = async (id) => {
    try {
      await api.delete(`/api/admin/lost/${id}`, { headers: { 'X-Role': 'ADMIN' } });
      showToast.success('Lost item removed');
      await load();
    } catch (e) {
      showToast.error('Failed to remove lost item');
    }
  };

  const removeFound = async (id) => {
    try {
      await api.delete(`/api/admin/found/${id}`, { headers: { 'X-Role': 'ADMIN' } });
      showToast.success('Found item removed');
      await load();
    } catch (e) {
      showToast.error('Failed to remove found item');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-light py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-3xl font-bold">Manage Items</h1>
          <button className="btn" onClick={load}><FiRefreshCcw className="inline mr-2"/> Refresh</button>
        </div>

        {loading ? (
          <div className="card">Loading...</div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="card">
              <h2 className="text-xl font-semibold mb-4">Lost Items</h2>
              <div className="space-y-3">
                {lost.map(item => (
                  <div key={item.id} className="flex items-center justify-between p-3 rounded border">
                    <div className="flex items-center gap-3">
                      <div className="w-16 h-16 bg-gray-100 rounded overflow-hidden">
                        {item.imageUrl ? (
                          <img src={item.imageUrl} alt={item.item} className="w-full h-full object-cover"/>
                        ) : (
                          <div className="w-full h-full" />
                        )}
                      </div>
                      <div>
                        <div className="font-semibold">{item.item}</div>
                        <div className="text-sm text-gray-600">{item.description}</div>
                      </div>
                    </div>
                    <button className="btn-danger" onClick={() => removeLost(item.id)}>
                      <FiTrash2 className="inline mr-2"/> Remove
                    </button>
                  </div>
                ))}
              </div>
            </div>

            <div className="card">
              <h2 className="text-xl font-semibold mb-4">Found Items</h2>
              <div className="space-y-3">
                {found.map(item => (
                  <div key={item.id} className="flex items-center justify-between p-3 rounded border">
                    <div className="flex items-center gap-3">
                      <div className="w-16 h-16 bg-gray-100 rounded overflow-hidden">
                        {item.imageUrl ? (
                          <img src={item.imageUrl} alt={item.item} className="w-full h-full object-cover"/>
                        ) : (
                          <div className="w-full h-full" />
                        )}
                      </div>
                      <div>
                        <div className="font-semibold">{item.item}</div>
                        <div className="text-sm text-gray-600">{item.description}</div>
                      </div>
                    </div>
                    <button className="btn-danger" onClick={() => removeFound(item.id)}>
                      <FiTrash2 className="inline mr-2"/> Remove
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminItemsPage;


