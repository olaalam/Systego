// src/components/pos/Cart.jsx

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

export default function Cart({ cartItems, onClearCart }) {
  const subTotal = cartItems.reduce((acc, item) => acc + item.price * item.quantity, 0);
  const tax = subTotal * 0.14; // Example tax rate

  return (
    <Card className="flex-1 min-h-[calc(100vh-100px)] flex flex-col">
      <CardHeader className="flex-row items-center justify-between p-4 border-b">
        <CardTitle>Order Details</CardTitle>
        <Button variant="outline" onClick={onClearCart} disabled={cartItems.length === 0}>
          Clear All Items ({cartItems.length})
        </Button>
      </CardHeader>

      <div className="grid grid-cols-4 text-xs font-medium text-muted-foreground p-4 border-b">
        <div>Item</div>
        <div className="text-center">Price</div>
        <div className="text-center">Quantity</div>
        <div className="text-right">Total</div>
      </div>
      
      <CardContent className="flex-1 overflow-auto p-4">
        {cartItems.length === 0 ? (
          <div className="text-center text-gray-500 mt-20">
            No items found for this order.
          </div>
        ) : (
          <div>
            {cartItems.map((item) => (
              <div key={item.id} className="grid grid-cols-4 text-sm items-center py-2 border-b last:border-b-0">
                <div className="truncate">{item.name}</div>
                <div className="text-center">{item.price} EGP</div>
                <div className="text-center">{item.quantity}</div>
                <div className="text-right">{(item.price * item.quantity).toFixed(2)} EGP</div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
      
      <div className="p-4 border-t">
        <div className="grid grid-cols-2 gap-2">
          <div className="text-sm font-medium">Sub Total</div>
          <div className="text-right">{subTotal.toFixed(2)} EGP</div>
          <div className="text-sm font-medium">Tax</div>
          <div className="text-right">{tax.toFixed(2)} EGP</div>
        </div>
        <div className="mt-4 pt-4 border-t flex justify-between items-baseline font-bold text-xl">
          <span>Amount To Pay:</span>
          <span className="text-green-600">{(subTotal + tax).toFixed(2)} EGP</span>
        </div>
        <Button className="w-full mt-4">
          Checkout
        </Button>
      </div>
    </Card>
  );
}