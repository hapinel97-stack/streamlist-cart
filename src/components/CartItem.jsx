import React from "react";

export default function CartItem({ item, onIncrease, onDecrease, onRemove }) {
  return (
    <div style={{ display: "flex", gap: "12px", alignItems: "center", marginBottom: "10px" }}>
      <div style={{ flex: 1 }}>
        <strong>{item.name}</strong>
        <div>${item.price.toFixed(2)}</div>
      </div>

      <div style={{ display: "flex", gap: "8px", alignItems: "center" }}>
        <button onClick={() => onDecrease(item.id)} disabled={item.quantity <= 1}>
          -
        </button>
        <span>{item.quantity}</span>
        <button onClick={() => onIncrease(item.id)}>+</button>
      </div>

      <div style={{ width: "90px", textAlign: "right" }}>
        ${(item.price * item.quantity).toFixed(2)}
      </div>

      <button onClick={() => onRemove(item.id)}>Remove</button>
    </div>
  );
}