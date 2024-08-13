import React from 'react';
import FeatureCard from '@/components/Landing/Card';
import Badge from '@/components/Landing/Badge';
import HeroSection from '@/components/Landing/Hero';
import Footer from '@/components/Landing/Footer';
import featureCardsData from '@/data/featureCards.json';

export function LandingPage() {
  return (
    <div className="flex flex-col min-h-screen bg-dark antialiased scroll-smooth p-4 md:p-8 overflow-hidden">
      <main className="flex-grow">
        <div className="max-w-3xl mx-auto px-4 py-8 space-y-4 flex-col">
          <Badge />
          <HeroSection />
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-6">
            {featureCardsData.map((card, index) => (
              <FeatureCard
                key={index}
                imageSrc={card.image}
                title={card.title}
                description={card.description}
                index={index}
              />
            ))}
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}

export default LandingPage;