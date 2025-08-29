import React from 'react';
import { ArrowRight } from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';

export default function Collections() {
  const { t } = useLanguage();

  const collections = [
    {
      name: 'Nusaý',
      image: 'src/assets/carpet 4.PNG',
    },
    {
      name: 'Kerwenli',
      image: 'src/assets/carpet 4.PNG',
    },
    {
      name: 'Güneş',
      image: 'src/assets/carpet 4.PNG',
  }
  ];

  const scrollToProducts = () => {
    const element = document.getElementById('products');
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <section className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-4xl lg:text-5xl font-bold text-gray-900 mb-6">
            {t('collections.title')}
          </h2>
          <div className="w-24 h-1 bg-green-800 mx-auto"></div>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {collections.map((collection, index) => (
            <div
              key={collection.name}
              className="group cursor-pointer transform hover:scale-105 transition-all duration-300"
              onClick={scrollToProducts}
            >
              <div className="relative overflow-hidden rounded-2xl shadow-lg hover:shadow-2xl transition-shadow duration-300">
                <img
                  src={collection.image}
                  alt={collection.name}
                  className="w-full h-80 object-cover group-hover:scale-110 transition-transform duration-700"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent"></div>
                <div className="absolute bottom-0 left-0 right-0 p-6 text-white">
                  <h3 className="text-2xl font-bold mb-2">{collection.name}</h3>
                  <p className="text-gray-200 mb-4">{collection.description}</p>
                  <div className="flex items-center text-green-300 font-medium group-hover:text-green-200 transition-colors">
                    <span className="mr-2">{t('collections.view')}</span>
                    <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}