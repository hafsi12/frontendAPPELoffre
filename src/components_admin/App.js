import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom"
import Login from "./components/Login"
import ProtectedRoute from "./components/ProtectedRoute"
import Navbar from "./components/Navbar"
import Admin_Dashboard_Content from "./components/Admin_Dashboard_Content"
import Clients from "./components/Clients"
import Opportunite from "./components/Opportunite"
import Offre from "./components/Offre"
import ContractManagement from "./components/ContractManagement"
import authService from "./services/authService"
import PermissionDebugger from "./components/PermissionDebugger"

function App() {
  return (
    <Router>
      <div className="App">
        <Navbar />
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route
            path="/admin"
            element={
              <ProtectedRoute>
                <Admin_Dashboard_Content />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/clients"
            element={
              <ProtectedRoute requiredPermission="clients">
                <Clients />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/opportunities"
            element={
              <ProtectedRoute requiredPermission="opportunities">
                <Opportunite />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/offers"
            element={
              <ProtectedRoute requiredPermission="offers">
                <Offre />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/contracts"
            element={
              <ProtectedRoute requiredPermission="contracts">
                <ContractManagement />
              </ProtectedRoute>
            }
          />
          <Route
            path="/"
            element={
              authService.isAuthenticated() ? <Navigate to="/admin" replace /> : <Navigate to="/login" replace />
            }
          />
        </Routes>
        <PermissionDebugger />
      </div>
    </Router>
  )
}

export default App
