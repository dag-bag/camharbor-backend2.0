import { Routes, Route } from 'react-router-dom';
import CityDashboard from '../components/CityDashboard';
import AddCityModal from '../components/AddCityModal';
import { useState } from 'react';

function CityRoutes() {
  const [showAddModal, setShowAddModal] = useState(false);
  const [editingCity, setEditingCity] = useState<any>(null);
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
            <CityDashboard
              key={refreshTrigger}
              onAddCity={() => { setEditingCity(null); setShowAddModal(true); }}
              onEditCity={(city: any) => { setEditingCity(city); setShowAddModal(true); }}
            />
          } 
        />
        {/* Future city-related routes can be added here */}
        {/* <Route path="analytics" element={<CityAnalytics />} /> */}
        {/* <Route path=":slug" element={<CityDetail />} /> */}
      </Routes>

      {showAddModal && (
        <AddCityModal
          onClose={() => setShowAddModal(false)}
          onSuccess={handleSuccess}
          cityToEdit={editingCity}
        />
      )}
    </>
  );
}

export default CityRoutes;
