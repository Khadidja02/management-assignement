import React, { useState } from 'react';
import {
  MDBBtn,
  MDBModal,
  MDBModalDialog,
  MDBModalContent,
  MDBModalHeader,
  MDBModalTitle,
  MDBModalBody,
  MDBModalFooter,
  MDBInput,
} from 'mdb-react-ui-kit';
import axios from 'axios';
import { sendEmail } from './endpoints';

const EmailPopUp = ({ emailprojectId, closepop }) => {
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);


  const handleSendEmail = async () => {
    setIsLoading(true);
    setMessage('');
    try {
      //const csrfTokenElement = document.querySelector('[name=csrfmiddlewaretoken]');
      //if (csrfTokenElement) {
       // console.log(csrfTokenElement);
      //} else {
       // console.error('CSRF token element not found');
      //}
      //const csrfToken = csrfTokenElement.value
      const response = await axios.post(sendEmail(emailprojectId), {
        receiver_email: email,
      },{headers: {
        'Content-Type': 'application/json',  
        //'X-CSRFToken': csrfToken,// Make sure the Content-Type is set to JSON
      }},);
      console.log(response);
      setMessage('Project details sent successfully!');
    } catch (error) {
      setMessage('Error: ' + (error.response?.data?.error || 'An unknown error occurred'));
      console.log(error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <MDBModal open={true} onClose={closepop} tabIndex='-1'>
        <MDBModalDialog centered>
          <MDBModalContent>
            <MDBModalHeader>
              <MDBBtn className='btn-close' color='none' onClick={closepop}></MDBBtn>
            </MDBModalHeader>
            <MDBModalBody>
              <MDBInput
                label='Recipient Email'
                type='email'
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
              {message && <p>{message}</p>}
            </MDBModalBody>
            <MDBModalFooter>
              <MDBBtn color='secondary' onClick={closepop}>
                Close
              </MDBBtn>
              <MDBBtn onClick={handleSendEmail} disabled={isLoading || !email}>
                {isLoading ? 'Sending...' : 'Send'}
              </MDBBtn>
            </MDBModalFooter>
          </MDBModalContent>
        </MDBModalDialog>
      </MDBModal>
    </>
  );
};

export default EmailPopUp;
