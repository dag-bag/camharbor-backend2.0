import { Routes, Route } from 'react-router-dom';
import BrandDashboard from '../components/BrandDashboard';
import AddBrandModal from '../components/AddBrandModal';
import { useState } from 'react';

function BrandRoutes() {
  const [showAddModal, setShowAddModal] = useState(false);
  const [editingBrand, setEditingBrand] = useState<any>(null);
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
            <BrandDashboard
              key={refreshTrigger}
              onAddBrand={() => { setEditingBrand(null); setShowAddModal(true); }}
              onEditBrand={(brand: any) => { setEditingBrand(brand); setShowAddModal(true); }}
            />
          } 
        />
      </Routes>

      {showAddModal && (
        <AddBrandModal
          onClose={() => setShowAddModal(false)}
          onSuccess={handleSuccess}
          brandToEdit={editingBrand}
        />
      )}
    </>
  );
}

export default BrandRoutes;
