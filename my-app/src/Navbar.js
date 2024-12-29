import React from "react";
import {
  MDBContainer,
  MDBNavbar,
  MDBNavbarBrand,
  MDBInputGroup,
  MDBBtn
} from "mdb-react-ui-kit";
import "./styling.css";
import { useAuth } from "./context/useAuth";


export default function Navbar() {
  
  const { user, logoutUser } = useAuth();
  
    const handleLogout = async (e) => {
      e.preventDefault();
      await logoutUser();
    };

  return (
    <MDBNavbar light bgColor="light">
      <MDBContainer fluid>
        <MDBNavbarBrand>
          <img
            src="https://media.licdn.com/dms/image/v2/D4E0BAQE3wuD_oCfvJw/company-logo_200_200/company-logo_200_200/0/1716394997353/sifartek_logo?e=2147483647&v=beta&t=tMJOukdWdpgDKaXoHoNH-3z1nH4ZLtSmcZjzWmXRMGo"
            height="50"
            alt="logo company"
            loading="lazy"
          />
          <span className="logo-name">Sifartek</span>
        </MDBNavbarBrand>
        <MDBInputGroup tag="form" className="d-flex w-auto mb-3">
        {user ? (
         <MDBBtn onClick={handleLogout}>Logout</MDBBtn> // Render the Logout button if user exists
         ) : null}
        </MDBInputGroup>
      </MDBContainer>
    </MDBNavbar>
  );
}
