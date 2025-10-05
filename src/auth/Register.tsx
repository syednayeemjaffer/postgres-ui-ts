import axios from "axios";
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

interface inputIn {
  firstname: string;
  lastname: string;
  email: string;
  password: string;
  ph: string;
  profile: File | null;
}

const Register = () => {
  const [data, setData] = useState<inputIn>({
    firstname: "",
    lastname: "",
    email: "",
    password: "",
    ph: "",
    profile: null,
  });
  const navigate = useNavigate();

  const inputhandler = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, files } = e.target;
    if (name === "profile" && files) {
      setData({ ...data, profile: files[0] });
    } else {
      setData({ ...data, [name]: value });
    }
  };

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const formData = new FormData();
      formData.append("firstname", data.firstname);
      formData.append("lastname", data.lastname);
      formData.append("email", data.email);
      formData.append("password", data.password);
      formData.append("ph", data.ph);
      if (data.profile) {
        formData.append("profile", data.profile);
      }
      await axios.post("http://localhost:2000/api/register", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      navigate("/login");
    } catch (err) {
      alert("Error occurred");
    }
  };

  return (
    <div className="registerDiv">
      <h1>Register</h1>
      <form className="registerForm" onSubmit={submit}>
        <input type="text" name="firstname" onChange={inputhandler} placeholder="First Name" />
        <input type="text" name="lastname" onChange={inputhandler} placeholder="Last Name" />
        <input type="email" name="email" onChange={inputhandler} placeholder="Email" />
        <input type="password" name="password" onChange={inputhandler} placeholder="Password" />
        <input type="number" name="ph" onChange={inputhandler} placeholder="Phone" />
        <input type="file" name="profile" onChange={inputhandler} />
        <button type="submit">Register</button>
      </form>
    </div>
  );
};

export default Register;
