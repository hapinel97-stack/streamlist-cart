import React from "react";
import CartItem from "./CartItem";

export default function Cart({ cart, onIncrease, onDecrease, onRemove }) {
  const total = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);

  return (
    <div>
      <h2>Cart</h2>

      {cart.length === 0 ? (
        <p>Your cart is empty.</p>
      ) : (
        <>
          {cart.map((item) => (
            <CartItem
              key={item.id}
              item={item}
              onIncrease={onIncrease}
              onDecrease={onDecrease}
              onRemove={onRemove}
            />
          ))}

          <hr />
          <div style={{ display: "flex", justifyContent: "flex-end", gap: "12px" }}>
            <strong>Total:</strong>
            <strong>${total.toFixed(2)}</strong>
          </div>
        </>
      )}
    </div>
  );
}