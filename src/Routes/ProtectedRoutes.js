import React, {useContext} from 'react'
import { Navigate, Outlet } from "react-router-dom";
import AuthContext from '../Context/AuthContext'

const ProtectedRoutes = (props) => {
  return (
    localStorage.getItem('auth') ? <Outlet /> : <Navigate to='/'/>
  )
}

export default ProtectedRoutes;