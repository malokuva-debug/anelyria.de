import React, { useState } from 'react';
import { LayoutGrid, Plus, Globe, Shield, Database, Users } from 'lucide-react';
import { Card } from '../components/icons';

export const BuilderPage = () => {
  const [tenants, setTenants] = useState([
    { id: '1', name: 'Acme Corp', slug: 'acme', status: 'active', users: 156 },
    { id: '2', name: 'Globex', slug: 'globex', status: 'active', users: 89 },
  ]);

  return (
    <div className="p-8 space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-white to-white/60">
            Platform Builder
          </h1>
          <p className="text-white/60 mt-1">Super Admin Dashboard</p>
        </div>
        <button className="flex items-center gap-2 px-4 py-2 bg-purple-600 hover:bg-purple-700 rounded-lg transition-colors font-medium">
          <Plus className="w-4 h-4" />
          Create New Tenant
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard icon={<Globe className="text-blue-400" />} label="Total Tenants" value={tenants.length.toString()} />
        <StatCard icon={<Users className="text-purple-400" />} label="Total Users" value="245" />
        <StatCard icon={<Database className="text-green-400" />} label="Active Databases" value={tenants.length.toString()} />
        <StatCard icon={<Shield className="text-red-400" />} label="Platform Health" value="100%" />
      </div>

      <div className="glass-panel overflow-hidden">
        <div className="p-6 border-b border-white/10">
          <h2 className="text-xl font-bold">Tenants</h2>
        </div>
        <table className="w-full text-left">
          <thead>
            <tr className="border-b border-white/5 bg-white/5">
              <th className="px-6 py-4 font-medium text-white/60">Name</th>
              <th className="px-6 py-4 font-medium text-white/60">Slug</th>
              <th className="px-6 py-4 font-medium text-white/60">Users</th>
              <th className="px-6 py-4 font-medium text-white/60">Status</th>
              <th className="px-6 py-4 font-medium text-white/60">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-white/5">
            {tenants.map((tenant) => (
              <tr key={tenant.id} className="hover:bg-white/5 transition-colors">
                <td className="px-6 py-4 font-medium">{tenant.name}</td>
                <td className="px-6 py-4 text-white/60">{tenant.slug}.anelyria.de</td>
                <td className="px-6 py-4">{tenant.users}</td>
                <td className="px-6 py-4">
                  <span className="px-2 py-1 rounded-full text-xs bg-green-500/20 text-green-400 border border-green-500/30">
                    {tenant.status}
                  </span>
                </td>
                <td className="px-6 py-4">
                  <button className="text-purple-400 hover:text-purple-300 transition-colors">Manage</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

const StatCard = ({ icon, label, value }: { icon: React.ReactNode, label: string, value: string }) => (
  <div className="glass-panel p-6 space-y-2">
    <div className="flex items-center gap-3">
      {icon}
      <span className="text-sm font-medium text-white/60">{label}</span>
    </div>
    <div className="text-2xl font-bold">{value}</div>
  </div>
);
