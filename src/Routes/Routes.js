import React from 'react'
import {
    BrowserRouter as Router,
    Routes,
    Route
} from "react-router-dom";
import ProtectedRoutes from './ProtectedRoutes';
import Login from '../Components/Login/Login';
import Engineer from '../Components/Engineer/Engineer';
import Employee from '../Components/Employee/Employee';

const AllRoutes = () => {
    return (
        <>
            <Router>
                <Routes>
                    <Route exact path='/' element={<Login />} />

                    {/*******************Protected Routes******** */}
                    <Route path='/' element={<ProtectedRoutes />} >
                        <Route exact path='/dashboard' element={<Engineer />} />
                        <Route exact path='/dashboard1' element={<Employee />} />
                    </Route>
                </Routes>
            </Router>
        </>
    )
}

export default AllRoutes