import {
  MDBBtn,
  MDBContainer,
  MDBRow,
  MDBCol,
  MDBCard,
  MDBCardBody,
  MDBInput,
  MDBIcon
}
from 'mdb-react-ui-kit';
import React, { useState } from "react";
import { useAuth } from './context/useAuth';
import { useNavigate } from 'react-router-dom';
import './Log.css';
import { CLIENT_DS } from './endpoints';
import { GoogleOAuthProvider, GoogleLogin } from "@react-oauth/google";




const  Login =() => {
  

    const [username, setUsername] = useState('')
    const [password, setPassword] = useState('')

    const { loginUser, googleLoginUser } = useAuth();
    const nav = useNavigate();

    
    const handleLogin = async (e) => {
        e.preventDefault();
        await loginUser(username, password)
    }
    const handleLoginSuccess = async (response) => {
      const token = response.credential;
      console.log("token:",token)
      if (token) {
        googleLoginUser(token); // Pass the Google token to the context
      } else {
        alert('Google login failed');
      }
      
    };
    const handleLoginFailure = (error) => {
      console.error("Google login failed:", error);
    };
    const handleNavigate = () => {
        nav('/register')
    }
    
  return (
    <GoogleOAuthProvider clientId={CLIENT_DS}>
    <MDBContainer fluid className='p-4 background-radial-gradient overflow-hidden'>

      <MDBRow>

        <MDBCol md='6' className='text-center text-md-start d-flex flex-column justify-content-center'>

          <h1 className="my-5 display-3 fw-bold ls-tight px-3" style={{color: 'hsl(218, 81%, 95%)'}}>
            The best Management Platform <br />
            <span style={{color: 'hsl(218, 81%, 75%)'}}>for your Project</span>
          </h1>

          <p className='px-3' style={{color: 'hsl(218, 81%, 85%)'}}>
            Lorem ipsum dolor sit amet consectetur adipisicing elit.
            Eveniet, itaque accusantium odio, soluta, corrupti aliquam
            quibusdam tempora at cupiditate quis eum maiores libero
            veritatis? Dicta facilis sint aliquid ipsum atque?
          </p>

        </MDBCol>

        <MDBCol md='6' className='position-relative'>

          <div id="radius-shape-1" className="position-absolute rounded-circle shadow-5-strong"></div>
          <div id="radius-shape-2" className="position-absolute shadow-5-strong"></div>

          <MDBCard className='my-5 bg-glass'>
            <MDBCardBody className='p-5'>

              <form onSubmit={handleLogin}>

              <MDBInput wrapperClass='mb-4' label='UserName' id='form3'  type="text" value={username} 
              onChange={(e) => setUsername(e.target.value)} required/>

              <MDBInput wrapperClass='mb-4' label='Password' id='form4' type='password' value={password}
              onChange={(e) => setPassword(e.target.value)} required/>


              <MDBBtn  className='w-100 mb-4' size='md' type='submit'>Login</MDBBtn>

              </form>

              <div className="text-center">

                <MDBBtn tag='a' color='none' className='mx-3' style={{ color: '#1266f1' }} onClick={handleNavigate}> Sign Up</MDBBtn>

                
                  <GoogleLogin
                    
                    onSuccess={handleLoginSuccess}
                    onError={handleLoginFailure}
                    />
                    
                    

                

              </div>

            </MDBCardBody>
          </MDBCard>

        </MDBCol>

      </MDBRow>

    </MDBContainer>
    </GoogleOAuthProvider>
  );
}

export default Login;