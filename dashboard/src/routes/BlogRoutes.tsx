import { Routes, Route } from 'react-router-dom';
import BlogDashboard from '../components/BlogDashboard';
import AddBlogModal from '../components/AddBlogModal';
import { useState } from 'react';

function BlogRoutes() {
  const [showAddModal, setShowAddModal] = useState(false);
  const [editingBlog, setEditingBlog] = useState<any>(null);
  const [refreshTrigger, setRefreshTrigger] = useState(0);

  const handleSuccess = () => {
    setRefreshTrigger(prev => prev + 1);
  };

  return (
    <>
      <Routes>
        <Route 
          index 
          element={
            <BlogDashboard
              key={refreshTrigger}
              onAddBlog={() => { setEditingBlog(null); setShowAddModal(true); }}
              onEditBlog={(blog: any) => { setEditingBlog(blog); setShowAddModal(true); }}
            />
          } 
        />
        {/* Future blog-related routes can be added here */}
        {/* <Route path="analytics" element={<BlogAnalytics />} /> */}
        {/* <Route path="categories" element={<BlogCategories />} /> */}
        {/* <Route path=":slug/preview" element={<BlogPreview />} /> */}
      </Routes>

      {showAddModal && (
        <AddBlogModal
          onClose={() => setShowAddModal(false)}
          onSuccess={handleSuccess}
          blogToEdit={editingBlog}
        />
      )}
    </>
  );
}

export default BlogRoutes;
