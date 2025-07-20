import React from "react";
import Home from "./components_admin/home";
import Login from "./components_admin/login";
import Admin_Menu from "./components_admin/admin_menu";
import Clients from "./components_admin/Clients";
import Admin_Page from "./Pages/admin_page";
import OpportunityDetails from "./components_admin/OpportunityDetails"
import { BrowserRouter, Routes, Route } from 'react-router-dom'

function App() {
  return (
    <>
            <BrowserRouter>
                <Routes>
                    <Route path="/" element={<Home/>} />
                    <Route path="login" element={<Login/>} />
                    <Route path="admin" element={<Admin_Page/>} />
                    <Route path="/opportunity/1" element={<OpportunityDetails />} />

                </Routes>
            </BrowserRouter>
        </>
  );
}

export default App;




