// src/components/layout/PublicLayout.jsx
import Navbar from './Navbar.jsx';
import Footer from './Footer.jsx';

export default function PublicLayout({ children }) {
  return (
    <div className="min-h-screen flex flex-col bg-white dark:bg-navy-950">
      <Navbar />
      <main className="flex-1 pt-16">{children}</main>
      <Footer />
    </div>
  );
}

// src/components/layout/DashboardLayout.jsx — exported separately below
