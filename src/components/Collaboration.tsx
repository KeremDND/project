import React, { useState, useRef, useEffect } from 'react';
import { 
  ArrowRight,
  Download,
  CheckCircle,
  Factory,
  Shield,
  Globe,
  Award,
  Truck,
  Users,
  Target,
  FileText,
  Send,
  Upload,
  X,
  Eye,
  Building,
  Package,
  Clock,
  Star
} from 'lucide-react';

export default function Collaboration() {
  const [formData, setFormData] = useState({
    companyName: '',
    contactName: '',
    email: '',
    phone: '',
    country: '',
    businessType: '',
    programInterest: [] as string[],
    volumesTimeline: '',
    sendLineSheet: false
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [selectedCertificate, setSelectedCertificate] = useState<number | null>(null);
  const [visibleSections, setVisibleSections] = useState<Set<string>>(new Set());
  const formRef = useRef<HTMLElement>(null);

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

    const sections = document.querySelectorAll('[data-animate]');
    sections.forEach(section => observer.observe(section));

    return () => observer.disconnect();
  }, []);

  const scrollToForm = () => {
    formRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    
    if (type === 'checkbox') {
      const checked = (e.target as HTMLInputElement).checked;
      if (name === 'sendLineSheet') {
        setFormData(prev => ({ ...prev, sendLineSheet: checked }));
      } else if (name === 'programInterest') {
        setFormData(prev => ({
          ...prev,
          programInterest: checked 
            ? [...prev.programInterest, value]
            : prev.programInterest.filter(item => item !== value)
        }));
      }
    } else {
      setFormData(prev => ({ ...prev, [name]: value }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    // Simulate form submission
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    setIsSubmitting(false);
    setShowSuccess(true);
    
    // Reset form after success
    setTimeout(() => {
      setFormData({
        companyName: '',
        contactName: '',
        email: '',
        phone: '',
        country: '',
        businessType: '',
        programInterest: [],
        volumesTimeline: '',
        sendLineSheet: false
      });
      setShowSuccess(false);
    }, 5000);
  };

  const certificates = [
    {
      name: 'ISO 9001',
      title: 'Quality Management',
      description: 'Consistent quality in manufacturing processes',
      icon: <Star className="w-5 h-5" />,
      color: 'text-blue-600',
      bgColor: 'bg-blue-50'
    },
    {
      name: 'ISO 14001',
      title: 'Environmental Management',
      description: 'Environmental responsibility and sustainability',
      icon: <Shield className="w-5 h-5" />,
      color: 'text-green-600',
      bgColor: 'bg-green-50'
    },
    {
      name: 'ISO 45001',
      title: 'Occupational Health & Safety',
      description: 'Workplace safety and employee well-being',
      icon: <Shield className="w-5 h-5" />,
      color: 'text-red-600',
      bgColor: 'bg-red-50'
    }
  ];

  const countries = [
    'Afghanistan', 'Albania', 'Algeria', 'Argentina', 'Armenia', 'Australia', 'Austria', 'Azerbaijan',
    'Bahrain', 'Bangladesh', 'Belarus', 'Belgium', 'Brazil', 'Bulgaria', 'Canada', 'Chile', 'China',
    'Colombia', 'Croatia', 'Czech Republic', 'Denmark', 'Egypt', 'Estonia', 'Finland', 'France',
    'Georgia', 'Germany', 'Greece', 'Hungary', 'India', 'Indonesia', 'Iran', 'Iraq', 'Ireland',
    'Israel', 'Italy', 'Japan', 'Jordan', 'Kazakhstan', 'Kuwait', 'Latvia', 'Lebanon', 'Lithuania',
    'Luxembourg', 'Malaysia', 'Mexico', 'Netherlands', 'New Zealand', 'Norway', 'Pakistan', 'Poland',
    'Portugal', 'Qatar', 'Romania', 'Russia', 'Saudi Arabia', 'Singapore', 'Slovakia', 'Slovenia',
    'South Africa', 'South Korea', 'Spain', 'Sweden', 'Switzerland', 'Thailand', 'Turkey',
    'Turkmenistan', 'Ukraine', 'United Arab Emirates', 'United Kingdom', 'United States', 'Uzbekistan'
  ];

  return (
    <section className="min-h-screen bg-white py-8 pt-32">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Executive Hero */}
        <div 
          id="hero"
          data-animate
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
              Reliable carpet manufacturing for retailers, wholesalers, and store networks.
            </h1>
            
            <p className="text-lg text-gray-600 leading-relaxed max-w-lg">
              24/7 Vandewiele production, in-house Neumag yarn, ISO-certified systems. 
              Scale, consistency, and modern design—ready for international roll-outs and local store openings.
            </p>
            
            <div className="flex gap-4">
              <button
                onClick={scrollToForm}
                className="bg-[#0F3B2F] text-white px-8 py-3 rounded-xl font-medium hover:bg-[#0F3B2F]/90 transition-all duration-180 hover:scale-105"
              >
                Start a Partnership
              </button>
              <button className="border border-gray-200 text-[#1A1A1A] px-8 py-3 rounded-xl font-medium hover:bg-gray-50 transition-all duration-180 flex items-center gap-2">
                <Download className="w-4 h-4" />
                Download Line Sheet
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

        {/* Why Partner with Abadan Haly */}
        <div 
          id="value-pillars"
          data-animate
          className={`mb-32 transition-all duration-300 delay-100 ${
            visibleSections.has('value-pillars') ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
          }`}
        >
          <h2 className="text-3xl font-bold text-[#1A1A1A] mb-16 text-center">Why Partner with Abadan Haly</h2>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8 mb-12">
            <div className="bg-[#F7F7F8] rounded-xl p-6 text-center">
              <div className="w-12 h-12 bg-white rounded-xl flex items-center justify-center mx-auto mb-4">
                <Factory className="w-6 h-6 text-[#0F3B2F]" />
              </div>
              <h3 className="font-semibold text-[#1A1A1A] mb-2">Scale</h3>
              <p className="text-sm text-gray-600">3M m² record (2020), 24/7 lines, 600+ team.</p>
            </div>

            <div className="bg-[#F7F7F8] rounded-xl p-6 text-center">
              <div className="w-12 h-12 bg-white rounded-xl flex items-center justify-center mx-auto mb-4">
                <Target className="w-6 h-6 text-[#0F3B2F]" />
              </div>
              <h3 className="font-semibold text-[#1A1A1A] mb-2">Consistency</h3>
              <p className="text-sm text-gray-600">8 Vandewiele looms + in-house Neumag yarn for repeatable quality.</p>
            </div>

            <div className="bg-[#F7F7F8] rounded-xl p-6 text-center">
              <div className="w-12 h-12 bg-white rounded-xl flex items-center justify-center mx-auto mb-4">
                <Package className="w-6 h-6 text-[#0F3B2F]" />
              </div>
              <h3 className="font-semibold text-[#1A1A1A] mb-2">Range</h3>
              <p className="text-sm text-gray-600">400+ designs, modern & classic; private-label ready.</p>
            </div>

            <div className="bg-[#F7F7F8] rounded-xl p-6 text-center">
              <div className="w-12 h-12 bg-white rounded-xl flex items-center justify-center mx-auto mb-4">
                <Award className="w-6 h-6 text-[#0F3B2F]" />
              </div>
              <h3 className="font-semibold text-[#1A1A1A] mb-2">Assurance</h3>
              <p className="text-sm text-gray-600">ISO 9001 · 14001 · 45001 + national export award.</p>
            </div>
          </div>

          <div className="text-center">
            <button
              onClick={scrollToForm}
              className="text-[#0F3B2F] hover:text-[#0F3B2F]/80 font-medium transition-colors duration-180 flex items-center gap-2 mx-auto"
            >
              Discuss your program
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Product Programs (B2B) */}
        <div 
          id="programs"
          data-animate
          className={`mb-32 transition-all duration-300 delay-200 ${
            visibleSections.has('programs') ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
          }`}
        >
          <h2 className="text-3xl font-bold text-[#1A1A1A] mb-16 text-center">Product Programs</h2>
          
          <div className="grid lg:grid-cols-2 gap-12 mb-8">
            {/* Standard Range Supply */}
            <div className="bg-[#F7F7F8] rounded-2xl p-8">
              <h3 className="text-xl font-semibold text-[#1A1A1A] mb-4">Standard Range Supply</h3>
              
              <div className="space-y-4 mb-6">
                <div>
                  <h4 className="font-medium text-[#1A1A1A] mb-2">Sizes</h4>
                  <p className="text-sm text-gray-600">160×230, 200×300, 300×400 cm standard; custom sizes available</p>
                </div>
                
                <div>
                  <h4 className="font-medium text-[#1A1A1A] mb-2">Materials</h4>
                  <p className="text-sm text-gray-600">Polypropylene, blends; premium fiber selection</p>
                </div>
                
                <div>
                  <h4 className="font-medium text-[#1A1A1A] mb-2">Style Families</h4>
                  <p className="text-sm text-gray-600">Modern/classic/minimal; heritage motifs available</p>
                </div>
                
                <div>
                  <h4 className="font-medium text-[#1A1A1A] mb-2">Logistics</h4>
                  <p className="text-sm text-gray-600">Bulk ordering, carton/pallet logistics, replenishment cadence</p>
                </div>
              </div>
            </div>

            {/* Private Label & Custom */}
            <div className="bg-[#F7F7F8] rounded-2xl p-8">
              <h3 className="text-xl font-semibold text-[#1A1A1A] mb-4">Private Label & Custom</h3>
              
              <div className="space-y-4 mb-6">
                <div>
                  <h4 className="font-medium text-[#1A1A1A] mb-2">Customization</h4>
                  <p className="text-sm text-gray-600">Colorways, labeling, packaging, barcode/inner cartons</p>
                </div>
                
                <div>
                  <h4 className="font-medium text-[#1A1A1A] mb-2">Design Collaboration</h4>
                  <p className="text-sm text-gray-600">Heritage motifs + modern culture blend</p>
                </div>
                
                <div>
                  <h4 className="font-medium text-[#1A1A1A] mb-2">Speed</h4>
                  <p className="text-sm text-gray-600">IT/AI-assisted iterations for rapid development</p>
                </div>
                
                <div>
                  <h4 className="font-medium text-[#1A1A1A] mb-2">Support</h4>
                  <p className="text-sm text-gray-600">Full design studio collaboration and technical guidance</p>
                </div>
              </div>
            </div>
          </div>

          <div className="flex gap-4 justify-center">
            <button
              onClick={scrollToForm}
              className="bg-[#0F3B2F] text-white px-6 py-3 rounded-xl font-medium hover:bg-[#0F3B2F]/90 transition-all duration-180"
            >
              Request Samples
            </button>
            <button className="border border-gray-200 text-[#1A1A1A] px-6 py-3 rounded-xl font-medium hover:bg-gray-50 transition-all duration-180">
              See Gallery
            </button>
          </div>
        </div>

        {/* Trade Terms & Logistics */}
        <div 
          id="trade-terms"
          data-animate
          className={`mb-32 transition-all duration-300 delay-300 ${
            visibleSections.has('trade-terms') ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
          }`}
        >
          <h2 className="text-3xl font-bold text-[#1A1A1A] mb-16 text-center">Trade Terms & Logistics</h2>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <div className="bg-white border border-gray-100 rounded-xl p-6">
              <div className="w-10 h-10 bg-[#F7F7F8] rounded-lg flex items-center justify-center mb-4">
                <Clock className="w-5 h-5 text-[#0F3B2F]" />
              </div>
              <h3 className="font-semibold text-[#1A1A1A] mb-2">MOQs & Lead Times</h3>
              <p className="text-sm text-gray-600">SKU MOQ 50–100 pcs; standard lead 3–6 weeks; rush options on request.</p>
            </div>

            <div className="bg-white border border-gray-100 rounded-xl p-6">
              <div className="w-10 h-10 bg-[#F7F7F8] rounded-lg flex items-center justify-center mb-4">
                <CheckCircle className="w-5 h-5 text-[#0F3B2F]" />
              </div>
              <h3 className="font-semibold text-[#1A1A1A] mb-2">Quality & Testing</h3>
              <p className="text-sm text-gray-600">Color fastness, density checks, batch QC with ISO 9001 processes.</p>
            </div>

            <div className="bg-white border border-gray-100 rounded-xl p-6">
              <div className="w-10 h-10 bg-[#F7F7F8] rounded-lg flex items-center justify-center mb-4">
                <Truck className="w-5 h-5 text-[#0F3B2F]" />
              </div>
              <h3 className="font-semibold text-[#1A1A1A] mb-2">Shipping & Documentation</h3>
              <p className="text-sm text-gray-600">FOB/CIF options, packing specs, labeling, export docs for KZ/AF/TR and beyond.</p>
            </div>

            <div className="bg-white border border-gray-100 rounded-xl p-6">
              <div className="w-10 h-10 bg-[#F7F7F8] rounded-lg flex items-center justify-center mb-4">
                <Users className="w-5 h-5 text-[#0F3B2F]" />
              </div>
              <h3 className="font-semibold text-[#1A1A1A] mb-2">Program Support</h3>
              <p className="text-sm text-gray-600">Dedicated account manager, weekly production updates, post-launch replenishment.</p>
            </div>
          </div>

          <div className="flex gap-3 justify-center">
            <button className="bg-[#F7F7F8] text-[#1A1A1A] px-4 py-2 rounded-lg text-sm font-medium hover:bg-gray-200 transition-colors flex items-center gap-2">
              <FileText className="w-4 h-4" />
              Line Sheet (PDF)
            </button>
            <button className="bg-[#F7F7F8] text-[#1A1A1A] px-4 py-2 rounded-lg text-sm font-medium hover:bg-gray-200 transition-colors flex items-center gap-2">
              <FileText className="w-4 h-4" />
              Spec Sheet (PDF)
            </button>
            <button className="bg-[#F7F7F8] text-[#1A1A1A] px-4 py-2 rounded-lg text-sm font-medium hover:bg-gray-200 transition-colors flex items-center gap-2">
              <FileText className="w-4 h-4" />
              Packaging Guide (PDF)
            </button>
          </div>
        </div>

        {/* Distribution & Store Opportunities */}
        <div 
          id="opportunities"
          data-animate
          className={`mb-32 transition-all duration-300 delay-400 ${
            visibleSections.has('opportunities') ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
          }`}
        >
          <h2 className="text-3xl font-bold text-[#1A1A1A] mb-16 text-center">Distribution & Store Opportunities</h2>
          
          <div className="grid lg:grid-cols-2 gap-12 mb-8">
            {/* Global B2B Distribution */}
            <div>
              <h3 className="text-xl font-semibold text-[#1A1A1A] mb-4">Global B2B Distribution</h3>
              <p className="text-gray-600 mb-6">
                Palletized shipments to retailer DCs and multi-store networks; route planning, ETAs, 
                carton/pallet configs; scalable replenishment.
              </p>
              
              <div className="space-y-3 mb-6">
                <div className="flex items-center gap-3">
                  <div className="w-2 h-2 bg-[#0F3B2F] rounded-full"></div>
                  <span className="text-sm text-gray-700">Territories</span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-2 h-2 bg-[#0F3B2F] rounded-full"></div>
                  <span className="text-sm text-gray-700">Capex & timelines</span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-2 h-2 bg-[#0F3B2F] rounded-full"></div>
                  <span className="text-sm text-gray-700">Marketing kit</span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-2 h-2 bg-[#0F3B2F] rounded-full"></div>
                  <span className="text-sm text-gray-700">Operations handbook</span>
                </div>
              </div>
            </div>

            {/* Local Store Opening */}
            <div>
              <h3 className="text-xl font-semibold text-[#1A1A1A] mb-4">Local Store Opening</h3>
              <p className="text-gray-600 mb-6">
                Criteria (location, retail experience, floor area), initial assortment pack, 
                VM guidelines, marketing support, training.
              </p>
              
              <div className="space-y-3 mb-6">
                <div className="flex items-center gap-3">
                  <div className="w-2 h-2 bg-[#0F3B2F] rounded-full"></div>
                  <span className="text-sm text-gray-700">Location requirements</span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-2 h-2 bg-[#0F3B2F] rounded-full"></div>
                  <span className="text-sm text-gray-700">Initial inventory package</span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-2 h-2 bg-[#0F3B2F] rounded-full"></div>
                  <span className="text-sm text-gray-700">Visual merchandising</span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-2 h-2 bg-[#0F3B2F] rounded-full"></div>
                  <span className="text-sm text-gray-700">Training & support</span>
                </div>
              </div>
            </div>
          </div>

          <div className="text-center">
            <button
              onClick={scrollToForm}
              className="text-[#0F3B2F] hover:text-[#0F3B2F]/80 font-medium transition-colors duration-180 flex items-center gap-2 mx-auto"
            >
              Apply to open a store / become a distributor
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Case Snapshots */}
        <div 
          id="cases"
          data-animate
          className={`mb-32 transition-all duration-300 delay-500 ${
            visibleSections.has('cases') ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
          }`}
        >
          <h2 className="text-3xl font-bold text-[#1A1A1A] mb-16 text-center">Case Snapshots</h2>
          
          <div className="grid md:grid-cols-3 gap-8">
            <div className="bg-white border border-gray-100 rounded-xl p-6">
              <h3 className="font-semibold text-[#1A1A1A] mb-2">Retail Rollout</h3>
              <p className="text-sm text-gray-600 mb-4">"12 stores, 6 weeks, 14 SKUs."</p>
              <button className="text-[#0F3B2F] text-sm font-medium hover:text-[#0F3B2F]/80 transition-colors flex items-center gap-1">
                <Eye className="w-3 h-3" />
                View details
              </button>
            </div>

            <div className="bg-white border border-gray-100 rounded-xl p-6">
              <h3 className="font-semibold text-[#1A1A1A] mb-2">Designer Project</h3>
              <p className="text-sm text-gray-600 mb-4">"Hospitality suite, 2×3 m custom palette."</p>
              <button className="text-[#0F3B2F] text-sm font-medium hover:text-[#0F3B2F]/80 transition-colors flex items-center gap-1">
                <Eye className="w-3 h-3" />
                View details
              </button>
            </div>

            <div className="bg-white border border-gray-100 rounded-xl p-6">
              <h3 className="font-semibold text-[#1A1A1A] mb-2">Government Procurement</h3>
              <p className="text-sm text-gray-600 mb-4">"Durability spec met; on-schedule."</p>
              <button className="text-[#0F3B2F] text-sm font-medium hover:text-[#0F3B2F]/80 transition-colors flex items-center gap-1">
                <Eye className="w-3 h-3" />
                View details
              </button>
            </div>
          </div>
        </div>

        {/* Compliance & Certifications */}
        <div 
          id="certifications"
          data-animate
          className={`mb-32 transition-all duration-300 delay-600 ${
            visibleSections.has('certifications') ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
          }`}
        >
          <h2 className="text-3xl font-bold text-[#1A1A1A] mb-16 text-center">Compliance & Certifications</h2>
          
          <div className="grid md:grid-cols-3 gap-8 mb-8">
            {certificates.map((cert, index) => (
              <button
                key={index}
                onClick={() => setSelectedCertificate(index)}
                className="bg-white border border-gray-100 rounded-xl p-6 hover:shadow-sm transition-all duration-180 text-left"
              >
                <div className={`w-10 h-10 ${cert.bgColor} rounded-lg flex items-center justify-center ${cert.color} mb-4`}>
                  {cert.icon}
                </div>
                <h3 className="font-semibold text-[#1A1A1A] mb-1">{cert.name}</h3>
                <h4 className="text-sm font-medium text-[#0F3B2F] mb-2">{cert.title}</h4>
                <p className="text-sm text-gray-600">{cert.description}</p>
              </button>
            ))}
          </div>

          <div className="text-center">
            <div className="inline-flex items-center bg-gradient-to-r from-[#C6A866] to-[#D4B876] text-white px-6 py-3 rounded-xl font-medium shadow-sm">
              <Award className="w-4 h-4 mr-2" />
              Year of Most Exported Products — Turkmenistan
            </div>
          </div>
        </div>

        {/* Process */}
        <div 
          id="process"
          data-animate
          className={`mb-32 transition-all duration-300 delay-700 ${
            visibleSections.has('process') ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
          }`}
        >
          <h2 className="text-3xl font-bold text-[#1A1A1A] mb-16 text-center">How We Work</h2>
          
          <div className="flex flex-col md:flex-row items-center justify-between gap-8 mb-8">
            {[
              'Requirements & SKUs',
              'Samples & Approvals',
              'Production & QC',
              'Packing & Shipping',
              'Replenishment & Support'
            ].map((step, index) => (
              <div key={index} className="flex flex-col items-center text-center">
                <div className="w-12 h-12 bg-[#0F3B2F] text-white rounded-xl flex items-center justify-center font-bold mb-3">
                  {index + 1}
                </div>
                <h3 className="font-medium text-[#1A1A1A] text-sm">{step}</h3>
                {index < 4 && (
                  <ArrowRight className="w-4 h-4 text-gray-400 mt-4 hidden md:block" />
                )}
              </div>
            ))}
          </div>

          <div className="text-center">
            <button
              onClick={scrollToForm}
              className="bg-[#0F3B2F] text-white px-8 py-3 rounded-xl font-medium hover:bg-[#0F3B2F]/90 transition-all duration-180"
            >
              Start Your Program
            </button>
          </div>
        </div>

        {/* Partnership Form */}
        <div 
          ref={formRef}
          id="partnership-form"
          data-animate
          className={`transition-all duration-300 delay-800 ${
            visibleSections.has('partnership-form') ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
          }`}
        >
          <div className="bg-[#F7F7F8] rounded-2xl p-8 lg:p-12">
            <div className="max-w-4xl mx-auto">
              <div className="text-center mb-12">
                <h2 className="text-3xl font-bold text-[#1A1A1A] mb-4">Start a Partnership</h2>
                <p className="text-gray-600">
                  Complete the form below and our partnership team will contact you within 1–2 business days.
                </p>
              </div>

              {showSuccess ? (
                <div className="text-center py-12">
                  <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
                    <CheckCircle className="w-8 h-8 text-green-600" />
                  </div>
                  <h3 className="text-2xl font-bold text-[#1A1A1A] mb-4">Thank You!</h3>
                  <p className="text-gray-600 mb-2">
                    Thanks—our team will reply within 1–2 business days.
                  </p>
                  <p className="text-sm text-gray-500">
                    We'll review your application and provide detailed partnership information.
                  </p>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-8">
                  <div className="grid md:grid-cols-2 gap-6">
                    <div>
                      <label htmlFor="companyName" className="block text-sm font-medium text-[#1A1A1A] mb-2">
                        Company Name *
                      </label>
                      <input
                        type="text"
                        id="companyName"
                        name="companyName"
                        required
                        value={formData.companyName}
                        onChange={handleInputChange}
                        className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#0F3B2F] focus:border-[#0F3B2F] outline-none transition-all duration-200"
                        placeholder="Your company name"
                      />
                    </div>
                    
                    <div>
                      <label htmlFor="contactName" className="block text-sm font-medium text-[#1A1A1A] mb-2">
                        Contact Name *
                      </label>
                      <input
                        type="text"
                        id="contactName"
                        name="contactName"
                        required
                        value={formData.contactName}
                        onChange={handleInputChange}
                        className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#0F3B2F] focus:border-[#0F3B2F] outline-none transition-all duration-200"
                        placeholder="Your full name"
                      />
                    </div>
                  </div>

                  <div className="grid md:grid-cols-2 gap-6">
                    <div>
                      <label htmlFor="email" className="block text-sm font-medium text-[#1A1A1A] mb-2">
                        Email *
                      </label>
                      <input
                        type="email"
                        id="email"
                        name="email"
                        required
                        value={formData.email}
                        onChange={handleInputChange}
                        className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#0F3B2F] focus:border-[#0F3B2F] outline-none transition-all duration-200"
                        placeholder="your@email.com"
                      />
                    </div>
                    
                    <div>
                      <label htmlFor="phone" className="block text-sm font-medium text-[#1A1A1A] mb-2">
                        Phone/WhatsApp
                      </label>
                      <input
                        type="tel"
                        id="phone"
                        name="phone"
                        value={formData.phone}
                        onChange={handleInputChange}
                        className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#0F3B2F] focus:border-[#0F3B2F] outline-none transition-all duration-200"
                        placeholder="+1 (555) 123-4567"
                      />
                    </div>
                  </div>

                  <div className="grid md:grid-cols-2 gap-6">
                    <div>
                      <label htmlFor="country" className="block text-sm font-medium text-[#1A1A1A] mb-2">
                        Country/Region *
                      </label>
                      <select
                        id="country"
                        name="country"
                        required
                        value={formData.country}
                        onChange={handleInputChange}
                        className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#0F3B2F] focus:border-[#0F3B2F] outline-none transition-all duration-200"
                      >
                        <option value="">Select country</option>
                        {countries.map(country => (
                          <option key={country} value={country}>{country}</option>
                        ))}
                      </select>
                    </div>
                    
                    <div>
                      <label htmlFor="businessType" className="block text-sm font-medium text-[#1A1A1A] mb-2">
                        Business Type *
                      </label>
                      <select
                        id="businessType"
                        name="businessType"
                        required
                        value={formData.businessType}
                        onChange={handleInputChange}
                        className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#0F3B2F] focus:border-[#0F3B2F] outline-none transition-all duration-200"
                      >
                        <option value="">Select business type</option>
                        <option value="Retailer">Retailer</option>
                        <option value="Wholesaler">Wholesaler</option>
                        <option value="Distributor">Distributor</option>
                        <option value="Designer">Designer</option>
                        <option value="Procurement">Procurement</option>
                        <option value="Franchisee">Franchisee</option>
                      </select>
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-[#1A1A1A] mb-3">
                      Program Interest (select all that apply)
                    </label>
                    <div className="grid md:grid-cols-3 gap-3">
                      {['Standard Supply', 'Private Label', 'Store Opening', 'Government', 'Other'].map(program => (
                        <label key={program} className="flex items-center gap-3 p-3 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors cursor-pointer">
                          <input
                            type="checkbox"
                            name="programInterest"
                            value={program}
                            checked={formData.programInterest.includes(program)}
                            onChange={handleInputChange}
                            className="w-4 h-4 text-[#0F3B2F] border-gray-300 rounded focus:ring-[#0F3B2F]"
                          />
                          <span className="text-sm text-[#1A1A1A]">{program}</span>
                        </label>
                      ))}
                    </div>
                  </div>

                  <div>
                    <label htmlFor="volumesTimeline" className="block text-sm font-medium text-[#1A1A1A] mb-2">
                      Estimated Volumes & Timeline
                    </label>
                    <textarea
                      id="volumesTimeline"
                      name="volumesTimeline"
                      rows={4}
                      value={formData.volumesTimeline}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#0F3B2F] focus:border-[#0F3B2F] outline-none transition-all duration-200 resize-none"
                      placeholder="Describe your expected volumes, timeline, and specific requirements..."
                    />
                  </div>

                  <div className="space-y-4">
                    <div className="border-2 border-dashed border-gray-200 rounded-xl p-6 text-center hover:border-gray-300 transition-colors">
                      <Upload className="w-8 h-8 text-gray-400 mx-auto mb-2" />
                      <p className="text-sm text-gray-600 mb-1">Upload brief/spec (PDF/Images)</p>
                      <p className="text-xs text-gray-500">Optional: Product briefs, specifications, or reference materials</p>
                    </div>

                    <label className="flex items-center gap-3 cursor-pointer">
                      <input
                        type="checkbox"
                        name="sendLineSheet"
                        checked={formData.sendLineSheet}
                        onChange={handleInputChange}
                        className="w-4 h-4 text-[#0F3B2F] border-gray-300 rounded focus:ring-[#0F3B2F]"
                      />
                      <span className="text-sm text-[#1A1A1A]">Send line sheet & price tiers</span>
                    </label>

                    <div className="bg-gray-50 border border-gray-200 rounded-xl p-4">
                      <label className="flex items-start gap-3 cursor-pointer">
                        <input
                          type="checkbox"
                          name="captchaVerification"
                          required
                          className="w-4 h-4 text-[#0F3B2F] border-gray-300 rounded focus:ring-[#0F3B2F] mt-0.5"
                        />
                        <div className="flex-1">
                          <span className="text-sm text-[#1A1A1A] font-medium">I'm not a robot *</span>
                          <p className="text-xs text-gray-500 mt-1">
                            Please verify that you are human to prevent spam submissions
                          </p>
                        </div>
                        <div className="w-8 h-8 bg-gray-200 rounded border border-gray-300 flex items-center justify-center">
                          <Shield className="w-4 h-4 text-gray-500" />
                        </div>
                      </label>
                    </div>
                  </div>

                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full bg-[#0F3B2F] hover:bg-[#0F3B2F]/90 disabled:bg-[#0F3B2F]/50 text-white py-4 rounded-xl font-semibold transition-all duration-180 flex items-center justify-center gap-3"
                  >
                    {isSubmitting ? (
                      <>
                        <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                        Processing...
                      </>
                    ) : (
                      <>
                        <Send className="w-5 h-5" />
                        Request Partnership
                      </>
                    )}
                  </button>

                  <div className="text-center">
                    <p className="text-xs text-gray-500">
                      By submitting this form, you agree to our privacy policy. 
                      We'll only use your information to discuss partnership opportunities.
                    </p>
                  </div>
                </form>
              )}
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
                    {certificates[selectedCertificate].name}
                  </h3>
                  <h4 className="text-lg text-[#0F3B2F] font-medium">
                    {certificates[selectedCertificate].title}
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
                {certificates[selectedCertificate].description}
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