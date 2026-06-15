'use client';

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  Users, Database, Briefcase, CheckCircle2, AlertCircle,
  TrendingUp, RefreshCw, BarChart2, Check, X, Shield, Plus
} from 'lucide-react';

interface Project {
  id: string;
  name: string;
  clientId: string;
  status: string;
  progress: number;
  startDate?: string;
  estCompletion?: string;
  client?: { companyName: string };
  agent?: { id: string; name: string };
  uploadedFiles?: any[];
}

interface Agent {
  id: string;
  name: string;
  email: string;
  capacity: number;
  activeTasks: number;
  completionRate: number;
  status: string;
}

export default function SuperAdminDashboard() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [agents, setAgents] = useState<Agent[]>([]);
  const [loading, setLoading] = useState(true);

  // Distribution Form State
  const [selectedProjectId, setSelectedProjectId] = useState('');
  const [useAutoSplit, setUseAutoSplit] = useState(true);
  const [manualSplits, setManualSplits] = useState<Record<string, number>>({});
  const [distributeStatus, setDistributeStatus] = useState('');

  // 1. Fetch Admin Metrics & Data
  const fetchData = async () => {
    const token = localStorage.getItem('token');
    if (!token) return;

    try {
      const projectsRes = await fetch('/api/crm/projects', {
        headers: { Authorization: `Bearer ${token}` }
      });
      if (projectsRes.ok) {
        const data = await projectsRes.json();
        setProjects(data.projects || []);
        
        // Find first approved project with leads to select by default
        const pendingDist = (data.projects || []).find((p: any) => p.status === 'APPROVED');
        if (pendingDist) {
          setSelectedProjectId(pendingDist.id);
        }
      }

      // Fetch active agents list
      const tokenUser = localStorage.getItem('user') ? JSON.parse(localStorage.getItem('user')!) : null;
      const agentsRes = await fetch('/api/crm/workload', {
        headers: { Authorization: `Bearer ${token}` }
      });
      if (agentsRes.ok) {
        const data = await agentsRes.json();
        // Fallback to mock data if empty
        const list = data.metrics?.length > 0 ? data.metrics : [
          { id: 'agent-1', name: 'John Connor', email: 'agent@gmail.com', capacity: 1000, activeTasks: 1, completionRate: 92.4, status: 'AVAILABLE' },
          { id: 'agent-2', name: 'Sarah Connor', email: 'sarah@resistance.net', capacity: 1000, activeTasks: 0, completionRate: 95.0, status: 'AVAILABLE' }
        ];
        setAgents(list);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();

    // Subscribe to SSE updates for real-time dashboard hot-reloading
    const sse = new EventSource('/api/crm/stream');
    sse.onmessage = (event) => {
      try {
        const data = JSON.parse(event.data);
        if (
          data.type === 'LEAD_STATUS_UPDATE' || 
          data.type === 'CONNECTED' || 
          data.type === 'NOTIFICATION' || 
          data.type === 'ACTIVITY_LOG'
        ) {
          fetchData();
        }
      } catch (err) {
        // ignore
      }
    };

    return () => {
      sse.close();
    };
  }, []);

  // 2. Approve Uploaded Database
  const handleApprove = async (id: string, approve: boolean) => {
    const token = localStorage.getItem('token');
    const status = approve ? 'APPROVED' : 'REJECTED';
    
    try {
      const res = await fetch(`/api/crm/projects/${id}/approve`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({ status })
      });
      if (res.ok) {
        fetchData();
      }
    } catch (err) {
      console.error(err);
    }
  };

  // 3. Trigger Workload splits distribution
  const handleDistribute = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedProjectId) {
      alert('Please select an approved campaign for workload splits.');
      return;
    }

    const token = localStorage.getItem('token');
    setDistributeStatus('Splitting workload leads...');

    try {
      let payload: any = { auto: useAutoSplit };
      
      if (!useAutoSplit) {
        // Format splits: Array of { agentId, count }
        const splits = Object.keys(manualSplits).map(agentId => ({
          agentId,
          count: Number(manualSplits[agentId])
        }));
        payload.agentSplits = splits;
      }

      const res = await fetch(`/api/crm/projects/${selectedProjectId}/distribute`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify(payload)
      });

      if (res.ok) {
        setDistributeStatus('Workload split successfully allocated!');
        fetchData();
        setManualSplits({});
        setTimeout(() => setDistributeStatus(''), 4000);
      } else {
        const err = await res.json();
        setDistributeStatus(err.error || 'Failed to split workload.');
      }
    } catch {
      setDistributeStatus('Connection error.');
    }
  };

  // KPI Calculations
  const pendingApprovals = projects.filter(p => p.status === 'PENDING_APPROVAL');
  const activeJobs = projects.filter(p => p.status !== 'PENDING_APPROVAL' && p.status !== 'COMPLETED' && p.status !== 'REJECTED');
  const completedJobs = projects.filter(p => p.status === 'COMPLETED');

  return (
    <div className="space-y-8">
      
      {/* ── METRICS OVERVIEW ── */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-4">
        
        {/* Total Databases */}
        <div className="rounded-2xl border border-white/5 bg-white/[0.02] p-5 backdrop-blur-md">
          <div className="flex items-center justify-between text-white/50 text-[10px] tracking-widest uppercase font-bold">
            <span>Total Uploads</span>
            <Database size={14} className="text-purple-400" />
          </div>
          <p className="mt-3 text-3xl font-bold font-mono">{projects.length}</p>
        </div>

        {/* Pending Approval */}
        <div className="rounded-2xl border border-white/5 bg-white/[0.02] p-5 backdrop-blur-md">
          <div className="flex items-center justify-between text-white/50 text-[10px] tracking-widest uppercase font-bold">
            <span>Pending Approvals</span>
            <AlertCircle size={14} className="text-blue-400" />
          </div>
          <p className="mt-3 text-3xl font-bold font-mono">{pendingApprovals.length}</p>
        </div>

        {/* Active Runs */}
        <div className="rounded-2xl border border-white/5 bg-white/[0.02] p-5 backdrop-blur-md">
          <div className="flex items-center justify-between text-white/50 text-[10px] tracking-widest uppercase font-bold">
            <span>Active Runs</span>
            <Briefcase size={14} className="text-gold" />
          </div>
          <p className="mt-3 text-3xl font-bold font-mono">{activeJobs.length}</p>
        </div>

        {/* Completed Runs */}
        <div className="rounded-2xl border border-white/5 bg-white/[0.02] p-5 backdrop-blur-md">
          <div className="flex items-center justify-between text-white/50 text-[10px] tracking-widest uppercase font-bold">
            <span>Completed Runs</span>
            <CheckCircle2 size={14} className="text-emerald-400" />
          </div>
          <p className="mt-3 text-3xl font-bold font-mono">{completedJobs.length}</p>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-8 lg:grid-cols-12">
        
        {/* Left Area: Approval center & workload splits */}
        <div className="space-y-8 lg:col-span-8">
          
          {/* DATABASE APPROVAL CENTER */}
          <div className="rounded-2xl border border-white/10 bg-background/50 p-6 backdrop-blur-md space-y-4">
            <div className="flex items-center gap-2">
              <Shield size={18} className="text-purple-400" />
              <h2 className="text-lg font-bold text-white">Database Approval Center</h2>
            </div>

            <div className="overflow-x-auto rounded-xl border border-white/5 bg-white/[0.01]">
              <table className="w-full text-left border-collapse text-xs text-white/80">
                <thead>
                  <tr className="border-b border-white/10 bg-white/5 text-white/40 text-[10px] font-bold uppercase tracking-wider">
                    <th className="px-4 py-3">Client Company</th>
                    <th className="px-4 py-3">File Name</th>
                    <th className="px-4 py-3">Records Count</th>
                    <th className="px-4 py-3">Status</th>
                    <th className="px-4 py-3 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5 font-medium">
                  {projects.length === 0 ? (
                    <tr>
                      <td colSpan={5} className="px-4 py-6 text-center text-white/30">No database uploads pending.</td>
                    </tr>
                  ) : (
                    projects.map((p) => (
                      <tr key={p.id}>
                        <td className="px-4 py-3.5 font-bold text-white">{p.client?.companyName || 'Septic Specialists'}</td>
                        <td className="px-4 py-3.5 font-mono text-[11px] text-white/70">{p.uploadedFiles?.[0]?.fileName || 'leads.csv'}</td>
                        <td className="px-4 py-3.5 font-mono">{p.uploadedFiles?.[0]?.recordCount || 500}</td>
                        <td className="px-4 py-3.5">
                          <span className={`text-[8.5px] font-extrabold uppercase px-2 py-0.5 rounded-full ${
                            p.status === 'APPROVED' ? 'bg-emerald-500/20 text-emerald-400' :
                            p.status === 'PENDING_APPROVAL' ? 'bg-blue-500/20 text-blue-400' : 'bg-red-500/20 text-red-400'
                          }`}>
                            {p.status.replace('_', ' ')}
                          </span>
                        </td>
                        <td className="px-4 py-3.5 text-right space-x-2">
                          {p.status === 'PENDING_APPROVAL' && (
                            <>
                              <button 
                                onClick={() => handleApprove(p.id, true)}
                                className="inline-flex h-6.5 w-6.5 items-center justify-center rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white transition"
                                title="Approve Upload"
                              >
                                <Check size={12} />
                              </button>
                              <button 
                                onClick={() => handleApprove(p.id, false)}
                                className="inline-flex h-6.5 w-6.5 items-center justify-center rounded-lg bg-red-600 hover:bg-red-500 text-white transition"
                                title="Reject Upload"
                              >
                                <X size={12} />
                              </button>
                            </>
                          )}
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>

          {/* WORK DISTRIBUTION ENGINE */}
          <div className="rounded-2xl border border-white/10 bg-background/50 p-6 backdrop-blur-md space-y-5">
            <div className="flex items-center gap-2">
              <Briefcase size={18} className="text-gold" />
              <h2 className="text-lg font-bold text-white">Work Distribution Engine</h2>
            </div>

            <form onSubmit={handleDistribute} className="space-y-4">
              <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                <div>
                  <label className="text-[10px] font-bold text-white/40 tracking-wider uppercase block mb-1.5">Select Approved Campaign</label>
                  <select
                    value={selectedProjectId}
                    onChange={(e) => setSelectedProjectId(e.target.value)}
                    className="w-full rounded-xl bg-background border border-white/10 px-3 py-2.5 text-xs text-white outline-none focus:border-gold transition"
                  >
                    <option value="">-- Choose Campaign --</option>
                    {projects.filter(p => p.status === 'APPROVED').map(p => (
                      <option key={p.id} value={p.id}>
                        {p.name} ({p.uploadedFiles?.[0]?.recordCount || 500} records)
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="text-[10px] font-bold text-white/40 tracking-wider uppercase block mb-1.5">Distribution Split Method</label>
                  <div className="grid grid-cols-2 gap-2">
                    <button
                      type="button"
                      onClick={() => setUseAutoSplit(true)}
                      className={`rounded-xl border py-2.5 text-xs font-bold transition ${
                        useAutoSplit 
                          ? 'border-gold bg-gold/10 text-gold' 
                          : 'border-white/10 bg-white/5 text-white/70 hover:bg-white/10'
                      }`}
                    >
                      Auto Equal Split
                    </button>
                    <button
                      type="button"
                      onClick={() => setUseAutoSplit(false)}
                      className={`rounded-xl border py-2.5 text-xs font-bold transition ${
                        !useAutoSplit 
                          ? 'border-gold bg-gold/10 text-gold' 
                          : 'border-white/10 bg-white/5 text-white/70 hover:bg-white/10'
                      }`}
                    >
                      Manual Split
                    </button>
                  </div>
                </div>
              </div>

              {/* Manual Splits Allocation Inputs */}
              {!useAutoSplit && selectedProjectId && (
                <div className="rounded-xl border border-white/5 bg-white/[0.01] p-4 space-y-3.5">
                  <span className="block text-[10px] font-bold text-gold uppercase tracking-wider">Allocate Splits Per Agent</span>
                  <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                    {agents.map((agent) => (
                      <div key={agent.id} className="flex items-center justify-between gap-4">
                        <span className="text-xs text-white/80">{agent.name}</span>
                        <input
                          type="number"
                          placeholder="Leads count"
                          value={manualSplits[agent.id] || ''}
                          onChange={(e) => setManualSplits(prev => ({ ...prev, [agent.id]: Number(e.target.value) }))}
                          className="w-[120px] rounded-lg bg-white/5 border border-white/10 px-3 py-1.5 text-xs text-white outline-none focus:border-gold font-mono"
                        />
                      </div>
                    ))}
                  </div>
                </div>
              )}

              <button
                type="submit"
                disabled={!selectedProjectId}
                className="w-full flex items-center justify-center gap-2 rounded-xl bg-gold text-background hover:brightness-105 py-3 text-xs font-bold transition disabled:opacity-50"
              >
                <span>Trigger Workload Allocation</span>
              </button>
            </form>

            {distributeStatus && (
              <div className="flex items-center gap-2 rounded-xl border border-gold/20 bg-gold/5 px-4 py-3 text-xs text-gold">
                <AlertCircle size={14} className="text-gold" />
                <span>{distributeStatus}</span>
              </div>
            )}
          </div>
        </div>

        {/* Right Area: Workload graphs / Agent dashboard */}
        <div className="space-y-8 lg:col-span-4">
          
          {/* WORKLOAD VISUALIZATION */}
          <div className="rounded-2xl border border-white/10 bg-background/50 p-6 backdrop-blur-md space-y-5">
            <div className="flex items-center gap-2 border-b border-white/5 pb-3">
              <BarChart2 size={16} className="text-purple-400" />
              <h2 className="text-md font-bold text-white">Workload Visualization</h2>
            </div>

            <div className="space-y-4">
              {agents.map((agent) => (
                <div key={agent.id} className="rounded-xl border border-white/5 bg-white/[0.01] p-3.5 space-y-3">
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-bold text-white">{agent.name}</span>
                    <span className={`text-[9px] uppercase font-mono px-2 py-0.5 rounded ${
                      agent.activeTasks > 0 ? 'bg-amber-500/20 text-amber-400' : 'bg-emerald-500/20 text-emerald-400'
                    }`}>
                      {agent.activeTasks > 0 ? `${agent.activeTasks} Tasks` : 'Available'}
                    </span>
                  </div>

                  {/* Progress/Capacity Bar */}
                  <div className="space-y-1">
                    <div className="flex items-center justify-between text-[9px] text-white/40 uppercase">
                      <span>Assigned capacity</span>
                      <span>{agent.activeTasks * 250 || 0} / {agent.capacity} leads</span>
                    </div>
                    <div className="h-1.5 w-full rounded-full bg-white/5 overflow-hidden">
                      <div 
                        className="h-full bg-purple-500 rounded-full"
                        style={{ width: `${Math.min(((agent.activeTasks * 250) / agent.capacity) * 100, 100)}%` }}
                      />
                    </div>
                  </div>

                  <div className="flex items-center justify-between text-[9.5px] text-white/40 border-t border-white/5 pt-2 font-semibold">
                    <span>Performance rate:</span>
                    <span className="text-emerald-400 font-mono">{agent.completionRate}%</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
