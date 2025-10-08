import axios from "axios";
import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";

interface dataInt {
  email: string;
  password: string;
}

const Login = () => {
  const [data, setData] = useState<dataInt>({ email: "", password: "" });
  const navigate = useNavigate();

  const inputHandler = (e: React.ChangeEvent<HTMLInputElement>) => {
    setData({ ...data, [e.target.name]: e.target.value });
  };

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await axios.post("http://localhost:2000/api/login", data);
      localStorage.setItem("token", res.data.token);
      navigate("/");
    } catch (err: any) {
      alert(`Error occurred: ${err.message}`);
    }
  };

  return (
    <div className="loginDiv">
      <h1>Login</h1>
      <form className="loginForm" onSubmit={submit}>
        <input type="email" name="email" onChange={inputHandler} placeholder="Enter email" />
        <input type="password" name="password" onChange={inputHandler} placeholder="Enter password" />
        <button type="submit">Login</button>
      </form>
      <p>
        Don't have an account? <Link to="/register">Register</Link>
      </p>
    </div>
  );
};

export default Login;
