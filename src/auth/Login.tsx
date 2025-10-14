import axios from "axios";
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

interface LoginInput {
  email: string;
  password: string;
}

interface ErrorInput {
  email?: string;
  password?: string;
}

const Login = () => {
  const [data, setData] = useState<LoginInput>({
    email: "",
    password: "",
  });

  const [errors, setErrors] = useState<ErrorInput>({});
  const [errorPopup, setErrorPopup] = useState<boolean>(false);
  const navigate = useNavigate();

  const emailregex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  const passwordregex =
    /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?])[^\s]{6,20}$/;

  const validateField = (name: string, value: string) => {
    let errorMsg = "";

    if (name === "email") {
      if (!value) errorMsg = "Email is required";
      else if (!emailregex.test(value)) errorMsg = "Invalid email format";
    }

    if (name === "password") {
      if (!value) errorMsg = "Password is required";
      else if (!passwordregex.test(value))
        errorMsg =
          "Password must have 1 uppercase, 1 lowercase, 1 number, 1 special character, 6-20 chars, no space";
    }

    setErrors((prev) => ({ ...prev, [name]: errorMsg }));
  };

  const inputhandler = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setData({ ...data, [name]: value });
    validateField(name, value);
  };

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    validateField("email", data.email);
    validateField("password", data.password);
    if (Object.values(errors).some((err) => err)) return;

    try {
      const res = await axios.post("http://localhost:2000/api/login", data);
      localStorage.setItem("token", res.data.token);
      navigate("/home");
    } catch {
      setErrorPopup(true);
    }
  };

  return (
    <div className="loginDiv">
      <h1>Login</h1>
      <form className="loginForm" onSubmit={submit}>
        <div>
          <input
            type="email"
            name="email"
            value={data.email}
            onChange={inputhandler}
            placeholder="Email"
          />
          {errors.email && <p style={{ color: "red" }}>{errors.email}</p>}
        </div>
        <div>
          <input
            type="password"
            name="password"
            value={data.password}
            onChange={inputhandler}
            placeholder="Password"
          />
          {errors.password && <p style={{ color: "red" }}>{errors.password}</p>}
        </div>
        <button type="submit">Login</button>
      </form>

      {errorPopup && (
        <div
          className="modal fade show d-flex align-items-center justify-content-center"
          tabIndex={-1}
          style={{ backgroundColor: "rgba(0,0,0,0.5)" }}
        >
          <div className="modal-dialog modal-dialog-centered">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">Login Failed</h5>
                <button
                  type="button"
                  className="btn-close"
                  onClick={() => setErrorPopup(false)}
                ></button>
              </div>
              <div className="modal-body">
                <p>Invalid email or password. Please try again.</p>
              </div>
              <div className="modal-footer">
                <button
                  type="button"
                  className="btn btn-secondary"
                  onClick={() => setErrorPopup(false)}
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Login;
