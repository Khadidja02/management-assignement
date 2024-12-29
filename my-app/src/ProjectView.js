import React from 'react';
import {
  MDBBtn,
  MDBModal,
  MDBModalDialog,
  MDBModalContent,
  MDBModalHeader,
  MDBModalTitle,
  MDBModalBody,
  MDBModalFooter,
} from 'mdb-react-ui-kit'
import './view.css'

function ProjectView({project, isOpen, isClose}) {
  const Backend= 'http://localhost:8000/'
  return (
    <div>
       <MDBModal open={isOpen} isClose={isClose} tabIndex="-1">
      <MDBModalDialog scrollable>
        <MDBModalContent>
          <MDBModalHeader className='head-details'>
            
            
          {project?.image1 && <img src={`${Backend}${project.image1}`} alt="Logo Project"  className='logo-image'/>}
          <MDBModalTitle className='ms-2'>Project Details</MDBModalTitle>
          <MDBBtn
              className="btn-close"
              color="none"
              onClick={isClose}
            ></MDBBtn>
    </MDBModalHeader>
          
          <MDBModalBody>
          {project ? (
            <div>
            <h5>{project.title} :</h5>
            <p>
              {project.description }
            </p>
            
            <p>
              <strong>Start Date:</strong> {project.start_date}
            </p>
            <p>
              <strong>End Date:</strong> {project.end_date}
            </p>
            <p><strong>Project Status:</strong> {project.status} </p>
            <p><strong>Project Priority:</strong> {project.priority} </p>
            <p><strong>Project category:</strong> {project.category} </p>
            {project?.image1 && <img src={`${Backend}${project.image2}`} alt="Project Image" className='projectImage' />}

            </div>
            ) : (
              <p>Loading project details...</p>
            )}
            
          </MDBModalBody>
          
          <MDBModalFooter>
            <MDBBtn color="secondary" onClick={isClose}>
              Close
            </MDBBtn>
          </MDBModalFooter>
        </MDBModalContent>
      </MDBModalDialog>
    </MDBModal>
    </div>
  )
}

export default ProjectView
