import React from 'react';

interface RichTextProps {
  content?: string | null;
  className?: string;
}

export const RichText: React.FC<RichTextProps> = ({ content, className = '' }) => {
  if (!content) return null;

  // Helper to parse inline markdown (**bold**, *italic*)
  const formatInline = (text: string) => {
    const parts = text.split(/(\*\*.*?\*\*|\*.*?\*)/g);
    return parts.map((part, index) => {
      if (part.startsWith('**') && part.endsWith('**')) {
        return (
          <strong key={index} className="font-bold text-stone-900">
            {part.slice(2, -2)}
          </strong>
        );
      }
      if (part.startsWith('*') && part.endsWith('*')) {
        return (
          <em key={index} className="italic text-stone-700">
            {part.slice(1, -1)}
          </em>
        );
      }
      return part;
    });
  };

  const lines = content.split('\n');

  return (
    <div className={`space-y-2 text-stone-700 text-xs sm:text-sm leading-relaxed ${className}`}>
      {lines.map((line, idx) => {
        const trimmed = line.trim();
        if (!trimmed) {
          return <div key={idx} className="h-1.5" />;
        }

        // Heading 3: ### Title
        if (trimmed.startsWith('### ')) {
          return (
            <h4 key={idx} className="font-bold text-amber-900 text-sm sm:text-base pt-2.5 font-serif">
              {formatInline(trimmed.replace(/^###\s+/, ''))}
            </h4>
          );
        }

        // Heading 2: ## Title
        if (trimmed.startsWith('## ')) {
          return (
            <h3 key={idx} className="font-bold text-amber-900 text-base sm:text-lg pt-3 font-serif border-b border-amber-100 pb-1">
              {formatInline(trimmed.replace(/^##\s+/, ''))}
            </h3>
          );
        }

        // Numbered list: 1. Item or 2. Item
        const numberedMatch = trimmed.match(/^(\d+)\.\s+(.*)$/);
        if (numberedMatch) {
          const num = numberedMatch[1];
          const text = numberedMatch[2];
          return (
            <div key={idx} className="flex items-start gap-2.5 pl-1 py-0.5">
              <span className="w-5 h-5 rounded-full bg-amber-100 border border-amber-300 text-amber-900 text-[11px] font-black flex items-center justify-center shrink-0 mt-0.5">
                {num}
              </span>
              <div className="flex-1 text-stone-700">
                {formatInline(text)}
              </div>
            </div>
          );
        }

        // Bullet list: - Item or * Item
        if (trimmed.startsWith('- ') || trimmed.startsWith('* ')) {
          return (
            <div key={idx} className="flex items-start gap-2 pl-2 py-0.5">
              <span className="w-1.5 h-1.5 rounded-full bg-amber-600 shrink-0 mt-2" />
              <div className="flex-1 text-stone-700">
                {formatInline(trimmed.replace(/^[-*]\s+/, ''))}
              </div>
            </div>
          );
        }

        // Normal paragraph
        return (
          <p key={idx} className="leading-relaxed">
            {formatInline(trimmed)}
          </p>
        );
      })}
    </div>
  );
};
