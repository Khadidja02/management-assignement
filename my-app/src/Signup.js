import {
  MDBBtn,
  MDBContainer,
  MDBRow,
  MDBCol,
  MDBCard,
  MDBCardBody,
  MDBInput,
  MDBIcon
} from 'mdb-react-ui-kit';
import './Log.css';
import React, { useState } from 'react';
import { useAuth } from './context/useAuth';
import { useNavigate } from 'react-router-dom';

const SignUp = () => {
    const [username, setUsername] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [passwordConfirm, setPasswordConfirm] = useState('');
    
    const { registerUser } = useAuth();
    const nav = useNavigate();
    
    const handleSignUp = async (e) => {
        e.preventDefault();
        
        if (password !== passwordConfirm) {
            alert('Passwords do not match');
            return;
        }
        
        try {
            const result = await registerUser(username, email, password, passwordConfirm);
            if (result.success) {
                nav('/login');  // Redirect to login
            } else {
                alert(result.message);  // Show error message (e.g., user already exists)
            }
        } catch (error) {
            console.error('Error during registration:', error);
            alert('There was an error. Please try again.');
        }
    };
    
    const handleNavigate = () => {
        nav('/login');
    };

    return (
        <MDBContainer fluid className='p-4 background-radial-gradient overflow-hidden'>
            <MDBRow>
                <MDBCol md='6' className='text-center text-md-start d-flex flex-column justify-content-center'>
                    <h1 className="my-5 display-3 fw-bold ls-tight px-3" style={{color: 'hsl(218, 81%, 95%)'}}>
                        The best offer <br />
                        <span style={{color: 'hsl(218, 81%, 75%)'}}>for your business</span>
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
                            <form onSubmit={handleSignUp}>
                                <MDBRow>
                                    <MDBCol col='6'>
                                        <MDBInput wrapperClass='mb-4' label='UserName' id='form1' type='text' 
                                            value={username}
                                            onChange={(e) => setUsername(e.target.value)}
                                            required />
                                    </MDBCol>
                                </MDBRow>
                                <MDBInput wrapperClass='mb-4' label='Email' id='form3' type='email' 
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    required />
                                <MDBInput wrapperClass='mb-4' label='Password' id='form4' type='password'  
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    required />
                                <MDBInput wrapperClass='mb-4' label='Confirm Password' id='form5' type='password'  
                                    value={passwordConfirm}
                                    onChange={(e) => setPasswordConfirm(e.target.value)}
                                    required />
                                
                                <MDBBtn className='w-100 mb-4' size='md'>Sign up</MDBBtn>
                            </form>
                            <div className="text-center">
                                <MDBBtn tag='a' color='none' className='mx-3' style={{ color: '#1266f1' }} onClick={handleNavigate}> Log In</MDBBtn>
                                <MDBBtn tag='a' color='none' className='mx-3' style={{ color: '#1266f1' }} onClick= {() => nav('/login')}>
                                    Log in With <MDBIcon fab icon='google' size="sm"/>
                                </MDBBtn>
                            </div>
                        </MDBCardBody>
                    </MDBCard>
                </MDBCol>
            </MDBRow>
        </MDBContainer>
    );
};

export default SignUp;
