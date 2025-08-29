import { createClient } from '@supabase/supabase-js';
import type { Database } from '../types/database';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || process.env.SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || process.env.SUPABASE_ANON_KEY;

let supabase: any;

if (!supabaseUrl || !supabaseAnonKey) {
  console.error('Missing Supabase environment variables. Please connect to Supabase first.');
  // Create a mock client to prevent crashes
  const mockClient = {
    from: () => ({
      select: () => ({ data: [], error: { message: 'Supabase not connected' } }),
      insert: () => ({ data: null, error: { message: 'Supabase not connected' } }),
      update: () => ({ data: null, error: { message: 'Supabase not connected' } }),
      delete: () => ({ error: { message: 'Supabase not connected' } }),
      eq: function() { return this; },
      order: function() { return this; },
      limit: function() { return this; },
      single: function() { return this; }
    }),
    auth: {
      signUp: () => ({ data: null, error: { message: 'Supabase not connected' } }),
      signInWithPassword: () => ({ data: null, error: { message: 'Supabase not connected' } }),
      signOut: () => ({ error: { message: 'Supabase not connected' } }),
      getUser: () => ({ data: { user: null }, error: null }),
      onAuthStateChange: () => ({ data: { subscription: { unsubscribe: () => {} } } })
    }
  };
  
  supabase = mockClient as any;
} else {
  supabase = createClient<Database>(supabaseUrl, supabaseAnonKey, {
    db: {
      // Increase connection timeout
      connectTimeout: 10000, // 10 seconds
      // Adjust max connections
      maxConnections: 10
    },
    auth: {
      autoRefreshToken: true,
      persistSession: true,
      detectSessionInUrl: true
    }
  });
}

export { supabase };
export default supabase;

// Auth helpers
export const auth = {
  signUp: async (email: string, password: string, userData?: { full_name?: string; phone?: string }) => {
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: userData
      }
    });
    return { data, error };
  },

  signIn: async (email: string, password: string) => {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password
    });
    return { data, error };
  },

  signOut: async () => {
    const { error } = await supabase.auth.signOut();
    return { error };
  },

  getCurrentUser: () => {
    return supabase.auth.getUser();
  },

  onAuthStateChange: (callback: (event: string, session: any) => void) => {
    return supabase.auth.onAuthStateChange(callback);
  }
};

// Database helpers with error handling
export const db = {
  // Categories
  getCategories: async () => {
    try {
      // Check if Supabase is connected
      if (!supabaseUrl || !supabaseAnonKey) {
        console.info('Supabase not connected. Using mock data.');
        return { data: null, error: { message: 'Supabase not connected' } };
      }

      const { data, error } = await supabase
        .from('categories')
        .select('*')
        .eq('is_active', true)
        .order('sort_order');
      
      if (error) {
        if (error.code === 'PGRST205' || error.message?.includes('Could not find the table')) {
          console.warn('Database tables not found. Using mock data. To fix: Connect to Supabase and run migrations.');
          return { data: null, error: { message: 'Tables not found', code: 'PGRST205' } };
        }
        throw error;
      }
      return { data, error: null };
    } catch (error) {
      console.error('Error fetching categories:', error);
      return { data: null, error };
    }
  },

  // Products
  getProducts: async (filters?: {
    category?: string;
    featured?: boolean;
    limit?: number;
    offset?: number;
  }) => {
    try {
      // Check if Supabase is connected
      if (!supabaseUrl || !supabaseAnonKey) {
        console.info('Supabase not connected. Using mock data.');
        return { data: null, error: { message: 'Supabase not connected' } };
      }

      let query = supabase
        .from('products')
        .select(`
          *,
          categories!inner(name, slug),
          product_images(image_url, alt_text, is_primary, sort_order)
        `)
        .eq('is_active', true);

      if (filters?.category) {
        query = query.eq('categories.slug', filters.category);
      }

      if (filters?.featured) {
        query = query.eq('is_featured', true);
      }

      if (filters?.limit) {
        query = query.limit(filters.limit);
      }

      if (filters?.offset) {
        query = query.range(filters.offset, filters.offset + (filters.limit || 10) - 1);
      }

      query = query.order('created_at', { ascending: false });

      const { data, error } = await query;
      
      if (error) {
        // Handle specific table not found error - don't throw, return error object
        if (error.code === 'PGRST205' || error.message?.includes('Could not find the table')) {
          console.warn('Database tables not found. Using mock data. To fix: Connect to Supabase and run migrations.');
          return { data: null, error: { message: 'Tables not found', code: 'PGRST205' } };
        }
        // For other errors, return them instead of throwing
        console.error('Database error:', error);
        return { data: null, error };
      }
      return { data, error: null };
    } catch (error) {
      // Catch any network or other errors
      console.error('Network or other error fetching products:', error);
      return { data: null, error };
    }
  },

  getProduct: async (slug: string) => {
    try {
      // Check if Supabase is connected
      if (!supabaseUrl || !supabaseAnonKey) {
        return { data: null, error: { message: 'Supabase not connected' } };
      }

      const { data, error } = await supabase
        .from('products')
        .select(`
          *,
          categories(name, slug),
          product_images(image_url, alt_text, is_primary, sort_order),
          reviews!inner(rating, title, comment, created_at, user_profiles(full_name))
        `)
        .eq('slug', slug)
        .eq('is_active', true)
        .single();
      
      if (error) {
        if (error.code === 'PGRST205' || error.message?.includes('Could not find the table')) {
          return { data: null, error: { message: 'Tables not found', code: 'PGRST205' } };
        }
        if (error.code !== 'PGRST116') throw error; // PGRST116 = no rows returned
      }
      return { data, error: null };
    } catch (error) {
      console.error('Error fetching product:', error);
      return { data: null, error };
    }
  },

  // User Profile
  getUserProfile: async (userId: string) => {
    try {
      if (!supabaseUrl || !supabaseAnonKey) {
        return { data: null, error: { message: 'Supabase not connected' } };
      }

      const { data, error } = await supabase
        .from('user_profiles')
        .select('*')
        .eq('id', userId)
        .single();
      
      if (error) {
        if (error.code === 'PGRST205' || error.message?.includes('Could not find the table')) {
          return { data: null, error: { message: 'Tables not found', code: 'PGRST205' } };
        }
        if (error.code !== 'PGRST116') throw error; // PGRST116 = no rows returned
      }
      return { data, error: null };
    } catch (error) {
      console.error('Error fetching user profile:', error);
      return { data: null, error };
    }
  },

  createUserProfile: async (profile: Database['public']['Tables']['user_profiles']['Insert']) => {
    try {
      if (!supabaseUrl || !supabaseAnonKey) {
        return { data: null, error: { message: 'Supabase not connected' } };
      }

      const { data, error } = await supabase
        .from('user_profiles')
        .insert(profile)
        .select()
        .single();
      
      if (error) {
        if (error.code === 'PGRST205' || error.message?.includes('Could not find the table')) {
          return { data: null, error: { message: 'Tables not found', code: 'PGRST205' } };
        }
        throw error;
      }
      return { data, error: null };
    } catch (error) {
      console.error('Error creating user profile:', error);
      return { data: null, error };
    }
  },

  updateUserProfile: async (userId: string, updates: Database['public']['Tables']['user_profiles']['Update']) => {
    try {
      if (!supabaseUrl || !supabaseAnonKey) {
        return { data: null, error: { message: 'Supabase not connected' } };
      }

      const { data, error } = await supabase
        .from('user_profiles')
        .update(updates)
        .eq('id', userId)
        .select()
        .single();
      
      if (error) {
        if (error.code === 'PGRST205' || error.message?.includes('Could not find the table')) {
          return { data: null, error: { message: 'Tables not found', code: 'PGRST205' } };
        }
        throw error;
      }
      return { data, error: null };
    } catch (error) {
      console.error('Error updating user profile:', error);
      return { data: null, error };
    }
  },

  // Favorites
  getFavorites: async (userId: string) => {
    try {
      const { data, error } = await supabase
        .from('favorites')
        .select(`
          *,
          product:products(
            *,
            product_images(image_url, alt_text, is_primary)
          )
        `)
        .eq('user_id', userId)
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      return { data, error: null };
    } catch (error) {
      console.error('Error fetching favorites:', error);
      return { data: null, error };
    }
  },

  addToFavorites: async (userId: string, productId: string) => {
    try {
      const { data, error } = await supabase
        .from('favorites')
        .insert({ user_id: userId, product_id: productId })
        .select()
        .single();
      
      if (error) throw error;
      return { data, error: null };
    } catch (error) {
      console.error('Error adding to favorites:', error);
      return { data: null, error };
    }
  },

  removeFromFavorites: async (userId: string, productId: string) => {
    try {
      const { error } = await supabase
        .from('favorites')
        .delete()
        .eq('user_id', userId)
        .eq('product_id', productId);
      
      if (error) throw error;
      return { error: null };
    } catch (error) {
      console.error('Error removing from favorites:', error);
      return { error };
    }
  },

  // Cart
  getCart: async (userId: string) => {
    try {
      const { data, error } = await supabase
        .from('cart_items')
        .select(`
          *,
          product:products(
            *,
            product_images(image_url, alt_text, is_primary)
          )
        `)
        .eq('user_id', userId)
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      return { data, error: null };
    } catch (error) {
      console.error('Error fetching cart:', error);
      return { data: null, error };
    }
  },

  addToCart: async (cartItem: Database['public']['Tables']['cart_items']['Insert']) => {
    try {
      // Check if item already exists
      const { data: existing } = await supabase
        .from('cart_items')
        .select('*')
        .eq('user_id', cartItem.user_id)
        .eq('product_id', cartItem.product_id)
        .eq('size_info', JSON.stringify(cartItem.size_info))
        .single();

      if (existing) {
        // Update quantity
        const { data, error } = await supabase
          .from('cart_items')
          .update({ quantity: existing.quantity + (cartItem.quantity || 1) })
          .eq('id', existing.id)
          .select()
          .single();
        
        if (error) throw error;
        return { data, error: null };
      } else {
        // Insert new item
        const { data, error } = await supabase
          .from('cart_items')
          .insert(cartItem)
          .select()
          .single();
        
        if (error) throw error;
        return { data, error: null };
      }
    } catch (error) {
      console.error('Error adding to cart:', error);
      return { data: null, error };
    }
  },

  updateCartItem: async (itemId: string, updates: Database['public']['Tables']['cart_items']['Update']) => {
    try {
      const { data, error } = await supabase
        .from('cart_items')
        .update(updates)
        .eq('id', itemId)
        .select()
        .single();
      
      if (error) throw error;
      return { data, error: null };
    } catch (error) {
      console.error('Error updating cart item:', error);
      return { data: null, error };
    }
  },

  removeFromCart: async (itemId: string) => {
    try {
      const { error } = await supabase
        .from('cart_items')
        .delete()
        .eq('id', itemId);
      
      if (error) throw error;
      return { error: null };
    } catch (error) {
      console.error('Error removing from cart:', error);
      return { error };
    }
  },

  clearCart: async (userId: string) => {
    try {
      const { error } = await supabase
        .from('cart_items')
        .delete()
        .eq('user_id', userId);
      
      if (error) throw error;
      return { error: null };
    } catch (error) {
      console.error('Error clearing cart:', error);
      return { error };
    }
  },

  // Contact Messages
  createContactMessage: async (message: Database['public']['Tables']['contact_messages']['Insert']) => {
    try {
      if (!supabaseUrl || !supabaseAnonKey) {
        return { data: null, error: { message: 'Supabase not connected' } };
      }

      const { data, error } = await supabase
        .from('contact_messages')
        .insert(message)
        .select()
        .single();
      
      if (error) {
        if (error.code === 'PGRST205' || error.message?.includes('Could not find the table')) {
          return { data: null, error: { message: 'Tables not found', code: 'PGRST205' } };
        }
        throw error;
      }
      return { data, error: null };
    } catch (error) {
      console.error('Error creating contact message:', error);
      return { data: null, error };
    }
  },

  // Reviews
  getProductReviews: async (productId: string) => {
    try {
      const { data, error } = await supabase
        .from('reviews')
        .select(`
          *,
          user_profiles(full_name)
        `)
        .eq('product_id', productId)
        .eq('is_approved', true)
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      return { data, error: null };
    } catch (error) {
      console.error('Error fetching reviews:', error);
      return { data: null, error };
    }
  },

  createReview: async (review: Database['public']['Tables']['reviews']['Insert']) => {
    try {
      const { data, error } = await supabase
        .from('reviews')
        .insert(review)
        .select()
        .single();
      
      if (error) throw error;
      return { data, error: null };
    } catch (error) {
      console.error('Error creating review:', error);
      return { data: null, error };
    }
  },

  // Stores
  getStores: async () => {
    try {
      const { data, error } = await supabase
        .from('stores')
        .select('*')
        .eq('is_active', true)
        .order('name');
      
      if (error) throw error;
      return { data, error: null };
    } catch (error) {
      console.error('Error fetching stores:', error);
      return { data: null, error };
    }
  },

  // Orders
  createOrder: async (order: Database['public']['Tables']['orders']['Insert'], items: Database['public']['Tables']['order_items']['Insert'][]) => {
    try {
      // Start transaction
      const { data: orderData, error: orderError } = await supabase
        .from('orders')
        .insert(order)
        .select()
        .single();

      if (orderError) throw orderError;

      // Insert order items
      const orderItems = items.map(item => ({
        ...item,
        order_id: orderData.id
      }));

      const { data: itemsData, error: itemsError } = await supabase
        .from('order_items')
        .insert(orderItems)
        .select();

      if (itemsError) throw itemsError;

      return { data: { order: orderData, items: itemsData }, error: null };
    } catch (error) {
      console.error('Error creating order:', error);
      return { data: null, error };
    }
  },

  getUserOrders: async (userId: string) => {
    try {
      const { data, error } = await supabase
        .from('orders')
        .select(`
          *,
          order_items(
            *,
            product:products(name, slug)
          )
        `)
        .eq('user_id', userId)
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      return { data, error: null };
    } catch (error) {
      console.error('Error fetching user orders:', error);
      return { data: null, error };
    }
  }
};

// Real-time subscriptions
export const subscriptions = {
  subscribeToProducts: (callback: (payload: any) => void) => {
    return supabase
      .channel('products')
      .on('postgres_changes', 
        { event: '*', schema: 'public', table: 'products' }, 
        callback
      )
      .subscribe();
  },

  subscribeToCart: (userId: string, callback: (payload: any) => void) => {
    return supabase
      .channel(`cart_${userId}`)
      .on('postgres_changes', 
        { 
          event: '*', 
          schema: 'public', 
          table: 'cart_items',
          filter: `user_id=eq.${userId}`
        }, 
        callback
      )
      .subscribe();
  },

  subscribeToOrders: (userId: string, callback: (payload: any) => void) => {
    return supabase
      .channel(`orders_${userId}`)
      .on('postgres_changes', 
        { 
          event: '*', 
          schema: 'public', 
          table: 'orders',
          filter: `user_id=eq.${userId}`
        }, 
        callback
      )
      .subscribe();
  }
};
