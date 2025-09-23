// src/components/pos/Categories.jsx

import { useState } from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { categories } from './mockData';

export default function Categories({ onSelectCategory }) {
  const [activeCategory, setActiveCategory] = useState('All');

  const handleCategoryClick = (categoryName) => {
    setActiveCategory(categoryName);
    onSelectCategory(categoryName);
  };

  return (
    <div className="flex space-x-4 overflow-x-auto pb-4">
      {categories.map((category) => (
        <Card
          key={category.id}
          className={`flex-shrink-0 cursor-pointer ${
            activeCategory === category.name ? 'border-primary' : ''
          }`}
          onClick={() => handleCategoryClick(category.name)}
        >
          <CardContent className="p-4 flex flex-col items-center">
            <span className="text-2xl">{category.icon}</span>
            <span className="mt-1 text-sm">{category.name}</span>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}