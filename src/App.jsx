import { useEffect, useMemo, useState } from "react";
import { GoogleLogin } from "@react-oauth/google";
import {
  Navigate,
  Route,
  Routes,
  useLocation,
  useNavigate,
} from "react-router-dom";

import ProductList from "./components/ProductList";
import Cart from "./components/Cart";
import products from "./data/Data";

function formatCardNumber(value) {
  // Keep digits only, max 16, and insert spaces every 4 digits
  const digitsOnly = value.replace(/\D/g, "").slice(0, 16);
  return digitsOnly.replace(/(.{4})/g, "$1 ").trim();
}

function isValidCardNumberFormatted(value) {
  return /^\d{4}\s\d{4}\s\d{4}\s\d{4}$/.test(value);
}

function ProtectedRoute({ isAuthed, children }) {
  const location = useLocation();

  if (!isAuthed) {
    return <Navigate to="/login" replace state={{ from: location.pathname }} />;
  }

  return children;
}

function LoginPage({ onLoginSuccess }) {
  const navigate = useNavigate();
  const location = useLocation();

  const from = location.state?.from || "/shop";

  return (
    <div style={{ maxWidth: "700px", margin: "0 auto", padding: "48px" }}>
      <h1>StreamList</h1>
      <p>Please sign in with Google to access the application.</p>

      <div style={{ marginTop: "16px" }}>
        <GoogleLogin
          onSuccess={(credentialResponse) => {
            onLoginSuccess(credentialResponse);
            navigate(from, { replace: true });
          }}
          onError={() => {
            alert("Google sign-in failed. Please try again.");
          }}
        />
      </div>
    </div>
  );
}

function ShopPage({
  cart,
  onLogout,
  onAddToCart,
  onIncrease,
  onDecrease,
  onRemove,
}) {
  const navigate = useNavigate();

  const cartCount = useMemo(
    () => cart.reduce((sum, item) => sum + (Number(item.quantity) || 0), 0),
    [cart]
  );

  return (
    <div style={{ maxWidth: "1100px", margin: "0 auto", padding: "24px" }}>
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          gap: "12px",
        }}
      >
        <div>
          <h1 style={{ margin: 0 }}>StreamList Cart System</h1>
          <div style={{ opacity: 0.8, marginTop: "6px" }}>
            Items in cart: {cartCount}
          </div>
        </div>

        <button onClick={onLogout} style={{ height: "40px" }}>
          Log out
        </button>
      </div>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "1fr 1fr",
          gap: "32px",
          marginTop: "16px",
          alignItems: "start",
        }}
      >
        <ProductList products={products} onAddToCart={onAddToCart} />

        <div>
          <Cart
            cart={cart}
            onIncrease={onIncrease}
            onDecrease={onDecrease}
            onRemove={onRemove}
          />

          <div style={{ marginTop: "16px" }}>
            <button
              onClick={() => navigate("/checkout")}
              disabled={cart.length === 0}
              style={{ width: "100%", height: "44px" }}
            >
              Checkout
            </button>
            <div style={{ opacity: 0.8, marginTop: "8px", fontSize: "14px" }}>
              Checkout is enabled once at least one item is in the cart.
            </div>
          </div>
        </div>
      </div>

      <p style={{ marginTop: "16px", opacity: 0.8 }}>
        Refresh the page to confirm the cart persists using localStorage.
      </p>
    </div>
  );
}

function CheckoutPage() {
  const navigate = useNavigate();
  const [cardName, setCardName] = useState(() => {
    try {
      return localStorage.getItem("cc_name") || "";
    } catch {
      return "";
    }
  });

  const [cardNumber, setCardNumber] = useState(() => {
    try {
      return localStorage.getItem("cc_number") || "";
    } catch {
      return "";
    }
  });

  const [message, setMessage] = useState("");

  useEffect(() => {
    try {
      localStorage.setItem("cc_name", cardName);
      localStorage.setItem("cc_number", cardNumber);
    } catch {
      // ignore
    }
  }, [cardName, cardNumber]);

  const handleSave = () => {
    if (!cardName.trim()) {
      setMessage("Please enter the name on the card.");
      return;
    }

    if (!isValidCardNumberFormatted(cardNumber)) {
      setMessage("Card number must be in the format 1234 5678 9012 3456.");
      return;
    }

    setMessage("Saved to localStorage successfully.");
  };

  return (
    <div style={{ maxWidth: "700px", margin: "0 auto", padding: "24px" }}>
      <h1>Checkout</h1>
      <p>Enter your credit card information to complete checkout.</p>

      <div style={{ marginTop: "16px" }}>
        <label style={{ display: "block", marginBottom: "6px" }}>
          Name on Card
        </label>
        <input
          value={cardName}
          onChange={(e) => setCardName(e.target.value)}
          placeholder="John Smith"
          style={{ width: "100%", height: "40px", padding: "8px" }}
        />
      </div>

      <div style={{ marginTop: "16px" }}>
        <label style={{ display: "block", marginBottom: "6px" }}>
          Card Number (Format: 1234 5678 9012 3456)
        </label>
        <input
          value={cardNumber}
          onChange={(e) => setCardNumber(formatCardNumber(e.target.value))}
          placeholder="1234 5678 9012 3456"
          inputMode="numeric"
          style={{ width: "100%", height: "40px", padding: "8px" }}
        />
      </div>

      <div style={{ display: "flex", gap: "12px", marginTop: "16px" }}>
        <button onClick={() => navigate("/shop")} style={{ height: "40px" }}>
          Back
        </button>
        <button onClick={handleSave} style={{ height: "40px" }}>
          Save Card
        </button>
      </div>

      {message ? (
        <p style={{ marginTop: "12px" }}>{message}</p>
      ) : (
        <p style={{ marginTop: "12px", opacity: 0.8 }}>
          Card details are stored in localStorage for this assignment.
        </p>
      )}
    </div>
  );
}

export default function App() {
  // Auth state (simple gate for this assignment)
  const [user, setUser] = useState(() => {
    try {
      const stored = localStorage.getItem("user");
      return stored ? JSON.parse(stored) : null;
    } catch {
      return null;
    }
  });

  // Cart state (persisted)
  const [cart, setCart] = useState(() => {
    try {
      const stored = localStorage.getItem("cart");
      return stored ? JSON.parse(stored) : [];
    } catch {
      return [];
    }
  });

  // Persist cart
  useEffect(() => {
    localStorage.setItem("cart", JSON.stringify(cart));
  }, [cart]);

  // Persist auth
  useEffect(() => {
    if (user) localStorage.setItem("user", JSON.stringify(user));
    else localStorage.removeItem("user");
  }, [user]);

  const onLoginSuccess = (credentialResponse) => {
    setUser({
      loggedIn: true,
      credential: credentialResponse?.credential || null,
      loggedInAt: new Date().toISOString(),
    });
  };

  const onLogout = () => setUser(null);

  const onAddToCart = (product) => {
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
    <Routes>
      <Route
        path="/"
        element={<Navigate to={user ? "/shop" : "/login"} replace />}
      />

      <Route
        path="/login"
        element={<LoginPage onLoginSuccess={onLoginSuccess} />}
      />

      <Route
        path="/shop"
        element={
          <ProtectedRoute isAuthed={!!user}>
            <ShopPage
              cart={cart}
              onLogout={onLogout}
              onAddToCart={onAddToCart}
              onIncrease={onIncrease}
              onDecrease={onDecrease}
              onRemove={onRemove}
            />
          </ProtectedRoute>
        }
      />

      <Route
        path="/checkout"
        element={
          <ProtectedRoute isAuthed={!!user}>
            <CheckoutPage />
          </ProtectedRoute>
        }
      />

      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}