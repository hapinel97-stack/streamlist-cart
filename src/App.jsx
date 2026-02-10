import { useEffect, useState } from "react";
import ProductList from "./components/ProductList";
import Cart from "./components/Cart";
import products from "./data/Data";

export default function App() {
  const [cart, setCart] = useState(() => {
    try {
      const stored = localStorage.getItem("cart");
      return stored ? JSON.parse(stored) : [];
    } catch {
      return [];
    }
  });

  useEffect(() => {
    localStorage.setItem("cart", JSON.stringify(cart));
  }, [cart]);

  const addToCart = (product) => {
    setCart((prevCart) => {
      const existing = prevCart.find((item) => item.id === product.id);

      if (existing) {
        return prevCart.map((item) => {
          if (item.id !== product.id) return item;
          const currentQty = Number(item.quantity) || 0;
          return { ...item, quantity: currentQty + 1 };
        });
      }

      return [...prevCart, { ...product, quantity: 1 }];
    });
  };

  const onIncrease = (id) => {
    setCart((prevCart) =>
      prevCart.map((item) => {
        if (item.id !== id) return item;
        const currentQty = Number(item.quantity) || 0;
        return { ...item, quantity: currentQty + 1 };
      })
    );
  };

  const onDecrease = (id) => {
    setCart((prevCart) =>
      prevCart.map((item) => {
        if (item.id !== id) return item;
        const currentQty = Number(item.quantity) || 1;
        return { ...item, quantity: Math.max(1, currentQty - 1) };
      })
    );
  };

  const onRemove = (id) => {
    setCart((prevCart) => prevCart.filter((item) => item.id !== id));
  };

  return (
    <div style={{ maxWidth: "1100px", margin: "0 auto", padding: "24px" }}>
      <h1>StreamList Cart System</h1>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "32px" }}>
        <ProductList products={products} onAddToCart={addToCart} />
        <Cart cart={cart} onIncrease={onIncrease} onDecrease={onDecrease} onRemove={onRemove} />
      </div>
    </div>
  );
}