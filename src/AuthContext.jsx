import { createContext, useContext, useState } from "react";

const API = "https://fsa-jwt-practice.herokuapp.com";

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [token, setToken] = useState(null);
  const [location, setLocation] = useState("GATE");

  // SIGNUP function: register the user and receive a token
  async function signup(username) {
    try {
      const response = await fetch(`${API}/signup`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ username }),
      });

      if (!response.ok) {
        throw new Error("Signup failed");
      }

      const data = await response.json();
      setToken(data.token);
      setLocation("TABLET"); // Move to the tablet page
    } catch (error) {
      console.error("Signup error:", error);
      alert("Signup failed. Please try again.");
    }
  }

  // AUTHENTICATE function: verify the token
  async function authenticate() {
    if (!token) {
      throw new Error("No token found");
    }

    try {
      const response = await fetch(`${API}/authenticate`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error("Authentication failed");
      }

      const data = await response.json();
      console.log("Authenticated:", data);
      setLocation("TUNNEL"); // Move to the tunnel page
    } catch (error) {
      console.error("Authentication error:", error);
      alert("Authentication failed. Your token may be invalid.");
    }
  }

  const value = {
    location,
    token,
    signup,
    authenticate,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) throw Error("useAuth must be used within an AuthProvider");
  return context;
}