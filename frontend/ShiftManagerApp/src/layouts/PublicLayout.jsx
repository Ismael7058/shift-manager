import { Outlet } from 'react-router-dom';
import Header from '../components/layout/Header'

const PublicLayout = () => {
  return (
    <div className="flex h-screen overflow-hidden bg-black">       
        <div className="flex flex-col flex-1">
            <Header/>
            <main className="flex-1 justify-center overflow-y-auto p-6 w-full ">
                <Outlet />
            </main>
        </div>
    </div>
  );
};

export default PublicLayout;