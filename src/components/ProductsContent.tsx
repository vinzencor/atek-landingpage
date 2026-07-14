import React, { useEffect, useRef } from 'react';
import {
  CreditCard, Stethoscope, Database, Gavel, FileText, ShoppingBag, ArrowRight, Layers
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { initSmoothAnimations, cleanupAnimations } from '../utils/smoothAnimations';

const products = [
  {
    key: 'paypilot',
    name: 'Pill Pall',
    tagline: 'Smart Medication & Wellness Companion',
    description: 'PillPal is an intelligent medication management platform designed to help individuals track prescriptions, set reminders, and stay consistent with their treatment plans. With secure health records, smart alerts, and caregiver connectivity, PillPal ensures better adherence and peace of mind for users and families.',
    features: ['Smart medication reminders', 'Prescription & dosage tracking', 'Refill alerts & pharmacy integration', 'Caregiver access & adherence reports'],
    icon: <CreditCard className="h-6 w-6" />,
    category: 'SaaS'
  },
  {
    key: 'medlink',
    name: 'MedLink',
    tagline: 'Integrated healthcare workflow platform',
    description: 'MedLink connects clinicians, patients, and care workflows — providing secure record exchange, appointment orchestration, and telehealth-ready modules designed for modern healthcare providers.',
    features: ['EHR-friendly integrations', 'Secure patient messaging', 'Appointment & telehealth management', 'Compliance-ready audit trails'],
    icon: <Stethoscope className="h-6 w-6" />,
    category: 'Healthcare'
  },
  {
    key: 'flavourdb',
    name: 'Flavour DB',
    tagline: 'Food & recipe intelligence platform',
    description: 'Flavour DB is a structured food and recipe database with ingredient taxonomy, nutrition metadata and search APIs ideal for food apps, recommendation engines and culinary research.',
    features: ['Ingredient taxonomy', 'Recipe nutrition metadata', 'Search & recommendation APIs', 'Media-ready assets'],
    icon: <Database className="h-6 w-6" />,
    category: 'FoodTech'
  },
  {
    key: 'lexintel',
    name: 'LexIntel',
    tagline: 'Legal AI Assistant',
    description: 'An AI-powered assistant that helps legal teams summarize documents, surface precedents, and accelerate research with secure, searchable knowledge bases.',
    features: ['Document summarization', 'Precedent search', 'Secure knowledge base', 'Query & citation tooling'],
    icon: <Gavel className="h-6 w-6" />,
    category: 'LegalTech'
  },
  {
    key: 'lexintel-supreme',
    name: 'LexIntel Supreme',
    tagline: 'End-to-End Case Management',
    description: 'Complete case lifecycle management for law firms with matter tracking, calendaring, billing integrations and secure client portals.',
    features: ['Matter & docketing', 'Billing & trust accounting', 'Client portal', 'Document management'],
    icon: <FileText className="h-6 w-6" />,
    category: 'LegalTech'
  },
  {
    key: 'mybotique',
    name: 'MyBotique',
    tagline: 'Custom wedding boutique with AR trials',
    description: 'An e-commerce boutique platform focused on wedding apparel and accessories, featuring AR try-ons, custom consultations and streamlined order workflows.',
    features: ['AR virtual trials', 'Custom measurement flows', 'Designer & inventory management', 'E‑commerce checkout integrations'],
    icon: <ShoppingBag className="h-6 w-6" />
  }
];


const ProductsContent: React.FC = () => {
  const ref = useRef<HTMLElement | null>(null);

  useEffect(() => {
    const observer = initSmoothAnimations(ref.current);
    return () => cleanupAnimations(observer);
  }, []);

  return (
    <div ref={ref}>
      {/* Hero */}
      <section className="pt-28 pb-12 bg-gradient-to-br from-white via-primary-50 to-primary-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="animate-on-scroll inline-flex items-center space-x-2 bg-white/90 backdrop-blur-sm rounded-full px-4 py-2 mx-auto mb-6 shadow-soft">
            <Layers className="h-4 w-4 text-primary-600" />
            <span className="text-sm font-semibold text-primary-700">Product Portfolio</span>
          </div>

          <h1 className="animate-on-scroll text-4xl sm:text-5xl md:text-6xl font-bold text-neutral-900 mb-4">
            Our Products
          </h1>
          <p className="animate-on-scroll max-w-3xl mx-auto text-lg text-neutral-600">
            Innovative platforms built by ATEK IT — discover our product portfolio below.
          </p>
        </div>
      </section>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {products.map((p, idx) => (
            <article
              key={p.key}
              className={cn('animate-on-scroll bg-white rounded-2xl p-6 shadow-md border border-gray-100', 'transition-all duration-300 hover:-translate-y-1')}
              style={{ animationDelay: `${idx * 0.08}s` }}
            >
              <div className="flex items-start justify-between">
                <div className="flex items-center space-x-4">
                  <div className="w-12 h-12 bg-primary-50 rounded-lg flex items-center justify-center flex-shrink-0">
                    <div className="text-primary-600">{p.icon}</div>
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-gray-900">{p.name}</h3>
                    <p className="text-sm text-neutral-600">{p.tagline}</p>
                  </div>
                </div>
              </div>

              <p className="text-sm text-neutral-600 mt-4 leading-relaxed">{p.description}</p>

              <ul className="mt-4 space-y-2">
                {p.features.map((f, i) => (
                  <li key={i} className="flex items-start space-x-3">
                    <span className="w-2 h-2 mt-2 rounded-full bg-primary-600 flex-shrink-0" />
                    <span className="text-sm text-gray-700">{f}</span>
                  </li>
                ))}
              </ul>

              <div className="mt-6 flex items-center justify-start">
                <a href="/contact#contact-section" className="group inline-flex items-center space-x-3 bg-primary-600 hover:bg-primary-700 text-white px-4 py-2 rounded-lg font-semibold transition-colors duration-200">
                  <span>Request Demo</span>
                  <ArrowRight className="h-4 w-4" />
                </a>
              </div>
            </article>
          ))}
        </div>

        {/* CTA */}
        <section className="mt-12 bg-gradient-to-br from-primary-600 to-secondary-500 text-white rounded-2xl p-8 flex flex-col md:flex-row items-center justify-between gap-6">
          <div>
            <h3 className="text-2xl font-bold">Interested in a custom demo?</h3>
            <p className="text-sm text-white/90">Tell us your use case and we’ll prepare a tailored walkthrough.</p>
          </div>
          <div className="flex gap-4">
            <a href="/contact#contact-section" className="bg-white text-primary-600 font-semibold px-6 py-3 rounded-lg">Contact Sales</a>
            <a href="/contact#contact-section" className="border-2 border-white/30 text-white px-6 py-3 rounded-lg">Request Demo</a>
          </div>
        </section>
      </main>
    </div>
  );
};

export default ProductsContent;
