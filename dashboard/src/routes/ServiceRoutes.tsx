import { Routes, Route } from 'react-router-dom';
import ServiceList from '../pages/service/ServiceList';

export default function ServiceRoutes() {
  return (
    <Routes>
      <Route path="/" element={<ServiceList />} />
      <Route path="/new" element={<div>New Service Form</div>} />
      <Route path="/:id" element={<div>Edit Service Form</div>} />
    </Routes>
  );
}
