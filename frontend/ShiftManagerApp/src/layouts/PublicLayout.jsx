import { Outlet } from 'react-router-dom';
import Header from '../components/layout/Header'
import Footer from '../components/layout/Footer';

const PublicLayout = () => {
  return (
    <div className="flex min-h-screen bg-black">
      <div className="flex flex-col flex-1">
        <Header />
        <main className="flex-1 w-full p-6">
          <Outlet />
        </main>
        <Footer />
      </div>
    </div>
  );
};

export default PublicLayout;