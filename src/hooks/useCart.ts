import { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';

interface CartItem {
  id: string;
  user_id: string;
  product_id: string;
  size_info: any;
  quantity: number;
  product?: any;
}

interface CartItemInsert {
  user_id: string;
  product_id: string;
  size_info: any;
  quantity: number;
}

interface CartItemUpdate {
  quantity?: number;
  size_info?: any;
}

export function useCart() {
  const { user } = useAuth();
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<any>(null);

  const fetchCart = async () => {
    if (!user) {
      setCartItems([]);
      return;
    }

    try {
      setLoading(true);
      setError(null);
      
      // Mock cart data - in a real app, this would come from a database
      const mockCartItems: CartItem[] = [];
      setCartItems(mockCartItems);
    } catch (err) {
      console.error('Error fetching cart:', err);
      setError(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCart();
  }, [user]);

  const addToCart = async (productId: string, sizeInfo: any, quantity: number = 1) => {
    if (!user) {
      throw new Error('Must be logged in to add to cart');
    }

    try {
      setError(null);
      
      const newItem: CartItem = {
        id: `cart_${Date.now()}`,
        user_id: user.id,
        product_id: productId,
        size_info: sizeInfo,
        quantity
      };

      setCartItems(prev => [...prev, newItem]);
      
      return { data: newItem, error: null };
    } catch (err) {
      console.error('Error adding to cart:', err);
      setError(err);
      return { data: null, error: err };
    }
  };

  const updateCartItem = async (itemId: string, updates: CartItemUpdate) => {
    try {
      setError(null);
      
      setCartItems(prev => prev.map(item => 
        item.id === itemId ? { ...item, ...updates } : item
      ));
      
      return { data: null, error: null };
    } catch (err) {
      console.error('Error updating cart item:', err);
      setError(err);
      return { data: null, error: err };
    }
  };

  const removeFromCart = async (itemId: string) => {
    try {
      setError(null);
      
      setCartItems(prev => prev.filter(item => item.id !== itemId));
      
      return { error: null };
    } catch (err) {
      console.error('Error removing from cart:', err);
      setError(err);
      return { error: err };
    }
  };

  const clearCart = async () => {
    if (!user) return { error: new Error('Must be logged in') };

    try {
      setError(null);
      setCartItems([]);
      return { error: null };
    } catch (err) {
      console.error('Error clearing cart:', err);
      setError(err);
      return { error: err };
    }
  };

  // Calculate cart totals
  const cartTotal = cartItems.reduce((total, item) => {
    const price = item.size_info?.price || item.product?.sale_price || item.product?.base_price || 0;
    return total + (price * item.quantity);
  }, 0);

  const cartCount = cartItems.reduce((count, item) => count + item.quantity, 0);

  return {
    cartItems,
    loading,
    error,
    cartTotal,
    cartCount,
    addToCart,
    updateCartItem,
    removeFromCart,
    clearCart,
    refetch: fetchCart
  };
}