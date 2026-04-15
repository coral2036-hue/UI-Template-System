import type { Category } from '../types';
import { CATEGORIES } from '../constants/categories';

interface CategoryPillBarProps {
  selectedCategory: Category;
  onCategorySelect: (cat: Category) => void;
}

export default function CategoryPillBar({ selectedCategory, onCategorySelect }: CategoryPillBarProps) {
  return (
    <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-hide" role="tablist" aria-label="카테고리 선택">
      {CATEGORIES.map((cat) => (
        <button
          key={cat.id}
          role="tab"
          aria-selected={selectedCategory === cat.id}
          onClick={() => onCategorySelect(cat.id)}
          className={`text-[13px] rounded-[20px] px-4 py-2 border whitespace-nowrap transition-all shrink-0
            ${selectedCategory === cat.id
              ? 'bg-brq-accent text-white border-brq-accent'
              : 'bg-brq-white text-brq-gray-700 border-brq-border hover:bg-brq-gray-50'
            }`}
        >
          {cat.label}
        </button>
      ))}
    </div>
  );
}
