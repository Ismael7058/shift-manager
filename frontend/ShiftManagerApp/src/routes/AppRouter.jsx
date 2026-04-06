import { Routes, Route } from 'react-router-dom'
import HomePage from '../pages/HomePage'
import PublicLayout from '../layouts/PublicLayout'

const AppRouter = () => {
  return (
    <Routes>
      <Route element={<PublicLayout />}>
        <Route path="/" element={<HomePage />} />
      </Route>
    </Routes>
  );
};

export default AppRouter;