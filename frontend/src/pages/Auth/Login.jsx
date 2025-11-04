import { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./Auth.scss";
import useApi from "../../hooks/useApi";
import { useAuth } from "../../context/AuthContext";

const Login = ({ onSwitch }) => {
  const navigate = useNavigate();
  const api = useApi();
  const { login } = useAuth();

  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const data = await api("/user/login", "POST", formData, false, true);
    if (data) {
      login(data);
      navigate("/calendar");
    } else {
      alert("Invalid credentials");
    }
  };

  return (
    <div className="auth-card">
      <h1 className="auth-title">Login</h1>

      <form className="auth-form" onSubmit={handleSubmit}>
        <div className="form-group">
          <label>Email</label>
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            required
          />
        </div>

        <div className="form-group">
          <label>Password</label>
          <input
            type="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
            required
          />
        </div>

        <button type="submit" className="btn-primary">
          Login
        </button>

        <p className="auth-link">
          Don’t have an account?{" "}
          <button type="button" onClick={onSwitch} className="auth-switch-btn">
            Register
          </button>
        </p>
      </form>
    </div>
  );
};

export default Login;