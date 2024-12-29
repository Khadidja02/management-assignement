import axios from 'axios';

const THE_BACKEND_DOMAIN = process.env.THE_BACKEND

export const CLIENT_IDS= '559543224720-lpt298m3ppqn3mb4gpda237npc9cm9kq.apps.googleusercontent.com';

export const projectList= `${THE_BACKEND_DOMAIN}projects/`; 
export const createProjects= `${THE_BACKEND_DOMAIN}create-project/`; 
export const editProjects = (id) => `${THE_BACKEND_DOMAIN}${id}/edit/`;
export const viewProjects = (id) => `${THE_BACKEND_DOMAIN}${id}/details/`;
export const deleteProject = (id) => `${THE_BACKEND_DOMAIN}${id}/delete/`;
export const exportProject = (id) => `${THE_BACKEND_DOMAIN}export-pdf/${id}/`;
export const sendEmail = (id) => `${THE_BACKEND_DOMAIN}send-email/${id}/`;
export const generate_summary =`${THE_BACKEND_DOMAIN}generate-summary/`;
export const googleLog =`${THE_BACKEND_DOMAIN}api/auth/google-login/`;

export const CLIENT_DS = '559543224720-lpt298m3ppqn3mb4gpda237npc9cm9kq.apps.googleusercontent.com';
const LOGIN_URL = `${THE_BACKEND_DOMAIN}login/`
const REGISTER_URL = `${THE_BACKEND_DOMAIN}register/`
const LOGOUT_URL = `${THE_BACKEND_DOMAIN}logout/`
const AUTHENTICATED_URL = `${THE_BACKEND_DOMAIN}authenticated/`



export const login = async (username, password) => {
  try {
      const response = await axios.post(
          LOGIN_URL, 
          { username, password },  // Object shorthand for cleaner syntax
          { withCredentials: true }  // Ensures cookies are included
      );
      
      // Check if the response contains a success attribute (depends on backend response structure)
      return response.data
  } catch (error) {
      console.error("Login failed:", error);
      return false;  // Return false or handle the error as needed
  }
};
export const logout = async () => {
  const response = await axios.post(LOGOUT_URL,{}, { withCredentials: true });
  return response.data;
};

export const register = async (username, email, password) => {
  const response = await axios.post(REGISTER_URL, {username, email, password}, { withCredentials: true });
  return response.data;
};

export const authenticated_user = async () => {
  const response = await axios.get(AUTHENTICATED_URL, { withCredentials: true}
   );
  return response.data
}
