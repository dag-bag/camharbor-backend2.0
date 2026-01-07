import { Routes, Route } from 'react-router-dom';
import RiskDashboard from '../pages/risk/RiskDashboard';

export default function RiskRoutes() {
  return (
    <Routes>
      <Route path="/" element={<RiskDashboard />} />
    </Routes>
  );
}
