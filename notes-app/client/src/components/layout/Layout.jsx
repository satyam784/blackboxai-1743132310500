import { useAuth } from '../../context/AuthContext';
import Navbar from '../ui/Navbar';
import Sidebar from '../ui/Sidebar';
import ThemeToggle from '../ui/ThemeToggle';

const Layout = ({ children }) => {
  const { user } = useAuth();

  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      <div className="flex flex-1">
        {user && <Sidebar />}
        <main className="flex-1 p-6">
          <div className="flex justify-end mb-4">
            <ThemeToggle />
          </div>
          {children}
        </main>
      </div>
    </div>
  );
};

export default Layout;