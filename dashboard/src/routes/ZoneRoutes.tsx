import { Routes, Route } from 'react-router-dom';
import ZoneList from '../pages/zone/ZoneList';
import ZoneForm from '../pages/zone/ZoneForm';

export default function ZoneRoutes() {
  return (
    <Routes>
      <Route path="/" element={<ZoneList />} />
      <Route path="/new" element={<ZoneForm />} />
      <Route path="/:id" element={<ZoneForm />} />
    </Routes>
  );
}
