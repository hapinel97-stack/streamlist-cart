import React from "react";

export default function ProductList({ products, onAddToCart }) {
  return (
    <div>
      <h2>Available Products</h2>

      {products.map((product) => (
        <div key={product.id} style={{ marginBottom: "10px" }}>
          <span>
            {product.name} - ${product.price.toFixed(2)}
          </span>
          <button
            style={{ marginLeft: "10px" }}
            onClick={() => onAddToCart(product)}
          >
            Add to Cart
          </button>
        </div>
      ))}
    </div>
  );
}