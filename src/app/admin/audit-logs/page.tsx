'use client';

import React, { useEffect, useState } from 'react';
import { adminService } from '@/services/admin.service';
import { History, Clock, Info, CheckCircle2, Ban, Shield, UserMinus, AlertCircle } from 'lucide-react';
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

  useEffect(() => {
    fetchLogs(currentPage);
  }, [currentPage]);

  const fetchLogs = async (page: number = 1) => {
    setLoading(true);
    setError(null);
    try {
      const response = await adminService.getAuditLogs(page);
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

  return (
    <div className="space-y-12 pb-12">
      <header>
        <SlideIn duration={0.5}>
          <div className="flex items-center gap-3 mb-2">
             <div className="bg-primary/10 p-2 rounded-lg">
                <History className="h-5 w-5 text-primary" />
             </div>
             <span className="text-[10px] font-black uppercase tracking-[0.3em] text-primary">System Oversight</span>
          </div>
          <h1 className="text-4xl font-black tracking-tight text-foreground sm:text-5xl">Audit Trail</h1>
          <p className="text-muted-foreground font-medium mt-2 text-lg">Platform-wide administrative activity and event logs.</p>
        </SlideIn>
      </header>

      {/* Audit Table */}
      <FadeIn delay={0.2}>
        <div className="premium-card rounded-[2rem] overflow-hidden border border-border/10">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-muted/30 border-b border-border/10">
                  <th className="px-8 py-5 text-[10px] font-black uppercase tracking-widest text-muted-foreground/50">Admin</th>
                  <th className="px-8 py-5 text-[10px] font-black uppercase tracking-widest text-muted-foreground/50">Action</th>
                  <th className="px-8 py-5 text-[10px] font-black uppercase tracking-widest text-muted-foreground/50">Target</th>
                  <th className="px-8 py-5 text-[10px] font-black uppercase tracking-widest text-muted-foreground/50">Timestamp</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border/10">
                {loading ? (
                  Array.from({ length: 5 }).map((_, i) => (
                    <tr key={i} className="animate-pulse">
                      <td colSpan={4} className="px-8 py-6 h-20 bg-muted/5"></td>
                    </tr>
                  ))
                ) : error ? (
                  <tr>
                    <td colSpan={4} className="px-8 py-20 text-center">
                      <AlertCircle className="h-12 w-12 text-rose-500/20 mx-auto mb-4" />
                      <p className="text-rose-500/80 font-bold mb-4">{error}</p>
                      <Button onClick={() => fetchLogs(currentPage)} variant="outline" className="rounded-xl font-bold">
                        Try Again
                      </Button>
                    </td>
                  </tr>
                ) : logs.length === 0 ? (
                  <tr>
                    <td colSpan={4} className="px-8 py-20 text-center">
                      <History className="h-12 w-12 text-muted-foreground/20 mx-auto mb-4" />
                      <p className="text-muted-foreground font-bold">No administrative actions recorded yet.</p>
                    </td>
                  </tr>
                ) : (
                  logs.map((log) => (
                    <tr key={log.id} className="hover:bg-muted/10 transition-colors group">
                      <td className="px-8 py-6">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 bg-primary/5 rounded-2xl flex items-center justify-center border border-primary/10 font-bold text-primary text-xs">
                             {log.admin.name ? log.admin.name[0].toUpperCase() : 'A'}
                          </div>
                          <div>
                            <p className="text-sm font-bold text-foreground">{log.admin.name || 'Admin'}</p>
                            <p className="text-[10px] text-muted-foreground">{log.admin.email}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-8 py-6">
                        <div className="flex items-center gap-2">
                           <div className="p-1.5 rounded-lg bg-muted/50">
                             {getActionIcon(log.action)}
                           </div>
                           <span className="text-xs font-black uppercase tracking-tighter text-foreground">
                             {formatAction(log.action)}
                           </span>
                        </div>
                      </td>
                      <td className="px-8 py-6">
                        {log.target ? (
                          <div className="flex items-center gap-3">
                            <div className="w-8 h-8 bg-muted rounded-xl flex items-center justify-center font-bold text-muted-foreground text-[10px]">
                               {log.target.name ? log.target.name[0].toUpperCase() : 'U'}
                            </div>
                            <div>
                               <p className="text-xs font-bold text-foreground">{log.target.name || 'User'}</p>
                               <p className="text-[10px] text-muted-foreground">{log.target.email}</p>
                            </div>
                          </div>
                        ) : (
                          <span className="text-xs text-muted-foreground/50 font-bold">- System Entity -</span>
                        )}
                      </td>
                      <td className="px-8 py-6">
                        <div className="flex items-center gap-2 text-muted-foreground">
                           <Clock className="h-3.5 w-3.5" />
                           <p className="text-xs font-medium text-nowrap">
                             {format(new Date(log.createdAt), 'MMM dd, yyyy • HH:mm')}
                           </p>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </FadeIn>

      {pagination && pagination.totalPages > 1 && (
        <PaginationPlus 
          currentPage={currentPage}
          totalPages={pagination.totalPages}
          totalResults={pagination.totalCount}
          limit={pagination.limit}
          onPageChange={setCurrentPage}
        />
      )}
    </div>
  );
}
