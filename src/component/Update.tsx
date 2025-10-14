import axios from "axios";
import React, { useState } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";

interface updateInt {
  firstname?: string;
  lastname?: string;
  email?: string;
  password?: string;
  ph?: string;
  profile?: File;
}

interface errorIn {
  firstname?: string;
  lastname?: string;
  email?: string;
  password?: string;
  ph?: string;
  profile?: string;
}

const Update = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const { state } = useLocation();

  const [update, setUpdate] = useState<updateInt>(state || {});
  const [errors, setErrors] = useState<errorIn>({});

  const nameregex = /^[A-Za-z\s]+$/;
  const emailregex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  const passwordregex =
    /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?])[^\s]{6,20}$/;

  const validateField = (name: string, value: any) => {
    let errorMsg = "";

    switch (name) {
      case "firstname":
        if (!value) errorMsg = "Firstname is required";
        else if (
          value.length < 3 ||
          value.length > 30 ||
          !nameregex.test(value)
        ) {
          errorMsg =
            "Firstname must contain only letters and be 3-30 characters";
        }

        break;
      case "lastname":
        if (!value) errorMsg = "Lastname is required";
        else if (
          value.length < 1 ||
          value.length > 20 ||
          !nameregex.test(value)
        )
          errorMsg =
            "Lastname must contain only letters and be 1-20 characters";
        break;
      case "email":
        if (!value) errorMsg = "Email is required";
        else if (!emailregex.test(value)) errorMsg = "Email is invalid";
        break;
      case "password":
        if (!value) errorMsg = "Password is required";
        else if (!passwordregex.test(value))
          errorMsg =
            "Password must have 1 uppercase, 1 lowercase, 1 number, 1 special character, 6-20 chars, no space";
        break;
      case "ph":
        if (!value) errorMsg = "Phone is required";
        break;
      case "profile":
        if (!value) errorMsg = "Profile image is required";
        else {
          const allowedTypes = ["image/jpeg", "image/jpg", "image/png"];
          if (!allowedTypes.includes(value.type))
            errorMsg = "Profile image must be jpeg, jpg, or png";
          if (value.size > 3 * 1024 * 1024)
            errorMsg = "Profile image must be less than 3MB";
        }
        break;
      default:
        break;
    }

    setErrors((pre) => ({ ...pre, [name]: errorMsg }));
  };

  const inputhandler = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, files } = e.target;
    if (name === "profile" && files) {
      setUpdate({ ...update, profile: files[0] });
      validateField(name, files[0]);
    } else {
      setUpdate({ ...update, [name]: value });
      validateField(name, value);
    }
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
      alert("The user us updated successfully");
      navigate("/users");
    } catch (err: any) {
      console.log(`error occured : ${err.message}`);
    }
  };

  return (
    <div>
      <h1>Update</h1>
      <form onSubmit={submit}>
        <input
          type="text"
          name="firstname"
          onChange={inputhandler}
          placeholder="First Name"
          value={update.firstname}
        />
        {errors.firstname && <p style={{ color: "red" }}>{errors.firstname}</p>}

        <input
          type="text"
          name="lastname"
          onChange={inputhandler}
          placeholder="Last Name"
          value={update.lastname}
        />

        {errors.lastname && <p style={{ color: "red" }}>{errors.lastname}</p>}

        <input
          type="email"
          name="email"
          onChange={inputhandler}
          placeholder="Email"
          value={update.email}
        />
        {errors.email && <p style={{ color: "red" }}>{errors.email}</p>}

        <input
          type="password"
          name="password"
          onChange={inputhandler}
          placeholder="Password"
          value={update.password}
        />
        {errors.password && <p style={{ color: "red" }}>{errors.password}</p>}

        <input
          type="number"
          name="ph"
          onChange={inputhandler}
          placeholder="Phone"
          value={update.ph}
        />
        {errors.ph && <p style={{ color: "red" }}>{errors.ph}</p>}

        <input type="file" name="profile" onChange={inputhandler} />
        {errors.profile && <p style={{ color: "red" }}>{errors.profile}</p>}

        <button type="submit">Update User</button>
      </form>
    </div>
  );
};

export default Update;
