import React from "react";
import "./App.css";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Register from "./auth/Register";
import Login from "./auth/Login";
import Home from "./component/Home";
import Productor from "./auth/Productor";
import Users from "./component/Users";
import Update from "./component/Update";
import Navbar from "./auth/Navbar";

function App() {
  const token = localStorage.getItem("token");

  return (
    <BrowserRouter>
      <Navbar />
      <Routes>
        <Route path="/" element={<Productor component={Home} />} />
        <Route
          path="/login"
          element={!token ? <Login /> : <Navigate to="/home" replace />}
        />
        <Route
          path="/register"
          element={!token ? <Register /> : <Navigate to="/home" replace />}
        />
        <Route path="/home" element={<Productor component={Home} />} />
        <Route path="/users" element={<Productor component={Users} />} />
        <Route path="/update/:id" element={<Productor component={Update} />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
