import axios from "axios";
import React, { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

interface updateInt {
  firstname: string | null;
  lastname: string | null;
  email: string | null;
  password: string | null;
  ph: string | null;
  profile: File | null;
}

const Update = () => {
  const [update, setUpdate] = useState<updateInt>({ firstname: null, lastname: null, email: null, password: null, ph: null, profile: null });
  const navigate = useNavigate();
  const { id } = useParams();

  const inputhandler = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, files } = e.target;
    if (name === "profile" && files) setUpdate({ ...update, profile: files[0] });
    else setUpdate({ ...update, [name]: value });
  };

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await axios.put(`http://localhost:2000/api/update/${id}`, update, {
        headers: {
          "Content-Type": "multipart/form-data",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });
      navigate("/users");
    } catch (err: any) {
      console.log(`error occured : ${err.message}`);
    }
  };

  return (
    <div>
      <h1>Update</h1>
      <form onSubmit={submit}>
        <input type="text" name="firstname" onChange={inputhandler} placeholder="First Name" />
        <input type="text" name="lastname" onChange={inputhandler} placeholder="Last Name" />
        <input type="email" name="email" onChange={inputhandler} placeholder="Email" />
        <input type="password" name="password" onChange={inputhandler} placeholder="Password" />
        <input type="number" name="ph" onChange={inputhandler} placeholder="Phone" />
        <input type="file" name="profile" onChange={inputhandler} />
        <button type="submit">Update User</button>
      </form>
    </div>
  );
};

export default Update;
