import React from 'react';
import { Package, CheckCircle2, Sparkles, AlertCircle, FolderTree } from 'lucide-react';
import type { AdminStats as AdminStatsType } from '../../types/index.js';

interface AdminStatsProps {
  stats: AdminStatsType | null;
  isLoading: boolean;
}

export const AdminStats: React.FC<AdminStatsProps> = ({ stats, isLoading }) => {
  if (isLoading || !stats) {
    return (
      <div className="grid grid-cols-2 lg:grid-cols-5 gap-4">
        {[1, 2, 3, 4, 5].map((i) => (
          <div key={i} className="bg-white p-5 rounded-2xl border border-stone-200 animate-pulse h-24" />
        ))}
      </div>
    );
  }

  const items = [
    {
      label: 'Tổng sản phẩm',
      value: stats.totalProducts,
      icon: Package,
      color: 'text-blue-600 bg-blue-50 border-blue-200',
    },
    {
      label: 'Đang hiển thị',
      value: stats.activeProducts,
      icon: CheckCircle2,
      color: 'text-emerald-600 bg-emerald-50 border-emerald-200',
    },
    {
      label: 'Ghim nổi bật',
      value: stats.featuredProducts,
      icon: Sparkles,
      color: 'text-amber-600 bg-amber-50 border-amber-200',
    },
    {
      label: 'Tạm hết hàng',
      value: stats.outOfStockProducts,
      icon: AlertCircle,
      color: 'text-rose-600 bg-rose-50 border-rose-200',
    },
    {
      label: 'Danh mục',
      value: stats.totalCategories,
      icon: FolderTree,
      color: 'text-purple-600 bg-purple-50 border-purple-200',
    },
  ];

  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
      {items.map((item, idx) => {
        const Icon = item.icon;
        return (
          <div
            key={idx}
            className="bg-white p-5 rounded-2xl border border-stone-200/80 shadow-xs flex items-center gap-4"
          >
            <div className={`p-3 rounded-xl border ${item.color} shrink-0`}>
              <Icon className="w-5 h-5" />
            </div>
            <div>
              <span className="text-xs text-stone-500 font-medium block">{item.label}</span>
              <span className="text-xl font-bold text-stone-900 font-serif">{item.value}</span>
            </div>
          </div>
        );
      })}
    </div>
  );
};
