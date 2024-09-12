import React from 'react'
import '../../styles/LandingPage.css';
import { useNavigate } from "react-router-dom";
import { useState } from 'react';
import { loginUser } from '../../redux/authSlice'
import { useDispatch } from 'react-redux';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const LoginPage = () => {
    const navigate = useNavigate();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const dispatch = useDispatch();

    const ErrorToastStyle = {
      background: 'red',
      color: 'white',
      fontSize: '16px',
      borderRadius: '8px',
    };
    const ErrorProgressStyle = {
      background: 'red',
    };

    const errorNotify = (message) => toast(message, {
      toastStyle: ErrorToastStyle,
      progressBar: true,
      progressStyle: ErrorProgressStyle,
      progressClassName: 'toast-progress'
    });
  
    const handleLogin = async (e) => {
        e.preventDefault(); // Prevent the default form submission
        const resultAction = await dispatch(loginUser({ email, password }));
  
        if (loginUser.fulfilled.match(resultAction)) {
            if (resultAction.payload.success === true) {
                navigate('/users'); // Redirect to users page on successful login
            } else {
                console.log(resultAction.payload.success || 'Login failed');
                setTimeout(() => {
                  errorNotify(resultAction.payload.message)
                }, 2000);
            }
        } else {
            console.log(resultAction.error.message);
            navigate('/'); // Redirect to login page
        }
    };
  
    return (
      <>
      <ToastContainer />
      <div className="container-fluid landing-page">
        <div className="row">
          <div className="col-lg-6"></div>
  
          <div className="col-lg-6 d-flex align-items-center justify-content-center right-side">
            <div className="form-2-wrapper">
              <h2 className="text-center mb-4" style={{ color: "whitesmoke" }}>Sign-In to your account</h2>
              <form onSubmit={handleLogin}>
                <div className="mb-3 form-box">
                  <input type="email" className="form-control" id="email" name="email" placeholder="Enter Your Email" onChange={(e) => setEmail(e.target.value)} required/>
                </div>
                <div className="mb-3">
                  <input type="password" className="form-control" id="password" name="password" placeholder="Enter Your Password" onChange={(e) => setPassword(e.target.value)} required/>
                </div>
                <button type="submit" className="btn btn-outline-secondary login-btn w-100 mb-3">Login</button>
  
              </form>
  
            </div>
          </div>
        </div>
      </div>
      </>
    );
}

export default LoginPage
