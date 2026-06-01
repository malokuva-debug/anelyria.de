import React, { useState, useEffect } from 'react';
import { LayoutGrid, Plus, Globe, Shield, Database, Users, Loader2, Power, Trash2, CheckCircle2, XCircle } from 'lucide-react';
import { useStore } from '../store/useStore';

export const BuilderPage = () => {
  const [tenants, setTenants] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newTenant, setNewTenant] = useState({ name: '', slug: '', managerEmail: '', managerPassword: '' });
  const [creating, setCreating] = useState(false);
  const [error, setError] = useState('');
  const { token, logout } = useStore();

  const fetchTenants = async () => {
    try {
      const response = await fetch('/api/admin/tenants', {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (response.status === 401 || response.status === 403) {
        logout();
        return;
      }
      const data = await response.json();
      setTenants(data);
    } catch (err) {
      console.error('Failed to fetch tenants');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTenants();
  }, [token]);

  const handleCreateTenant = async (e: React.FormEvent) => {
    e.preventDefault();
    setCreating(true);
    setError('');
    try {
      const response = await fetch('/api/admin/tenants', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(newTenant),
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.message || 'Failed to create tenant');
      
      setIsModalOpen(false);
      setNewTenant({ name: '', slug: '', managerEmail: '', managerPassword: '' });
      fetchTenants();
    } catch (err: any) {
      setError(err.message);
    } finally {
      setCreating(false);
    }
  };

  const toggleTenantStatus = async (id: string, currentActive: boolean) => {
    try {
      await fetch(`/api/admin/tenants/${id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ active: !currentActive }),
      });
      fetchTenants();
    } catch (err) {
      console.error('Failed to update tenant');
    }
  };

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-black">
        <Loader2 className="w-12 h-12 text-purple-500 animate-spin" />
      </div>
    );
  }

  return (
    <div className="p-8 space-y-8 bg-black min-h-screen text-white">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-white to-white/60">
            Platform Builder
          </h1>
          <p className="text-white/60 mt-1">Super Admin Dashboard</p>
        </div>
        <div className="flex gap-4">
          <button 
            onClick={fetchTenants}
            className="flex items-center gap-2 px-4 py-2 bg-white/5 hover:bg-white/10 rounded-lg transition-colors font-medium border border-white/10"
          >
            Refresh
          </button>
          <button 
            onClick={() => setIsModalOpen(true)}
            className="flex items-center gap-2 px-4 py-2 bg-purple-600 hover:bg-purple-700 rounded-lg transition-colors font-medium shadow-lg shadow-purple-600/20"
          >
            <Plus className="w-4 h-4" />
            Create New Tenant
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard icon={<Globe className="text-blue-400" />} label="Total Tenants" value={tenants.length.toString()} />
        <StatCard icon={<Users className="text-purple-400" />} label="Total Users" value={tenants.length > 0 ? "Connected" : "0"} />
        <StatCard icon={<Database className="text-green-400" />} label="Active Databases" value={tenants.filter(t => t.active).length.toString()} />
        <StatCard icon={<Shield className="text-red-400" />} label="Platform Health" value="100%" />
      </div>

      <div className="glass-panel overflow-hidden border border-white/10 rounded-2xl">
        <div className="p-6 border-b border-white/10 bg-white/5">
          <h2 className="text-xl font-bold">Manage Tenants</h2>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="border-b border-white/5 bg-white/5">
                <th className="px-6 py-4 font-medium text-white/60">Name</th>
                <th className="px-6 py-4 font-medium text-white/60">Slug / Domain</th>
                <th className="px-6 py-4 font-medium text-white/60">Created At</th>
                <th className="px-6 py-4 font-medium text-white/60">Status</th>
                <th className="px-6 py-4 font-medium text-white/60">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {tenants.map((tenant) => (
                <tr key={tenant.id} className="hover:bg-white/5 transition-colors">
                  <td className="px-6 py-4 font-medium">{tenant.name}</td>
                  <td className="px-6 py-4 text-white/60">
                    <div className="flex flex-col">
                      <span>{tenant.slug}.anelyria.de</span>
                      <span className="text-xs text-white/30">{tenant.dbName}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-white/60">
                    {new Date(tenant.createdAt).toLocaleDateString()}
                  </td>
                  <td className="px-6 py-4">
                    {tenant.active ? (
                      <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium bg-green-500/10 text-green-400 border border-green-500/20">
                        <CheckCircle2 className="w-3 h-3" />
                        Active
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium bg-red-500/10 text-red-400 border border-red-500/20">
                        <XCircle className="w-3 h-3" />
                        Inactive
                      </span>
                    )}
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <button 
                        onClick={() => toggleTenantStatus(tenant.id, tenant.active)}
                        className={`p-2 rounded-lg transition-colors ${tenant.active ? 'text-white/40 hover:text-red-400 hover:bg-red-400/10' : 'text-white/40 hover:text-green-400 hover:bg-green-400/10'}`}
                        title={tenant.active ? 'Deactivate' : 'Activate'}
                      >
                        <Power className="w-4 h-4" />
                      </button>
                      <button className="p-2 rounded-lg text-white/40 hover:text-white hover:bg-white/10 transition-colors">
                        <Database className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
              {tenants.length === 0 && (
                <tr>
                  <td colSpan={5} className="px-6 py-12 text-center text-white/40">
                    No tenants found. Create your first one to get started.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
          <div className="w-full max-w-md glass-panel border border-white/10 rounded-2xl overflow-hidden animate-in fade-in zoom-in duration-200">
            <div className="p-6 border-b border-white/10 bg-white/5">
              <h3 className="text-xl font-bold">Provision New Tenant</h3>
            </div>
            <form onSubmit={handleCreateTenant} className="p-6 space-y-4">
              {error && (
                <div className="p-3 bg-red-500/10 border border-red-500/20 rounded-xl text-red-400 text-sm text-center">
                  {error}
                </div>
              )}
              <div className="space-y-1">
                <label className="text-xs font-medium text-white/60 ml-1">Tenant Name</label>
                <input
                  required
                  type="text"
                  placeholder="Acme Corp"
                  value={newTenant.name}
                  onChange={e => setNewTenant({...newTenant, name: e.target.value})}
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-white focus:outline-none focus:ring-2 focus:ring-purple-500/50 transition-all"
                />
              </div>
              <div className="space-y-1">
                <label className="text-xs font-medium text-white/60 ml-1">Subdomain Slug</label>
                <input
                  required
                  type="text"
                  placeholder="acme"
                  value={newTenant.slug}
                  onChange={e => setNewTenant({...newTenant, slug: e.target.value.toLowerCase().replace(/[^a-z0-9-]/g, '')})}
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-white focus:outline-none focus:ring-2 focus:ring-purple-500/50 transition-all"
                />
              </div>
              <hr className="border-white/5 my-4" />
              <div className="space-y-1">
                <label className="text-xs font-medium text-white/60 ml-1">Manager Email</label>
                <input
                  required
                  type="email"
                  placeholder="admin@acme.com"
                  value={newTenant.managerEmail}
                  onChange={e => setNewTenant({...newTenant, managerEmail: e.target.value})}
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-white focus:outline-none focus:ring-2 focus:ring-purple-500/50 transition-all"
                />
              </div>
              <div className="space-y-1">
                <label className="text-xs font-medium text-white/60 ml-1">Initial Password</label>
                <input
                  required
                  type="password"
                  placeholder="••••••••••••"
                  value={newTenant.managerPassword}
                  onChange={e => setNewTenant({...newTenant, managerPassword: e.target.value})}
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-white focus:outline-none focus:ring-2 focus:ring-purple-500/50 transition-all"
                />
              </div>
              <div className="flex gap-3 mt-6">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="flex-1 px-4 py-2.5 rounded-xl bg-white/5 hover:bg-white/10 transition-colors font-medium border border-white/10"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={creating}
                  className="flex-1 px-4 py-2.5 rounded-xl bg-purple-600 hover:bg-purple-700 transition-colors font-medium shadow-lg shadow-purple-600/20 disabled:opacity-50 flex items-center justify-center"
                >
                  {creating ? <Loader2 className="w-5 h-5 animate-spin" /> : 'Provision'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

const StatCard = ({ icon, label, value }: { icon: React.ReactNode, label: string, value: string }) => (
  <div className="glass-panel p-6 space-y-2 border border-white/10 rounded-2xl bg-white/5 hover:bg-white/10 transition-all">
    <div className="flex items-center gap-3">
      {icon}
      <span className="text-sm font-medium text-white/60">{label}</span>
    </div>
    <div className="text-2xl font-bold">{value}</div>
  </div>
);
