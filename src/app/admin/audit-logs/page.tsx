'use client';

import React, { useEffect, useState } from 'react';
import { adminService } from '@/services/admin.service';
import { History, Clock, Info, CheckCircle2, Ban, Shield, UserMinus, AlertCircle, Search, Filter } from 'lucide-react';
import { SlideIn, FadeIn } from '@/components/ui/FramerMotion';
import { Button } from '@/components/ui/button';
import { PaginationPlus } from '@/components/ui/PaginationPlus';
import { cn } from '@/lib/utils';
import { format } from 'date-fns';
import { handleApiError } from '@/lib/error-handler';

export default function AuditLogPage() {
  const [logs, setLogs] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [pagination, setPagination] = useState<any>(null);

  // Filters State
  const [filters, setFilters] = useState({
    action: '',
    startDate: '',
    endDate: '',
    search: ''
  });

  useEffect(() => {
    fetchLogs(currentPage, filters);
  }, [currentPage, filters]);

  const fetchLogs = async (page: number = 1, currentFilters: any = {}) => {
    setLoading(true);
    setError(null);
    try {
      const response = await adminService.getAuditLogs(page, 15, currentFilters);
      if (response.success) {
        setLogs(response.data);
        setPagination(response.pagination);
      }
    } catch (err: any) {
      const { message } = handleApiError(err, { silent: true });
      setError(message);
    } finally {
      setLoading(false);
    }
  };

  const getActionIcon = (action: string) => {
    switch (action) {
      case 'BAN_USER': return <Ban className="h-4 w-4 text-rose-500" />;
      case 'REACTIVATE_USER': return <CheckCircle2 className="h-4 w-4 text-emerald-500" />;
      case 'PROMOTE_ADMIN': return <Shield className="h-4 w-4 text-primary" />;
      case 'DEMOTE_USER': return <UserMinus className="h-4 w-4 text-amber-500" />;
      case 'VERIFY_USER': return <CheckCircle2 className="h-4 w-4 text-blue-500" />;
      case 'UNVERIFY_USER': return <AlertCircle className="h-4 w-4 text-slate-400" />;
      default: return <Info className="h-4 w-4 text-muted-foreground" />;
    }
  };

  const formatAction = (action: string) => {
    return action.replace(/_/g, ' ');
  };

  const handleFilterChange = (name: string, value: string) => {
    setFilters(prev => ({ ...prev, [name]: value }));
    setCurrentPage(1); // Reset to first page on filter change
  };

  const resetFilters = () => {
    setFilters({ action: '', startDate: '', endDate: '', search: '' });
    setCurrentPage(1);
  };

  return (
    <div className="flex flex-col h-full space-y-4 md:space-y-8">
      <header className="flex-none">
        <SlideIn duration={0.5}>
          <div className="flex items-center gap-2 md:gap-3 mb-1 md:mb-2">
            <div className="bg-primary/10 p-1.5 md:p-2 rounded-lg">
              <History className="h-4 w-4 md:h-5 md:w-5 text-primary" />
            </div>
            <span className="text-[9px] md:text-[10px] font-black uppercase tracking-[0.2em] md:tracking-[0.3em] text-primary">System Oversight</span>
          </div>
          <h1 className="text-2xl font-black tracking-tight text-foreground sm:text-4xl">Audit Trail</h1>
          <p className="text-muted-foreground font-medium mt-1 text-xs md:text-sm">Administrative events across the ecosystem.</p>
        </SlideIn>
      </header>

      {/* Responsive Filter Bar */}
      <div className="flex-none">
        <SlideIn delay={0.1} duration={0.5}>
          <div className="premium-card p-4 md:p-5 rounded-2xl md:rounded-[1.5rem] border border-border/10 space-y-3 md:space-y-4 shadow-xl">
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3 md:gap-4 items-end">
              <div className="col-span-1 md:col-span-1 space-y-1.5">
                <label className="text-[9px] font-black uppercase tracking-widest text-muted-foreground ml-1">Search</label>
                <div className="relative">
                  <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground/50" />
                  <input
                    type="text"
                    placeholder="Email or Name..."
                    value={filters.search}
                    onChange={(e) => handleFilterChange('search', e.target.value)}
                    className="w-full bg-muted/20 border border-border/40 rounded-xl md:rounded-2xl h-10 md:h-11 pl-11 pr-4 font-bold text-xs md:text-sm focus:ring-2 focus:ring-primary/20 outline-none transition-all placeholder:text-muted-foreground/30"
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-[9px] font-black uppercase tracking-widest text-muted-foreground ml-1">Event Type</label>
                <div className="relative">
                   <select
                    value={filters.action}
                    onChange={(e) => handleFilterChange('action', e.target.value)}
                    className="w-full bg-muted/20 border border-border/40 rounded-xl md:rounded-2xl h-10 md:h-11 px-4 font-bold text-xs md:text-sm focus:ring-2 focus:ring-primary/20 outline-none transition-all appearance-none cursor-pointer"
                  >
                    <option value="">All Actions</option>
                    <option value="BAN_USER">Ban User</option>
                    <option value="REACTIVATE_USER">Reactivate User</option>
                    <option value="PROMOTE_ADMIN">Promote Admin</option>
                    <option value="DEMOTE_USER">Demote User</option>
                    <option value="VERIFY_USER">Verify User</option>
                    <option value="UNVERIFY_USER">Unverify User</option>
                  </select>
                   <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none opacity-40">
                      <Filter className="h-3 w-3" />
                   </div>
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-[9px] font-black uppercase tracking-widest text-muted-foreground ml-1">Start Date</label>
                <input
                  type="date"
                  value={filters.startDate}
                  onChange={(e) => handleFilterChange('startDate', e.target.value)}
                  className="w-full bg-muted/20 border border-border/40 rounded-xl md:rounded-2xl h-10 md:h-11 px-4 font-bold text-xs md:text-sm focus:ring-2 focus:ring-primary/20 outline-none transition-all cursor-pointer"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-[9px] font-black uppercase tracking-widest text-muted-foreground ml-1">End Date</label>
                <input
                  type="date"
                  value={filters.endDate}
                  onChange={(e) => handleFilterChange('endDate', e.target.value)}
                  className="w-full bg-muted/20 border border-border/40 rounded-xl md:rounded-2xl h-10 md:h-11 px-4 font-bold text-xs md:text-sm focus:ring-2 focus:ring-primary/20 outline-none transition-all cursor-pointer"
                />
              </div>
            </div>

            <div className="flex items-center justify-end gap-2 pt-2 border-t border-border/5">
              <Button
                onClick={resetFilters}
                variant="outline"
                className="px-4 md:px-6 h-9 md:h-10 rounded-xl md:rounded-2xl font-bold text-[10px] uppercase tracking-widest hover:bg-muted/50 transition-all border-border/40"
              >
                Clear
              </Button>
              <Button
                onClick={() => fetchLogs(1, filters)}
                className="px-6 md:px-8 h-9 md:h-10 rounded-xl md:rounded-2xl font-bold text-[10px] uppercase tracking-widest shadow-lg shadow-primary/10 sapphire-glow"
              >
                Apply Filters
              </Button>
            </div>
          </div>
        </SlideIn>
      </div>

      {/* Hybrid Scrolling Audit Table Container */}
      <div className="w-full flex-none">
        <FadeIn className="w-full" duration={0.7}>
          <div className="premium-card rounded-2xl md:rounded-[2rem] overflow-hidden border border-border/10">
            <div className="w-full overflow-x-auto sapphire-scrollbar pb-2">
              <table className="w-full text-left border-collapse min-w-[1000px]">
                <thead className="sticky top-0 z-20">
                  <tr className="bg-muted/90 backdrop-blur-xl border-b border-border/10">
                    <th className="px-6 md:px-8 py-4 md:py-5 text-[9px] md:text-[10px] font-black uppercase tracking-widest text-muted-foreground/60">Administrator</th>
                    <th className="px-6 md:px-8 py-4 md:py-5 text-[9px] md:text-[10px] font-black uppercase tracking-widest text-muted-foreground/60">Action Execution</th>
                    <th className="px-6 md:px-8 py-4 md:py-5 text-[9px] md:text-[10px] font-black uppercase tracking-widest text-muted-foreground/60">Subject Target</th>
                    <th className="px-6 md:px-8 py-4 md:py-5 text-[9px] md:text-[10px] font-black uppercase tracking-widest text-muted-foreground/60">Timestamp (UTC)</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border/10">
                  {loading ? (
                    Array.from({ length: 8 }).map((_, i) => (
                      <tr key={i} className="animate-pulse">
                        <td colSpan={4} className="px-6 md:px-8 py-5 md:py-6 h-16 md:h-20 bg-muted/5"></td>
                      </tr>
                    ))
                  ) : error ? (
                    <tr>
                      <td colSpan={4} className="px-8 py-20 text-center">
                        <AlertCircle className="h-10 w-10 text-rose-500/30 mx-auto mb-4" />
                        <p className="text-rose-500/80 font-bold mb-4 text-xs md:text-sm">{error}</p>
                        <Button onClick={() => fetchLogs(currentPage, filters)} variant="outline" className="rounded-xl font-bold h-10">
                          Retry Synchronisation
                        </Button>
                      </td>
                    </tr>
                  ) : logs.length === 0 ? (
                    <tr>
                      <td colSpan={4} className="px-8 py-20 text-center">
                        <History className="h-10 w-10 text-muted-foreground/20 mx-auto mb-4" />
                        <p className="text-muted-foreground font-bold text-xs md:text-sm tracking-tight">No administrative anomalies detected in history.</p>
                      </td>
                    </tr>
                  ) : (
                    logs.map((log) => (
                      <tr key={log.id} className="hover:bg-primary/[0.02] transition-colors group">
                        <td className="px-6 md:px-8 py-5 md:py-6">
                          <div className="flex items-center gap-3">
                            <div className="w-9 h-9 md:w-10 md:h-10 bg-primary/5 rounded-xl md:rounded-2xl flex items-center justify-center border border-primary/10 font-bold text-primary text-xs sapphire-glow/20">
                              {log.admin.name ? log.admin.name[0].toUpperCase() : 'A'}
                            </div>
                            <div>
                              <p className="text-xs md:text-sm font-bold text-foreground leading-none mb-1">{log.admin.name || 'Admin'}</p>
                              <p className="text-[9px] md:text-[10px] text-muted-foreground font-medium">{log.admin.email}</p>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 md:px-8 py-5 md:py-6">
                          <div className="flex items-center gap-2">
                            <div className="p-1.5 rounded-lg bg-muted/40 backdrop-blur-sm group-hover:bg-primary/5 transition-colors">
                              {getActionIcon(log.action)}
                            </div>
                            <span className="text-[10px] md:text-xs font-black uppercase tracking-tighter text-foreground text-nowrap">
                              {formatAction(log.action)}
                            </span>
                          </div>
                        </td>
                        <td className="px-6 md:px-8 py-5 md:py-6">
                          {log.target ? (
                            <div className="flex items-center gap-3">
                              <div className="w-8 h-8 bg-muted/50 rounded-lg md:rounded-xl flex items-center justify-center font-bold text-muted-foreground/50 text-[10px] border border-border/50">
                                {log.target.name ? log.target.name[0].toUpperCase() : 'U'}
                              </div>
                              <div>
                                <p className="text-xs font-bold text-foreground leading-none mb-1">{log.target.name || 'User'}</p>
                                <p className="text-[9px] md:text-[10px] text-muted-foreground">{log.target.email}</p>
                              </div>
                            </div>
                          ) : (
                            <div className="inline-flex py-1 px-3 bg-muted/30 rounded-full border border-border/20">
                               <span className="text-[9px] text-muted-foreground font-black uppercase tracking-widest">- System -</span>
                            </div>
                          )}
                        </td>
                        <td className="px-6 md:px-8 py-5 md:py-6">
                          <div className="flex items-center gap-2 text-muted-foreground/60">
                            <Clock className="h-3 w-3 md:h-3.5 md:w-3.5" />
                            <p className="text-[10px] md:text-xs font-bold text-nowrap tracking-tight">
                              {format(new Date(log.createdAt), 'MMM dd, yyyy • HH:mm:ss')}
                            </p>
                          </div>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>

            {/* Anchored Registry Pagination */}
            {pagination && pagination.totalPages > 1 && (
              <div className="flex-none px-6 md:px-8 py-3 md:py-4 bg-background/60 backdrop-blur-2xl border-t border-border/5">
                <PaginationPlus
                  currentPage={currentPage}
                  totalPages={pagination.totalPages}
                  totalResults={pagination.totalCount}
                  limit={pagination.limit}
                  onPageChange={setCurrentPage}
                />
              </div>
            )}
          </div>
        </FadeIn>
      </div>
    </div>
  );
}
