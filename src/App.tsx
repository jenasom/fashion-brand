import React, { useState, useEffect } from 'react';
import { AppProvider } from './context/AppContext';
import { Navbar } from './components/Navbar';
import { Footer } from './components/Footer';
import { CartDrawer } from './components/CartDrawer';
import { ToastContainer } from './components/ToastContainer';

// Pages
import { DashboardPage } from './pages/DashboardPage';
import { LoginPage } from './pages/LoginPage';
import { HomePage } from './pages/HomePage';
import { ShopPage } from './pages/ShopPage';
import { ProductDetailPage } from './pages/ProductDetailPage';
import { CollectionsPage } from './pages/CollectionsPage';
import { CartPage } from './pages/CartPage';
import { CheckoutPage } from './pages/CheckoutPage';
import { OrderDetailPage } from './pages/OrderDetailPage';
import { AcademyPage } from './pages/AcademyPage';
import { CourseDetailPage } from './pages/CourseDetailPage';
import { StudentDashboardPage } from './pages/StudentDashboardPage';
import { LessonViewerPage } from './pages/LessonViewerPage';
import { ClassesPage } from './pages/ClassesPage';
import { TutoringPage } from './pages/TutoringPage';
import { CertificateVerifyPage } from './pages/CertificateVerifyPage';
import { AdminDashboardPage } from './pages/AdminDashboardPage';

export default function App() {
  const [currentPath, setCurrentPath] = useState<string>(() => {
    const hash = window.location.hash.replace(/^#/, '');
    return hash || '/';
  });

  useEffect(() => {
    const handleHashChange = () => {
      const hash = window.location.hash.replace(/^#/, '');
      setCurrentPath(hash || '/');
      window.scrollTo(0, 0);
    };

    window.addEventListener('hashchange', handleHashChange);
    return () => window.removeEventListener('hashchange', handleHashChange);
  }, []);

  const navigateTo = (route: string) => {
    window.location.hash = route;
    setCurrentPath(route);
    window.scrollTo(0, 0);
  };

  // Route Resolver
  const renderCurrentView = () => {
    // Parse query params if present
    const [path, queryString] = currentPath.split('?');
    const params = new URLSearchParams(queryString || '');

    if (path === '/login') return <LoginPage onNavigate={navigateTo} />;
    if (path === '/dashboard' || path.startsWith('/dashboard/')) return <DashboardPage role={path.split('/')[2]} onNavigate={navigateTo} />;
    // Product Detail: /shop/:slug
    if (path.startsWith('/shop/')) {
      const slug = path.replace('/shop/', '');
      return <ProductDetailPage slug={slug} onNavigate={navigateTo} />;
    }

    // Shop Storefront: /shop
    if (path === '/shop') {
      return (
        <ShopPage
          onNavigate={navigateTo}
          searchParam={params.get('search') || ''}
          categoryParam={params.get('category') || ''}
          wishlistOnly={params.get('wishlist') === 'true'}
        />
      );
    }

    // Collections: /collections
    if (path === '/collections') {
      return <CollectionsPage onNavigate={navigateTo} />;
    }

    // Cart: /cart
    if (path === '/cart') {
      return <CartPage onNavigate={navigateTo} />;
    }

    // Checkout: /checkout
    if (path === '/checkout') {
      return <CheckoutPage onNavigate={navigateTo} />;
    }

    // Order Detail: /orders/:id
    if (path.startsWith('/orders/')) {
      const orderId = path.replace('/orders/', '');
      return <OrderDetailPage orderId={orderId} onNavigate={navigateTo} />;
    }

    // Academy: /academy
    if (path === '/academy') {
      return <AcademyPage onNavigate={navigateTo} />;
    }

    // Course Detail: /courses/:slug
    if (path.startsWith('/courses/')) {
      const slug = path.replace('/courses/', '');
      return <CourseDetailPage slug={slug} onNavigate={navigateTo} />;
    }

    // Student Dashboard: /student
    if (path === '/student') {
      return <DashboardPage role="student" onNavigate={navigateTo} />;
    }

    // Student Course Classroom: /student/courses/:courseId
    if (path.startsWith('/student/courses/')) {
      const courseId = path.replace('/student/courses/', '');
      return <LessonViewerPage courseId={courseId} onNavigate={navigateTo} />;
    }

    // Scheduled Classes: /classes
    if (path === '/classes') {
      return <ClassesPage onNavigate={navigateTo} />;
    }

    // Mentorship: /tutoring
    if (path === '/tutoring') {
      return <TutoringPage onNavigate={navigateTo} />;
    }

    // Certificate verification: /certificates/:code
    if (path.startsWith('/certificates/')) {
      const code = path.replace('/certificates/', '');
      return <CertificateVerifyPage initialCode={code === 'verify' ? '' : code} onNavigate={navigateTo} />;
    }

    // Admin Dashboard: /admin
    if (path === '/admin') {
      return <DashboardPage role="admin" onNavigate={navigateTo} />;
    }

    // Default: Home
    return <HomePage onNavigate={navigateTo} />;
  };

  return (
    <AppProvider>
      <div className="min-h-screen flex flex-col bg-[#FAF9F5] text-[#1A1A1A] selection:bg-[#C2A676] selection:text-white">
        <Navbar currentRoute={currentPath} onNavigate={navigateTo} />
        <main className="flex-1">{renderCurrentView()}</main>
        <Footer onNavigate={navigateTo} />
        <CartDrawer />
        <ToastContainer />
      </div>
    </AppProvider>
  );
}
