import React, { createContext, useContext, useState, ReactNode } from 'react';

type Language = 'tm' | 'ru' | 'en';

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: string) => string;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

const translations: Record<Language, Record<string, string>> = {
  tm: {
    'nav.home': 'Baş sahypa',
    'nav.about': 'Biz barada',
    'nav.collaboration': 'Hyzmatdaşlyk',
    'nav.gallery': 'Galereýa',
    'nav.certificates': 'Şahadatnamalar',
    'nav.support': 'Goldaw',
    'hero.title': 'Premium Halylary',
    'hero.subtitle': 'Türkmenistanyň iň uly haly öndürijisi',
    'hero.description': '2016-njy ýyldan bäri däp bolup gelen hünär we häzirki zaman innowasiyasy bilen premium halylary öndürýäris.',
    'hero.cta1': 'Kolleksiýany görmek',
    'hero.cta2': '3D otagda görmek',
    'hero.discounted.title': 'Bu aýda arzanladylan kolleksiýa',
    'hero.discounted.subtitle': 'Çäkli wagtyň teklifi gutarýar:',
    'hero.countdown.days': 'Günler',
    'hero.countdown.hours': 'Sagatlar',
    'hero.countdown.minutes': 'Minutlar',
    'hero.countdown.seconds': 'Sekundlar',
    'hero.collection.traditional': 'Däp kolleksiýasy',
    'hero.collection.modern': 'Häzirki zaman kolleksiýasy',
    'hero.collection.premium': 'Premium kolleksiýa',
    'hero.discount.save': 'Tygşytlaň',
    'hero.view.3d': '3D otagda görmek',
    'hero.certificates.title': 'Biziň şahadatnamalarymyz',
    'hero.certificates.subtitle': 'Halkara hil standartlary we şahadatnamalar',
    'hero.iso.quality': 'Hil dolandyryşy',
    'hero.iso.environment': 'Daşky gurşaw dolandyryşy',
    'hero.iso.safety': 'Iş howpsuzlygy we saglygy',
    'hero.contact.title': 'Biziň bilen habarlaşyň',
    'hero.contact.name': 'Doly ady',
    'hero.contact.email': 'E-poçta salgysy',
    'hero.contact.message': 'Habar',
    'hero.contact.send': 'Habar ibermek',
    'hero.contact.phone': 'Telefon',
    'hero.contact.visit': 'Bize gelip görmek',
    'hero.contact.call': 'Jaň etmek',
    'hero.contact.email.us': 'E-poçta ibermek',
    'hero.contact.visit.us': 'Bize baryň',
    'stats.designs': 'haly dizaýny',
    'stats.years': 'ýyl bazarda',
    'stats.production': 'million m² ýyllyk önümçilik',
    'stats.specialists': 'hünärmen',
    'features.quality': 'Premium hil',
    'features.quality.desc': 'ISO sertifikatly önümçilik iň gowy materiallar bilen',
    'features.ar': 'AR wizualizasiýa',
    'features.ar.desc': 'Halylaryň otagyňyzda nähili görünýändigini satyn almazdan ozal görüň',
    'features.craft': 'Hünärmen ussatlyk',
    'features.craft.desc': '700+ ökde hünärmen däp usullary goraýar',
    'stores.title': 'Premium sergiler',
    'stores.subtitle': 'Halylary şahsy görmek üçin ajaýyp dizaýn edilen sergilerimize baryň',
    'stores.nearest': 'Iň ýakyn dükan',
    'stores.directions': 'Ugur',
    'stores.call': 'Jaň etmek',
    'stores.all': 'Ähli dükanlar',
    'stores.services': 'Premium hyzmatlar',
    'stores.expert': 'Hünärmen maslahat',
    'stores.expert.desc': 'Haly saýlamak, ölçeg we ýerleşdirmek boýunça professional maslahat',
    'stores.ar.demo': 'AR görkezişleri',
    'stores.ar.demo.desc': 'AR tehnologiýasy bilen halylaryň otagyňyzda nähili görünýändigini görüň',
    'stores.delivery': 'Eltip bermek we oturtmak',
    'stores.delivery.desc': 'Professional eltip bermek we oturtmak hyzmatlary bar',
    'stores.support': 'Satyşdan soňky goldaw',
    'stores.support.desc': 'Dowamly tehniki hyzmat maslahat we kepillik goldawy'
  },
  ru: {
    'nav.home': 'Главная',
    'nav.about': 'О нас',
    'nav.collaboration': 'Сотрудничество',
    'nav.gallery': 'Галерея',
    'nav.certificates': 'Сертификаты',
    'nav.support': 'Поддержка',
    'hero.title': 'Премиальные ковры',
    'hero.subtitle': 'Крупнейший производитель ковров в Туркменистане',
    'hero.description': 'С 2016 года мы создаем премиальные ковры, сочетающие традиционное мастерство с современными инновациями.',
    'hero.cta1': 'Посмотреть коллекцию',
    'hero.cta2': 'Посмотреть в 3D комнате',
    'hero.discounted.title': 'Коллекция со скидками в этом месяце',
    'hero.discounted.subtitle': 'Предложение ограниченного времени заканчивается через:',
    'hero.countdown.days': 'Дни',
    'hero.countdown.hours': 'Часы',
    'hero.countdown.minutes': 'Минуты',
    'hero.countdown.seconds': 'Секунды',
    'hero.collection.traditional': 'Традиционная коллекция',
    'hero.collection.modern': 'Современная коллекция',
    'hero.collection.premium': 'Премиум коллекция',
    'hero.discount.save': 'Экономия',
    'hero.view.3d': 'Посмотреть в 3D комнате',
    'hero.certificates.title': 'Наши сертификаты',
    'hero.certificates.subtitle': 'Международные стандарты качества и сертификаты',
    'hero.iso.quality': 'Управление качеством',
    'hero.iso.environment': 'Управление окружающей средой',
    'hero.iso.safety': 'Охрана труда и безопасность',
    'hero.contact.title': 'Свяжитесь с нами',
    'hero.contact.name': 'Полное имя',
    'hero.contact.email': 'Адрес электронной почты',
    'hero.contact.message': 'Сообщение',
    'hero.contact.send': 'Отправить сообщение',
    'hero.contact.phone': 'Телефон',
    'hero.contact.visit': 'Посетить нас',
    'hero.contact.call': 'Позвонить нам',
    'hero.contact.email.us': 'Написать нам',
    'hero.contact.visit.us': 'Посетить нас',
    'stats.designs': 'дизайнов ковров',
    'stats.years': 'лет на рынке',
    'stats.production': 'млн м² годового производства',
    'stats.specialists': 'специалистов',
    'features.quality': 'Премиальное качество',
    'features.quality.desc': 'Производство с сертификатом ISO из лучших материалов',
    'features.ar': 'AR визуализация',
    'features.ar.desc': 'Посмотрите, как ковры будут выглядеть в вашем пространстве перед покупкой',
    'features.craft': 'Экспертное мастерство',
    'features.craft.desc': '700+ опытных мастеров сохраняют традиционные техники',
    'stores.title': 'Премиальные шоурумы',
    'stores.subtitle': 'Посетите наши красиво оформленные шоурумы, чтобы лично познакомиться с коврами',
    'stores.nearest': 'Ближайший магазин',
    'stores.directions': 'Маршрут',
    'stores.call': 'Позвонить',
    'stores.all': 'Все магазины',
    'stores.services': 'Премиальные услуги',
    'stores.expert': 'Экспертная консультация',
    'stores.expert.desc': 'Профессиональные советы по выбору, размеру и размещению ковров',
    'stores.ar.demo': 'AR демонстрации',
    'stores.ar.demo.desc': 'Посмотрите, как ковры выглядят в вашем пространстве с помощью AR технологий',
    'stores.delivery': 'Доставка и установка',
    'stores.delivery.desc': 'Доступны профессиональные услуги доставки и установки',
    'stores.support': 'Послепродажная поддержка',
    'stores.support.desc': 'Постоянные советы по обслуживанию и гарантийная поддержка'
  },
  en: {
    'nav.home': 'Home',
    'nav.about': 'About',
    'nav.collaboration': 'Collaboration',
    'nav.gallery': 'Gallery',
    'nav.certificates': 'Certificates',
    'nav.support': 'Support',
    'hero.title': 'Premium Carpets',
    'hero.subtitle': 'Turkmenistan\'s largest carpet manufacturer',
    'hero.description': 'Since 2016, we\'ve been crafting premium carpets that combine traditional artistry with modern innovation.',
    'hero.cta1': 'Explore Collection',
    'hero.cta2': 'View in 3D Room',
    'hero.discounted.title': 'Discounted Collection This Month',
    'hero.discounted.subtitle': 'Limited Time Offer Ends In:',
    'hero.countdown.days': 'Days',
    'hero.countdown.hours': 'Hours',
    'hero.countdown.minutes': 'Minutes',
    'hero.countdown.seconds': 'Seconds',
    'hero.collection.traditional': 'Traditional Collection',
    'hero.collection.modern': 'Modern Collection',
    'hero.collection.premium': 'Premium Collection',
    'hero.discount.save': 'Save',
    'hero.view.3d': 'View in 3D Room',
    'hero.certificates.title': 'Our Certifications',
    'hero.certificates.subtitle': 'International quality standards and certifications that guarantee excellence',
    'hero.iso.quality': 'Quality Management',
    'hero.iso.environment': 'Environmental Management',
    'hero.iso.safety': 'Occupational Health & Safety',
    'hero.contact.title': 'Get in Touch',
    'hero.contact.name': 'Full Name',
    'hero.contact.email': 'Email Address',
    'hero.contact.message': 'Message',
    'hero.contact.send': 'Send Message',
    'hero.contact.phone': 'Phone',
    'hero.contact.visit': 'Visit Us',
    'hero.contact.call': 'Call Us',
    'hero.contact.email.us': 'Email Us',
    'hero.contact.visit.us': 'Visit Us',
    'stats.designs': 'carpet designs',
    'stats.years': 'years on the market',
    'stats.production': 'million m² annual production',
    'stats.specialists': 'specialists',
    'features.quality': 'Premium Quality',
    'features.quality.desc': 'ISO certified manufacturing with the finest materials',
    'features.ar': 'AR Visualization',
    'features.ar.desc': 'See how carpets look in your space before buying',
    'features.craft': 'Expert Craftsmanship',
    'features.craft.desc': '700+ skilled artisans preserving traditional techniques',
    'stores.title': 'Premium Showrooms',
    'stores.subtitle': 'Visit our beautifully designed showrooms to experience carpets in person',
    'stores.nearest': 'Nearest Store',
    'stores.directions': 'Directions',
    'stores.call': 'Call',
    'stores.all': 'All Stores',
    'stores.services': 'Premium Services',
    'stores.expert': 'Expert Consultation',
    'stores.expert.desc': 'Professional advice on carpet selection, sizing, and placement',
    'stores.ar.demo': 'AR Demonstrations',
    'stores.ar.demo.desc': 'See how carpets look in your space using AR technology',
    'stores.delivery': 'Delivery & Installation',
    'stores.delivery.desc': 'Professional delivery and installation services available',
    'stores.support': 'After-Sales Support',
    'stores.support.desc': 'Ongoing maintenance advice and warranty support'
  }
};

interface LanguageProviderProps {
  children: ReactNode;
}

export function LanguageProvider({ children }: LanguageProviderProps) {
  const [language, setLanguage] = useState<Language>('en');

  const t = (key: string): string => {
    return translations[language][key] || key;
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (context === undefined) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
}