import React from "react";
import { Navigate } from "react-router-dom";

interface componentInt {
  component: React.ComponentType;
}

const Productor = ({ component: Component }: componentInt) => {
  const token:string | null = localStorage.getItem("token");

  if (!token) {
    return <Navigate to="/login" replace />;
  }

  return <Component />;
};

export default Productor;
