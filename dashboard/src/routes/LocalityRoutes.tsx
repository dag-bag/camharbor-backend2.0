import { Routes, Route } from 'react-router-dom';
import LocalityList from '../pages/locality/LocalityList';

export default function LocalityRoutes() {
  return (
    <Routes>
      <Route path="/" element={<LocalityList />} />
      <Route path="/new" element={<div>New Locality Form</div>} />
      <Route path="/:id" element={<div>Edit Locality Form</div>} />
    </Routes>
  );
}
