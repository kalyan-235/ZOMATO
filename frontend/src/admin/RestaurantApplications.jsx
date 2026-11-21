import { useEffect, useState } from 'react';
import API from '../api';
import AdminLayout from './AdminLayout';
import './restaurant-applications.css';

const STATUSES = ['pending', 'approved', 'rejected'];

const formatDate = (date) => new Date(date).toLocaleDateString('en-IN', {
  day: '2-digit',
  month: 'short',
  year: 'numeric',
});

const RestaurantApplications = () => {
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState('');
  const [actionError, setActionError] = useState('');
  const [notice, setNotice] = useState('');
  const [updatingId, setUpdatingId] = useState('');
  const [refreshKey, setRefreshKey] = useState(0);

  useEffect(() => {
    let active = true;

    const loadApplications = async () => {
      setLoading(true);
      setLoadError('');
      try {
        const response = await API.get('/admin/restaurant-applications');
        if (active) setApplications(response.data);
      } catch (error) {
        if (active) {
          setLoadError(error.response?.data?.message || 'Unable to load restaurant applications.');
        }
      } finally {
        if (active) setLoading(false);
      }
    };

    loadApplications();
    return () => { active = false; };
  }, [refreshKey]);

  const handleReview = async (applicationId, approvalStatus) => {
    setUpdatingId(applicationId);
    setActionError('');
    setNotice('');

    try {
      const response = await API.patch(
        `/admin/restaurant-applications/${applicationId}/status`,
        { approvalStatus }
      );
      setApplications((current) => current.map((application) => (
        application._id === applicationId ? response.data : application
      )));
      setNotice(`${response.data.name} ${approvalStatus}.`);
    } catch (error) {
      setActionError(error.response?.data?.message || `Unable to ${approvalStatus} this application.`);
    } finally {
      setUpdatingId('');
    }
  };

  const counts = applications.reduce((result, application) => {
    result[application.approvalStatus] = (result[application.approvalStatus] || 0) + 1;
    return result;
  }, { pending: 0, approved: 0, rejected: 0 });

  return (
    <AdminLayout>
      <div className="adm-page raa-page">
        <div className="adm-page-header raa-header">
          <div>
            <h1>Restaurant applications</h1>
            <p>Review restaurant owner submissions before they go live.</p>
          </div>
          <button
            className="adm-btn-outline"
            type="button"
            onClick={() => setRefreshKey((key) => key + 1)}
            disabled={loading}
          >
            Refresh
          </button>
        </div>

        <div className="raa-summary" aria-label="Application totals">
          {STATUSES.map((status) => (
            <div className={`raa-summary-card raa-${status}`} key={status}>
              <span>{status}</span>
              <strong>{counts[status]}</strong>
            </div>
          ))}
        </div>

        {notice && <p className="adm-toast" role="status">{notice}</p>}
        {actionError && <p className="adm-toast adm-toast-error" role="alert">{actionError}</p>}
        {loadError && (
          <div className="raa-state raa-error" role="alert">
            <p>{loadError}</p>
            <button type="button" className="adm-btn-outline" onClick={() => setRefreshKey((key) => key + 1)}>
              Try again
            </button>
          </div>
        )}
        {loading && <p className="adm-loading">Loading restaurant applications…</p>}
        {!loading && !loadError && applications.length === 0 && (
          <div className="raa-state">
            <span aria-hidden="true">📋</span>
            <p>No restaurant applications yet.</p>
          </div>
        )}

        {!loading && !loadError && applications.length > 0 && (
          <div className="raa-grid">
            {applications.map((application) => {
              const isUpdating = updatingId === application._id;
              const canReview = application.approvalStatus === 'pending';
              const ownerName = application.owner?.username || 'Owner account unavailable';
              return (
                <article className="raa-card" key={application._id}>
                  <div className="raa-card-header">
                    <div className="raa-avatar" aria-hidden="true">
                      {application.name?.charAt(0)?.toUpperCase() || 'R'}
                    </div>
                    <div className="raa-title">
                      <h2>{application.name}</h2>
                      <span className={`raa-status raa-status-${application.approvalStatus}`}>
                        {application.approvalStatus}
                      </span>
                    </div>
                  </div>

                  <dl className="raa-details">
                    <div><dt>Owner</dt><dd>{ownerName}</dd></div>
                    <div><dt>Email</dt><dd>{application.owner?.email || '—'}</dd></div>
                    <div><dt>Address</dt><dd>{application.address}</dd></div>
                    {application.phone && <div><dt>Phone</dt><dd>{application.phone}</dd></div>}
                    {application.city && <div><dt>City</dt><dd>{application.city}</dd></div>}
                    {application.cuisine && <div><dt>Cuisine</dt><dd>{application.cuisine}</dd></div>}
                    <div>
                      <dt>Submitted</dt>
                      <dd><time dateTime={application.createdAt}>{formatDate(application.createdAt)}</time></dd>
                    </div>
                  </dl>

                  {canReview && (
                    <div className="raa-actions">
                      <button
                        type="button"
                        className="raa-approve"
                        onClick={() => handleReview(application._id, 'approved')}
                        disabled={isUpdating}
                      >
                        {isUpdating ? 'Saving…' : 'Approve'}
                      </button>
                      <button
                        type="button"
                        className="raa-reject"
                        onClick={() => handleReview(application._id, 'rejected')}
                        disabled={isUpdating}
                      >
                        {isUpdating ? 'Saving…' : 'Reject'}
                      </button>
                    </div>
                  )}
                </article>
              );
            })}
          </div>
        )}
      </div>
    </AdminLayout>
  );
};

export default RestaurantApplications;
