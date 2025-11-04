import { useState } from "react";
import { useNavigate } from "react-router-dom";
import useApi from "../../hooks/useApi";
import { useAuth } from "../../context/AuthContext";
import "./Auth.scss";

const Register = ({ onSwitch }) => {
  const navigate = useNavigate();
  const api = useApi();
  const { login } = useAuth();

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const data = await api("/user/signup", "POST", formData, false, true);
    if (data) {
      login(data);
      navigate("/calendar");
    }
  };

  return (
    <div className="auth-card">
      <h1 className="auth-title">Create Account</h1>

      <form className="auth-form" onSubmit={handleSubmit}>
        <div className="form-group">
          <label>Name</label>
          <input
            name="name"
            value={formData.name}
            onChange={handleChange}
            required
          />
        </div>

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
          Register
        </button>

        <p className="auth-link">
          Already have an account?{" "}
          <button type="button" onClick={onSwitch} className="auth-switch-btn">
            Login
          </button>
        </p>
      </form>
    </div>
  );
};

export default Register;