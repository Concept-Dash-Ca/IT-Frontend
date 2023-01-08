import React from 'react'
import {
    BrowserRouter as Router,
    Routes,
    Route
} from "react-router-dom";
import ProtectedRoutes from './ProtectedRoutes';
import Login from '../Components/Login/Login';
import Engineer from '../Components/Engineer/Engineer';

const AllRoutes = () => {
    return (
        <>
            <Router>
                <Routes>
                    <Route exact path='/' element={<Login />} />

                    {/*******************Protected Routes******** */}
                        <Route exact path='/dashboard' element={<Engineer />} />
                    <Route path='/' element={<ProtectedRoutes />} >
                    </Route>
                </Routes>
            </Router>
        </>
    )
}

export default AllRoutes