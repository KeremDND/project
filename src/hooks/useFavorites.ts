import { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';

interface Favorite {
  id: string;
  user_id: string;
  product_id: string;
  created_at: string;
}

export function useFavorites() {
  const { user } = useAuth();
  const [favorites, setFavorites] = useState<Favorite[]>([]);
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
      
      // Mock favorites data - in a real app, this would come from a database
      const mockFavorites: Favorite[] = [];
      setFavorites(mockFavorites);
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
      
      const newFavorite: Favorite = {
        id: `fav_${Date.now()}`,
        user_id: user.id,
        product_id: productId,
        created_at: new Date().toISOString()
      };

      setFavorites(prev => [...prev, newFavorite]);
      
      return { data: newFavorite, error: null };
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
      
      setFavorites(prev => prev.filter(fav => fav.product_id !== productId));
      
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