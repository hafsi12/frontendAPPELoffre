import React, { useState, useEffect } from "react";
import "../styles/home.css";
import { Link } from "react-router-dom";

function Home() {
  return (
    <div>
      {/* Navbar */}
      <nav className="navbar navbar-expand-lg navbar-light bg-white border-bottom border-gray shadow-sm">
        <div className="container-fluid bb">
          <a className="navbar-brand" href="#">
            <img src="1.png" alt="ensa khouribga" height="70" />
          </a>

          <button
            className="navbar-toggler"
            type="button"
            data-bs-toggle="collapse"
            data-bs-target="#navbarNav"
          >
            <span className="navbar-toggler-icon"></span>
          </button>

          <div className="collapse navbar-collapse" id="navbarNav">
            <ul className="navbar-nav mx-auto">
              <li className="nav-item">
                <a className="nav-link fw-bold" href="#">
                  Home
                </a>
              </li>
              <li className="nav-item">
                <a className="nav-link fw-bold" href="#footer">
                  About us
                </a>
              </li>
              <li className="nav-item">
                <a className="nav-link fw-bold" href="#contact-form">
                  Contact us
                </a>
              </li>
            </ul>
            <div className="d-flex align-items-">
              <Link
                to="/login"
                className="btn btn-primary rounded-pill px-5 py-2 me-4 fw-bold cn_btn"
              >
                Se connecter
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="hero-section">
        <div className="container-fluid mrg">
          <div className="row align-items-center justify-content-center">
            <div className="col-md-5">
              <h2 className="tl_st">
                Bienvenue sur Votre système <br /> de gestion des appels d'offre
              </h2>
              <br />
              <p className="tl2_st">
                Une plateforme dédiée à la gestion des appels d'offres publiques
                <br />
                Une solution intelligente pour un suivi commercial simplifié
                <br />
                Tout le cycle client, opportunité, offre et contrat en un seul outil !
              </p>
              <br />
              <Link
                to="/login"
                className="btn btn-primary rounded-pill px-5 py-2 me-4 fw-bold cn_btn"
              >
                Accédez maintenant
              </Link>
            </div>
            <div className="col-md-5 d-flex justify-content-end">
              <img
                src="2.png"
                alt="Système de gestion universitaire"
                className="img-fluid"
                style={{ width: "600px", height: "auto" }}
              />
            </div>
          </div>
        </div>
      </section>

      {/* Terragis en nombres */}
      <section>
        <div className="container mrg2 ">
          <div className="row justify-content-center">
            <div className="col-12 text-center">
              <h2 style={{ fontFamily: "corbel", color: "gray" }}>
                Terragis en nombres
              </h2>
              <br />
              <br />
              <hr className="custom-hr" />
              <br />
              <br />
              <br />
            </div>

            {/* Card 1 */}
            <div className="col-md-3">
              <div className="card l-bg">
                <div className="card-statistic-3 p-4">
                  <div className="mb-4">
                    <h5 className="card-title mb-0">les employés</h5>
                  </div>
                  <div className="row align-items-center mb-2 d-flex">
                    <div className="col-8">
                      <h2 className="d-flex align-items-center mb-0">1250</h2>
                    </div>
                  </div>
                  <div className="progress mt-1" style={{ height: "8px" }}>
                    <div
                      className="progress-bar l-bg-green"
                      role="progressbar"
                      style={{ width: "80%" }}
                    ></div>
                  </div>
                </div>
              </div>
            </div>

            {/* Card 2 */}
            <div className="col-md-3">
              <div className="card l-bg">
                <div className="card-statistic-3 p-4">
                  <div className="mb-4">
                    <h5 className="card-title mb-0">projets</h5>
                  </div>
                  <div className="row align-items-center mb-2 d-flex">
                    <div className="col-8">
                      <h2 className="d-flex align-items-center mb-0">56</h2>
                    </div>
                  </div>
                  <div className="progress mt-1" style={{ height: "8px" }}>
                    <div
                      className="progress-bar l-bg-green"
                      role="progressbar"
                      style={{ width: "50%" }}
                    ></div>
                  </div>
                </div>
              </div>
            </div>

            {/* Card 3 */}
            <div className="col-md-3">
              <div className="card l-bg">
                <div className="card-statistic-3 p-4">
                  <div className="mb-4">
                    <h5 className="card-title mb-0">clients</h5>
                  </div>
                  <div className="row align-items-center mb-2 d-flex">
                    <div className="col-8">
                      <h2 className="d-flex align-items-center mb-0">2</h2>
                    </div>
                  </div>
                  <div className="progress mt-1" style={{ height: "8px" }}>
                    <div
                      className="progress-bar l-bg-green"
                      role="progressbar"
                      style={{ width: "20%" }}
                    ></div>
                  </div>
                </div>
              </div>
            </div>

            {/* Card 4 */}
            <div className="col-md-3">
              <div className="card l-bg">
                <div className="card-statistic-3 p-4">
                  <div className="mb-4">
                    <h5 className="card-title mb-0">Directeur</h5>
                  </div>
                  <div className="row align-items-center mb-2 d-flex">
                    <div className="col-8">
                      <h2 className="d-flex align-items-center mb-0">2</h2>
                    </div>
                  </div>
                  <div className="progress mt-1" style={{ height: "8px" }}>
                    <div
                      className="progress-bar l-bg-green"
                      role="progressbar"
                      style={{ width: "5%" }}
                    ></div>
                  </div>
                </div>
              </div>
            </div>

            <hr className="custom-hr" />
          </div>
        </div>
      </section>

      {/* Contact Form Section */}
      <section className="contact-section" id="contact-form">
        <div className="container">
          <div className="row align-items-center">
            <div className="col-12 text-center">
              <h2 style={{ fontFamily: "corbel", color: "gray" }}>
                Contactez-nous
              </h2>
              <br />
            </div>

            <div className="col-md-12 d-flex justify-content-center" style={{ height: "500px" }}>
              <div className="contact-form-container" style={{ flex: 1 }}>
                <form>
                  <div className="mb-3">
                    <input type="text" className="form-control" placeholder="Entrez votre nom" />
                  </div>
                  <div className="mb-3">
                    <input type="text" className="form-control" placeholder="Entrez votre prénom" />
                  </div>
                  <div className="mb-3">
                    <input type="tel" className="form-control" placeholder="Entrez votre téléphone" />
                  </div>
                  <div className="mb-3">
                    <input type="email" className="form-control" placeholder="Entrez votre email" />
                  </div>
                  <div className="mb-3">
                    <textarea className="form-control" rows="4" placeholder="Entrez votre message"></textarea>
                  </div>
                  <div className="d-flex justify-content-center mt-3">
                    <button className="btn btn-primary rounded-pill px-5 py-2 me-4 fw-bold cn_btn" type="submit">
                      Envoyer
                    </button>
                  </div>
                </form>
              </div>

              <div className="contact-form-container" style={{ flex: 1 }}>
                <iframe
                  title="Carte Terragis"
                  src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3325.4010326654184!2d-7.642806825475141!3d33.54295534445253!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0xa498614930bac917%3A0x5e9e3e41753a0355!2sTerragis!5e0!3m2!1sfr!2sma!4v1751809466384!5m2!1sfr!2sma"
                  width="100%"
                  height="100%"
                  style={{ border: 0 }}
                  allowFullScreen=""
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                />

              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer
        id="footer"
        className="text-center text-lg-start text-white"
        style={{
          background: "linear-gradient(to right, #040404c5, rgb(62, 85, 83))",
        }}
      >
        <div className="container p-4 pb-0">
          <section>
            <div className="row">
              <div className="col-md-3 col-lg-3 col-xl-3 mx-auto mt-3">
                <h6 className="text-uppercase mb-4 font-weight-bold ft">Terragis</h6>
                <p style={{ textAlign: "justify" }}>
                  Terragis est un cabinet de conseil spécialisé en urbanisme, résilience climatique, gestion des ressources en eau et technologies géospatiales. Grâce à son expertise avancée en SIG, BIM et jumeaux numériques, Terragis accompagne les collectivités, institutions et entreprises dans la planification territoriale, la conception d'infrastructures intelligentes et la prise de décision stratégique face aux enjeux environnementaux et urbains.
                </p>

              </div>
              <div className="col-md-4 col-lg-3 col-xl-3 mx-auto mt-3">
                <h6 className="text-uppercase mb-4 font-weight-bold ft">Contact</h6>
                <p><i className="fas fa-home mr-3"></i>&nbsp; Technopark, Route Nouaceur, Casablanca</p>
                <p><i className="fas fa-envelope mr-3"></i>&nbsp; contact@terragis.ma</p>
                <p><i className="fas fa-phone mr-3"></i>&nbsp; +212660438565</p>
                <p><i className="fas fa-print mr-3"></i>&nbsp; 0523492339</p>
              </div>
              <div className="col-md-3 col-lg-2 col-xl-2 mx-auto mt-3">
                <h6 className="text-uppercase mb-4 font-weight-bold ft">Liens utiles</h6>
                <p><a className="text-white" href="#">Organisation</a></p>
                <p><a className="text-white" href="#">Galerie</a></p>
                <p><a className="text-white" href="#">Départements</a></p>
                <p><a className="text-white" href="#">Partenaires</a></p>
              </div>
            </div>
          </section>
          <hr className="my-3" />
          <section className="p-3 pt-0">
            <div className="row d-flex align-items-center">
              <div className="col-md-7 col-lg-8 text-center text-md-start">
                <div className="p-3">©Copyright 2025 | Terragis</div>
              </div>
              <div className="col-md-5 col-lg-4 text-center text-md-end">
                <a className="btn btn-outline-light btn-floating m-1" href="https://facebook.com" role="button">
                  <i className="fab fa-facebook-f"></i>
                </a>
                <a className="btn btn-outline-light btn-floating m-1" href="#"><i className="fab fa-twitter"></i></a>
                <a className="btn btn-outline-light btn-floating m-1" href="#"><i className="fab fa-google"></i></a>
                <a className="btn btn-outline-light btn-floating m-1" href="#"><i className="fab fa-instagram"></i></a>
              </div>
            </div>
          </section>
        </div>
      </footer>
    </div>
  );
}

export default Home;
