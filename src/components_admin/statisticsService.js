import api from './api'

class StatisticsService {
  // Obtenir les statistiques générales
  async getOverviewStatistics() {
    try {
      const response = await api.get('/statistics/overview')
      return response.data
    } catch (error) {
      console.error('Erreur lors de la récupération des statistiques générales:', error)
      throw error
    }
  }

  // Obtenir la répartition des opportunités par statut
  async getOpportunitiesByStatus() {
    try {
      const response = await api.get('/statistics/opportunites/by-status')
      return response.data
    } catch (error) {
      console.error('Erreur lors de la récupération des opportunités par statut:', error)
      throw error
    }
  }

  // Obtenir la répartition des offres par statut adjugé
  async getOffresByAdjuge() {
    try {
      const response = await api.get('/statistics/offres/by-adjuge')
      return response.data
    } catch (error) {
      console.error('Erreur lors de la récupération des offres par adjugé:', error)
      throw error
    }
  }

  // Obtenir l'évolution mensuelle des opportunités
  async getOpportunitesMonthlyTrend() {
    try {
      const response = await api.get('/statistics/opportunites/monthly-trend')
      return response.data
    } catch (error) {
      console.error('Erreur lors de la récupération de l\'évolution mensuelle des opportunités:', error)
      throw error
    }
  }

  // Obtenir la répartition des contrats par statut
  async getContratsByStatus() {
    try {
      const response = await api.get('/statistics/contrats/by-status')
      return response.data
    } catch (error) {
      console.error('Erreur lors de la récupération des contrats par statut:', error)
      throw error
    }
  }

  // Obtenir la répartition des factures par statut de paiement
  async getFacturesByPaymentStatus() {
    try {
      const response = await api.get('/statistics/factures/by-payment-status')
      return response.data
    } catch (error) {
      console.error('Erreur lors de la récupération des factures par statut de paiement:', error)
      throw error
    }
  }

  // Obtenir l'évolution mensuelle du chiffre d'affaires
  async getMonthlyRevenue() {
    try {
      const response = await api.get('/statistics/revenue/monthly')
      return response.data
    } catch (error) {
      console.error('Erreur lors de la récupération du chiffre d\'affaires mensuel:', error)
      throw error
    }
  }

  // Obtenir le top 10 des clients par opportunités
  async getTopClientsByOpportunities() {
    try {
      const response = await api.get('/statistics/clients/top-opportunities')
      return response.data
    } catch (error) {
      console.error('Erreur lors de la récupération du top clients:', error)
      throw error
    }
  }

  // Obtenir la répartition des livrables par statut de validation
  async getLivrablesByValidationStatus() {
    try {
      const response = await api.get('/statistics/livrables/by-validation-status')
      return response.data
    } catch (error) {
      console.error('Erreur lors de la récupération des livrables par statut de validation:', error)
      throw error
    }
  }

  // Obtenir la répartition des utilisateurs par rôle
  async getUsersByRole() {
    try {
      const response = await api.get('/statistics/users/by-role')
      return response.data
    } catch (error) {
      console.error('Erreur lors de la récupération des utilisateurs par rôle:', error)
      throw error
    }
  }

  // Obtenir les analytics avancés
  async getAdvancedAnalytics() {
    try {
      const response = await api.get('/statistics/advanced-analytics')
      return response.data
    } catch (error) {
      console.error('Erreur lors de la récupération des analytics avancés:', error)
      throw error
    }
  }

  // Obtenir toutes les statistiques en une fois
  async getAllStatistics() {
    try {
      const [
        overview,
        opportunitiesStatus,
        offresAdjuge,
        monthlyTrend,
        contractsStatus,
        facturesPayment,
        monthlyRevenue,
        topClients,
        livrablesValidation,
        usersRole,
        advancedAnalytics
      ] = await Promise.all([
        this.getOverviewStatistics(),
        this.getOpportunitiesByStatus(),
        this.getOffresByAdjuge(),
        this.getOpportunitesMonthlyTrend(),
        this.getContratsByStatus(),
        this.getFacturesByPaymentStatus(),
        this.getMonthlyRevenue(),
        this.getTopClientsByOpportunities(),
        this.getLivrablesByValidationStatus(),
        this.getUsersByRole(),
        this.getAdvancedAnalytics()
      ])

      return {
        overview,
        opportunitiesStatus,
        offresAdjuge,
        monthlyTrend,
        contractsStatus,
        facturesPayment,
        monthlyRevenue,
        topClients,
        livrablesValidation,
        usersRole,
        advancedAnalytics
      }
    } catch (error) {
      console.error('Erreur lors de la récupération de toutes les statistiques:', error)
      throw error
    }
  }

  // Calculer les KPIs personnalisés
  calculateKPIs(statistics) {
    const kpis = {}
    
    if (statistics.overview && statistics.advancedAnalytics) {
      // Calcul du taux de croissance (approximation)
      kpis.growthRate = statistics.advancedAnalytics.conversionRate > 50 ? 'Élevé' : 'Modéré'
      
      // Score de performance global
      const conversionScore = (statistics.advancedAnalytics.conversionRate || 0) / 100
      const successScore = (statistics.advancedAnalytics.successRate || 0) / 100
      const revenueScore = (statistics.advancedAnalytics.totalRevenue || 0) > 1000000 ? 1 : 0.5
      
      kpis.performanceScore = Math.round((conversionScore + successScore + revenueScore) / 3 * 100)
      
      // Recommandations
      kpis.recommendations = []
      
      if ((statistics.advancedAnalytics.conversionRate || 0) < 30) {
        kpis.recommendations.push('Améliorer le processus de qualification des opportunités')
      }
      
      if ((statistics.advancedAnalytics.successRate || 0) < 25) {
        kpis.recommendations.push('Revoir la stratégie de réponse aux appels d\'offres')
      }
      
      if ((statistics.advancedAnalytics.averageContractValue || 0) < 30000) {
        kpis.recommendations.push('Cibler des projets de plus grande envergure')
      }
      
      if (kpis.recommendations.length === 0) {
        kpis.recommendations.push('Excellente performance ! Continuer sur cette lancée.')
      }
    }
    
    return kpis
  }

  // Exporter les données en CSV
  exportToCSV(data, filename) {
    const csvContent = this.convertToCSV(data)
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' })
    const link = document.createElement('a')
    
    if (link.download !== undefined) {
      const url = URL.createObjectURL(blob)
      link.setAttribute('href', url)
      link.setAttribute('download', filename || 'statistics.csv')
      link.style.visibility = 'hidden'
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
    }
  }

  // Convertir les données en format CSV
  convertToCSV(data) {
    if (!data || !Array.isArray(data)) return ''
    
    const headers = Object.keys(data[0] || {})
    const csvRows = [
      headers.join(','),
      ...data.map(row => headers.map(header => {
        const value = row[header]
        return typeof value === 'string' ? `"${value}"` : value
      }).join(','))
    ]
    
    return csvRows.join('\n')
  }
}

export default new StatisticsService()