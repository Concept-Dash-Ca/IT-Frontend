import React, { useContext, useState,useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import AuthenticationContext from '../../Context/AuthContext';
import './Login.css'
import axios from 'axios';
import { HOST, LOGIN } from '../Constants/Constants';

const Login = () => {
  const navigate = useNavigate()
//   useEffect(() => {
//     const department = localStorage.getItem('department')
//     if(department) {
//       switch (department) {
//         case 'Admin':
//           navigate('/admin')
//           break;
//         case 'Engineer':
//           navigate('/engineers')
//           break;
//         case 'Manager':
//           navigate('/manager')
//           break;
//         default:
//           break;
//       }
//   }
  
    
//   }, [])
  
  
  const context = useContext(AuthenticationContext)
  const [username, setusername] = useState('')
  const [password, setpassword] = useState('')
  
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    await axios.post(HOST + LOGIN,{'username':username,'password':password}).then((res) => {
      if(res.data.error==="Email or Password is Incorrect") {
          alert('Incorrect Username or Password');
      } else {
        if(!res.data.success)
          alert('Something Went Wrong...')
      }
            console.log(res.data);
            localStorage.setItem('auth',res.data.auth)
            localStorage.setItem('department',res.data.user.department)
            localStorage.setItem('emailWork',res.data.user.emailWork)
            localStorage.setItem('employeeId',res.data.user.employeeId)
            switch (res.data.user.department) {
              case 'Team':
                navigate('/dashboard1')
                break;
              case 'Engineer':
                navigate('/engineers')
                break;
              case 'Manager':
                navigate('/dashboard')
                break;
              default:
                break;
            }}
          ).catch((err) => {
            console.log(err)
          })
    // navigate('/dashboard')
  }
  return (
    <>
      <div className='home container d-flex justify-content-center align-items-center'>
        <div className='main-body '>
          <div className='heading d-flex flex-row mb-5'>
            <h2 align="center" style={{ color: "white" }}>Login using Your Credentials</h2>
          </div>
          <form>
            <div className=" mb-4">
              <input type="text" className="form-control shadow-none input-home" id="inputEmail3" placeholder='Username' onChange={(e)=>{setusername(e.target.value)}} />
            </div>
            <div className=" mb-3">
              <input type="password" className="form-control shadow-none input-home" id="password" placeholder='Password' style={{ marginBottom : "4rem"}} onChange={(e)=>{setpassword(e.target.value)}}/>
            </div>
            <div className='d-flex flex-row justify-content-center my-1'>
              <button type="submit" className="btn btn-home" onClick={handleSubmit}>Login Here</button>
            </div>

          </form>
        </div>
      </div>
    </>
  )
}

export default Login