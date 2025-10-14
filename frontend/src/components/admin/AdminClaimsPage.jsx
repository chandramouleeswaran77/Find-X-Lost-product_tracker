import React, { useEffect, useState } from 'react';
import { FiCheck, FiX, FiRefreshCcw } from 'react-icons/fi';
import api from '../../apiClient';
import { showToast } from '../ui/Toast';

const AdminClaimsPage = () => {
  const [claims, setClaims] = useState([]);
  const [loading, setLoading] = useState(true);
  const [actioningId, setActioningId] = useState(null);

  const fetchClaims = async () => {
    try {
      setLoading(true);
      const res = await api.get('/api/admin/claims', { headers: { 'X-Role': 'ADMIN' } });
      setClaims(res.data || []);
    } catch (e) {
      console.error(e);
      showToast.error('Failed to load claims');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchClaims();
  }, []);

  const approve = async (id) => {
    try {
      setActioningId(id);
      await api.put(`/api/admin/found/${id}/approve-claim`, null, { headers: { 'X-Role': 'ADMIN' } });
      showToast.success('Claim approved');
      await fetchClaims();
    } catch (e) {
      console.error(e);
      showToast.error('Failed to approve claim');
    } finally {
      setActioningId(null);
    }
  };

  const decline = async (id) => {
    const reason = window.prompt('Optional: Add a reason for declining');
    try {
      setActioningId(id);
      await api.put(`/api/admin/found/${id}/decline-claim`, null, { params: { reason }, headers: { 'X-Role': 'ADMIN' } });
      showToast.success('Claim declined');
      await fetchClaims();
    } catch (e) {
      console.error(e);
      showToast.error('Failed to decline claim');
    } finally {
      setActioningId(null);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-light py-8">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-3xl font-bold">Pending Claims</h1>
          <button className="btn" onClick={fetchClaims}>
            <FiRefreshCcw className="inline mr-2" /> Refresh
          </button>
        </div>

        {loading ? (
          <div className="card">Loading...</div>
        ) : claims.length === 0 ? (
          <div className="card">No pending claims.</div>
        ) : (
          <div className="grid grid-cols-1 gap-4">
            {claims.map((c) => (
              <div key={c.id} className="card md:flex md:items-center md:justify-between">
                {/* Left: image + details */}
                <div className="flex items-start gap-4 flex-1 min-w-0">
                  <div className="w-20 h-20 bg-gray-100 rounded overflow-hidden flex-shrink-0">
                    {c.imageUrl ? (
                      <img src={c.imageUrl} alt={c.item} className="w-full h-full object-cover" />
                    ) : (
                      <div className="w-full h-full" />
                    )}
                  </div>
                  <div className="min-w-0">
                    <div className="font-semibold text-lg truncate">{c.item}</div>
                    <div className="text-sm text-gray-600 break-words">{c.description}</div>
                    {c.claimDescription && (
                      <div className="mt-2 text-sm break-words"><span className="font-semibold">Claim:</span> {c.claimDescription}</div>
                    )}
                    <div className="mt-1 space-y-1 text-sm">
                      {c.claimIdProof && (
                        <div><span className="font-semibold">ID Proof:</span> {c.claimIdProof}</div>
                      )}
                      {c.pendingClaimUserId && (
                        <div><span className="font-semibold">Claimant:</span> {c.pendingClaimUserId}</div>
                      )}
                    </div>
                    {c.status && (
                      <div className="text-xs inline-block px-2 py-1 rounded bg-yellow-100 text-yellow-700 mt-2">{c.status}</div>
                    )}
                  </div>
                </div>
                {/* Right: actions */}
                {c.status === 'PENDING_CLAIM' ? (
                  <div className="mt-4 md:mt-0 flex items-center gap-2 md:ml-6">
                    <button disabled={actioningId===c.id} className="btn-primary" onClick={() => approve(c.id)}>
                      <FiCheck className="inline mr-2"/> Approve
                    </button>
                    <button disabled={actioningId===c.id} className="btn-danger" onClick={() => decline(c.id)}>
                      <FiX className="inline mr-2"/> Decline
                    </button>
                  </div>
                ) : (
                  <div className="mt-4 md:mt-0 text-sm text-gray-500 md:ml-6">No actions available</div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminClaimsPage;


