import React, { useState, useEffect } from 'react';
import { MapPin, Phone, Clock, Navigation, Star, Award, Users, Car } from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';

interface Store {
  id: number;
  name: string;
  address: string;
  phone: string;
  hours: {
    weekdays: string;
    saturday: string;
    sunday: string;
  };
  coordinates: {
    lat: number;
    lng: number;
  };
  services: string[];
  rating: number;
  reviews: number;
  image: string;
  specialties: string[];
  distance?: number;
}

export default function StoreLocator() {
  const { t } = useLanguage();
  const [userLocation, setUserLocation] = useState<{lat: number, lng: number} | null>(null);
  const [nearestStore, setNearestStore] = useState<Store | null>(null);
  const [locationError, setLocationError] = useState<string>('');
  const [isLoadingLocation, setIsLoadingLocation] = useState(false);

  const stores: Store[] = [
    {
      id: 1,
      name: "Abadan Haly ",
      address: "Abadan district, Ashgabat, Turkmenistan",
      phone: "+993 12 345-678",
      hours: {
        weekdays: "9:00 - 19:00",
        saturday: "9:00 - 18:00",
        sunday: "10:00 - 17:00"
      },
      coordinates: { lat: 37.9601, lng: 58.3261 },
      services: ["Expert Consultation", "AR Demonstrations", "Custom Orders", "Installation Service"],
      rating: 4.9,
      reviews: 247,
      image: "public/APC_0277.JPG?auto=compress&cs=tinysrgb&w=800&h=400&fit=crop",
      specialties: ["Premium Collection", "Traditional Designs", "Custom Sizing"]
    },
    {
      id: 2,
      name: "Gurtly",
      address: "Central district, Ashgabat, Turkmenistan",
      phone: "+993 12 345-679",
      hours: {
        weekdays: "9:00 - 18:00",
        saturday: "9:00 - 17:00",
        sunday: "10:00 - 16:00"
      },
      coordinates: { lat: 37.9755, lng: 58.3794 },
      services: ["Product Display", "Size Consultation", "Delivery Service", "Maintenance Support"],
      rating: 4.7,
      reviews: 189,
      image: "public/IMG_8794.JPG?auto=compress&cs=tinysrgb&w=800&h=400&fit=crop",
      specialties: ["Modern Collection", "Quick Service", "Urban Designs"]
    },
    {
      id: 3,
      name: "Ceper Haly",
      address: "Central district, Ashgabat, Turkmenistan",
      phone: "+993 12 345-679",
      hours: {
        weekdays: "9:00 - 18:00",
        saturday: "9:00 - 17:00",
        sunday: "10:00 - 16:00"
      },
      coordinates: { lat: 37.9755, lng: 58.3794 },
      services: ["Product Display", "Size Consultation", "Delivery Service", "Maintenance Support"],
      rating: 4.7,
      reviews: 189,
      image: "public/Screenshot 2025-08-28 at 12.07.03.png?auto=compress&cs=tinysrgb&w=800&h=400&fit=crop",
      specialties: ["Modern Collection", "Quick Service", "Urban Designs"]
    },
    {
      id: 4,
      name: "Abadan Haly Dukany",
      address: "Berkararlyk district, Ashgabat, Turkmenistan",
      phone: "+993 12 345-680",
      hours: {
        weekdays: "9:00 - 18:00",
        saturday: "9:00 - 17:00",
        sunday: "Closed"
      },
      coordinates: { lat: 37.9200, lng: 58.3500 },
      services: ["Local Collection", "Express Service", "Repair & Cleaning", "Home Consultation"],
      rating: 4.8,
      reviews: 156,
      image: "public/APC_0279.JPG?auto=compress&cs=tinysrgb&w=800&h=400&fit=crop",
      specialties: ["Classic Collection", "Family Service", "Local Expertise"]
    }
  ];

  // Calculate distance between two coordinates using Haversine formula
  const calculateDistance = (lat1: number, lng1: number, lat2: number, lng2: number): number => {
    const R = 6371; // Earth's radius in kilometers
    const dLat = (lat2 - lat1) * Math.PI / 180;
    const dLng = (lng2 - lng1) * Math.PI / 180;
    const a = 
      Math.sin(dLat/2) * Math.sin(dLat/2) +
      Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) * 
      Math.sin(dLng/2) * Math.sin(dLng/2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
    return R * c;
  };

  // Get user's location
  const getUserLocation = () => {
    setIsLoadingLocation(true);
    setLocationError('');

    if (!navigator.geolocation) {
      setLocationError('Geolocation is not supported by this browser.');
      setIsLoadingLocation(false);
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude } = position.coords;
        setUserLocation({ lat: latitude, lng: longitude });
        
        // Calculate distances and find nearest store
        const storesWithDistance = stores.map(store => ({
          ...store,
          distance: calculateDistance(latitude, longitude, store.coordinates.lat, store.coordinates.lng)
        }));
        
        const nearest = storesWithDistance.reduce((prev, current) => 
          (prev.distance! < current.distance!) ? prev : current
        );
        
        setNearestStore(nearest);
        setIsLoadingLocation(false);
      },
      (error) => {
        let errorMessage = 'Unable to retrieve your location.';
        switch(error.code) {
          case error.PERMISSION_DENIED:
            errorMessage = 'Location access denied. Please enable location services.';
            break;
          case error.POSITION_UNAVAILABLE:
            errorMessage = 'Location information is unavailable.';
            break;
          case error.TIMEOUT:
            errorMessage = 'Location request timed out.';
            break;
        }
        setLocationError(errorMessage);
        setIsLoadingLocation(false);
      },
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 300000 // 5 minutes
      }
    );
  };

  useEffect(() => {
    // Automatically try to get location on component mount
    getUserLocation();
  }, []);

  const handleGetDirections = (store: Store) => {
    const url = `https://www.google.com/maps/dir/?api=1&destination=${store.coordinates.lat},${store.coordinates.lng}`;
    window.open(url, '_blank');
  };

  const handleCallStore = (phone: string) => {
    window.location.href = `tel:${phone}`;
  };

  return (
    <section className="py-20 bg-gradient-to-br from-emerald-50 via-white to-blue-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center bg-emerald-100 text-emerald-800 px-4 py-2 rounded-full text-sm font-medium mb-6">
            <MapPin className="w-4 h-4 mr-2" />
            {t('stores.nearest')}
          </div>
          
          <h2 className="text-4xl lg:text-5xl font-bold text-gray-900 mb-6">
            {t('stores.title')}
          </h2>
          <p className="text-lg text-gray-600 max-w-3xl mx-auto">
            {t('stores.subtitle')}
          </p>
        </div>

        {/* Nearest Store Highlight */}
        {nearestStore && (
          <div className="mb-16">
            <div className="bg-white rounded-3xl shadow-xl overflow-hidden border border-emerald-100">
              <div className="bg-gradient-to-r from-emerald-800 to-emerald-700 text-white p-6">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center">
                      <Navigation className="w-6 h-6" />
                    </div>
                    <div>
                      <h3 className="text-2xl font-bold">Nearest Store to You</h3>
                      <p className="opacity-90">
                        {nearestStore.distance ? `${nearestStore.distance.toFixed(1)} km` : t('stores.nearest')}
                      </p>
                    </div>
                  </div>
                  
                  <div className="text-right">
                    <div className="text-sm opacity-75">Premium Location</div>
                  </div>
                </div>
              </div>
              
              <div className="grid lg:grid-cols-2 gap-0">
                <div className="relative h-64 lg:h-auto">
                  <img
                    src={nearestStore.image}
                    alt={nearestStore.name}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent"></div>
                </div>
                
                <div className="p-8">
                  <h4 className="text-2xl font-bold text-gray-900 mb-4">
                    {nearestStore.name}
                  </h4>
                  
                  <div className="space-y-4 mb-6">
                    <div className="flex items-start gap-3">
                      <MapPin className="w-5 h-5 text-emerald-600 flex-shrink-0 mt-0.5" />
                      <span className="text-gray-700">{nearestStore.address}</span>
                    </div>
                    
                    <div className="flex items-center gap-3">
                      <Phone className="w-5 h-5 text-emerald-600 flex-shrink-0" />
                      <span className="text-gray-700">{nearestStore.phone}</span>
                    </div>
                    
                    <div className="flex items-start gap-3">
                      <Clock className="w-5 h-5 text-emerald-600 flex-shrink-0 mt-0.5" />
                      <div className="text-gray-700">
                        <div>Mon-Fri: {nearestStore.hours.weekdays}</div>
                        <div>Sat: {nearestStore.hours.saturday}</div>
                        <div>Sun: {nearestStore.hours.sunday}</div>
                      </div>
                    </div>
                  </div>
                  
                  <div className="mb-6">
                    <h5 className="font-semibold text-gray-900 mb-3">Specialties</h5>
                    <div className="flex flex-wrap gap-2">
                      {nearestStore.specialties.map((specialty, index) => (
                        <span 
                          key={index}
                          className="bg-emerald-50 text-emerald-800 px-3 py-1 rounded-full text-sm font-medium"
                        >
                          {specialty}
                        </span>
                      ))}
                    </div>
                  </div>
                  
                  <div className="flex gap-3">
                    <button
                      onClick={() => handleGetDirections(nearestStore)}
                      className="flex-1 bg-emerald-800 hover:bg-emerald-700 text-white py-3 px-4 rounded-xl font-semibold transition-colors flex items-center justify-center gap-2"
                    >
                      <Car className="w-4 h-4" />
                      {t('stores.directions')}
                    </button>
                    <button
                      onClick={() => handleCallStore(nearestStore.phone)}
                      className="flex-1 bg-gray-100 hover:bg-gray-200 text-gray-800 py-3 px-4 rounded-xl font-semibold transition-colors flex items-center justify-center gap-2"
                    >
                      <Phone className="w-4 h-4" />
                      {t('stores.call')}
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Location Services */}
        {!userLocation && (
          <div className="mb-12 text-center">
            <div className="bg-white rounded-2xl p-8 shadow-lg border border-gray-100 max-w-md mx-auto">
              <MapPin className="w-12 h-12 text-emerald-600 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-gray-900 mb-3">
                Find Your Nearest Store
              </h3>
              <p className="text-gray-600 mb-6">
                Allow location access to find the closest showroom to you with personalized directions and store information.
              </p>
              
              {locationError && (
                <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-4 text-sm">
                  {locationError}
                </div>
              )}
              
              <button
                onClick={getUserLocation}
                disabled={isLoadingLocation}
                className="bg-emerald-800 hover:bg-emerald-700 disabled:bg-emerald-400 text-white py-3 px-6 rounded-xl font-semibold transition-colors flex items-center justify-center gap-2 mx-auto"
              >
                {isLoadingLocation ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    Finding Location...
                  </>
                ) : (
                  <>
                    <Navigation className="w-4 h-4" />
                    Enable Location
                  </>
                )}
              </button>
            </div>
          </div>
        )}

        {/* All Stores Grid */}
        <div>
          <h3 className="text-2xl font-bold text-gray-900 mb-8 text-center">
            {t('stores.all')}
          </h3>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {stores.map((store) => (
              <div
                key={store.id}
                className={`bg-white rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden border-2 ${
                  nearestStore?.id === store.id ? 'border-emerald-200 ring-2 ring-emerald-100' : 'border-gray-100'
                }`}
              >
                <div className="relative h-48">
                  <img
                    src={store.image}
                    alt={store.name}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent"></div>
                  
                  {nearestStore?.id === store.id && (
                    <div className="absolute top-4 right-4 bg-emerald-800 text-white px-3 py-1 rounded-full text-sm font-medium">
                      Nearest
                    </div>
                  )}
                </div>
                
                <div className="p-6">
                  <h4 className="text-lg font-bold text-gray-900 mb-3">
                    {store.name}
                  </h4>
                  
                  <div className="space-y-3 mb-4">
                    <div className="flex items-start gap-2">
                      <MapPin className="w-4 h-4 text-emerald-600 flex-shrink-0 mt-0.5" />
                      <span className="text-sm text-gray-600">{store.address}</span>
                    </div>
                    
                    <div className="flex items-center gap-2">
                      <Phone className="w-4 h-4 text-emerald-600 flex-shrink-0" />
                      <span className="text-sm text-gray-600">{store.phone}</span>
                    </div>
                    
                    <div className="flex items-center gap-2">
                      <Clock className="w-4 h-4 text-emerald-600 flex-shrink-0" />
                      <span className="text-sm text-gray-600">
                        Mon-Fri: {store.hours.weekdays}
                      </span>
                    </div>
                    
                    {store.distance && (
                      <div className="flex items-center gap-2">
                        <Navigation className="w-4 h-4 text-emerald-600 flex-shrink-0" />
                        <span className="text-sm text-gray-600">
                          {store.distance.toFixed(1)} km away
                        </span>
                      </div>
                    )}
                  </div>
                  
                  <div className="mb-4">
                    <div className="flex flex-wrap gap-1">
                      {store.services.slice(0, 2).map((service, index) => (
                        <span 
                          key={index}
                          className="bg-gray-50 text-gray-700 px-2 py-1 rounded-lg text-xs"
                        >
                          {service}
                        </span>
                      ))}
                      {store.services.length > 2 && (
                        <span className="bg-gray-50 text-gray-700 px-2 py-1 rounded-lg text-xs">
                          +{store.services.length - 2} more
                        </span>
                      )}
                    </div>
                  </div>
                  
                  <div className="flex gap-2">
                    <button
                      onClick={() => handleGetDirections(store)}
                      className="flex-1 bg-emerald-800 hover:bg-emerald-700 text-white py-2 px-3 rounded-lg font-medium text-sm transition-colors"
                    >
                      {t('stores.directions')}
                    </button>
                    <button
                      onClick={() => handleCallStore(store.phone)}
                      className="flex-1 bg-gray-100 hover:bg-gray-200 text-gray-800 py-2 px-3 rounded-lg font-medium text-sm transition-colors"
                    >
                      {t('stores.call')}
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Additional Services */}
        <div className="mt-16 bg-white rounded-3xl p-12 shadow-lg">
          <div className="text-center mb-12">
            <h3 className="text-3xl font-bold text-gray-900 mb-4">
              {t('stores.services')}
            </h3>
            <p className="text-lg text-gray-600 max-w-3xl mx-auto">
              {t('stores.subtitle')}
            </p>
          </div>
          
          <div className="grid md:grid-cols-4 gap-8">
            {[
              {
                icon: <Award className="w-8 h-8" />,
                title: t('stores.expert'),
                description: t('stores.expert.desc')
              },
              {
                icon: <Users className="w-8 h-8" />,
                title: t('stores.ar.demo'),
                description: t('stores.ar.demo.desc')
              },
              {
                icon: <Car className="w-8 h-8" />,
                title: t('stores.delivery'),
                description: t('stores.delivery.desc')
              },
              {
                icon: <Phone className="w-8 h-8" />,
                title: t('stores.support'),
                description: t('stores.support.desc')
              }
            ].map((service, index) => (
              <div key={index} className="text-center">
                <div className="w-16 h-16 bg-emerald-100 text-emerald-800 rounded-2xl flex items-center justify-center mx-auto mb-4">
                  {service.icon}
                </div>
                <h4 className="text-lg font-semibold text-gray-900 mb-2">
                  {service.title}
                </h4>
                <p className="text-gray-600 text-sm">
                  {service.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}