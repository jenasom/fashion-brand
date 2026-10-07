import React, { createContext, useContext, useState, useEffect } from 'react';
import { User, Cart, Notification } from '../types/index';
import { api, sessionToken } from '../services/api';

interface ToastInfo {
  id: string;
  type: 'success' | 'error' | 'info';
  message: string;
}

interface AppContextType {
  user: User | null;
  setUser: (u: User | null) => void;
  authReady: boolean;
  signIn: (email: string, password: string) => Promise<User>;
  signOut: () => Promise<void>;
  switchPersona: (userId: string) => Promise<void>;
  cart: Cart | null;
  isCartOpen: boolean;
  setIsCartOpen: (open: boolean) => void;
  refreshCart: () => Promise<void>;
  addToCart: (productId: string, variantId: string, quantity?: number) => Promise<void>;
  updateCartQuantity: (itemId: string, quantity: number) => Promise<void>;
  removeCartItem: (itemId: string) => Promise<void>;
  notifications: Notification[];
  unreadCount: number;
  markNotificationRead: (id: string) => Promise<void>;
  wishlist: string[];
  toggleWishlist: (productId: string) => void;
  isInWishlist: (productId: string) => boolean;
  toasts: ToastInfo[];
  showToast: (message: string, type?: 'success' | 'error' | 'info') => void;
  removeToast: (id: string) => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [authReady, setAuthReady] = useState(false);
  const [user, setUser] = useState<User | null>(null);
  const [cart, setCart] = useState<Cart | null>(null);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [wishlist, setWishlist] = useState<string[]>(() => {
    try {
      return JSON.parse(localStorage.getItem('atelier_wishlist_guest') || '[]');
    } catch {
      return [];
    }
  });
  const [toasts, setToasts] = useState<ToastInfo[]>([]);

  useEffect(() => {
    try { const stored = JSON.parse(localStorage.getItem('atelier_wishlist_' + (user?.id || 'guest')) || '[]'); setWishlist(Array.isArray(stored) ? stored.filter(item => typeof item === 'string') : []); }
    catch { setWishlist([]); }
  }, [user?.id]);
  const cartId = 'atelier_cart_session_1';

  const showToast = (message: string, type: 'success' | 'error' | 'info' = 'success') => {
    const id = `toast_${Date.now()}_${Math.random().toString(36).substring(2, 5)}`;
    setToasts((prev) => [...prev, { id, type, message }]);
    setTimeout(() => {
      removeToast(id);
    }, 4000);
  };

  const removeToast = (id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  // Initial load
  useEffect(() => {
    const init = async () => {
      try {
        const { user: currentUser } = await api.getCurrentUser();
        setUser(currentUser);
        if (currentUser) {
          loadNotifications(currentUser.id);
        }
      } catch (err) {
        sessionToken.clear();
      } finally {
        setAuthReady(true);
      }

      try {
        const { cart: currentCart } = await api.getCart(cartId);
        setCart(currentCart);
      } catch (err) {
        console.warn('Could not load cart:', err);
      }
    };

    init();
  }, []);

  const loadNotifications = async (userId: string) => {
    try {
      const { notifications: list } = await api.getNotifications(userId);
      setNotifications(list);
    } catch (err) {
      console.warn('Failed to load notifications', err);
    }
  };

  const signIn = async (email: string, password: string) => {
    const result = await api.login(email, password);
    sessionToken.set(result.token);
    setUser(result.user);
    setNotifications([]);
    await loadNotifications(result.user.id);
    return result.user;
  };
  const signOut = async () => {
    try { await api.logout(); } finally { sessionToken.clear(); setUser(null); setNotifications([]); window.location.hash = '/login'; }
  };
  const switchPersona = async (userId: string) => {
    try {
      const { user: newUser } = await api.switchPersona(userId);
      setUser(newUser);
      loadNotifications(newUser.id);
      showToast(`Switched active persona to ${newUser.name} (${newUser.roles.join(', ')})`, 'info');
    } catch (err: any) {
      showToast(err.message, 'error');
    }
  };

  const refreshCart = async () => {
    try {
      const { cart: updated } = await api.getCart(cartId);
      setCart(updated);
    } catch (err) {
      console.warn('Failed to refresh cart', err);
    }
  };

  const addToCart = async (productId: string, variantId: string, quantity = 1) => {
    try {
      const { cart: updated } = await api.addToCart(cartId, productId, variantId, quantity);
      setCart(updated);
      setIsCartOpen(true);
      showToast('Item placed into atelier wardrobe bag.');
    } catch (err: any) {
      showToast(err.message || 'Cannot add item', 'error');
      throw err;
    }
  };

  const updateCartQuantity = async (itemId: string, quantity: number) => {
    try {
      const { cart: updated } = await api.updateCartItem(cartId, itemId, quantity);
      setCart(updated);
    } catch (err: any) {
      showToast(err.message, 'error');
    }
  };

  const removeCartItem = async (itemId: string) => {
    try {
      const { cart: updated } = await api.removeCartItem(cartId, itemId);
      setCart(updated);
      showToast('Item removed from cart', 'info');
    } catch (err: any) {
      showToast(err.message, 'error');
    }
  };

  const markNotificationRead = async (id: string) => {
    try {
      await api.markNotificationRead(id);
      setNotifications((prev) => prev.map((n) => (n.id === id ? { ...n, isRead: true } : n)));
    } catch (err) {
      console.warn(err);
    }
  };

  const toggleWishlist = (productId: string) => {
    setWishlist((prev) => {
      const next = prev.includes(productId) ? prev.filter((id) => id !== productId) : [...prev, productId];
      localStorage.setItem('atelier_wishlist_' + (user?.id || 'guest'), JSON.stringify(next));
      showToast(prev.includes(productId) ? 'Removed from saved wishlist' : 'Saved to your private atelier wishlist');
      return next;
    });
  };

  const isInWishlist = (productId: string) => wishlist.includes(productId);

  const unreadCount = notifications.filter((n) => !n.isRead).length;

  return (
    <AppContext.Provider
      value={{
        user,
        authReady,
        signIn,
        signOut,
        setUser,
        switchPersona,
        cart,
        isCartOpen,
        setIsCartOpen,
        refreshCart,
        addToCart,
        updateCartQuantity,
        removeCartItem,
        notifications,
        unreadCount,
        markNotificationRead,
        wishlist,
        toggleWishlist,
        isInWishlist,
        toasts,
        showToast,
        removeToast
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) throw new Error('useApp must be used within an AppProvider');
  return context;
};
