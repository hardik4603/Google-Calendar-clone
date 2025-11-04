import React, { useState } from "react";
import Register from "./Register";
import Login from "./Login";

const AuthPage = () => {
  const [isLogin, setIsLogin] = useState(false);

  const toggleAuth = () => {
    setIsLogin((prev) => !prev);
  };

  return (
    <div className="auth-container">
      {isLogin ? (
        <Login onSwitch={toggleAuth} />
      ) : (
        <Register onSwitch={toggleAuth} />
      )}
    </div>
  );
};

export default AuthPage;