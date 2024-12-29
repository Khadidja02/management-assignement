import React, { useEffect, useState } from 'react';
import { MDBInput, MDBBtn, MDBTextArea } from 'mdb-react-ui-kit';
import AsyncSelect from 'react-select/async';
import { editProjects, viewProjects, generate_summary } from './endpoints';
import {useNavigate, useParams} from 'react-router-dom';
import axios from 'axios';
import { DateRangePicker } from 'react-date-range';
import 'react-date-range/dist/styles.css'; // Main style file
import 'react-date-range/dist/theme/default.css'; //
import './design.css'  


export default function EditProject() {
  const [formData, setFormData] = useState({
    title: '',
    category: '',
    status: '',
    priority: '',
    description: '',
    start_date: '',
    end_date: '',
    image1: null,
    image2: null,
  });

  const navigate = useNavigate();
  const {id} = useParams();
  const [project, setProject] = useState(null);
  const [summary, setSummary] = useState('');
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [responseMessage, setResponseMessage] = useState('');

  const [dateRange, setDateRange] = useState([
      {
        startDate: new Date(),
        endDate: new Date(),
        key: 'selection',
      },
    ]);
  

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleFileChange = (e) => {
    const { name, files } = e.target;
    setFormData({ ...formData, [name]: files[0] }); // Only save the first file
  };
  const handleDateChange = (ranges) => {
    setDateRange([ranges.selection]);
    setFormData({
      ...formData,
      start_date: ranges.selection.startDate.toISOString(),
      end_date: ranges.selection.endDate.toISOString(),
    })};
  
  const statusOptions = [
    { value: 'Not Started', label: 'Not Started' },
    { value: 'In Progress', label: 'In Progress' },
    { value: 'Completed', label: 'Completed' },
  ];

  const priorityOptions = [
    { value: 'High', label: 'High' },
    { value: 'Medium', label: 'Medium' },
    { value: 'Low', label: 'Low' },
  ];

  const selectingOptions = (type) => {
    console.log(`Loading options for: ${type}`);
    const options = type === 'status' ? statusOptions : priorityOptions;
    console.log(options);  // Log the options to check them
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve(options);
      }, 1000);
    });
  };
  const generateSummary = async () => {
    try {
      const response = await axios.post(generate_summary, {description: formData.description });

      if (response.status === 200) {
        setSummary(response.data.summary);
        setFormData({ ...formData, description: response.data.summary });
      } else {
        setError(response.data.error || 'Failed to generate summary');
      }
    } catch (err) {
      setError('An error occurred while generating the summary.');
    }
  };
  useEffect (() => {
    const fetchProjectPrevdata = async ()=> {
    try {
      const response = await axios.get(viewProjects(id),{withCredentials: true});
      console.log(response);

      const result = response.data;
      setProject(result);
      setFormData((prevData) => ({
        ...prevData,
        title: result.title || '',
        category: result.category || '',
        status: result.status || '',
        priority: result.priority || '',
        description: result.description || '',
        start_date: result.start_date || '',
        end_date: result.end_date || '',
        image1: result.image1 || null,
        image2: result.image2 || null,
      }));
    } catch (error) {
      setResponseMessage('Failed to fetch project. Please try again.');
      console.error('Error fetching:', error);
    } 
};
    fetchProjectPrevdata();}, [id]);


  const handleSubmit = async (e) => {
    e.preventDefault();

    // Basic validation for required fields
    if (
        !formData.title || 
        !formData.category || 
        !formData.status || 
        !formData.priority ||
        !formData.start_date || 
        !formData.end_date || 
        !formData.description) {
      setResponseMessage('Please fill in all required fields.');
      return;
    }
   
      

    setIsSubmitting(true);
    const token = localStorage.getItem('access_token'); 

    // Create a FormData object to send files and other data
    const data = new FormData();
    Object.keys(formData).forEach((key) => {
      if (formData[key] instanceof File) {
        data.append(key, formData[key]); // Add file inputs
      } else {
        data.append(key, formData[key]); // Add text inputs
      }
    });

    
    

  try{
    const token = localStorage.getItem('access_token');
    const response = await axios.put(editProjects(id),data,{ withCredentials: true ,
      headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "multipart/form-data", }// Required for FormData
    });
    setResponseMessage('project edited successfully');
    navigate('/project-dashboard');
    }catch {
        setResponseMessage('Failed to edit project. Please try again.');
    }finally{
        setIsSubmitting(false);
    }

 };

  return (
    <div className='First-Form'>
      <h2>Project Editing</h2>
      <form onSubmit={handleSubmit} className='form-project'>
        
        <MDBInput
          id='form4Example1'
          wrapperClass='mb-4'
          label='Title'
          name='title'
          value={formData.title}
          onChange={handleInputChange}
        />
        
        <MDBInput
          id='form4Example2'
          wrapperClass='mb-4'
          label='Category'
          name='category'
          value={formData.category}
          onChange={handleInputChange}
        />
        Project Status:
        <AsyncSelect
          cacheOptions
          defaultOptions
          loadOptions={() => selectingOptions('status')}
          onChange={(option) => {
            console.log('Selected Status:', option);
            setFormData({ ...formData, status: option.value });
          }}
          value={formData.status ? { value: formData.status, label: formData.status } : null}
        /><br></br>
        <label>Project Priority:</label>
        <AsyncSelect
          cacheOptions
          defaultOptions
          loadOptions={() => selectingOptions('priority')}
          onChange={(option) => {
            console.log('Selected Priority:', option);
            setFormData({ ...formData, priority: option.value })
            ;
          }}
          value={formData.priority ? { value: formData.priority, label: formData.priority } : null}
        />
        <br></br>
        <label>Select Project Dates:</label>
                <DateRangePicker
                          ranges={dateRange}
                          onChange={handleDateChange}
                        />
        <label>Project Logo:</label>
        <MDBInput
          id='image1'
          wrapperClass='mb-4'
          type='file'
          name='image1'
          onChange={handleFileChange}
        />
        <label>Project Image:</label>
        <MDBInput
          id='image2'
          wrapperClass='mb-4'
          type='file'
          name='image2'
          onChange={handleFileChange}
        />

        <MDBTextArea 
          wrapperClass='mb-4'
          tag= 'textarea'
          id='form4Example3'
          rows={10}
          label='Message'
          name='description'
          value={formData.description}
          onChange={handleInputChange}
        />
        <MDBBtn color='dark' type="button" className="mb-4" onClick={generateSummary}>
              Generate Summary
          </MDBBtn>
          {summary && <p><strong>Summary:</strong> {summary}</p>}
          {error && <p style={{ color: 'red' }}><strong>Error:</strong> {error}</p>}
          <div className='float-right'>
        <MDBBtn type='submit' className='mb-4'  disabled={isSubmitting}>
          {isSubmitting ? 'Submitting...' : 'update Project'}
        </MDBBtn>
        <MDBBtn className='mb-4 ms-2' color='secondary' onClick={()=> {navigate('/project-dashboard')}}>
                Back
              </MDBBtn></div>
        {responseMessage && <p>{responseMessage}</p>}
      </form>
    </div>
  );
}
