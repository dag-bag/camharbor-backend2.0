import React, { useState } from 'react';
import { Search, Plus, RefreshCw, Trash2, FileText, AlertCircle, TrendingUp, Activity, Star, Eye } from 'lucide-react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { blogApi } from '../api/blogApi';
import type { Blog } from '../types/blog.types';

interface BlogDashboardProps {
  onAddBlog: () => void;
  onEditBlog: (blog: Blog) => void;
}

const BlogDashboard: React.FC<BlogDashboardProps> = ({ onAddBlog, onEditBlog }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedSlugs, setSelectedSlugs] = useState<string[]>([]);
  const [statusFilter, setStatusFilter] = useState<'all' | 'draft' | 'published' | 'archived'>('all');
  const queryClient = useQueryClient();

  const { data: blogsData, isLoading: loading, error, isRefetching } = useQuery({
    queryKey: ['blogs', statusFilter],
    queryFn: async () => {
      const response = await blogApi.listBlogs(1, 100, {
        ...(statusFilter !== 'all' && { status: statusFilter as any })
      });
      return response;
    },
    staleTime: 5 * 60 * 1000,
  });

  const blogs = blogsData?.data || [];

  const toggleStatusMutation = useMutation({
    mutationFn: (slug: string) => blogApi.toggleBlogStatus(slug),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['blogs'] });
    },
    onError: (err: any) => {
      alert('Error toggling status: ' + (err.response?.data?.error?.message || err.message));
    }
  });

  const deleteBlogMutation = useMutation({
    mutationFn: (slug: string) => blogApi.deleteBlog(slug),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['blogs'] });
    },
    onError: (err: any) => {
      alert('Error deleting blog: ' + (err.response?.data?.error?.message || err.message));
    }
  });

  const deleteBlogsMutation = useMutation({
    mutationFn: (slugs: string[]) => blogApi.deleteBlogs(slugs),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['blogs'] });
      setSelectedSlugs([]);
    },
    onError: (err: any) => {
      alert('Error deleting blogs: ' + (err.response?.data?.error?.message || err.message));
    }
  });

  const handleToggleStatus = (slug: string) => {
    toggleStatusMutation.mutate(slug);
  };

  const handleDeleteBlog = (slug: string) => {
    if (!window.confirm(`Are you sure you want to delete "${slug}"?`)) return;
    deleteBlogMutation.mutate(slug);
  };

  const handleBulkDelete = () => {
    if (!window.confirm(`Are you sure you want to delete ${selectedSlugs.length} blogs?`)) return;
    deleteBlogsMutation.mutate(selectedSlugs);
  };

  const toggleSelectAll = (checked: boolean) => {
    if (checked) {
      setSelectedSlugs(filteredBlogs.map(b => b.slug));
    } else {
      setSelectedSlugs([]);
    }
  };

  const toggleSelect = (slug: string) => {
    setSelectedSlugs(prev =>
      prev.includes(slug) ? prev.filter(s => s !== slug) : [...prev, slug]
    );
  };

  const handleRefresh = () => {
    queryClient.invalidateQueries({ queryKey: ['blogs'] });
  };

  const filteredBlogs = blogs.filter(blog =>
    blog.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    blog.excerpt?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    blog.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
    blog.author.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const formatDate = (date: string | undefined) => {
    if (!date) return 'N/A';
    return new Date(date).toLocaleDateString('en-US', { 
      year: 'numeric', 
      month: 'short', 
      day: 'numeric' 
    });
  };

  return (
    <div className="min-h-screen w-full bg-grid premium-gradient p-4 md:p-12 overflow-x-hidden">
      <div className="max-w-7xl mx-auto space-y-12">
        {/* Header Section */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-8 animate-fade-in-up">
          <div className="space-y-4">
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-indigo-500/10 border border-indigo-500/20 rounded-full text-indigo-400 text-xs font-bold tracking-widest uppercase shadow-[0_0_15px_-3px_rgba(79,70,229,0.3)]">
              <Activity className="w-3 h-3 animate-pulse" />
              Content Management System
            </div>
            <h1 className="text-6xl font-black text-white tracking-tighter drop-shadow-2xl">
              Blog <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-cyan-400">Hub</span>
            </h1>
            <p className="text-slate-400 text-lg max-w-xl leading-relaxed text-left font-medium">
              Manage your blog content, articles, and editorial workflow.
            </p>
          </div>
          <div className="flex items-center gap-4">
            {selectedSlugs.length > 0 && (
              <button
                onClick={handleBulkDelete}
                className="px-6 py-4 bg-rose-500/10 hover:bg-rose-500/20 text-rose-500 rounded-2xl font-bold transition-all border border-rose-500/20 flex items-center gap-3 animate-in fade-in zoom-in"
              >
                <Trash2 className="w-5 h-5" />
                Delete Selected ({selectedSlugs.length})
              </button>
            )}
            <button
              onClick={handleRefresh}
              disabled={loading || isRefetching}
              className="p-4 glass-card hover:bg-slate-800 transition-all group disabled:opacity-50 rounded-2xl border border-slate-700/50"
            >
              <RefreshCw className={`w-6 h-6 text-slate-400 group-hover:text-white ${isRefetching ? 'animate-spin' : ''}`} />
            </button>
            <button
              onClick={onAddBlog}
              className="px-8 py-4 bg-indigo-600 hover:bg-indigo-500 text-white rounded-2xl font-bold transition-all shadow-[0_0_30px_-5px_rgba(79,70,229,0.5)] active:scale-95 flex items-center gap-3 group border border-indigo-400/20"
            >
              <Plus className="w-6 h-6 group-hover:rotate-90 transition-transform duration-300" />
              New Article
            </button>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 animate-fade-in-up delay-100">
          <div className="glass-card p-8 rounded-[2rem] group hover:border-indigo-500/50 transition-all duration-500">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-slate-500 font-bold text-xs uppercase tracking-widest">Total Articles</p>
                <p className="text-5xl font-black text-white mt-2 tracking-tight">{blogs.length}</p>
              </div>
              <div className="p-4 bg-indigo-500/10 rounded-2xl text-indigo-400 border border-indigo-500/20">
                <FileText className="w-8 h-8" />
              </div>
            </div>
          </div>

          <div className="glass-card p-8 rounded-[2rem] group hover:border-emerald-500/50 transition-all duration-500">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-slate-500 font-bold text-xs uppercase tracking-widest">Published</p>
                <p className="text-5xl font-black text-emerald-400 mt-2 tracking-tight">
                  {blogs.filter(b => b.status === 'published').length}
                </p>
              </div>
              <div className="p-4 bg-emerald-500/10 rounded-2xl text-emerald-400 border border-emerald-500/20">
                <Eye className="w-8 h-8" />
              </div>
            </div>
          </div>

          <div className="glass-card p-8 rounded-[2rem] group hover:border-amber-500/50 transition-all duration-500">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-slate-500 font-bold text-xs uppercase tracking-widest">Drafts</p>
                <p className="text-5xl font-black text-amber-400 mt-2 tracking-tight">
                  {blogs.filter(b => b.status === 'draft').length}
                </p>
              </div>
              <div className="p-4 bg-amber-500/10 rounded-2xl text-amber-400 border border-amber-500/20">
                <AlertCircle className="w-8 h-8" />
              </div>
            </div>
          </div>

          <div className="glass-card p-8 rounded-[2rem] group hover:border-cyan-500/50 transition-all duration-500">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-slate-500 font-bold text-xs uppercase tracking-widest">Featured</p>
                <p className="text-5xl font-black text-cyan-400 mt-2 tracking-tight">
                  {blogs.filter(b => b.is_featured).length}
                </p>
              </div>
              <div className="p-4 bg-cyan-500/10 rounded-2xl text-cyan-400 border border-cyan-500/20">
                <Star className="w-8 h-8" />
              </div>
            </div>
          </div>
        </div>

        {/* Main Content Card */}
        <div className="glass-card rounded-[2.5rem] overflow-hidden animate-fade-in-up delay-200 border border-slate-700/50">
          <div className="p-8 border-b border-slate-800 bg-slate-900/30 flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="relative w-full md:w-[28rem]">
              <Search className="absolute left-5 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-500" />
              <input
                type="text"
                placeholder="Search articles..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-slate-950/50 border border-slate-700 py-4 pl-14 pr-6 rounded-2xl text-slate-200 placeholder-slate-600 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500/50 transition-all font-medium text-lg shadow-inner"
              />
            </div>
            
            {/* Status Filter */}
            <div className="flex items-center gap-2">
              {(['all', 'published', 'draft', 'archived'] as const).map((status) => (
                <button
                  key={status}
                  onClick={() => setStatusFilter(status)}
                  className={`px-4 py-2 rounded-xl text-xs font-bold uppercase tracking-wider transition-all ${
                    statusFilter === status
                      ? 'bg-indigo-600 text-white'
                      : 'bg-slate-800/50 text-slate-400 hover:bg-slate-700'
                  }`}
                >
                  {status}
                </button>
              ))}
            </div>
          </div>

          {loading ? (
            <div className="py-40 flex flex-col items-center justify-center gap-6">
              <div className="relative">
                <div className="w-24 h-24 border-4 border-indigo-500/20 border-t-indigo-500 rounded-full animate-spin"></div>
                <div className="absolute inset-0 flex items-center justify-center">
                  <Activity className="w-8 h-8 text-indigo-400 animate-pulse" />
                </div>
              </div>
              <p className="text-slate-400 font-bold tracking-widest text-sm uppercase">Loading Articles...</p>
            </div>
          ) : error ? (
            <div className="py-40 flex flex-col items-center justify-center gap-6">
              <div className="w-24 h-24 bg-rose-500/10 rounded-full flex items-center justify-center text-rose-500 border border-rose-500/20">
                <AlertCircle className="w-12 h-12" />
              </div>
              <p className="text-rose-400 font-black text-2xl tracking-tight">{(error as any)?.message || 'Load Error'}</p>
              <button
                onClick={handleRefresh}
                className="px-8 py-3 bg-slate-800 hover:bg-slate-700 text-white rounded-xl font-bold transition-all uppercase tracking-wider text-sm border border-slate-600"
              >
                Retry
              </button>
            </div>
          ) : filteredBlogs.length === 0 ? (
            <div className="py-40 flex flex-col items-center justify-center gap-6 opacity-60">
              <FileText className="w-24 h-24 text-slate-800" />
              <p className="text-slate-600 font-black text-2xl tracking-tight">No Articles Found</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-slate-950/50 border-b border-slate-800">
                    <th className="px-10 py-6 text-center w-16">
                      <input
                        type="checkbox"
                        className="w-5 h-5 rounded border-slate-700 bg-slate-800 text-indigo-600 focus:ring-indigo-500/50"
                        onChange={(e) => toggleSelectAll(e.target.checked)}
                        checked={filteredBlogs.length > 0 && selectedSlugs.length === filteredBlogs.length}
                      />
                    </th>
                    <th className="px-10 py-6 text-[10px] font-black text-slate-500 uppercase tracking-[0.2em]">Article</th>
                    <th className="px-10 py-6 text-[10px] font-black text-slate-500 uppercase tracking-[0.2em]">Category</th>
                    <th className="px-10 py-6 text-[10px] font-black text-slate-500 uppercase tracking-[0.2em]">Author</th>
                    <th className="px-10 py-6 text-[10px] font-black text-slate-500 uppercase tracking-[0.2em]">Status</th>
                    <th className="px-10 py-6 text-[10px] font-black text-slate-500 uppercase tracking-[0.2em]">Published</th>
                    <th className="px-10 py-6 text-[10px] font-black text-slate-500 uppercase tracking-[0.2em] text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/50">
                  {filteredBlogs.map((blog) => (
                    <tr key={blog.slug} className={`hover:bg-indigo-500/[0.03] transition-all group ${selectedSlugs.includes(blog.slug) ? 'bg-indigo-500/[0.05]' : ''}`}>
                      <td className="px-10 py-6 text-center">
                        <input
                          type="checkbox"
                          className="w-5 h-5 rounded border-slate-700 bg-slate-800 text-indigo-600 focus:ring-indigo-500/50"
                          checked={selectedSlugs.includes(blog.slug)}
                          onChange={() => toggleSelect(blog.slug)}
                        />
                      </td>
                      <td className="px-10 py-6">
                        <div className="flex items-center gap-4">
                          {blog.is_featured && (
                            <Star className="w-5 h-5 text-amber-400 fill-amber-400" />
                          )}
                          <div>
                            <p className="text-white text-lg font-bold group-hover:text-indigo-400 transition-colors tracking-tight">
                              {blog.title}
                            </p>
                            <p className="text-slate-500 text-sm mt-1">{blog.reading_time} min read</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-10 py-6">
                        <span className="inline-flex items-center px-3 py-1 rounded-lg text-xs font-bold bg-slate-800/50 text-slate-300 border border-slate-700">
                          {blog.category}
                        </span>
                      </td>
                      <td className="px-10 py-6">
                        <p className="text-slate-400 font-medium">{blog.author}</p>
                      </td>
                      <td className="px-10 py-6">
                        <span className={`inline-flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-black uppercase tracking-widest border ${
                          blog.status === 'published'
                            ? 'bg-emerald-500/5 text-emerald-400 border-emerald-500/20'
                            : blog.status === 'draft'
                            ? 'bg-amber-500/5 text-amber-400 border-amber-500/20'
                            : 'bg-slate-800/50 text-slate-500 border-slate-700'
                        }`}>
                          <span className={`w-2.5 h-2.5 rounded-full ${
                            blog.status === 'published' ? 'bg-emerald-400 animate-pulse' : 'bg-amber-400'
                          }`}></span>
                          {blog.status}
                        </span>
                      </td>
                      <td className="px-10 py-6">
                        <p className="text-slate-400 font-mono text-sm">{formatDate(blog.published_at)}</p>
                      </td>
                      <td className="px-10 py-6 text-right">
                        <div className="flex items-center justify-end gap-3 translate-x-4 opacity-0 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-300">
                          <button
                            onClick={() => onEditBlog(blog)}
                            className="p-3 bg-indigo-500/10 text-indigo-400 hover:bg-indigo-500/20 rounded-xl transition-all border border-indigo-500/20"
                            title="Edit Article"
                          >
                            <div className="w-5 h-5 flex items-center justify-center font-bold text-xs">✎</div>
                          </button>
                          <button
                            onClick={() => handleToggleStatus(blog.slug)}
                            className="p-3 bg-cyan-500/10 text-cyan-400 hover:bg-cyan-500/20 rounded-xl transition-all border border-cyan-500/20"
                            title="Toggle Status"
                          >
                            <TrendingUp className="w-5 h-5" />
                          </button>
                          <button
                            onClick={() => handleDeleteBlog(blog.slug)}
                            className="p-3 bg-rose-500/10 text-rose-500 hover:bg-rose-500/20 rounded-xl transition-all border border-rose-500/20"
                            title="Delete Article"
                          >
                            <Trash2 className="w-5 h-5" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default BlogDashboard;
