import React, {useState, useEffect} from 'react';
import axios from 'axios';
import {Link, useNavigate} from 'react-router-dom';
import { MDBBadge, MDBBtn, MDBTable, MDBTableHead, MDBTableBody,MDBModal, MDBModalDialog,MDBModalContent,MDBModalHeader,
MDBModalTitle,MDBModalBody,MDBModalFooter,MDBDropdown, MDBDropdownMenu,
MDBDropdownToggle, MDBDropdownItem} from 'mdb-react-ui-kit';
import { projectList, deleteProject, viewProjects, exportProject } from './endpoints';
import './styling.css'
import { AiOutlineDelete } from "react-icons/ai";
import { BiDotsVerticalRounded } from "react-icons/bi";
import ProjectView from './ProjectView';
import EmailPopUp from './EmailPopUp';
import { useAuth } from "./context/useAuth";



function ProjectListing() {
  const [projects, setProjects]= useState([]);
  const [showModel, setShowModal]= useState(false);
  const [openModal, setOpenModal] = useState(false);
  const [selectedProject, setSelectedProject] = useState(null);
  const [loading, setLoading] = useState(true);
  const [projectDeleting, setProjectDelting]= useState(null);
  const [openPopUpId, setOpenPopUp]= useState (null);
  const navigate = useNavigate();

  const { user, logoutUser } = useAuth();

  

  useEffect(() => {
   

    axios.get(projectList, { withCredentials: true }
    )
    .then((response)=>{
      setProjects(response.data.projects)
      console.log(response.data.projects)}
    )
    
    .catch((error) => {
      console.error('Error fetching projects',error);}
    )
    .finally(() => {
      setLoading(false);
      });
  }, []);

  const handleClickDelete = (project) => {
    setProjectDelting(project);
    setShowModal(true);

  };
  const handleCancelModel = () => {
    setShowModal(false);
    setProjectDelting(null);
  }

  const handleConfirmDeleting =() => {
    axios.delete(deleteProject(projectDeleting.id), { withCredentials: true })
    .then((response) =>{
      setProjects(projects.filter(project => project.id !== projectDeleting.id))
      handleCancelModel();
      setShowModal(false);
      setProjectDelting(null);
    } )
    .catch((error) => {
      console.error('Error deleting project', error);
    });


  }
  const exportDetailsToPdf= async(projectId) => {
    const response = (exportProject(projectId));
    window.location.href =response;
  };
  const openViewModal = async (projectId) => {
    setLoading(true);
    try {
      const project = await axios.get(viewProjects(projectId),{ withCredentials: true })
      console.log("Selected project:", project.data); 
      setSelectedProject(project.data);
      setOpenModal(true);
    } catch (err) {
      console.log("Failed to load project details. Please try again later.");
    } finally {
      setLoading(false);
    }
  };
  const closeViewModal = ()=> {
    setOpenModal(false);
    setSelectedProject(null);
  }

  const handleOpenPopUp = (projectId) => {
    setOpenPopUp(projectId);
  }
  const handleClosePop = () =>{
    setOpenPopUp(false);
  }

  
 
const handleCreate = () =>{
  navigate('/create-project');
}

  if (loading) {
    return <div>Loading...</div>;
  }


    
  return (
    <div className="container">
      <div>
      <h3>Project Listing</h3>
      
      <div className="d-grid gap-2 d-md-flex justify-content-md-end">
      <MDBBtn className='btn-create' onClick={handleCreate}> + Create New Project</MDBBtn>
    </div>
      

      </div>
    <MDBTable align='middle' className='tbl-list'>
      <MDBTableHead className='tbl-head'>
        <tr>
          <th scope='col'>Title</th>
          <th scope='col'>Status</th>
          <th scope='col'>Start Date</th>
          <th scope='col'>Category</th>
          <th scope='col'>Priority</th>
          <th scope='col' style={{ textAlign : 'center' }}>Actions</th>
        </tr>
      </MDBTableHead>
      
      <MDBTableBody>
      {projects.length > 0 ? (
        projects.map((project) => {

          
          return(
        <tr key={project.id} >
          

          <td>
            <p className='fw-normal mb-1'>{project.title}</p>
          </td>
          <td>
            <MDBBadge color='success' pill>
              {project.status}
            </MDBBadge>
          </td>
          <td>{project.start_date}</td>
          
          <td>{project.category}</td>
          <td>{project.priority}</td>
          <td className='actions-fields'>
            <MDBBtn color='link' rounded size='sm' onClick={() => navigate(`/edit-project/${project.id}`)}>
              Edit
            </MDBBtn>
            <AiOutlineDelete  onClick={() => handleClickDelete(project)}/>
            <MDBDropdown>
            <MDBDropdownToggle className='btn-dropdown' style={{ cursor: 'pointer' }}>
              <BiDotsVerticalRounded className='icon-dots'/>
          </MDBDropdownToggle>
              <MDBDropdownMenu>
                <MDBDropdownItem link onClick={()=> openViewModal(project.id)}>View</MDBDropdownItem>
                <MDBDropdownItem link onClick={()=> exportDetailsToPdf(project.id)}>Export as PDF</MDBDropdownItem>
                <MDBDropdownItem link onClick={() =>handleOpenPopUp (project.id)}>Send on Email</MDBDropdownItem>
              </MDBDropdownMenu>
            </MDBDropdown>

            


          </td>
        </tr>
        
          
        );
      })
    ) : (
      <tr>
        <td colSpan="8" className="text-center">
          No projects created.
        </td>
      </tr>
    )}
      </MDBTableBody>
       
    </MDBTable>
    {/*deleting model */}
    <MDBModal open={showModel} onClose={handleCancelModel} tabIndex="-1">
        <MDBModalDialog>
          <MDBModalContent>
            <MDBModalHeader>
              <MDBModalTitle>Confirm Deletion</MDBModalTitle>
              <MDBBtn className="btn-close" color="none" onClick={handleCancelModel}></MDBBtn>
            </MDBModalHeader>
            <MDBModalBody>
              Are you sure you want to delete the project: <strong>{projectDeleting ? projectDeleting.title : ''}</strong>?
            </MDBModalBody>

            <MDBModalFooter>
              <MDBBtn color="secondary" onClick={handleCancelModel}>
                Cancel
              </MDBBtn>
              <MDBBtn color="danger" onClick={handleConfirmDeleting}>
                Confirm
              </MDBBtn>
            </MDBModalFooter>
          </MDBModalContent>
        </MDBModalDialog>
      </MDBModal>
      <ProjectView project={selectedProject} isOpen= {openModal} isClose= {closeViewModal} />
      {openPopUpId && (
      <EmailPopUp emailprojectId={openPopUpId} closepop={handleClosePop}/>)}
    </div>
      );
}
export default ProjectListing;