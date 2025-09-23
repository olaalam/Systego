// src/components/pos/PosLayout.jsx

import { useState } from 'react';
import Cart from "./Cart";
import Categories from "./Categories";
import Products from "./Products";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

export default function PosLayout() {
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [cartItems, setCartItems] = useState([]);
  const [showCart, setShowCart] = useState(false); // New state to manage view

  const handleAddToCart = (product) => {
    setCartItems(prevItems => {
      const existingItem = prevItems.find(item => item.id === product.id);
      if (existingItem) {
        return prevItems.map(item =>
          item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item
        );
      }
      return [...prevItems, { ...product, quantity: 1 }];
    });
  };

  const handleClearCart = () => {
    setCartItems([]);
  };

  return (
    <div className="flex flex-col lg:flex-row gap-4 p-4">
      {/* Mobile view toggle buttons */}
      <div className="flex lg:hidden justify-between w-full mb-4">
        <Button 
          variant={!showCart ? "default" : "outline"} 
          className="w-1/2 mr-2"
          onClick={() => setShowCart(false)}>
          Products
        </Button>
        <Button 
          variant={showCart ? "default" : "outline"} 
          className="w-1/2 ml-2"
          onClick={() => setShowCart(true)}>
          Cart ({cartItems.length})
        </Button>
      </div>

      {/* Cart Section - Conditionally rendered based on screen size and state */}
      <div className={`${showCart ? 'w-full' : 'hidden'} lg:w-1/2 lg:flex flex-col`}>
        <Cart cartItems={cartItems} onClearCart={handleClearCart} />
      </div>

      {/* Products Section - Conditionally rendered based on screen size and state */}
      <div className={`${!showCart ? 'w-full' : 'hidden'} lg:w-1/2 lg:flex flex-col`}>
        {/* Categories Section */}
        <div className="p-4 bg-white rounded-lg shadow-md mb-6">
            <h2 className="text-xl font-semibold mb-3">Select Category</h2>
            <Categories onSelectCategory={setSelectedCategory} />
        </div>

        {/* Products Grid */}
        <div className="flex-1 overflow-y-auto [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden p-4 bg-white rounded-lg shadow-md">
            <div className="flex items-center w-[70%] md:w-full justify-between mb-4">
                <h2 className="text-xl font-semibold">Select Product</h2>
                <Input type="text" placeholder="Search by product " className="w-1/2" />
            </div>
            <Products selectedCategory={selectedCategory} onAddToCart={handleAddToCart} />
        </div>
      </div>
    </div>
  );
}