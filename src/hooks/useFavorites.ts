import { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { db } from '../lib/supabase';
import type { Favorite } from '../types/database';

export function useFavorites() {
  const { user } = useAuth();
  const [favorites, setFavorites] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<any>(null);

  const fetchFavorites = async () => {
    if (!user) {
      setFavorites([]);
      return;
    }

    try {
      setLoading(true);
      setError(null);
      
      const { data, error: fetchError } = await db.getFavorites(user.id);
      
      if (fetchError) {
        throw fetchError;
      }
      
      setFavorites(data || []);
    } catch (err) {
      console.error('Error fetching favorites:', err);
      setError(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchFavorites();
  }, [user]);

  const addToFavorites = async (productId: string) => {
    if (!user) {
      throw new Error('Must be logged in to add to favorites');
    }

    try {
      setError(null);
      
      const { data, error: addError } = await db.addToFavorites(user.id, productId);
      
      if (addError) {
        throw addError;
      }
      
      // Refresh favorites
      await fetchFavorites();
      
      return { data, error: null };
    } catch (err) {
      console.error('Error adding to favorites:', err);
      setError(err);
      return { data: null, error: err };
    }
  };

  const removeFromFavorites = async (productId: string) => {
    if (!user) {
      throw new Error('Must be logged in to remove from favorites');
    }

    try {
      setError(null);
      
      const { error: removeError } = await db.removeFromFavorites(user.id, productId);
      
      if (removeError) {
        throw removeError;
      }
      
      // Refresh favorites
      await fetchFavorites();
      
      return { error: null };
    } catch (err) {
      console.error('Error removing from favorites:', err);
      setError(err);
      return { error: err };
    }
  };

  const isFavorite = (productId: string) => {
    return favorites.some(fav => fav.product_id === productId);
  };

  const toggleFavorite = async (productId: string) => {
    if (isFavorite(productId)) {
      return await removeFromFavorites(productId);
    } else {
      return await addToFavorites(productId);
    }
  };

  return {
    favorites,
    loading,
    error,
    addToFavorites,
    removeFromFavorites,
    isFavorite,
    toggleFavorite,
    refetch: fetchFavorites
  };
}