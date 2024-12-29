
import './App.css';
import { Routes, Route } from 'react-router-dom';
import ProjectListing from './Projectlisting';
import Navbar from './Navbar';
import CreateProject from './CreateProject';
import EditProject from './EditProject';
import Login from './Login';
import { AuthProvider } from './context/useAuth';
import SignUp from './Signup';
import PrivateRoute from './components/PrivateRoute';




function App() {
  return (
    <>
   
  
   <AuthProvider>
    <Navbar/>
   <Routes>
   <Route path="/" element={<Login/>} />

   <Route path="login" element={<Login/>} />
   <Route path="register" element={<SignUp/>} />
   
   
    
    <Route path='project-dashboard' element= {<PrivateRoute><ProjectListing/></PrivateRoute> }/>
    <Route path='edit-project/:id' element= {<PrivateRoute><EditProject/></PrivateRoute>}/>
    <Route path='create-project' element= {<PrivateRoute><CreateProject/></PrivateRoute>} />
    
   </Routes>
   </AuthProvider>
   </>
  );
}

export default App;
