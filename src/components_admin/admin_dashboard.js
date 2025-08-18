"use client"
import { useState, useEffect, useCallback } from "react"
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
  const [activeTab, setActiveTab] = useState('overview')

  const user = authService.getCurrentUser()

  const fetchAllStatistics = useCallback(async () => {
    setLoading(true)
    setError(null)

    try {
      const endpoints = [
        '/statistics/overview',
        '/statistics/opportunites/by-status',
        '/statistics/offres/by-adjuge',
        '/statistics/opportunites/monthly-trend',
        '/statistics/contrats/by-status',
        '/statistics/factures/by-payment-status',
        '/statistics/revenue/monthly',
        '/statistics/clients/top-opportunities',
        '/statistics/livrables/by-validation-status',
        '/statistics/users/by-role',
        '/statistics/advanced-analytics'
      ]

      const responses = await Promise.all(
        endpoints.map(endpoint =>
          api.get(endpoint).catch(err => {
            console.warn(`Failed to fetch ${endpoint}:`, err)
            return { data: {} }
          })
        )
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
      <div className="d-flex justify-content-center align-items-center" style={{ height: "400px" }}>
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Chargement...</span>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="alert alert-danger">
        {error}
        <button type="button" className="btn-close" onClick={() => setError(null)}></button>
      </div>
    )
  }

  // Préparer les données pour le graphique en nuage de points (opportunités vs montant)
  const scatterData = {
    data: monthlyRevenueData.labels?.map((label, index) => ({
      x: index + 1,
      y: monthlyRevenueData.data?.[index] || 0
    })) || [],
    xLabel: "Mois",
    yLabel: "Chiffre d'affaires (€)"
  }

  return (
    <div className="container-fluid p-4">
      {/* En-tête avec informations utilisateur */}
      <div className="row mb-4">
        <div className="col-12">
          <div className="alert alert-info">
            <h4>📊 Tableau de Bord Analytique - {user?.firstName} {user?.lastName}</h4>
            <p className="mb-0">Analyse complète des données avec visualisations interactives</p>
          </div>
        </div>
      </div>

      {/* Statistiques générales */}
      <div className="row mb-4">
        <div className="col-md-3 mb-3">
          <div className="card border-primary">
            <div className="card-body text-center">
              <i className="fas fa-users fa-2x text-primary mb-2"></i>
              <h3 className="text-primary">{overviewStats.totalClients || 0}</h3>
              <p style={{ color: "black" }} className="card-text">Clients</p>
            </div>
          </div>
        </div>
        <div className="col-md-3 mb-3">
          <div className="card border-success">
            <div className="card-body text-center">
              <i className="fas fa-lightbulb fa-2x text-success mb-2"></i>
              <h3 className="text-success">{overviewStats.totalOpportunites || 0}</h3>
              <p style={{ color: "black" }} className="card-text">Opportunités</p>
            </div>
          </div>
        </div>
        <div className="col-md-3 mb-3">
          <div className="card border-warning">
            <div className="card-body text-center">
              <i className="fas fa-file-invoice fa-2x text-warning mb-2"></i>
              <h3 className="text-warning">{overviewStats.totalOffres || 0}</h3>
              <p style={{ color: "black" }} className="card-text">Offres</p>
            </div>
          </div>
        </div>
        <div className="col-md-3 mb-3">
          <div className="card border-info">
            <div className="card-body text-center">
              <i className="fas fa-file-contract fa-2x text-info mb-2"></i>
              <h3 className="text-info">{overviewStats.totalContrats || 0}</h3>
              <p style={{ color: "black" }} className="card-text">Contrats</p>
            </div>
          </div>
        </div>
      </div>

      {/* Métriques avancées */}
      <div className="row mb-4">
        <div className="col-md-3 mb-3">
          <div className="card bg-primary text-white">
            <div className="card-body text-center">
              <h4>{advancedAnalytics.conversionRate || 0}%</h4>
              <p>Taux de Conversion</p>
              <small>Opportunités → Offres</small>
            </div>
          </div>
        </div>
        <div className="col-md-3 mb-3">
          <div className="card bg-success text-white">
            <div className="card-body text-center">
              <h4>{advancedAnalytics.successRate || 0}%</h4>
              <p>Taux de Réussite</p>
              <small>Offres Gagnées</small>
            </div>
          </div>
        </div>
        <div className="col-md-3 mb-3">
          <div className="card bg-info text-white">
            <div className="card-body text-center">
              <h4>{(advancedAnalytics.averageContractValue || 0).toLocaleString()}€</h4>
              <p>Valeur Moyenne</p>
              <small>Par Contrat</small>
            </div>
          </div>
        </div>
        <div className="col-md-3 mb-3">
          <div className="card bg-warning text-white">
            <div className="card-body text-center">
              <h4>{(advancedAnalytics.totalRevenue || 0).toLocaleString()}€</h4>
              <p>Chiffre d'Affaires</p>
              <small>Total</small>
            </div>
          </div>
        </div>
      </div>

      {/* Navigation des onglets */}
      <ul className="nav nav-tabs mb-4">
        <li className="nav-item">
          <button
            className={`nav-link ${activeTab === 'overview' ? 'active' : ''}`}
            onClick={() => setActiveTab('overview')}
          >
            📊 Vue d'ensemble
          </button>
        </li>
        <li className="nav-item">
          <button
            className={`nav-link ${activeTab === 'opportunities' ? 'active' : ''}`}
            onClick={() => setActiveTab('opportunities')}
          >
            💡 Opportunités
          </button>
        </li>
        <li className="nav-item">
          <button
            className={`nav-link ${activeTab === 'offers' ? 'active' : ''}`}
            onClick={() => setActiveTab('offers')}
          >
            📄 Offres & Contrats
          </button>
        </li>
        <li className="nav-item">
          <button
            className={`nav-link ${activeTab === 'finance' ? 'active' : ''}`}
            onClick={() => setActiveTab('finance')}
          >
            💰 Finances
          </button>
        </li>
        <li className="nav-item">
          <button
            className={`nav-link ${activeTab === 'clients' ? 'active' : ''}`}
            onClick={() => setActiveTab('clients')}
          >
            👥 Analyse Clients
          </button>
        </li>
      </ul>

      {/* Contenu des onglets */}
      {activeTab === 'overview' && (
        <div className="row">
          <div className="col-md-6 mb-4">
            <div className="card">
              <div className="card-header">
                <h5>📈 Évolution Mensuelle des Opportunités</h5>
              </div>
              <div className="card-body" style={{ height: '400px' }}>
                <LineChart
                  data={monthlyTrendData}
                  title="Opportunités par Mois"
                />
              </div>
            </div>
          </div>
          <div className="col-md-6 mb-4">
            <div className="card">
              <div className="card-header">
                <h5>🎯 État des Opportunités</h5>
              </div>
              <div className="card-body" style={{ height: '400px' }}>
                <PieChart
                  data={opportunitiesStatusData}
                  title="Répartition par État"
                />
              </div>
            </div>
          </div>
        </div>
      )}

      {activeTab === 'opportunities' && (
        <div className="row">
          <div className="col-md-6 mb-4">
            <div className="card">
              <div className="card-header">
                <h5>📊 État des Opportunités</h5>
              </div>
              <div className="card-body" style={{ height: '400px' }}>
                <BarChart
                  data={opportunitiesStatusData}
                  title="Opportunités par État"
                />
              </div>
            </div>
          </div>
          <div className="col-md-6 mb-4">
            <div className="card">
              <div className="card-header">
                <h5>📈 Tendance Mensuelle</h5>
              </div>
              <div className="card-body" style={{ height: '400px' }}>
                <AreaChart
                  data={{
                    labels: monthlyTrendData.labels,
                    datasets: [{
                      label: 'Opportunités',
                      data: monthlyTrendData.data,
                      backgroundColor: 'rgba(54, 162, 235, 0.3)',
                      borderColor: 'rgba(54, 162, 235, 1)',
                      fill: true
                    }]
                  }}
                  title="Évolution des Opportunités"
                />
              </div>
            </div>
          </div>
        </div>
      )}

      {activeTab === 'offers' && (
        <div className="row">
          <div className="col-md-6 mb-4">
            <div className="card">
              <div className="card-header">
                <h5>🏆 Statut des Offres</h5>
              </div>
              <div className="card-body" style={{ height: '400px' }}>
                <PieChart
                  data={offresAdjugeData}
                  title="Offres par Statut"
                />
              </div>
            </div>
          </div>
          <div className="col-md-6 mb-4">
            <div className="card">
              <div className="card-header">
                <h5>📋 État des Contrats</h5>
              </div>
              <div className="card-body" style={{ height: '400px' }}>
                <BarChart
                  data={contractsStatusData}
                  title="Contrats par État"
                />
              </div>
            </div>
          </div>
          <div className="col-md-12 mb-4">
            <div className="card">
              <div className="card-header">
                <h5>✅ Validation des Livrables</h5>
              </div>
              <div className="card-body" style={{ height: '400px' }}>
                <BarChart
                  data={livrablesValidationData}
                  title="Livrables par Statut de Validation"
                />
              </div>
            </div>
          </div>
        </div>
      )}

      {activeTab === 'finance' && (
        <div className="row">
          <div className="col-md-6 mb-4">
            <div className="card">
              <div className="card-header">
                <h5>💶 Évolution du Chiffre d'Affaires</h5>
              </div>
              <div className="card-body" style={{ height: '400px' }}>
                <LineChart
                  data={monthlyRevenueData}
                  title="Chiffre d'Affaires Mensuel (€)"
                />
              </div>
            </div>
          </div>
          <div className="col-md-6 mb-4">
            <div className="card">
              <div className="card-header">
                <h5>💳 Statut des Paiements</h5>
              </div>
              <div className="card-body" style={{ height: '400px' }}>
                <PieChart
                  data={facturesPaymentData}
                  title="Factures par Statut de Paiement"
                />
              </div>
            </div>
          </div>
          <div className="col-md-12 mb-4">
            <div className="card">
              <div className="card-header">
                <h5>📊 Analyse Revenus vs Temps</h5>
              </div>
              <div className="card-body" style={{ height: '400px' }}>
                <ScatterChart
                  data={scatterData}
                  title="Corrélation Temporelle des Revenus"
                />
              </div>
            </div>
          </div>
        </div>
      )}

      {activeTab === 'clients' && (
        <div className="row">
          <div className="col-md-8 mb-4">
            <div className="card">
              <div className="card-header">
                <h5>🏆 Top 10 Clients par Opportunités</h5>
              </div>
              <div className="card-body" style={{ height: '400px' }}>
                <BarChart
                  data={topClientsData}
                  title="Clients les Plus Actifs"
                />
              </div>
            </div>
          </div>
          <div className="col-md-4 mb-4">
            <div className="card">
              <div className="card-header">
                <h5>👤 Répartition des Utilisateurs</h5>
              </div>
              <div className="card-body" style={{ height: '400px' }}>
                <PieChart
                  data={usersRoleData}
                  title="Utilisateurs par Rôle"
                />
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Section d'aide à la décision */}
      <div className="row mt-5">
        <div className="col-12">
          <div className="card border-success">
            <div className="card-header bg-success text-white">
              <h5><i className="fas fa-brain"></i> Aide à la Décision - Insights Analytiques</h5>
            </div>
            <div className="card-body">
              <div className="row">
                <div className="col-md-3">
                  <div className="alert alert-info">
                    <strong>Performance Commerciale</strong><br/>
                    Taux de conversion: {advancedAnalytics.conversionRate || 0}%<br/>
                    <small>
                      {(advancedAnalytics.conversionRate || 0) > 50 ?
                        "✅ Excellent taux de conversion" :
                        "⚠️ Amélioration possible"}
                    </small>
                  </div>
                </div>
                <div className="col-md-3">
                  <div className="alert alert-success">
                    <strong>Efficacité des Offres</strong><br/>
                    Taux de réussite: {advancedAnalytics.successRate || 0}%<br/>
                    <small>
                      {(advancedAnalytics.successRate || 0) > 30 ?
                        "✅ Très bon taux de réussite" :
                        "⚠️ Revoir la stratégie d'offres"}
                    </small>
                  </div>
                </div>
                <div className="col-md-3">
                  <div className="alert alert-warning">
                    <strong>Valeur Moyenne</strong><br/>
                    {(advancedAnalytics.averageContractValue || 0).toLocaleString()}€ par contrat<br/>
                    <small>
                      {(advancedAnalytics.averageContractValue || 0) > 50000 ?
                        "✅ Contrats de grande valeur" :
                        "💡 Cibler des projets plus importants"}
                    </small>
                  </div>
                </div>
                <div className="col-md-3">
                  <div className="alert alert-primary">
                    <strong>Chiffre d'Affaires</strong><br/>
                    {(advancedAnalytics.totalRevenue || 0).toLocaleString()}€ total<br/>
                    <small>
                      {(advancedAnalytics.totalRevenue || 0) > 1000000 ?
                        "🎉 Objectif atteint !" :
                        "📈 En progression"}
                    </small>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Bouton de rafraîchissement */}
      <div className="row mt-3">
        <div className="col-12 text-center">
          <button
            className="btn btn-primary btn-lg"
            onClick={fetchAllStatistics}
            disabled={loading}
          >
            <i className="fas fa-sync-alt"></i> {loading ? 'Actualisation...' : 'Actualiser les Données'}
          </button>
        </div>
      </div>
    </div>
  )
}

export default Enhanced_Dashboard_Content