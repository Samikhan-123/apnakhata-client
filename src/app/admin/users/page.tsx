'use client';

import React, { useEffect, useState } from 'react';
import { adminService } from '@/services/admin.service';
import { Users, Shield, UserCheck, UserX, Search, Filter, MoreHorizontal, CheckCircle2, AlertCircle } from 'lucide-react';
import { SlideIn, FadeIn } from '@/components/ui/FramerMotion';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { toast } from 'sonner';

export default function UserManagementPage() {
  const [users, setUsers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const response = await adminService.getUsers();
      if (response.success) {
        setUsers(response.data);
      }
    } catch (error) {
      console.error('Failed to fetch users:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleToggleVerification = async (id: string, currentStatus: boolean) => {
    try {
      const response = await adminService.updateUser(id, { isVerified: !currentStatus });
      if (response.success) {
        toast.success(`User ${!currentStatus ? 'verified' : 'unverified'} successfully`);
        fetchUsers();
      }
    } catch (error) {
      toast.error('Failed to update user');
    }
  };

  const filteredUsers = users.filter(u => 
    u.email.toLowerCase().includes(search.toLowerCase()) || 
    (u.name && u.name.toLowerCase().includes(search.toLowerCase()))
  );

  return (
    <div className="space-y-12 pb-12">
      <header>
        <SlideIn duration={0.5}>
          <div className="flex items-center gap-3 mb-2">
             <div className="bg-emerald-500/10 p-2 rounded-lg">
                <Users className="h-5 w-5 text-emerald-600" />
             </div>
             <span className="text-[10px] font-black uppercase tracking-[0.3em] text-emerald-600">Command & Control</span>
          </div>
          <h1 className="text-4xl font-black tracking-tight text-foreground sm:text-5xl">User Registry</h1>
          <p className="text-muted-foreground font-medium mt-2 text-lg">Manage platform identities and security clearances.</p>
        </SlideIn>
      </header>

      {/* Filters */}
      <div className="flex flex-col md:flex-row gap-4">
        <div className="relative flex-1 group">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground/40 group-focus-within:text-primary transition-colors" />
          <input 
            type="text" 
            placeholder="Search by name or email..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full bg-muted/20 border border-border/40 rounded-2xl h-14 pl-12 pr-6 font-medium focus:ring-2 focus:ring-primary/20 outline-none transition-all"
          />
        </div>
        <Button className="h-14 px-8 rounded-2xl font-bold gap-2">
           <Filter className="h-4 w-4" />
           <span>Advanced Filters</span>
        </Button>
      </div>

      {/* User Table */}
      <FadeIn delay={0.2}>
        <div className="premium-card rounded-[2rem] overflow-hidden border border-border/10">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-muted/30 border-b border-border/10">
                  <th className="px-8 py-5 text-[10px] font-black uppercase tracking-widest text-muted-foreground/50">Member</th>
                  <th className="px-8 py-5 text-[10px] font-black uppercase tracking-widest text-muted-foreground/50">Status</th>
                  <th className="px-8 py-5 text-[10px] font-black uppercase tracking-widest text-muted-foreground/50">Role</th>
                  <th className="px-8 py-5 text-[10px] font-black uppercase tracking-widest text-muted-foreground/50">Activity</th>
                  <th className="px-8 py-5 text-[10px] font-black uppercase tracking-widest text-muted-foreground/50">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border/10">
                {filteredUsers.map((user) => (
                  <tr key={user.id} className="hover:bg-muted/10 transition-colors group">
                    <td className="px-8 py-6">
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 bg-primary/5 rounded-2xl flex items-center justify-center border border-primary/10 font-black text-primary">
                           {user.name ? user.name[0].toUpperCase() : 'U'}
                        </div>
                        <div>
                          <p className="font-bold text-foreground">{user.name || 'Anonymous'}</p>
                          <p className="text-xs text-muted-foreground">{user.email}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-8 py-6">
                      <div className={cn(
                        "inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-tighter border",
                        user.isVerified 
                          ? "bg-emerald-500/10 text-emerald-600 border-emerald-500/20" 
                          : "bg-amber-500/10 text-amber-600 border-amber-500/20"
                      )}>
                        {user.isVerified ? <CheckCircle2 className="h-3 w-3" /> : <AlertCircle className="h-3 w-3" />}
                        {user.isVerified ? 'Verified' : 'Pending'}
                      </div>
                    </td>
                    <td className="px-8 py-6">
                      <div className={cn(
                        "inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-tighter border",
                        user.role === 'ADMIN' 
                          ? "bg-primary/10 text-primary border-primary/20" 
                          : "bg-muted text-muted-foreground border-border/40"
                      )}>
                        <Shield className="h-3 w-3" />
                        {user.role}
                      </div>
                    </td>
                    <td className="px-8 py-6">
                      <div className="flex flex-col gap-0.5">
                        <p className="text-xs font-bold text-foreground">{user._count?.ledgerEntries || 0} Entries</p>
                        <p className="text-[10px] text-muted-foreground">Joined {new Date(user.createdAt).toLocaleDateString()}</p>
                      </div>
                    </td>
                    <td className="px-8 py-6">
                       <Button 
                        variant="ghost" 
                        size="icon" 
                        className="rounded-xl hover:bg-muted group-hover:scale-105 transition-all"
                        onClick={() => handleToggleVerification(user.id, user.isVerified)}
                       >
                         {user.isVerified ? <UserX className="h-4 w-4 text-destructive" /> : <UserCheck className="h-4 w-4 text-emerald-600" />}
                       </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </FadeIn>
    </div>
  );
}
