import React, { useState } from 'react';
import { MDBInput, MDBBtn , MDBTextArea} from 'mdb-react-ui-kit';
import AsyncSelect from 'react-select/async';
import { createProjects, generate_summary } from './endpoints';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { DateRangePicker } from 'react-date-range';
import 'react-date-range/dist/styles.css'; // Main style file
import 'react-date-range/dist/theme/default.css'; //
import './design.css'


export default function CreateProject() {
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
  const [dateRange, setDateRange] = useState([
    {
      startDate: new Date(),
      endDate: new Date(),
      key: 'selection',
    },
  ]);
  const [summary, setSummary] = useState('');
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false); 
  const [responseMessage, setResponseMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false); 
  const navigate = useNavigate();

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleFileChange = (e) => {
    const { name, files } = e.target;
    setFormData({ ...formData, [name]: files[0] }); // Only save the first file
  };
  const handleDateChange = (ranges) => {
    const formatDate = (date) => {
      const d = new Date(date);
      const year = d.getFullYear();
      const month = String(d.getMonth() + 1).padStart(2, '0'); // Ensure two digits for the month
      const day = String(d.getDate()).padStart(2, '0');        // Ensure two digits for the day
      return `${year}-${month}-${day}`;                       // Return in YYYY-MM-DD format
    };
    setDateRange([ranges.selection]);
    setFormData({
      ...formData,
      start_date: formatDate(ranges.selection.startDate.toISOString()),
      end_date: formatDate(ranges.selection.endDate.toISOString()),
    });
  };
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
    const options = type === 'status' ? statusOptions : priorityOptions;
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
        setIsLoading(false)
      } else {
        setError(response.data.error || 'Failed to generate summary');
      }
    } catch (err) {
      setError('An error occurred while generating the summary.');
    }
  };

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
      !formData.description
    ) {
      setResponseMessage('Please fill in all required fields.');
      return;
    }

    setIsSubmitting(true);

    const data = new FormData();
    Object.keys(formData).forEach((key) => {
      if (formData[key] instanceof File) {
        data.append(key, formData[key]); // Add file inputs
      } else {
        data.append(key, formData[key]); // Add text inputs
      }
    });

    try {
      const token = localStorage.getItem('access_token');
      const response = await axios.post(createProjects, data, {
        withCredentials: true,
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'multipart/form-data',
        },
      });

      setResponseMessage('Project created successfully!');
      navigate('/project-dashboard');
    } catch (error) {
      const errorMessage =
        error.response?.data?.message || 'Failed to create project. Please try again.';
      setResponseMessage(errorMessage);
      console.error('Error submitting form:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className='First-Form'>
      <h2>Project Creation Form</h2>
      <form onSubmit={handleSubmit} className="form-project" >
        <MDBInput
          id="form4Example1"
          wrapperClass="mb-4"
          label="Title"
          name="title"
          value={formData.title}
          onChange={handleInputChange}
        />
        <MDBInput
          id="form4Example2"
          wrapperClass="mb-4"
          label="Category"
          name="category"
          value={formData.category}
          onChange={handleInputChange}
        />
        <AsyncSelect
          placeholder= 'Select Status'
          cacheOptions
          defaultOptions
          loadOptions={() => selectingOptions('status')}
          onChange={(option) => {
            setFormData({ ...formData, status: option.value });
          }}
        />
        <br></br>
        <AsyncSelect
          placeholder= 'Select Priority'
          cacheOptions
          defaultOptions
          loadOptions={() => selectingOptions('priority')}
          onChange={(option) => {
            setFormData({ ...formData, priority: option.value });
          }}
        />
        <br></br>
        <label>Select Project Dates:</label>
        <DateRangePicker
          ranges={dateRange}
          onChange={handleDateChange}
        />
        <br></br>
        <label>Project Logo:</label>
        <MDBInput
          id="image1"
          wrapperClass="mb-4"
          type="file"
          name="image1"
          onChange={handleFileChange}
        />
        <label>Project Image:</label>
        <MDBInput
          placeholder='Upload Project Image'
          id="image2"
          wrapperClass="mb-4"
          type="file"
          name="image2"
          onChange={handleFileChange}
        />
        <br></br>
        <MDBTextArea
          wrapperClass="mb-4"
          tag= "textarea"
          id="form4Example3"
          rows={10}
          
          label="Project Description"

          name="description"
          value={formData.description}
          onChange={handleInputChange}
        />
        <MDBBtn color='dark' type="button" className="mb-4" onClick={generateSummary} disabled={isLoading} >
        {isLoading ? 'Summarizing...' : 'Generate Summary'}
        </MDBBtn>
        {summary && <p><strong>Summary:</strong> {summary}</p>}
        {error && <p style={{ color: 'red' }}><strong>Error:</strong> {error}</p>}
        <div className='float-right'>

        <MDBBtn  type="submit" className="mb-4  "  disabled={isSubmitting}>
          {isSubmitting ? 'Submitting...' : 'Create Project'}
        </MDBBtn>
        <MDBBtn className='mb-4 ms-2' color='secondary' onClick={()=> {navigate('/project-dashboard')}}>
        Back
      </MDBBtn>

        </div>
        {responseMessage && <p>{responseMessage}</p>}
      </form>
    </div>
  );
}
