import React, { useState, useEffect } from 'react';
import type { Product, PageRoute } from '../types/index.js';
import { api } from '../services/api.js';
import { HeroSection } from '../components/home/HeroSection.js';
import { FeaturedProductsSection } from '../components/home/FeaturedProductsSection.js';
import { AboutSection } from '../components/home/AboutSection.js';
import { ComparisonSection } from '../components/home/ComparisonSection.js';
import { BenefitsSection } from '../components/home/BenefitsSection.js';
import { KnowledgeSection } from '../components/home/KnowledgeSection.js';
import { QualityGuideSection } from '../components/home/QualityGuideSection.js';
import { FAQSection } from '../components/home/FAQSection.js';
import { CTASection } from '../components/home/CTASection.js';
import { ProductDetailModal } from '../components/product/ProductDetailModal.js';
import { OrderContactModal } from '../components/product/OrderContactModal.js';

interface HomePageProps {
  onNavigate: (route: PageRoute) => void;
}

export const HomePage: React.FC<HomePageProps> = ({ onNavigate }) => {
  const [featuredProducts, setFeaturedProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [orderProduct, setOrderProduct] = useState<Product | null>(null);

  useEffect(() => {
    async function loadFeatured() {
      try {
        const res = await api.getFeaturedProducts();
        if (res.success && res.data) {
          setFeaturedProducts(res.data);
        }
      } catch (err) {
        console.error('Failed to load featured products', err);
      } finally {
        setIsLoading(false);
      }
    }
    loadFeatured();
  }, []);

  return (
    <div className="min-h-screen bg-stone-950 text-stone-100">
      {/* 1. Hero Banner with Ecosystem chips and Quick Cards */}
      <HeroSection onNavigate={onNavigate} />

      {/* 2. Featured Products by Category */}
      <FeaturedProductsSection
        products={featuredProducts}
        isLoading={isLoading}
        onSelectProduct={(prod) => setSelectedProduct(prod)}
        onOrderProduct={(prod) => setOrderProduct(prod)}
        onNavigate={onNavigate}
      />

      {/* 3. About Ong Dú (Meliponini & Cerumen) */}
      <AboutSection />

      {/* 5. Comparison: Ong Dú vs Regular Honey */}
      <ComparisonSection />

      {/* 6. Scientific Benefits & Trehalulose & Safety Warnings */}
      <BenefitsSection />

      {/* 7. Knowledge & Guides (Hiểu đúng · Dùng đúng) */}
      <KnowledgeSection />

      {/* 8. Quality Guide: 4 Signs of Pure Honey */}
      <QualityGuideSection />

      {/* 9. FAQ Accordion (Câu hỏi thường gặp) */}
      <FAQSection />

      {/* 10. CTA Banner & Contact */}
      <CTASection onNavigate={onNavigate} />

      {/* Product Detail Modal */}
      <ProductDetailModal
        product={selectedProduct}
        isOpen={Boolean(selectedProduct)}
        onClose={() => setSelectedProduct(null)}
        onOrder={(prod) => {
          setSelectedProduct(null);
          setOrderProduct(prod);
        }}
      />

      {/* Order / Contact Modal */}
      <OrderContactModal
        product={orderProduct}
        isOpen={Boolean(orderProduct)}
        onClose={() => setOrderProduct(null)}
      />
    </div>
  );
};
