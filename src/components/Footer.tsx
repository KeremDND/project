import React from 'react';
import { MapPin, Phone, Mail, Instagram, ArrowRight } from 'lucide-react';

interface FooterProps {
  onNavigate: (page: 'home' | 'shop' | 'product' | 'gallery' | 'certificates' | 'about') => void;
}

export default function Footer({ onNavigate }: FooterProps) {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-gray-100 text-gray-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Main Footer Content */}
        <div className="py-16 grid md:grid-cols-2 lg:grid-cols-4 gap-8">
          
          {/* Company Info */}
          <div className="lg:col-span-2">
            <div className="flex items-center space-x-3 mb-6">
              <img 
                src="/Images/logo.png"
                alt="Abadan Haly Logo" 
                className="h-10 w-auto"
              />
            </div>
            
            <p className="text-gray-600 mb-6 leading-relaxed max-w-md">
              Abadan Haly is a modern carpet manufacturer based in Turkmenistan. Established on 15 February 2016, we operate around the clock with a team of 600+ specialists. Our facility runs Belgian Vandewiele looms and spins its own polypropylene yarn on German industrial lines, reliable quality at scale. 
            </p>
            
            <div className="space-y-3">
              <div className="flex items-center space-x-3">
                <MapPin className="w-5 h-5 text-emerald-400 flex-shrink-0" />
                <span className="text-gray-600">Türkmenistan, Aşgabat ş, Abadan etr., Altyn Asyr köç. jay.27</span>
              </div>
              <div className="flex items-center space-x-3">
                <Phone className="w-5 h-5 text-emerald-400 flex-shrink-0" />
                <span className="text-gray-600">+993 12 357905</span>
              </div>
              <div className="flex items-center space-x-3">
                <Mail className="w-5 h-5 text-emerald-400 flex-shrink-0" />
                <span className="text-gray-600">info@abadanhaly.com.tm</span>
              </div>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-lg font-semibold mb-6 text-gray-900">Quick Links</h4>
            <ul className="space-y-3">
              {[
                { label: 'Home', page: 'home' as const },
                { label: 'Shop', page: 'shop' as const },
                { label: 'Gallery', page: 'gallery' as const },
                
                { label: 'About', page: 'about' as const }
              ].map((link) => (
                <li key={link.page}>
                  <button
                    onClick={() => onNavigate(link.page)}
                    className="text-gray-600 hover:text-emerald-600 transition-colors flex items-center group"
                  >
                    <span>{link.label}</span>
                    <ArrowRight className="w-4 h-4 ml-1 opacity-0 group-hover:opacity-100 group-hover:translate-x-1 transition-all duration-200 text-emerald-600" />
                  </button>
                </li>
              ))}
            </ul>
          </div>

          {/* Services */}
          <div>
            <h4 className="text-lg font-semibold mb-6 text-gray-900">Services</h4>
            <ul className="space-y-3 text-gray-600">
              <li className="flex items-center">
                <span className="w-1.5 h-1.5 bg-emerald-400 rounded-full mr-3"></span>
                Free In-Home Measuring
              </li>
              <li className="flex items-center">
                <span className="w-1.5 h-1.5 bg-emerald-400 rounded-full mr-3"></span>
                Custom Carpet Design
              </li>
              <li className="flex items-center">
                <span className="w-1.5 h-1.5 bg-emerald-400 rounded-full mr-3"></span>
                Free Delivery & Installation
              </li>
              <li className="flex items-center">
                <span className="w-1.5 h-1.5 bg-emerald-400 rounded-full mr-3"></span>
                Custom Sizes & Designs
              </li>
              <li className="flex items-center">
                <span className="w-1.5 h-1.5 bg-emerald-400 rounded-full mr-3"></span>
                Care & Support
              </li>
              <li className="flex items-center">
                <span className="w-1.5 h-1.5 bg-emerald-400 rounded-full mr-3"></span>
                3D/AR Visualization
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="py-6 border-t border-gray-300">
          <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
            <div className="text-sm text-gray-600">
              © {currentYear} Abadan Haly. All rights reserved.
            </div>
            
            <div className="flex items-center space-x-6">
              <button className="text-sm text-gray-600 hover:text-gray-900 transition-colors">
                Privacy Policy
              </button>
              <button className="text-sm text-gray-600 hover:text-gray-900 transition-colors">
                Terms of Service
              </button>
              <button className="text-sm text-gray-600 hover:text-gray-900 transition-colors">
                Shipping Policy
              </button>
            </div>
            
          </div>
        </div>
      </div>
    </footer>
  );
}