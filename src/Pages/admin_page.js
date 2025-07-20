import React, { useState, useEffect } from "react";
import "bootstrap/dist/css/bootstrap.min.css"; // Ensure Bootstrap is imported
import "bootstrap/dist/js/bootstrap.bundle.min.js";
import "../styles/dashboard.css"; // Import the CSS file



import Admin_Menu from "../components_admin/admin_menu";
import Admin_Dashboard_Content from "../components_admin/admin_dashboard";
import Clients from "../components_admin/Clients";




{
  /*-----------------------------------*/
}
function Admin_Page() {
 
return(
    <div>
    
    <Admin_Menu>
        <Admin_Dashboard_Content />
    </Admin_Menu>




    </div>
  );
}

export default Admin_Page;


