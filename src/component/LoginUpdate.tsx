import axios from "axios";
import React, { useState, useEffect } from "react";
import { jwtDecode } from "jwt-decode";
import { useLocation, useNavigate } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";

// =============== INTERFACES ===============
interface UserData {
  firstname?: string;
  lastname?: string;
  ph?: string;
  email?: string;
  profile?: File | string;
}

interface ErrorData {
  firstname?: string;
  lastname?: string;
  email?: string;
  ph?: string;
  profile?: string;
}

interface PasswordData {
  oldPassword?: string;
  newPassword?: string;
  confirmPassword?: string;
}

// =============== LOGIN UPDATE COMPONENT ===============
export const LoginUpdate = () => {
  const [data, setData] = useState<UserData>({});
  const [errors, setErrors] = useState<ErrorData>({});
  const [id, setId] = useState<number | null>(null);
  const navigate = useNavigate();
  const nameregex = /^[A-Za-z\s]+$/;
  const emailregex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  useEffect(() => {
    const fetchUserData = async () => {
      const token = localStorage.getItem("token");
      if (!token) return navigate("/login");

      const decoded = jwtDecode<{ id: number }>(token);
      setId(decoded.id);

      const res = await axios.get(`http://localhost:2000/api/user/${decoded.id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      setData(res.data.user);
    };
    fetchUserData();
  }, [navigate]);

  const validateField = (name: string, value: any) => {
    let errorMsg = "";
    switch (name) {
      case "firstname":
        if (!value || value.length < 3 || value.length > 30 || !nameregex.test(value))
          errorMsg = "Invalid firstname";
        break;
      case "lastname":
        if (!value || value.length < 1 || value.length > 20 || !nameregex.test(value))
          errorMsg = "Invalid lastname";
        break;
      case "email":
        if (!value || !emailregex.test(value)) errorMsg = "Invalid email";
        break;
      case "ph":
        if (!value) errorMsg = "Phone is required";
        break;
      case "profile":
        if (value instanceof File) {
          if (!["image/jpeg", "image/jpg", "image/png"].includes(value.type))
            errorMsg = "Invalid file type";
          else if (value.size > 3 * 1024 * 1024) errorMsg = "Max 3MB allowed";
        }
        break;
    }
    setErrors((prev) => ({ ...prev, [name]: errorMsg }));
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, files } = e.target;
    if (name === "profile" && files) {
      setData({ ...data, profile: files[0] });
      validateField(name, files[0]);
    } else {
      setData({ ...data, [name]: value });
      validateField(name, value);
    }
  };

  const updateUser = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!id) return;

    const token = localStorage.getItem("token");
    const formData = new FormData();

    formData.append("firstname", data.firstname || "");
    formData.append("lastname", data.lastname || "");
    formData.append("ph", data.ph || "");
    formData.append("email", data.email || "");
    if (data.profile instanceof File) {
      formData.append("profile", data.profile);
    }

    await axios.put(`http://localhost:2000/api/update/${id}`, formData, {
      headers: { Authorization: `Bearer ${token}`, "Content-Type": "multipart/form-data" },
    });

    toast.success("User Updated Successfully");
    navigate("/");
  };

  return (
    <div className="user_Update">
      <h1>Update login user</h1>
      {typeof data.profile === "string" && (
        <img src={`http://localhost:2000/${data.profile}`} />
      )}

      <form onSubmit={updateUser} className="user_Update_form">
        <input name="firstname" onChange={handleChange} value={data.firstname || ""} placeholder="First name" />
        {errors.firstname && <p style={{ color: "red" }}>{errors.firstname}</p>}

        <input name="lastname" onChange={handleChange} value={data.lastname || ""} placeholder="Last name" />
        {errors.lastname && <p style={{ color: "red" }}>{errors.lastname}</p>}

        <input name="ph" onChange={handleChange} value={data.ph || ""} placeholder="Phone" />
        {errors.ph && <p style={{ color: "red" }}>{errors.ph}</p>}

        <input name="email" onChange={handleChange} value={data.email || ""} placeholder="Email" />
        {errors.email && <p style={{ color: "red" }}>{errors.email}</p>}

        <input name="profile" type="file" onChange={handleChange} />
        {errors.profile && <p style={{ color: "red" }}>{errors.profile}</p>}

        <button type="submit">Update User</button>
      </form>

      <a style={{ color: "blue", cursor: "pointer" }} onClick={() => navigate("/changePassword", { state: { id } })}>
        Want to Change password?
      </a>
    </div>
  );
};

// =============== CHANGE PASSWORD COMPONENT ===============
export const ChangePassword = () => {
  const navigate = useNavigate();
  const { state } = useLocation();
  const [data, setData] = useState<PasswordData>({});
  const [lengthError, setLengthError] = useState(false);
  const [mismatchError, setMismatchError] = useState(false);
  const id = state?.id;
  const token = localStorage.getItem("token");

  const passwordregex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?])[^\s]{6,20}$/;

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const updated = { ...data, [e.target.name]: e.target.value };
    setData(updated);

    if (e.target.name === "newPassword") {
      setLengthError(updated.newPassword?.length! < 6 || updated.newPassword?.length! > 20);
    }

    if (e.target.name === "confirmPassword") {
      setMismatchError(updated.newPassword !== updated.confirmPassword);
    }
  };

  const changePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!id) return;

    if (!data.oldPassword || !data.newPassword || !data.confirmPassword) {
      toast.error("All fields are required");
      return;
    }

    if (lengthError) {
      toast.error("Password must be 6-20 characters long");
      return;
    }

    if (mismatchError) {
      toast.error("New password and confirm password do not match");
      return;
    }

    if (!passwordregex.test(data.newPassword!)) {
      toast.error("New password must contain uppercase, lowercase, number, special character");
      return;
    }

    try {
      const res = await axios.put(
        `http://localhost:2000/api/changePassword/${id}`,
        { oldPassword: data.oldPassword, newPassword: data.newPassword },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      if (res.data.status) {
        toast.success(res.data.message);
        navigate("/");
      } else {
        toast.error(res.data.message);
      }
    } catch (err: any) {
      toast.error(err.response?.data?.message || "Server error");
    }
  };

  return (
    <div>
      <ToastContainer />
      <form onSubmit={changePassword}>
        <input name="oldPassword" type="password" onChange={handleChange} placeholder="Old password" />
        <input name="newPassword" type="password" onChange={handleChange} placeholder="New password" />
        {lengthError && <p style={{ color: "red" }}>Password must be 6-20 characters</p>}
        <input name="confirmPassword" type="password" onChange={handleChange} placeholder="Confirm password" />
        {mismatchError && <p style={{ color: "red" }}>Passwords do not match</p>}
        <button type="submit">Change Password</button>
      </form>
    </div>
  );
};
