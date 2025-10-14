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

interface errorIn {
  firstname?: string;
  lastname?: string;
  email?: string;
  password?: string;
  ph?: string;
  profile?: string;
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

  const [errors, setErrors] = useState<errorIn>({});
  const [errorPopup, setErrorPopup] = useState<boolean>(false);
  const navigate = useNavigate();

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
        ){
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

    setErrors((prev) => ({ ...prev, [name]: errorMsg }));
  };

  const inputhandler = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, files } = e.target;

    if (name === "profile" && files) {
      setData({ ...data, profile: files[0] });
      validateField(name, files[0]);
    } else {
      setData({ ...data, [name]: value });
      validateField(name, value);
    }
  };

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    Object.entries(data).forEach(([name, value]) => validateField(name, value));
    if (Object.values(errors).some((err) => err)) return;

    try {
      const formData = new FormData();
      formData.append("firstname", data.firstname);
      formData.append("lastname", data.lastname);
      formData.append("email", data.email);
      formData.append("password", data.password);
      formData.append("ph", data.ph);
      if (data.profile) formData.append("profile", data.profile);

      await axios.post("http://localhost:2000/api/register", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      navigate("/login");
    } catch {
      setErrorPopup(true);
    }
  };

  return (
    <div className="registerDiv">
      <h1>Register</h1>
      <form className="registerForm" onSubmit={submit}>
        <div>
          <input
            type="text"
            name="firstname"
            value={data.firstname}
            onChange={inputhandler}
            placeholder="First Name"
          />
          {errors.firstname && (
            <p style={{ color: "red" }}>{errors.firstname}</p>
          )}
        </div>
        <div>
          <input
            type="text"
            name="lastname"
            value={data.lastname}
            onChange={inputhandler}
            placeholder="Last Name"
          />
          {errors.lastname && <p style={{ color: "red" }}>{errors.lastname}</p>}
        </div>
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
        <div>
          <input
            type="number"
            name="ph"
            value={data.ph}
            onChange={inputhandler}
            placeholder="Phone"
          />
          {errors.ph && <p style={{ color: "red" }}>{errors.ph}</p>}
        </div>
        <div>
          <input type="file" name="profile" onChange={inputhandler} />
          {errors.profile && <p style={{ color: "red" }}>{errors.profile}</p>}
        </div>
        <button type="submit">Register</button>
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
                <h5 className="modal-title">Error</h5>
                <button
                  type="button"
                  className="btn-close"
                  onClick={() => setErrorPopup(false)}
                ></button>
              </div>
              <div className="modal-body">
                <p>An error occurred. Please try again.</p>
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

export default Register;
