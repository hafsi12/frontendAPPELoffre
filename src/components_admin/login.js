import React from "react";
import "../styles/login.css"; // Import the CSS file
import { Link } from "react-router-dom";


function Login() {
  return (
    <div>
      <nav class="navbar navbar-expand-lg navbar-light bg-white border-bottom border-gray shadow-sm">
        <div class="container-fluid bb">
          {/* logo */}

          <a class="navbar-brand" href="#">
            <img src="1.png" alt="Terragis" height="60"></img>
          </a>

          {/* menu */}

          <button
            class="navbar-toggler"
            type="button"
            data-bs-toggle="collapse"
            data-bs-target="#navbarNav"
            aria-controls="navbarNav"
            aria-expanded="false"
            aria-label="Toggle navigation"
          >
            <span class="navbar-toggler-icon"></span>
          </button>

          {/* Home Button ---------------------------------------------------------------------------------- */}
          <div class="collapse navbar-collapse" id="navbarNav ">
            <div className="d-flex ms-auto">
              <Link
                to="/"
                className="btn btn-primary rounded-pill px-5 py-2 me-4 fw-bold cn_btn"
                type="button"
              >
                Home
              </Link>

              
            </div>
          </div>
        </div>
      </nav>

      <br />
      <br />
      <br />

      {/* Login Form ------------------------------------------------------------------------------------------------------*/}

      {/* Contact Us Section */}

      <section className="login-section">
        <div className="container">
          <div className="row align-items-center justify-content-center ">
            <div
              className="col-md-5 d-flex justify-content-center"
              style={{ height: "520px" }}
            >
              {/* login Form */}
              <div className="contact-form-container" style={{ flex: 1 }}>
                <div>
                  <br />
                  <h1 class="tl3_st centered-title">Connection</h1>
                  <hr />
                  <br />
                  <br />
                  <br />
                </div>
                <form>
                  

                  <div className="mb-3">
                    <input
                      type="text"
                      className="form-control"
                      id="prenom"
                      placeholder="Entrez votre identifiant"
                    />
                  </div>
                  <div className="mb-3">
                    <input
                      type="tel"
                      className="form-control"
                      id="telephone"
                      placeholder="Entrez votre mot de passe"
                    />
                  </div>

                  <br />
                  <br />

                  {/* the button se connecter ------------------------------------------------------ */}

                  <div className="d-flex justify-content-center mt-3">
                    <Link
                      to="/admin"
                      className="btn btn-primary rounded-pill px-5 py-2 me-4 fw-bold cn_btn"
                      type="submit"
                      style={{ width: "250px" }}
                    >
                      Se connecter
                    </Link>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

export default Login;
