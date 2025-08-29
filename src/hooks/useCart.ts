import { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { db, subscriptions } from '../lib/supabase';
import type { CartItemWithProduct, CartItemInsert, CartItemUpdate } from '../types/database';

export function useCart() {
  const { user } = useAuth();
  const [cartItems, setCartItems] = useState<CartItemWithProduct[]>([]);
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
      
      const { data, error: fetchError } = await db.getCart(user.id);
      
      if (fetchError) {
        throw fetchError;
      }
      
      setCartItems(data || []);
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

  // Subscribe to real-time cart updates
  useEffect(() => {
    if (!user) return;

    const subscription = subscriptions.subscribeToCart(user.id, (payload) => {
      console.log('Cart update:', payload);
      fetchCart();
    });

    return () => {
      subscription.unsubscribe();
    };
  }, [user]);

  const addToCart = async (productId: string, sizeInfo: any, quantity: number = 1) => {
    if (!user) {
      throw new Error('Must be logged in to add to cart');
    }

    try {
      setError(null);
      
      const cartItem: CartItemInsert = {
        user_id: user.id,
        product_id: productId,
        size_info: sizeInfo,
        quantity
      };

      const { data, error: addError } = await db.addToCart(cartItem);
      
      if (addError) {
        throw addError;
      }
      
      // Refresh cart
      await fetchCart();
      
      return { data, error: null };
    } catch (err) {
      console.error('Error adding to cart:', err);
      setError(err);
      return { data: null, error: err };
    }
  };

  const updateCartItem = async (itemId: string, updates: CartItemUpdate) => {
    try {
      setError(null);
      
      const { data, error: updateError } = await db.updateCartItem(itemId, updates);
      
      if (updateError) {
        throw updateError;
      }
      
      // Refresh cart
      await fetchCart();
      
      return { data, error: null };
    } catch (err) {
      console.error('Error updating cart item:', err);
      setError(err);
      return { data: null, error: err };
    }
  };

  const removeFromCart = async (itemId: string) => {
    try {
      setError(null);
      
      const { error: removeError } = await db.removeFromCart(itemId);
      
      if (removeError) {
        throw removeError;
      }
      
      // Refresh cart
      await fetchCart();
      
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
      
      const { error: clearError } = await db.clearCart(user.id);
      
      if (clearError) {
        throw clearError;
      }
      
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