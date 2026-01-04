import React, { useState, useMemo } from 'react';
import { X, Code, FileText, Upload, CheckCircle2, AlertCircle, Loader2, Sparkles, BookOpen } from 'lucide-react';
import SimpleMDE from 'react-simplemde-editor';
import 'easymde/dist/easymde.min.css';
import { blogApi } from '../api/blogApi';
import type { Blog } from '../types/blog.types';
import { useMutation, useQueryClient } from '@tanstack/react-query';

interface AddBlogModalProps {
  onClose: () => void;
  onSuccess: () => void;
  blogToEdit?: Blog | null;
}

const AddBlogModal: React.FC<AddBlogModalProps> = ({ onClose, onSuccess, blogToEdit }) => {
  const [activeTab, setActiveTab] = useState<'form' | 'json'>(blogToEdit ? 'form' : 'json');
  const [jsonInput, setJsonInput] = useState(blogToEdit ? JSON.stringify(blogToEdit, null, 2) : '');
  const [success, setSuccess] = useState<boolean>(false);
  const queryClient = useQueryClient();

  const [formData, setFormData] = useState({
    title: blogToEdit?.title || '',
    slug: blogToEdit?.slug || '',
    excerpt: blogToEdit?.excerpt || '',
    content: blogToEdit?.content || '',
    cover_image: blogToEdit?.cover_image || '',
    category: blogToEdit?.category || '',
    tags: blogToEdit?.tags?.join(', ') || '',
    author: blogToEdit?.author || '',
    seo: {
      meta_title: blogToEdit?.seo?.meta_title || '',
      meta_description: blogToEdit?.seo?.meta_description || '',
      keywords: blogToEdit?.seo?.keywords?.join(', ') || ''
    },
    status: blogToEdit?.status || 'draft' as 'draft' | 'published' | 'archived',
    is_featured: blogToEdit?.is_featured ?? false,
    published_at: blogToEdit?.published_at ? new Date(blogToEdit.published_at).toISOString().slice(0, 16) : ''
  });

  // SimpleMDE options - must be at top level to avoid React Hooks order violation
  const editorOptions = useMemo(() => ({
    spellChecker: false,
    placeholder: "# Your blog content here\n\nWrite in **Markdown** format...",
    status: ['lines', 'words'],
    toolbar: ["bold", "italic", "heading", "|", "quote", "unordered-list", "ordered-list", "|", "link", "image", "|", "preview", "side-by-side", "fullscreen", "|", "guide"],
    autofocus: false,
    hideIcons: [],
  }), []);

  const mutation = useMutation({
    mutationFn: async (vars: { type: 'json' | 'form', data: any }) => {
      let payload = vars.data;
      if (vars.type === 'json') {
        payload = JSON.parse(vars.data);
      }

      if (blogToEdit) {
        // Edit Mode - Update existing
        const response = await blogApi.updateBlog(blogToEdit.slug, payload);
        if (!response.success) throw new Error(response.error?.message || 'Update failed');
      } else {
        // Create Mode - Create new (bulk or single)
        const response = await blogApi.createBlog(payload);
        if (!response.success) throw new Error(response.error?.message || 'Creation failed');
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['blogs'] });
      setSuccess(true);
      setTimeout(() => { onSuccess(); onClose(); }, 2000);
    }
  });

  const handleSubmitJson = async () => {
    try {
      JSON.parse(jsonInput);
      mutation.mutate({ type: 'json', data: jsonInput });
    } catch (err) {
      mutation.mutate({ type: 'json', data: jsonInput });
    }
  };

  const handleSubmitForm = async (e: React.FormEvent) => {
    e.preventDefault();
    
    const blogData: Partial<Blog> = {
      title: formData.title,
      slug: formData.slug,
      excerpt: formData.excerpt,
      content: formData.content,
      cover_image: formData.cover_image,
      category: formData.category,
      tags: formData.tags.split(',').map(t => t.trim()).filter(t => t),
      author: formData.author,
      seo: {
        meta_title: formData.seo.meta_title || undefined,
        meta_description: formData.seo.meta_description || undefined,
        keywords: formData.seo.keywords ? formData.seo.keywords.split(',').map(k => k.trim()).filter(k => k) : undefined
      },
      status: formData.status,
      is_featured: formData.is_featured,
      published_at: formData.published_at ? new Date(formData.published_at).toISOString() : undefined
    };
    
    mutation.mutate({ type: 'form', data: blogData });
  };

  const error = mutation.error
    ? (mutation.error instanceof SyntaxError
      ? 'Invalid JSON format'
      : (mutation.error as Error).message)
    : null;

  const isSubmitting = mutation.isPending;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      {/* Backdrop */}
      <div className="absolute inset-0 bg-slate-950/90 backdrop-blur-md animate-in fade-in duration-300" onClick={onClose} />

      {/* Modal Container */}
      <div className="relative glass-card rounded-[2rem] w-full max-w-5xl max-h-[90vh] flex flex-col shadow-[0_0_100px_-20px_rgba(79,70,229,0.4)] overflow-hidden animate-in zoom-in-95 slide-in-from-bottom-10 duration-500 border border-slate-700/50">

        {/* Modal Header */}
        <div className="p-8 border-b border-white/5 bg-white/5 flex items-center justify-between relative overflow-hidden">
          <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-500/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2 pointer-events-none"></div>
          <div className="text-left space-y-1 relative z-10">
            <h2 className="text-3xl font-black text-white flex items-center gap-4 tracking-tighter">
              <Sparkles className="w-8 h-8 text-indigo-400 fill-indigo-400/20" />
              {blogToEdit ? 'Edit Article' : 'Create Article'}
            </h2>
            <p className="text-slate-400 text-sm font-bold tracking-widest font-mono uppercase opacity-70 pl-1">
              Content Management Interface v2.0
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-3 hover:bg-white/10 rounded-2xl text-slate-400 hover:text-white transition-all transform hover:rotate-90 duration-300 relative z-10"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Tab Switcher */}
        <div className="flex p-2 bg-black/20 gap-2 mx-8 mt-8 rounded-2xl border border-white/5">
          <button
            onClick={() => setActiveTab('json')}
            className={`flex-1 py-4 text-xs font-black uppercase tracking-[0.2em] flex items-center justify-center gap-3 transition-all rounded-xl ${activeTab === 'json' ? 'bg-indigo-600 text-white shadow-xl shadow-indigo-600/20' : 'text-slate-500 hover:text-slate-300 hover:bg-white/5'
              }`}
          >
            <Code className="w-4 h-4" />
            JSON Editor
          </button>
          <button
            onClick={() => setActiveTab('form')}
            className={`flex-1 py-4 text-xs font-black uppercase tracking-[0.2em] flex items-center justify-center gap-3 transition-all rounded-xl ${activeTab === 'form' ? 'bg-indigo-600 text-white shadow-xl shadow-indigo-600/20' : 'text-slate-500 hover:text-slate-300 hover:bg-white/5'
              }`}
          >
            <FileText className="w-4 h-4" />
            Form Editor
          </button>
        </div>

        {/* Content Area */}
        <div className="flex-1 overflow-y-auto p-8 relative">
          {success ? (
            <div className="flex flex-col items-center justify-center py-24 text-center space-y-8 animate-in zoom-in duration-500">
              <div className="relative">
                <div className="w-24 h-24 bg-emerald-500/20 rounded-full flex items-center justify-center text-emerald-400 border border-emerald-500/30">
                  <CheckCircle2 className="w-12 h-12" />
                </div>
                <div className="absolute -inset-6 bg-emerald-500/20 rounded-full blur-2xl -z-10 animate-pulse" />
              </div>
              <div className="space-y-2">
                <h3 className="text-4xl font-black text-white tracking-tight">Success!</h3>
                <p className="text-slate-400 font-medium text-lg">Article has been {blogToEdit ? 'updated' : 'created'} successfully.</p>
              </div>
            </div>
          ) : (
            <>
              {activeTab === 'json' ? (
                <div className="space-y-6 h-full flex flex-col text-left">
                  <div className="p-4 bg-indigo-500/10 border border-indigo-500/20 rounded-2xl text-indigo-300 text-xs font-mono leading-relaxed flex gap-3">
                    <BookOpen className="w-5 h-5 flex-shrink-0" />
                    <div>
                      <span className="text-indigo-400 font-black uppercase block mb-1 tracking-widest">JSON Import</span>
                      Paste blog data as JSON. Supports single blog object or array for bulk import.
                    </div>
                  </div>
                  <div className="flex-1 relative group">
                    <textarea
                      placeholder={`{
  "title": "Your Amazing Blog Post",
  "slug": "your-amazing-blog-post",
  "excerpt": "A brief summary...",
  "content": "# Your Content Here\\n\\nMarkdown supported!",
  "category": "Technology",
  "tags": ["tech", "tutorial"],
  "author": "John Doe",
  "status": "draft"
}`}
                      value={jsonInput}
                      onChange={(e) => setJsonInput(e.target.value)}
                      className="w-full h-full min-h-[400px] bg-black/60 border border-slate-700/50 rounded-[2rem] p-8 font-mono text-sm text-cyan-400 placeholder:text-slate-700 focus:outline-none focus:ring-4 focus:ring-indigo-500/20 focus:border-indigo-500/50 transition-all resize-none shadow-inner"
                    />
                    <div className="absolute right-8 top-8 text-slate-800 pointer-events-none group-focus-within:text-indigo-500/20 transition-colors">
                      <Code className="w-8 h-8" />
                    </div>
                  </div>
                </div>
              ) : (
                <form onSubmit={handleSubmitForm} className="grid grid-cols-1 md:grid-cols-2 gap-6 text-left">
                  {/* Basic Info */}
                  <div className="md:col-span-2 space-y-3 group">
                    <label className="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em] px-2">Title *</label>
                    <input
                      type="text"
                      required
                      placeholder="Enter blog title"
                      value={formData.title}
                      onChange={e => {
                        const val = e.target.value;
                        setFormData({
                          ...formData,
                          title: val,
                          slug: val.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '')
                        });
                      }}
                      className="w-full bg-white/5 border border-white/5 rounded-2xl py-4 px-6 text-white placeholder:text-slate-700 group-hover:bg-white/[0.08] focus:outline-none focus:ring-4 focus:ring-indigo-500/20 focus:border-indigo-500/50 transition-all font-bold tracking-tight"
                    />
                  </div>

                  <div className="space-y-3 group">
                    <label className="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em] px-2">Slug *</label>
                    <input
                      type="text"
                      required
                      value={formData.slug}
                      onChange={e => setFormData({ ...formData, slug: e.target.value })}
                      className="w-full bg-white/5 border border-white/5 rounded-2xl py-4 px-6 text-white placeholder:text-slate-700 group-hover:bg-white/[0.08] focus:outline-none focus:ring-4 focus:ring-indigo-500/20 focus:border-indigo-500/50 transition-all font-mono"
                    />
                  </div>

                  <div className="space-y-3 group">
                    <label className="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em] px-2">Category *</label>
                    <input
                      type="text"
                      required
                      placeholder="e.g., Technology, Business"
                      value={formData.category}
                      onChange={e => setFormData({ ...formData, category: e.target.value })}
                      className="w-full bg-white/5 border border-white/5 rounded-2xl py-4 px-6 text-white placeholder:text-slate-700 group-hover:bg-white/[0.08] focus:outline-none focus:ring-4 focus:ring-indigo-500/20 focus:border-indigo-500/50 transition-all font-bold"
                    />
                  </div>

                  <div className="md:col-span-2 space-y-3 group">
                    <label className="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em] px-2">Excerpt (max 300 chars)</label>
                    <textarea
                      maxLength={300}
                      placeholder="Brief summary of the blog post..."
                      value={formData.excerpt}
                      onChange={e => setFormData({ ...formData, excerpt: e.target.value })}
                      className="w-full bg-white/5 border border-white/5 rounded-2xl py-4 px-6 text-white placeholder:text-slate-700 group-hover:bg-white/[0.08] focus:outline-none focus:ring-4 focus:ring-indigo-500/20 focus:border-indigo-500/50 transition-all resize-none h-24"
                    />
                    <p className="text-xs text-slate-500 px-2">{formData.excerpt.length}/300 characters</p>
                  </div>

                  <div className="md:col-span-2 space-y-3">
                    <label className="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em] px-2">Content (Markdown) *</label>
                    <div className="markdown-editor-wrapper">
                      <SimpleMDE
                        value={formData.content}
                        onChange={(value) => setFormData({ ...formData, content: value })}
                        options={editorOptions}
                      />
                    </div>
                  </div>

                  <div className="space-y-3 group">
                    <label className="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em] px-2">Author *</label>
                    <input
                      type="text"
                      required
                      placeholder="Author name"
                      value={formData.author}
                      onChange={e => setFormData({ ...formData, author: e.target.value })}
                      className="w-full bg-white/5 border border-white/5 rounded-2xl py-4 px-6 text-white placeholder:text-slate-700 group-hover:bg-white/[0.08] focus:outline-none focus:ring-4 focus:ring-indigo-500/20 focus:border-indigo-500/50 transition-all font-bold"
                    />
                  </div>

                  <div className="space-y-3 group">
                    <label className="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em] px-2">Tags (comma-separated)</label>
                    <input
                      type="text"
                      placeholder="tech, tutorial, guide"
                      value={formData.tags}
                      onChange={e => setFormData({ ...formData, tags: e.target.value })}
                      className="w-full bg-white/5 border border-white/5 rounded-2xl py-4 px-6 text-white placeholder:text-slate-700 group-hover:bg-white/[0.08] focus:outline-none focus:ring-4 focus:ring-indigo-500/20 focus:border-indigo-500/50 transition-all"
                    />
                  </div>

                  <div className="md:col-span-2 space-y-3 group">
                    <label className="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em] px-2">Cover Image URL</label>
                    <input
                      type="url"
                      placeholder="https://example.com/image.jpg"
                      value={formData.cover_image}
                      onChange={e => setFormData({ ...formData, cover_image: e.target.value })}
                      className="w-full bg-white/5 border border-white/5 rounded-2xl py-4 px-6 text-white placeholder:text-slate-700 group-hover:bg-white/[0.08] focus:outline-none focus:ring-4 focus:ring-indigo-500/20 focus:border-indigo-500/50 transition-all font-mono text-sm"
                    />
                  </div>

                  {/* SEO Fields */}
                  <div className="md:col-span-2 space-y-4 p-6 glass-card rounded-2xl border border-slate-700/30">
                    <h3 className="text-white font-bold text-sm flex items-center gap-2">
                      <span className="text-indigo-400">⚡</span> SEO Optimization
                    </h3>
                    
                    <div className="space-y-3">
                      <input
                        type="text"
                        placeholder="SEO Meta Title"
                        value={formData.seo.meta_title}
                        onChange={e => setFormData({ ...formData, seo: { ...formData.seo, meta_title: e.target.value } })}
                        className="w-full bg-white/5 border border-white/5 rounded-xl py-3 px-4 text-white placeholder:text-slate-700 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 transition-all text-sm"
                      />
                      <textarea
                        placeholder="SEO Meta Description"
                        value={formData.seo.meta_description}
                        onChange={e => setFormData({ ...formData, seo: { ...formData.seo, meta_description: e.target.value } })}
                        className="w-full bg-white/5 border border-white/5 rounded-xl py-3 px-4 text-white placeholder:text-slate-700 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 transition-all resize-none h-20 text-sm"
                      />
                      <input
                        type="text"
                        placeholder="SEO Keywords (comma-separated)"
                        value={formData.seo.keywords}
                        onChange={e => setFormData({ ...formData, seo: { ...formData.seo, keywords: e.target.value } })}
                        className="w-full bg-white/5 border border-white/5 rounded-xl py-3 px-4 text-white placeholder:text-slate-700 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 transition-all text-sm"
                      />
                    </div>
                  </div>

                  {/* Status & Publishing */}
                  <div className="space-y-3 group">
                    <label className="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em] px-2">Status</label>
                    <select
                      value={formData.status}
                      onChange={e => setFormData({ ...formData, status: e.target.value as any })}
                      className="w-full bg-white/5 border border-white/5 rounded-2xl py-4 px-6 text-white group-hover:bg-white/[0.08] focus:outline-none focus:ring-4 focus:ring-indigo-500/20 focus:border-indigo-500/50 transition-all font-bold"
                    >
                      <option value="draft">Draft</option>
                      <option value="published">Published</option>
                      <option value="archived">Archived</option>
                    </select>
                  </div>

                  <div className="space-y-3 group">
                    <label className="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em] px-2">Published Date</label>
                    <input
                      type="datetime-local"
                      value={formData.published_at}
                      onChange={e => setFormData({ ...formData, published_at: e.target.value })}
                      className="w-full bg-white/5 border border-white/5 rounded-2xl py-4 px-6 text-white group-hover:bg-white/[0.08] focus:outline-none focus:ring-4 focus:ring-indigo-500/20 focus:border-indigo-500/50 transition-all"
                    />
                  </div>

                  <div className="md:col-span-2 p-6 glass-card rounded-3xl border-dashed border-white/10 flex items-center justify-between hover:bg-white/5 transition-colors cursor-pointer group" onClick={() => setFormData({ ...formData, is_featured: !formData.is_featured })}>
                    <div>
                      <p className="text-sm font-bold text-white group-hover:text-indigo-300 transition-colors">Featured Article</p>
                      <p className="text-xs text-slate-500 mt-1 uppercase tracking-widest font-bold">Highlight this article on homepage</p>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer pointer-events-none">
                      <input
                        type="checkbox"
                        checked={formData.is_featured}
                        readOnly
                        className="sr-only peer"
                      />
                      <div className="w-14 h-8 bg-slate-800 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full after:content-[''] after:absolute after:top-[4px] after:left-[4px] after:bg-white after:rounded-full after:h-6 after:w-6 after:transition-all peer-checked:bg-indigo-600 shadow-inner"></div>
                    </label>
                  </div>
                </form>
              )}

              {error && (
                <div className="mt-8 p-6 bg-rose-500/10 border border-rose-500/20 rounded-3xl text-rose-400 text-sm font-bold flex items-start gap-4 animate-in shake duration-500 text-left shadow-[0_0_20px_-5px_rgba(244,63,94,0.2)]">
                  <AlertCircle className="w-6 h-6 flex-shrink-0" />
                  <p className="mt-0.5 leading-relaxed">{error}</p>
                </div>
              )}
            </>
          )}
        </div>

        {/* Action Footer */}
        {!success && (
          <div className="p-8 border-t border-white/5 flex items-center justify-between bg-black/40 backdrop-blur-md">
            <button
              onClick={onClose}
              disabled={isSubmitting}
              className="px-6 py-3 text-slate-500 hover:text-white font-black uppercase tracking-widest text-xs transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={(e) => {
                if (activeTab === 'json') {
                  handleSubmitJson();
                } else {
                  handleSubmitForm(e as any);
                }
              }}
              disabled={isSubmitting}
              className="px-8 py-4 bg-indigo-600 hover:bg-indigo-500 text-white rounded-2xl font-bold transition-all shadow-[0_0_30px_-5px_rgba(79,70,229,0.5)] active:scale-95 flex items-center gap-3 group disabled:opacity-50"
            >
              {isSubmitting ? (
                <><Loader2 className="w-4 h-4 animate-spin" /> Saving...</>
              ) : (
                <><Upload className="w-4 h-4 group-hover:-translate-y-0.5 transition-transform" /> {blogToEdit ? 'Update' : 'Create'} Article</>
              )}
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default AddBlogModal;
