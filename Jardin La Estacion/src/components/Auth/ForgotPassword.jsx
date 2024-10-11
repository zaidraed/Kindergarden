import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { forgotPassword } from "../../features/auth/authSlice";

const ForgotPassword = () => {
  const [email, setEmail] = useState("");
  const dispatch = useDispatch();
  const { error, status } = useSelector((state) => state.auth);

  const handleForgotPassword = async (e) => {
    e.preventDefault();
    dispatch(forgotPassword(email));
  };

  return (
    <div>
      <h2>Forgot Password</h2>
      <form onSubmit={handleForgotPassword}>
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Enter your email"
          required
        />
        <button type="submit" disabled={status === "loading"}>
          {status === "loading" ? "Sending..." : "Reset Password"}
        </button>
      </form>
      {error && <p className="error">{error.message || "An error occurred"}</p>}
      {status === "succeeded" && (
        <p className="success">Password reset email sent!</p>
      )}
    </div>
  );
};

export default ForgotPassword;
