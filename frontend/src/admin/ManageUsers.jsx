import { useEffect, useState } from 'react';
import API from '../api';
import AdminLayout from './AdminLayout';

const ManageUsers = () => {
  const [users, setUsers]     = useState([]);
  const [search, setSearch]   = useState('');
  const [loading, setLoading] = useState(true);

  const fetchUsers = () => {
    API.get('/admin/users').then(res => { setUsers(res.data); setLoading(false); });
  };

  useEffect(() => { fetchUsers(); }, []);

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this user?')) return;
    await API.delete(`/admin/users/${id}`);
    fetchUsers();
  };

  const filtered = users.filter(u =>
    u.username.toLowerCase().includes(search.toLowerCase()) ||
    u.email.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <AdminLayout>
      <div className="adm-page">
        <div className="adm-page-header">
          <h1>👥 Manage Users</h1>
          <span className="adm-count-badge">{users.length} users</span>
        </div>

        <div className="adm-search-bar">
          <input value={search} onChange={e => setSearch(e.target.value)} placeholder="🔍 Search by username or email…" />
          <span>{filtered.length} results</span>
        </div>

        {loading ? <p className="adm-loading">Loading…</p> : (
          <div className="adm-table-card">
            <table className="adm-table">
              <thead>
                <tr><th>#</th><th>Username</th><th>Email</th><th>Joined</th><th>Action</th></tr>
              </thead>
              <tbody>
                {filtered.map((u, i) => (
                  <tr key={u._id}>
                    <td>{i + 1}</td>
                    <td>
                      <span className="adm-user-badge">{u.username[0].toUpperCase()}</span>
                      {u.username}
                    </td>
                    <td>{u.email}</td>
                    <td>{new Date(u.createdAt).toLocaleDateString('en-IN', { day:'2-digit', month:'short', year:'numeric' })}</td>
                    <td>
                      <button className="adm-btn-delete" onClick={() => handleDelete(u._id)}>🗑️ Delete</button>
                    </td>
                  </tr>
                ))}
                {filtered.length === 0 && (
                  <tr><td colSpan={5} style={{ textAlign:'center', color:'#aaa', padding:'32px' }}>No users found</td></tr>
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </AdminLayout>
  );
};

export default ManageUsers;
