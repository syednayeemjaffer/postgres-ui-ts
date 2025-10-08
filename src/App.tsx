import React from "react";
import "./App.css";
import "react-quill/dist/quill.snow.css";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Register from "./auth/Register";
import Login from "./auth/Login";
import Home from "./component/Home";
import Productor from "./auth/Productor";
import Users from "./component/Users";
import Update from "./component/Update";
import Navbar from "./auth/Navbar";
import Post from "./component/Post";
import UpdatePost from "./component/UpdatePost";
import "react-quill/dist/quill.snow.css";

function App() {
  const token = localStorage.getItem("token");

  return (
    <BrowserRouter>
      <Navbar />
      <Routes>
        <Route path="/" element={<Productor component={Home} />} />
        <Route
          path="/login"
          Component={Login}
        />
        <Route
          path="/register"
          Component={Register}
        />
        <Route path="/home" element={<Productor component={Home} />} />
        <Route path="/users" element={<Productor component={Users} />} />
        <Route path="/update/:id" element={<Productor component={Update} />} />
        <Route path="/post" element={<Productor component={Post} />} />
        <Route path="/postUpdate/:id" element={<Productor component={UpdatePost}/>} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
