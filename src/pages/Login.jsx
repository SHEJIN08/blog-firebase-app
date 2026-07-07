import { useState } from "react";
import { auth, googleProvider } from "../firebase";
import { signInWithEmailAndPassword, signInWithPopup } from "firebase/auth";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

export function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigation = useNavigate();

  const handleAuthError = (error) => {
    switch (error.code) {
      case "auth/invalid-email":
        toast.error("Please enter a valid email address.");
        break;
      case "auth/invalid-credential":
        toast.error("Incorrect email or password.");
        break;
      case "auth/missing-password":
        toast.error("Please enter your password.");
        break;
      case "auth/popup-closed-by-user":
        toast.warning("Google sign-in was cancelled.");
        break;
      default:
        toast.error("Login failed. Please try again.");
    }
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      await signInWithEmailAndPassword(auth, email, password);
      toast.success("Welcome back!");
      navigation("/");
    } catch (err) {
      handleAuthError(err);
    }
  };

  const handleGoogleLogin = async () => {
    try {
      await signInWithPopup(auth, googleProvider);
      toast.success("Logged in with Google!");
      navigation("/");
    } catch (err) {
      handleAuthError(err);
    }
  };

  return (
    <form onSubmit={handleLogin} noValidate>
      <h2>Login</h2>
      <input
        type="email"
        placeholder="Email"
        onChange={(e) => setEmail(e.target.value)}
        required
      />
      <input
        type="password"
        placeholder="Password"
        onChange={(e) => setPassword(e.target.value)}
        required
      />
      <button type="submit">Login with Email</button>

      <hr
        style={{
          margin: "15px 0",
          border: "none",
          borderTop: "1px solid #ccc",
        }}
      />

      <button type="button" onClick={handleGoogleLogin} className="google">
        Sign in with Google
      </button>
    </form>
  );
}
