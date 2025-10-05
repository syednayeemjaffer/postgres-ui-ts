import React from "react";
import "./App.css";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Register from "./auth/Register";
import Login from "./auth/Login";
import Home from "./component/Home";
import Productor from "./auth/Productor";
import Users from "./component/Users";
import Update from "./component/Update";
import Navbar from "./auth/Navbar";

function App() {
  return (
    <BrowserRouter>
    <Navbar/>
      <Routes>
        <Route path="/" element={<Productor component={Home} />} />
        <Route path="/register" element={<Register />} />
        <Route path="/login" element={<Login />} />
        <Route path="/home" element={<Productor component={Home} />} />
        <Route path="/users" element={<Productor component={Users} />} />
        <Route path="/update/:id" element={<Productor component={Update} />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
