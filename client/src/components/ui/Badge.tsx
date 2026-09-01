import React from 'react';
import { Star, Sparkles, CheckCircle2, XCircle } from 'lucide-react';

interface BadgeProps {
  children: React.ReactNode;
  variant?: 'amber' | 'emerald' | 'rose' | 'stone' | 'gold';
  size?: 'sm' | 'md';
  className?: string;
}

export const Badge: React.FC<BadgeProps> = ({
  children,
  variant = 'amber',
  size = 'md',
  className = '',
}) => {
  const variantStyles = {
    amber: 'bg-amber-100/80 text-amber-900 border-amber-300',
    emerald: 'bg-emerald-100/80 text-emerald-900 border-emerald-300',
    rose: 'bg-rose-100/80 text-rose-900 border-rose-300',
    stone: 'bg-stone-100 text-stone-800 border-stone-300',
    gold: 'bg-gradient-to-r from-amber-200 to-yellow-300 text-amber-950 border-amber-400 font-semibold shadow-xs',
  }[variant];

  const sizeStyles = {
    sm: 'px-2 py-0.5 text-xs',
    md: 'px-2.5 py-1 text-xs sm:text-sm',
  }[size];

  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full border font-medium ${variantStyles} ${sizeStyles} ${className}`}
    >
      {children}
    </span>
  );
};

export const RatingBadge: React.FC<{ rating?: number; reviewCount?: number; className?: string }> = ({
  rating = 5.0,
  reviewCount = 24,
  className = '',
}) => (
  <div className={`inline-flex items-center gap-1 text-xs font-semibold ${className}`}>
    <Star className="w-3.5 h-3.5 fill-[#d49a2a] text-[#d49a2a]" />
    <span className="font-bold text-[#f0cf7e]">{rating.toFixed(1)}</span>
    <span className="text-stone-400 font-normal text-[11px]">({reviewCount})</span>
  </div>
);

export const FeaturedBadge: React.FC = () => (
  <Badge variant="gold" size="sm">
    <Sparkles className="w-3 h-3 text-amber-700" />
    <span>Nổi bật</span>
  </Badge>
);

export const StockBadge: React.FC<{ inStock: boolean | number }> = ({ inStock }) => {
  const isAvailable = Boolean(inStock);
  return isAvailable ? (
    <Badge variant="emerald" size="sm">
      <CheckCircle2 className="w-3 h-3" />
      <span>Còn hàng</span>
    </Badge>
  ) : (
    <Badge variant="rose" size="sm">
      <XCircle className="w-3 h-3" />
      <span>Tạm hết hàng</span>
    </Badge>
  );
};
