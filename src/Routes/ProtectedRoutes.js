import React from 'react'
import { Navigate, Outlet } from "react-router-dom";

const ProtectedRoutes = (props) => {
  return (
    localStorage.getItem('auth') ? <Outlet /> : <Navigate to='/'/>
  )
}

export default ProtectedRoutes;