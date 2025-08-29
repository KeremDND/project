import React, { useState, useEffect, useRef } from 'react';
import { 
  Award, 
  Users, 
  Factory, 
  Globe, 
  Target, 
  Heart, 
  ArrowRight,
  CheckCircle,
  Star,
  Building,
  Phone,
  Mail,
  MapPin,
  Eye,
  Download,
  X,
  Zap,
  Shield,
  Leaf
} from 'lucide-react';

interface AboutProps {
  onNavigate: (page: 'home' | 'gallery' | 'certificates' | 'about' | 'support') => void;
}

export default function About({ onNavigate }: AboutProps) {
  const [visibleSections, setVisibleSections] = useState<Set<string>>(new Set());
  const [selectedCertificate, setSelectedCertificate] = useState<number | null>(null);
  const [counters, setCounters] = useState({
    employees: 0,
    looms: 0,
    production: 0,
    years: 0
  });

  const sectionRefs = useRef<{ [key: string]: HTMLElement | null }>({});

  // Intersection Observer for animations
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setVisibleSections(prev => new Set([...prev, entry.target.id]));
          }
        });
      },
      { threshold: 0.1 }
    );

    Object.values(sectionRefs.current).forEach(ref => {
      if (ref) observer.observe(ref);
    });

    return () => observer.disconnect();
  }, []);

  // Counter animation
  useEffect(() => {
    if (visibleSections.has('stats')) {
      const targets = { employees: 600, looms: 8, production: 3, years: 9 };
      const duration = 1500;
      const steps = 60;
      const stepTime = duration / steps;

      let step = 0;
      const timer = setInterval(() => {
        step++;
        const progress = step / steps;
        const easeOut = 1 - Math.pow(1 - progress, 2);

        setCounters({
          employees: Math.floor(targets.employees * easeOut),
          looms: Math.floor(targets.looms * easeOut),
          production: Math.floor(targets.production * easeOut),
          years: Math.floor(targets.years * easeOut)
        });

        if (step >= steps) clearInterval(timer);
      }, stepTime);

      return () => clearInterval(timer);
    }
  }, [visibleSections]);

  const milestones = [
    {
      year: '2016',
      title: 'Founded',
      description: '3 Vandewiele machines and a clear mission: quality and scale.',
      icon: <Factory className="w-5 h-5" />
    },
    {
      year: '2017',
      title: 'First exports',
      description: 'International shipments begin.',
      icon: <Globe className="w-5 h-5" />
    },
    {
      year: '2020',
      title: 'National record',
      description: '3,000,000 m² of carpets and carpet items produced.',
      icon: <Award className="w-5 h-5" />
    },
    {
      year: '2024+',
      title: 'Innovation',
      description: 'AI-assisted design workflows; expanded product ranges.',
      icon: <Zap className="w-5 h-5" />
    },
    {
      year: '2025',
      title: 'Today',
      description: '8 Vandewiele looms, 600+ employees, 24/7 operations.',
      icon: <Users className="w-5 h-5" />
    }
  ];

  const certifications = [
    {
      name: 'ISO 9001',
      title: 'Quality Management',
      description: 'Ensures consistent quality in our manufacturing processes and customer satisfaction.',
      icon: <Star className="w-6 h-6" />,
      color: 'text-blue-600',
      bgColor: 'bg-blue-50'
    },
    {
      name: 'ISO 14001',
      title: 'Environmental Management',
      description: 'Demonstrates our commitment to environmental responsibility and sustainable practices.',
      icon: <Leaf className="w-6 h-6" />,
      color: 'text-green-600',
      bgColor: 'bg-green-50'
    },
    {
      name: 'ISO 45001',
      title: 'Occupational Health & Safety',
      description: 'Guarantees the highest standards of workplace safety and employee well-being.',
      icon: <Shield className="w-6 h-6" />,
      color: 'text-red-600',
      bgColor: 'bg-red-50'
    }
  ];

  const missions = [
    'Improve quality continuously.',
    'Catch and keep world standards.',
    'Happy, responsive customer care.',
    'Extend to foreign countries.',
    'Modern & beautiful design for daily life.',
    'IT/AI-assisted design for reliable prices & fast production.'
  ];

  const markets = {
    exports: ['Kazakhstan', 'Afghanistan', 'Turkey'],
    domestic: 'Turkmenistan',
    stores: 3
  };

  return (
    <section className="min-h-screen bg-white py-8 pt-32">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Hero Intro */}
        <div 
          ref={el => sectionRefs.current['hero'] = el}
          id="hero"
          className={`grid lg:grid-cols-2 gap-16 items-center mb-32 transition-all duration-300 ${
            visibleSections.has('hero') ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
          }`}
        >
          {/* Left - Text */}
          <div className="space-y-8">
            <div className="font-hand text-2xl text-[#0F3B2F]">
              Abadan Haly, Owadan Haly
            </div>
            
            <h1 className="text-5xl lg:text-6xl font-bold text-[#1A1A1A] leading-tight">
              Crafted at scale.<br />
              Built for real homes.
            </h1>
            
            <p className="text-lg text-gray-600 leading-relaxed max-w-lg">
              Founded on 15 February 2016, Abadan Haly runs 24/7 production with 600+ specialists. 
              We operate Belgian Vandewiele looms and spin our own Neumag polypropylene yarn to deliver 
              modern, color-fast carpets—reliable at scale.
            </p>
            
            <div className="flex gap-4">
              <button
                onClick={() => onNavigate('gallery')}
                className="bg-[#0F3B2F] text-white px-8 py-3 rounded-xl font-medium hover:bg-[#0F3B2F]/90 transition-all duration-180 hover:scale-105"
              >
                Explore Carpets
              </button>
              <button
                onClick={() => document.getElementById('cta')?.scrollIntoView({ behavior: 'smooth' })}
                className="border border-gray-200 text-[#1A1A1A] px-8 py-3 rounded-xl font-medium hover:bg-gray-50 transition-all duration-180"
              >
                Contact Us
              </button>
            </div>
          </div>

          {/* Right - Media */}
          <div className="relative">
            <div className="rounded-2xl overflow-hidden shadow-sm">
              <img
                src="https://abadanhaly.com.tm/storage/image_index/0y7i7lR6bP.jpg"
                alt="Vandewiele loom line, Turkmenistan"
                className="w-full h-96 object-cover"
              />
            </div>
          </div>
        </div>

        {/* Our Story Timeline */}
        <div 
          ref={el => sectionRefs.current['timeline'] = el}
          id="timeline"
          className={`mb-32 transition-all duration-300 delay-100 ${
            visibleSections.has('timeline') ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
          }`}
        >
          <h2 className="text-3xl font-bold text-[#1A1A1A] mb-16 text-center">Our Story</h2>
          
          <div className="space-y-8">
            {milestones.map((milestone, index) => (
              <div key={index} className="flex gap-6 items-start">
                <div className="flex-shrink-0 w-12 h-12 bg-[#F7F7F8] rounded-xl flex items-center justify-center text-[#0F3B2F]">
                  {milestone.icon}
                </div>
                <div className="flex-1 pb-8 border-b border-gray-100 last:border-b-0">
                  <div className="flex items-center gap-4 mb-2">
                    <span className="text-2xl font-bold text-[#0F3B2F]">{milestone.year}</span>
                    <span className="text-lg font-semibold text-[#1A1A1A]">{milestone.title}</span>
                  </div>
                  <p className="text-gray-600">{milestone.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Scale & Technology */}
        <div 
          ref={el => sectionRefs.current['stats'] = el}
          id="stats"
          className={`mb-32 transition-all duration-300 delay-200 ${
            visibleSections.has('stats') ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
          }`}
        >
          {/* Stats Row */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-8 mb-16">
            {[
              { number: `${counters.employees}+`, label: 'employees' },
              { number: '24/7', label: 'production' },
              { number: `${counters.looms}`, label: 'Vandewiele looms' },
              { number: `${counters.production}M m²`, label: '(2020)' }
            ].map((stat, index) => (
              <div key={index} className="text-center">
                <div className="bg-[#F7F7F8] rounded-xl px-4 py-3 mb-2">
                  <div className="text-2xl font-bold text-[#0F3B2F]">{stat.number}</div>
                </div>
                <div className="text-sm text-gray-600">{stat.label}</div>
              </div>
            ))}
          </div>

          {/* Two Column Features */}
          <div className="grid lg:grid-cols-2 gap-12">
            <div className="flex gap-4">
              <div className="w-12 h-12 bg-[#F7F7F8] rounded-xl flex items-center justify-center text-[#0F3B2F] flex-shrink-0">
                <Target className="w-6 h-6" />
              </div>
              <div>
                <h3 className="text-xl font-semibold text-[#1A1A1A] mb-3">Own Yarn, Reliable Quality</h3>
                <p className="text-gray-600 leading-relaxed">
                  We spin polypropylene yarn in-house on German Neumag lines to ensure color-fastness and consistency.
                </p>
              </div>
            </div>

            <div className="flex gap-4">
              <div className="w-12 h-12 bg-[#F7F7F8] rounded-xl flex items-center justify-center text-[#0F3B2F] flex-shrink-0">
                <Factory className="w-6 h-6" />
              </div>
              <div>
                <h3 className="text-xl font-semibold text-[#1A1A1A] mb-3">Precision Machinery</h3>
                <p className="text-gray-600 leading-relaxed">
                  Belgian Vandewiele looms deliver detail, density, and repeatable quality at production speeds.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Heritage × Modern Design */}
        <div 
          ref={el => sectionRefs.current['heritage'] = el}
          id="heritage"
          className={`mb-32 transition-all duration-300 delay-300 ${
            visibleSections.has('heritage') ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
          }`}
        >
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <div>
              <h2 className="text-3xl font-bold text-[#1A1A1A] mb-6">
                Where Turkman heritage meets modern culture
              </h2>
              <p className="text-lg text-gray-600 leading-relaxed">
                We honor historical Turkman motifs while designing for today's interiors. Our studio blends 
                tradition with innovation—using information technology and AI-driven iterations to meet customer 
                expectations at reliable prices and fast lead times.
              </p>
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div className="rounded-xl overflow-hidden border border-gray-100">
                <img
                  src="https://images.pexels.com/photos/6782567/pexels-photo-6782567.jpeg?auto=compress&cs=tinysrgb&w=400&h=300&fit=crop"
                  alt="Traditional Turkman carpet pattern detail"
                  className="w-full h-32 object-cover"
                />
              </div>
              <div className="rounded-xl overflow-hidden border border-gray-100">
                <img
                  src="https://images.pexels.com/photos/6969831/pexels-photo-6969831.jpeg?auto=compress&cs=tinysrgb&w=400&h=300&fit=crop"
                  alt="Modern carpet texture detail"
                  className="w-full h-32 object-cover"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Quality, Safety & Environment */}
        <div 
          ref={el => sectionRefs.current['certifications'] = el}
          id="certifications"
          className={`mb-32 transition-all duration-300 delay-400 ${
            visibleSections.has('certifications') ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
          }`}
        >
          <h2 className="text-3xl font-bold text-[#1A1A1A] mb-16 text-center">
            Quality, Safety & Environment
          </h2>
          
          <div className="grid md:grid-cols-3 gap-8 mb-8">
            {certifications.map((cert, index) => (
              <button
                key={index}
                onClick={() => setSelectedCertificate(index)}
                className="bg-white border border-gray-100 rounded-2xl p-8 hover:shadow-sm transition-all duration-180 text-left group"
              >
                <div className={`w-12 h-12 ${cert.bgColor} rounded-xl flex items-center justify-center ${cert.color} mb-4 group-hover:scale-110 transition-transform duration-180`}>
                  {cert.icon}
                </div>
                <h3 className="text-lg font-semibold text-[#1A1A1A] mb-2">{cert.name}</h3>
                <h4 className="text-sm font-medium text-[#0F3B2F] mb-3">{cert.title}</h4>
                <p className="text-sm text-gray-600 leading-relaxed">{cert.description}</p>
              </button>
            ))}
          </div>

          {/* Award */}
          <div className="text-center">
            <div className="inline-flex items-center bg-gradient-to-r from-[#C6A866] to-[#D4B876] text-white px-6 py-3 rounded-xl font-medium shadow-sm">
              <Award className="w-5 h-5 mr-2" />
              Year of Most Exported Products — Turkmenistan
            </div>
          </div>
        </div>

        {/* Markets & Stores */}
        <div 
          ref={el => sectionRefs.current['markets'] = el}
          id="markets"
          className={`mb-32 transition-all duration-300 delay-500 ${
            visibleSections.has('markets') ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
          }`}
        >
          <h2 className="text-3xl font-bold text-[#1A1A1A] mb-16 text-center">Markets & Stores</h2>
          
          <div className="grid md:grid-cols-3 gap-8">
            <div className="bg-[#F7F7F8] rounded-2xl p-8">
              <h3 className="text-lg font-semibold text-[#1A1A1A] mb-4">Export Markets</h3>
              <ul className="space-y-2">
                {markets.exports.map((country, index) => (
                  <li key={index} className="flex items-center gap-3">
                    <div className="w-2 h-2 bg-[#0F3B2F] rounded-full"></div>
                    <span className="text-gray-700">{country}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="bg-[#F7F7F8] rounded-2xl p-8">
              <h3 className="text-lg font-semibold text-[#1A1A1A] mb-4">Domestic Focus</h3>
              <div className="flex items-center gap-3">
                <MapPin className="w-5 h-5 text-[#0F3B2F]" />
                <span className="text-gray-700">{markets.domestic}</span>
              </div>
            </div>

            <div className="bg-[#F7F7F8] rounded-2xl p-8">
              <h3 className="text-lg font-semibold text-[#1A1A1A] mb-4">Retail Stores</h3>
              <div className="flex items-center gap-3">
                <Building className="w-5 h-5 text-[#0F3B2F]" />
                <span className="text-gray-700">{markets.stores} main carpet stores</span>
              </div>
            </div>
          </div>
        </div>

        {/* What Drives Us */}
        <div 
          ref={el => sectionRefs.current['mission'] = el}
          id="mission"
          className={`mb-32 transition-all duration-300 delay-600 ${
            visibleSections.has('mission') ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
          }`}
        >
          <h2 className="text-3xl font-bold text-[#1A1A1A] mb-16 text-center">What Drives Us</h2>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {missions.map((mission, index) => (
              <div 
                key={index}
                className="bg-white border border-gray-100 rounded-2xl p-6 hover:shadow-sm transition-all duration-180"
              >
                <div className="w-8 h-8 bg-[#0F3B2F] rounded-lg flex items-center justify-center text-white mb-4">
                  <CheckCircle className="w-4 h-4" />
                </div>
                <p className="text-[#1A1A1A] font-medium leading-relaxed">{mission}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Call to Action */}
        <div 
          ref={el => sectionRefs.current['cta'] = el}
          id="cta"
          className={`transition-all duration-300 delay-700 ${
            visibleSections.has('cta') ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
          }`}
        >
          <div className="bg-[#F7F7F8] rounded-2xl p-12 text-center">
            <h2 className="text-2xl font-bold text-[#1A1A1A] mb-4">
              Questions about sizing, lead times, or collaboration? We're here.
            </h2>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button
                onClick={() => {
                  // Navigate to home and scroll to contact form
                  onNavigate('home');
                  setTimeout(() => {
                    const element = document.querySelector('[data-section="contact"]');
                    if (element) {
                      element.scrollIntoView({ behavior: 'smooth' });
                    }
                  }, 100);
                }}
                className="bg-[#0F3B2F] text-white px-8 py-3 rounded-xl font-medium hover:bg-[#0F3B2F]/90 transition-all duration-180 hover:scale-105"
              >
                Contact Us
              </button>
              <button
                onClick={() => {
                  // Navigate to home and scroll to stores
                  onNavigate('home');
                  setTimeout(() => {
                    const element = document.querySelector('[data-section="stores"]');
                    if (element) {
                      element.scrollIntoView({ behavior: 'smooth' });
                    }
                  }, 100);
                }}
                className="border border-gray-200 text-[#1A1A1A] px-8 py-3 rounded-xl font-medium hover:bg-gray-50 transition-all duration-180"
              >
                Find a Store
              </button>
            </div>
          </div>
        </div>

        {/* Certificate Lightbox */}
        {selectedCertificate !== null && (
          <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4">
            <div className="bg-white rounded-2xl max-w-2xl w-full p-8">
              <div className="flex justify-between items-start mb-6">
                <div>
                  <h3 className="text-2xl font-bold text-[#1A1A1A] mb-2">
                    {certifications[selectedCertificate].name}
                  </h3>
                  <h4 className="text-lg text-[#0F3B2F] font-medium">
                    {certifications[selectedCertificate].title}
                  </h4>
                </div>
                <button
                  onClick={() => setSelectedCertificate(null)}
                  className="p-2 rounded-lg hover:bg-gray-100 transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
              
              <p className="text-gray-600 leading-relaxed mb-6">
                {certifications[selectedCertificate].description}
              </p>
              
              <div className="flex gap-3">
                <button className="flex items-center gap-2 bg-[#0F3B2F] text-white px-4 py-2 rounded-xl font-medium hover:bg-[#0F3B2F]/90 transition-colors">
                  <Eye className="w-4 h-4" />
                  View Certificate
                </button>
                <button className="flex items-center gap-2 border border-gray-200 text-[#1A1A1A] px-4 py-2 rounded-xl font-medium hover:bg-gray-50 transition-colors">
                  <Download className="w-4 h-4" />
                  Download PDF
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </section>
  );
}