import { Routes, Route } from 'react-router-dom';
import ProductList from '../pages/product/ProductList';

export default function ProductRoutes() {
  return (
    <Routes>
      <Route path="/" element={<ProductList />} />
      <Route path="/new" element={<div>New Product Form</div>} />
      <Route path="/:id" element={<div>Edit Product Form</div>} />
    </Routes>
  );
}
