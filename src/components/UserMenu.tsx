import React, { useState, useRef, useEffect } from 'react';
import { User, LogOut, Heart, ShoppingBag, Settings, Package } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { useCart } from '../hooks/useCart';

export default function UserMenu() {
  const [isOpen, setIsOpen] = useState(false);
  const { user, profile, signOut } = useAuth();
  const { cartCount } = useCart();
  const menuRef = useRef<HTMLDivElement>(null);

  // Close menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSignOut = async () => {
    await signOut();
    setIsOpen(false);
  };

  if (!user) return null;

  return (
    <div className="relative" ref={menuRef}>
      {/* User Avatar Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 p-2 rounded-lg hover:bg-white/20 transition-colors focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:ring-offset-2"
        aria-expanded={isOpen}
        aria-haspopup="true"
      >
        <div className="w-8 h-8 bg-emerald-800 text-white rounded-full flex items-center justify-center text-sm font-semibold">
          {profile?.full_name ? profile.full_name.charAt(0).toUpperCase() : user.email?.charAt(0).toUpperCase()}
        </div>
        
        {/* Cart Badge */}
        {cartCount > 0 && (
          <div className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 text-white text-xs rounded-full flex items-center justify-center font-bold">
            {cartCount > 9 ? '9+' : cartCount}
          </div>
        )}
      </button>

      {/* Dropdown Menu */}
      {isOpen && (
        <div className="absolute right-0 mt-2 w-64 glassmorphism-dropdown rounded-xl shadow-lg py-2 z-20">
          
          {/* User Info */}
          <div className="px-4 py-3 border-b border-white/20">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-emerald-800 text-white rounded-full flex items-center justify-center font-semibold">
                {profile?.full_name ? profile.full_name.charAt(0).toUpperCase() : user.email?.charAt(0).toUpperCase()}
              </div>
              <div>
                <div className="font-semibold text-gray-900">
                  {profile?.full_name || 'User'}
                </div>
                <div className="text-sm text-gray-600">
                  {user.email}
                </div>
              </div>
            </div>
          </div>

          {/* Menu Items */}
          <div className="py-2">
            <button
              onClick={() => {
                setIsOpen(false);
                // Navigate to profile page (implement later)
              }}
              className="w-full flex items-center gap-3 px-4 py-2 text-gray-700 hover:bg-white/20 transition-colors"
            >
              <User className="w-4 h-4" />
              <span>Profile Settings</span>
            </button>

            <button
              onClick={() => {
                setIsOpen(false);
                // Navigate to orders page (implement later)
              }}
              className="w-full flex items-center gap-3 px-4 py-2 text-gray-700 hover:bg-white/20 transition-colors"
            >
              <Package className="w-4 h-4" />
              <span>My Orders</span>
            </button>

            <button
              onClick={() => {
                setIsOpen(false);
                // Navigate to favorites page (implement later)
              }}
              className="w-full flex items-center gap-3 px-4 py-2 text-gray-700 hover:bg-white/20 transition-colors"
            >
              <Heart className="w-4 h-4" />
              <span>Favorites</span>
            </button>

            <button
              onClick={() => {
                setIsOpen(false);
                // Navigate to cart page (implement later)
              }}
              className="w-full flex items-center gap-3 px-4 py-2 text-gray-700 hover:bg-white/20 transition-colors"
            >
              <ShoppingBag className="w-4 h-4" />
              <span>Shopping Cart</span>
              {cartCount > 0 && (
                <span className="ml-auto bg-emerald-800 text-white text-xs px-2 py-1 rounded-full">
                  {cartCount}
                </span>
              )}
            </button>
          </div>

          {/* Sign Out */}
          <div className="border-t border-white/20 pt-2">
            <button
              onClick={handleSignOut}
              className="w-full flex items-center gap-3 px-4 py-2 text-red-600 hover:bg-red-50 transition-colors"
            >
              <LogOut className="w-4 h-4" />
              <span>Sign Out</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
}