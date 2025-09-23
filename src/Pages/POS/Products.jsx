// src/components/pos/Products.jsx

import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { products } from './mockData';

export default function Products({ selectedCategory, onAddToCart }) {
  const filteredProducts = selectedCategory === 'All'
    ? products
    : products.filter(p => p.categoryId === products.find(c => c.name === selectedCategory)?.categoryId);

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 w-[70%] md:w-full gap-4 mt-6">
      {filteredProducts.map((product) => (
        <Card key={product.id} className="group overflow-hidden relative">
          <img src={product.image} alt={product.name} className="w-full h-32 object-cover transition-transform duration-300 group-hover:scale-105" />
          <CardContent className="p-3 text-center">
            <h3 className="font-semibold text-sm truncate">{product.name}</h3>
            <p className="text-xs text-muted-foreground">Description</p>
            <p className="font-bold text-red-500 mt-1">{product.price} EGP</p>
          </CardContent>
          <CardFooter className="p-3 pt-0">
            <Button className="w-full text-xs" onClick={() => onAddToCart(product)}>
              Add to Order
            </Button>
          </CardFooter>
        </Card>
      ))}
    </div>
  );
}