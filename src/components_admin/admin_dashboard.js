"use client"
import { useState, useEffect, useCallback } from "react"
import { useNavigate } from "react-router-dom"
import "bootstrap/dist/css/bootstrap.min.css"
import "bootstrap/dist/js/bootstrap.bundle.min.js"
import "../styles/dashboard.css"
import { BarChart, PieChart, LineChart, AreaChart, ScatterChart } from "./AdvancedCharts"
import authService from "../services/authService"
import api from "../services/api"

function Enhanced_Dashboard_Content() {
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [overviewStats, setOverviewStats] = useState({})
  const [opportunitiesStatusData, setOpportunitiesStatusData] = useState({ labels: [], data: [] })
  const [offresAdjugeData, setOffresAdjugeData] = useState({ labels: [], data: [] })
  const [monthlyTrendData, setMonthlyTrendData] = useState({ labels: [], data: [] })
  const [contractsStatusData, setContractsStatusData] = useState({ labels: [], data: [] })
  const [facturesPaymentData, setFacturesPaymentData] = useState({ labels: [], data: [] })
  const [monthlyRevenueData, setMonthlyRevenueData] = useState({ labels: [], data: [] })
  const [topClientsData, setTopClientsData] = useState({ labels: [], data: [] })
  const [livrablesValidationData, setLivrablesValidationData] = useState({ labels: [], data: [] })
  const [usersRoleData, setUsersRoleData] = useState({ labels: [], data: [] })
  const [advancedAnalytics, setAdvancedAnalytics] = useState({})

  const user = authService.getCurrentUser()
  const navigate = useNavigate()

  const handleLogout = () => {
    authService.logout()
    navigate("/login")
  }

  const fetchAllStatistics = useCallback(async () => {
    setLoading(true)
    setError(null)

    try {
      const endpoints = [
        "/statistics/overview",
        "/statistics/opportunites/by-status",
        "/statistics/offres/by-adjuge",
        "/statistics/opportunites/monthly-trend",
        "/statistics/contrats/by-status",
        "/statistics/factures/by-payment-status",
        "/statistics/revenue/monthly",
        "/statistics/clients/top-opportunities",
        "/statistics/livrables/by-validation-status",
        "/statistics/users/by-role",
        "/statistics/advanced-analytics",
      ]

      const responses = await Promise.all(
        endpoints.map((endpoint) =>
          api.get(endpoint).catch((err) => {
            console.warn(`Failed to fetch ${endpoint}:`, err)
            return { data: {} }
          }),
        ),
      )

      setOverviewStats(responses[0]?.data || {})
      setOpportunitiesStatusData(responses[1]?.data || { labels: [], data: [] })
      setOffresAdjugeData(responses[2]?.data || { labels: [], data: [] })
      setMonthlyTrendData(responses[3]?.data || { labels: [], data: [] })
      setContractsStatusData(responses[4]?.data || { labels: [], data: [] })
      setFacturesPaymentData(responses[5]?.data || { labels: [], data: [] })
      setMonthlyRevenueData(responses[6]?.data || { labels: [], data: [] })
      setTopClientsData(responses[7]?.data || { labels: [], data: [] })
      setLivrablesValidationData(responses[8]?.data || { labels: [], data: [] })
      setUsersRoleData(responses[9]?.data || { labels: [], data: [] })
      setAdvancedAnalytics(responses[10]?.data || {})
    } catch (err) {
      console.error("Error fetching statistics:", err)
      setError("Erreur lors du chargement des statistiques: " + err.message)
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    fetchAllStatistics()
  }, [fetchAllStatistics])

  if (loading) {
    return (
      <div className="d-flex justify-content-center align-items-center" style={{ height: "100vh", background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)" }}>
        <div className="text-center">
          <div className="spinner-border text-light mb-3" role="status" style={{ width: "4rem", height: "4rem" }}>
            <span className="visually-hidden">Chargement...</span>
          </div>
          <h4 className="text-light">Chargement du tableau de bord...</h4>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="container-fluid p-4">
        <div className="alert alert-danger shadow-sm">
          <i className="fas fa-exclamation-triangle me-2"></i>
          {error}
          <button type="button" className="btn-close" onClick={() => setError(null)}></button>
        </div>
      </div>
    )
  }

  // Préparer les données pour le graphique en nuage de points (opportunités vs montant)
  const scatterData = {
    data:
      monthlyRevenueData.labels?.map((label, index) => ({
        x: index + 1,
        y: monthlyRevenueData.data?.[index] || 0,
      })) || [],
    xLabel: "Mois",
    yLabel: "Chiffre d'affaires (€)",
  }

  return (
    <div style={{ background: "linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)", minHeight: "100vh" }}>
      {/* Header professionnel avec nom d'utilisateur */}
      <div className="container-fluid" style={{
        background: "linear-gradient(135deg, #2c3e50 0%, #34495e 100%)",
        boxShadow: "0 4px 6px rgba(0,0,0,0.1)",
        borderBottom: "3px solid #3498db"
      }}>
        <div className="row align-items-center py-3">
          <div className="col-md-8">
            <div className="d-flex align-items-center">
              <div className="me-3">
                <i className="fas fa-chart-line fa-2x text-primary" style={{
                  background: "white",
                  padding: "10px",
                  borderRadius: "50%",
                  boxShadow: "0 2px 4px rgba(0,0,0,0.1)"
                }}></i>
              </div>
              <div>
                <h2 className="text-light mb-0 fw-bold">
                  <i className="fas fa-tachometer-alt me-2"></i>
                  Tableau de Bord Analytique
                </h2>
                <p className="text-light opacity-75 mb-0">
                  <i className="fas fa-user me-2"></i>
                  Connecté en tant que: <strong>{user?.firstName} {user?.lastName}</strong>
                  <span className="mx-2">|</span>
                  <i className="fas fa-calendar me-1"></i>
                  {new Date().toLocaleDateString('fr-FR', {
                    weekday: 'long',
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric'
                  })}
                </p>
              </div>
            </div>
          </div>
          <div className="col-md-4 text-end">
            <button
              className="btn btn-outline-light me-2"
              onClick={fetchAllStatistics}
              disabled={loading}
              style={{ borderRadius: "25px" }}
            >
              <i className="fas fa-sync-alt me-1"></i>
              Actualiser
            </button>
            <button
              className="btn btn-danger"
              onClick={handleLogout}
              title="Se déconnecter"
              style={{ borderRadius: "25px" }}
            >
              <i className="fas fa-sign-out-alt me-1"></i>
              Déconnexion
            </button>
          </div>
        </div>
      </div>

      <div className="container-fluid p-4">
        {/* KPIs principaux - Style Power BI */}
        <div className="row mb-4">
          <div className="col-12">
            <h3 className="mb-3 text-dark fw-bold">
              <i className="fas fa-chart-bar me-2 text-primary"></i>
              Indicateurs Clés de Performance
            </h3>
          </div>
        </div>

        <div className="row mb-4 g-3">
          <div className="col-lg-3 col-md-6">
            <div className="card border-0 shadow-sm h-100" style={{
              background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
              borderRadius: "15px"
            }}>
              <div className="card-body text-center text-white">
                <i className="fas fa-users fa-3x mb-3 opacity-75"></i>
                <h2 className="fw-bold mb-1">{overviewStats.totalClients || 0}</h2>
                <p className="mb-0 opacity-75">Total Clients</p>
                <small className="opacity-75">
                  <i className="fas fa-arrow-up me-1"></i>
                  Actifs dans le système
                </small>
              </div>
            </div>
          </div>
          <div className="col-lg-3 col-md-6">
            <div className="card border-0 shadow-sm h-100" style={{
              background: "linear-gradient(135deg, #f093fb 0%, #f5576c 100%)",
              borderRadius: "15px"
            }}>
              <div className="card-body text-center text-white">
                <i className="fas fa-lightbulb fa-3x mb-3 opacity-75"></i>
                <h2 className="fw-bold mb-1">{overviewStats.totalOpportunites || 0}</h2>
                <p className="mb-0 opacity-75">Opportunités</p>
                <small className="opacity-75">
                  <i className="fas fa-arrow-up me-1"></i>
                  En cours de traitement
                </small>
              </div>
            </div>
          </div>
          <div className="col-lg-3 col-md-6">
            <div className="card border-0 shadow-sm h-100" style={{
              background: "linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)",
              borderRadius: "15px"
            }}>
              <div className="card-body text-center text-white">
                <i className="fas fa-file-invoice fa-3x mb-3 opacity-75"></i>
                <h2 className="fw-bold mb-1">{overviewStats.totalOffres || 0}</h2>
                <p className="mb-0 opacity-75">Offres Soumises</p>
                <small className="opacity-75">
                  <i className="fas fa-arrow-up me-1"></i>
                  Propositions actives
                </small>
              </div>
            </div>
          </div>
          <div className="col-lg-3 col-md-6">
            <div className="card border-0 shadow-sm h-100" style={{
              background: "linear-gradient(135deg, #43e97b 0%, #38f9d7 100%)",
              borderRadius: "15px"
            }}>
              <div className="card-body text-center text-white">
                <i className="fas fa-file-contract fa-3x mb-3 opacity-75"></i>
                <h2 className="fw-bold mb-1">{overviewStats.totalContrats || 0}</h2>
                <p className="mb-0 opacity-75">Contrats Signés</p>
                <small className="opacity-75">
                  <i className="fas fa-check me-1"></i>
                  Contrats finalisés
                </small>
              </div>
            </div>
          </div>
        </div>

        {/* Métriques avancées */}
        <div className="row mb-4 g-3">
          <div className="col-lg-3 col-md-6">
            <div className="card border-0 shadow-sm" style={{ borderRadius: "15px", borderLeft: "5px solid #3498db" }}>
              <div className="card-body text-center">
                <h3 className="text-primary fw-bold">{advancedAnalytics.conversionRate || 0}%</h3>
                <p className="text-muted mb-1">Taux de Conversion</p>
                <small className="text-muted">Opportunités → Offres</small>
              </div>
            </div>
          </div>
          <div className="col-lg-3 col-md-6">
            <div className="card border-0 shadow-sm" style={{ borderRadius: "15px", borderLeft: "5px solid #27ae60" }}>
              <div className="card-body text-center">
                <h3 className="text-success fw-bold">{advancedAnalytics.successRate || 0}%</h3>
                <p className="text-muted mb-1">Taux de Réussite</p>
                <small className="text-muted">Offres Gagnées</small>
              </div>
            </div>
          </div>
          <div className="col-lg-3 col-md-6">
            <div className="card border-0 shadow-sm" style={{ borderRadius: "15px", borderLeft: "5px solid #f39c12" }}>
              <div className="card-body text-center">
                <h3 className="text-warning fw-bold">{(advancedAnalytics.averageContractValue || 0).toLocaleString()}€</h3>
                <p className="text-muted mb-1">Valeur Moyenne</p>
                <small className="text-muted">Par Contrat</small>
              </div>
            </div>
          </div>
          <div className="col-lg-3 col-md-6">
            <div className="card border-0 shadow-sm" style={{ borderRadius: "15px", borderLeft: "5px solid #e74c3c" }}>
              <div className="card-body text-center">
                <h3 className="text-danger fw-bold">{(advancedAnalytics.totalRevenue || 0).toLocaleString()}€</h3>
                <p className="text-muted mb-1">Chiffre d'Affaires</p>
                <small className="text-muted">Total Généré</small>
              </div>
            </div>
          </div>
        </div>

        {/* Tous les graphiques visibles - Style Power BI Grid */}
        <div className="row mb-4">
          <div className="col-12">
            <h3 className="mb-3 text-dark fw-bold">
              <i className="fas fa-chart-area me-2 text-success"></i>
              Analyses Visuelles Complètes
            </h3>
          </div>
        </div>

        {/* Première ligne de graphiques */}
        <div className="row mb-4 g-3">
          <div className="col-lg-6 col-md-12">
            <div className="card border-0 shadow-sm h-100" style={{ borderRadius: "15px" }}>
              <div className="card-header bg-gradient text-white" style={{
                background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
                borderRadius: "15px 15px 0 0"
              }}>
                <h5 className="mb-0">
                  <i className="fas fa-chart-line me-2"></i>
                  Évolution Mensuelle des Opportunités
                </h5>
              </div>
              <div className="card-body" style={{ height: "350px" }}>
                <LineChart data={monthlyTrendData} title="Tendance des Opportunités" />
              </div>
            </div>
          </div>
          <div className="col-lg-6 col-md-12">
            <div className="card border-0 shadow-sm h-100" style={{ borderRadius: "15px" }}>
              <div className="card-header bg-gradient text-white" style={{
                background: "linear-gradient(135deg, #f093fb 0%, #f5576c 100%)",
                borderRadius: "15px 15px 0 0"
              }}>
                <h5 className="mb-0">
                  <i className="fas fa-chart-pie me-2"></i>
                  État des Opportunités
                </h5>
              </div>
              <div className="card-body" style={{ height: "350px" }}>
                <PieChart data={opportunitiesStatusData} title="Répartition par État" />
              </div>
            </div>
          </div>
        </div>

        {/* Deuxième ligne de graphiques */}
        <div className="row mb-4 g-3">
          <div className="col-lg-4 col-md-6">
            <div className="card border-0 shadow-sm h-100" style={{ borderRadius: "15px" }}>
              <div className="card-header bg-gradient text-white" style={{
                background: "linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)",
                borderRadius: "15px 15px 0 0"
              }}>
                <h5 className="mb-0">
                  <i className="fas fa-trophy me-2"></i>
                  Statut des Offres
                </h5>
              </div>
              <div className="card-body" style={{ height: "350px" }}>
                <PieChart data={offresAdjugeData} title="Offres par Statut" />
              </div>
            </div>
          </div>
          <div className="col-lg-4 col-md-6">
            <div className="card border-0 shadow-sm h-100" style={{ borderRadius: "15px" }}>
              <div className="card-header bg-gradient text-white" style={{
                background: "linear-gradient(135deg, #43e97b 0%, #38f9d7 100%)",
                borderRadius: "15px 15px 0 0"
              }}>
                <h5 className="mb-0">
                  <i className="fas fa-file-contract me-2"></i>
                  État des Contrats
                </h5>
              </div>
              <div className="card-body" style={{ height: "350px" }}>
                <BarChart data={contractsStatusData} title="Contrats par État" />
              </div>
            </div>
          </div>
          <div className="col-lg-4 col-md-12">
            <div className="card border-0 shadow-sm h-100" style={{ borderRadius: "15px" }}>
              <div className="card-header bg-gradient text-white" style={{
                background: "linear-gradient(135deg, #fa709a 0%, #fee140 100%)",
                borderRadius: "15px 15px 0 0"
              }}>
                <h5 className="mb-0">
                  <i className="fas fa-users-cog me-2"></i>
                  Utilisateurs par Rôle
                </h5>
              </div>
              <div className="card-body" style={{ height: "350px" }}>
                <PieChart data={usersRoleData} title="Répartition des Rôles" />
              </div>
            </div>
          </div>
        </div>

        {/* Troisième ligne de graphiques */}
        <div className="row mb-4 g-3">
          <div className="col-lg-6 col-md-12">
            <div className="card border-0 shadow-sm h-100" style={{ borderRadius: "15px" }}>
              <div className="card-header bg-gradient text-white" style={{
                background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
                borderRadius: "15px 15px 0 0"
              }}>
                <h5 className="mb-0">
                  <i className="fas fa-euro-sign me-2"></i>
                  Évolution du Chiffre d'Affaires
                </h5>
              </div>
              <div className="card-body" style={{ height: "350px" }}>
                <LineChart data={monthlyRevenueData} title="Revenus Mensuels (€)" />
              </div>
            </div>
          </div>
          <div className="col-lg-6 col-md-12">
            <div className="card border-0 shadow-sm h-100" style={{ borderRadius: "15px" }}>
              <div className="card-header bg-gradient text-white" style={{
                background: "linear-gradient(135deg, #f093fb 0%, #f5576c 100%)",
                borderRadius: "15px 15px 0 0"
              }}>
                <h5 className="mb-0">
                  <i className="fas fa-credit-card me-2"></i>
                  Statut des Paiements
                </h5>
              </div>
              <div className="card-body" style={{ height: "350px" }}>
                <PieChart data={facturesPaymentData} title="Factures par Statut" />
              </div>
            </div>
          </div>
        </div>

        {/* Quatrième ligne de graphiques */}
        <div className="row mb-4 g-3">
          <div className="col-lg-8 col-md-12">
            <div className="card border-0 shadow-sm h-100" style={{ borderRadius: "15px" }}>
              <div className="card-header bg-gradient text-white" style={{
                background: "linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)",
                borderRadius: "15px 15px 0 0"
              }}>
                <h5 className="mb-0">
                  <i className="fas fa-medal me-2"></i>
                  Top 10 Clients par Opportunités
                </h5>
              </div>
              <div className="card-body" style={{ height: "350px" }}>
                <BarChart data={topClientsData} title="Clients les Plus Actifs" />
              </div>
            </div>
          </div>
          <div className="col-lg-4 col-md-12">
            <div className="card border-0 shadow-sm h-100" style={{ borderRadius: "15px" }}>
              <div className="card-header bg-gradient text-white" style={{
                background: "linear-gradient(135deg, #43e97b 0%, #38f9d7 100%)",
                borderRadius: "15px 15px 0 0"
              }}>
                <h5 className="mb-0">
                  <i className="fas fa-check-circle me-2"></i>
                  Validation Livrables
                </h5>
              </div>
              <div className="card-body" style={{ height: "350px" }}>
                <BarChart data={livrablesValidationData} title="Statut Validation" />
              </div>
            </div>
          </div>
        </div>

        {/* Analyse avancée */}
        <div className="row mb-4">
          <div className="col-12">
            <div className="card border-0 shadow-sm" style={{ borderRadius: "15px" }}>
              <div className="card-header bg-gradient text-white" style={{
                background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
                borderRadius: "15px 15px 0 0"
              }}>
                <h5 className="mb-0">
                  <i className="fas fa-chart-scatter me-2"></i>
                  Analyse Revenus vs Temps (Corrélation)
                </h5>
              </div>
              <div className="card-body" style={{ height: "400px" }}>
                <ScatterChart data={scatterData} title="Corrélation Temporelle des Revenus" />
              </div>
            </div>
          </div>
        </div>

        {/* Section d'insights - Style plus propre */}
        <div className="row">
          <div className="col-12">
            <div className="card border-0 shadow-sm" style={{ borderRadius: "15px" }}>
              <div className="card-header" style={{
                background: "#f8f9fa",
                borderRadius: "15px 15px 0 0",
                borderBottom: "1px solid #dee2e6"
              }}>
                <h5 className="mb-0 text-dark">
                  <i className="fas fa-analytics text-primary me-2"></i>
                  Résumé des Performances
                </h5>
              </div>
              <div className="card-body" style={{ padding: "2rem" }}>
                <div className="row g-4">
                  <div className="col-lg-3 col-md-6">
                    <div className="text-center p-3" style={{
                      border: "2px solid #e3f2fd",
                      borderRadius: "12px",
                      backgroundColor: "#fafafa",
                      transition: "all 0.3s ease"
                    }}>
                      <div className="mb-3">
                        <i className="fas fa-percentage fa-2x" style={{ color: "#1976d2" }}></i>
                      </div>
                      <h4 className="fw-bold text-dark mb-1">{advancedAnalytics.conversionRate || 0}%</h4>
                      <p className="text-muted mb-2">Taux de Conversion</p>
                      <small className="badge bg-light text-dark">
                        {(advancedAnalytics.conversionRate || 0) > 50
                          ? "Performance Excellente"
                          : "À Améliorer"}
                      </small>
                    </div>
                  </div>
                  <div className="col-lg-3 col-md-6">
                    <div className="text-center p-3" style={{
                      border: "2px solid #e8f5e8",
                      borderRadius: "12px",
                      backgroundColor: "#fafafa",
                      transition: "all 0.3s ease"
                    }}>
                      <div className="mb-3">
                        <i className="fas fa-bullseye fa-2x" style={{ color: "#388e3c" }}></i>
                      </div>
                      <h4 className="fw-bold text-dark mb-1">{advancedAnalytics.successRate || 0}%</h4>
                      <p className="text-muted mb-2">Taux de Succès</p>
                      <small className="badge bg-light text-dark">
                        {(advancedAnalytics.successRate || 0) > 30
                          ? "Très Satisfaisant"
                          : "Stratégie à Revoir"}
                      </small>
                    </div>
                  </div>
                  <div className="col-lg-3 col-md-6">
                    <div className="text-center p-3" style={{
                      border: "2px solid #fff3e0",
                      borderRadius: "12px",
                      backgroundColor: "#fafafa",
                      transition: "all 0.3s ease"
                    }}>
                      <div className="mb-3">
                        <i className="fas fa-euro-sign fa-2x" style={{ color: "#f57c00" }}></i>
                      </div>
                      <h4 className="fw-bold text-dark mb-1">{(advancedAnalytics.averageContractValue || 0).toLocaleString()}€</h4>
                      <p className="text-muted mb-2">Valeur Moyenne</p>
                      <small className="badge bg-light text-dark">Par Contrat</small>
                    </div>
                  </div>
                  <div className="col-lg-3 col-md-6">
                    <div className="text-center p-3" style={{
                      border: "2px solid #f3e5f5",
                      borderRadius: "12px",
                      backgroundColor: "#fafafa",
                      transition: "all 0.3s ease"
                    }}>
                      <div className="mb-3">
                        <i className="fas fa-chart-bar fa-2x" style={{ color: "#7b1fa2" }}></i>
                      </div>
                      <h4 className="fw-bold text-dark mb-1">{(advancedAnalytics.totalRevenue || 0).toLocaleString()}€</h4>
                      <p className="text-muted mb-2">Revenus Totaux</p>
                      <small className="badge bg-light text-dark">
                        {(advancedAnalytics.totalRevenue || 0) > 1000000 ? "Objectif Atteint" : "En Croissance"}
                      </small>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Enhanced_Dashboard_Content