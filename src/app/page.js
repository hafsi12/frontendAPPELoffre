"use client"
import { useState, useCallback } from "react"
import Opportunite from "../opportunite"
import Offre from "../offre"

export default function Page() {
  const [view, setView] = useState("opportunite") // "opportunite" or "offre"
  const [selectedOpportunityForOffre, setSelectedOpportunityForOffre] = useState(null)

  const handleNavigateToOffre = useCallback((opportunity) => {
    setSelectedOpportunityForOffre(opportunity)
    setView("offre")
  }, []) // Empty dependency array means this function is stable and won't change

  const handleCloseOffreCreation = () => {
    setSelectedOpportunityForOffre(null)
    setView("opportunite")
  }

  return (
    <div>
      {view === "opportunite" && <Opportunite onNavigateToOffre={handleNavigateToOffre} />}
      {view === "offre" && (
        <Offre initialOpportunity={selectedOpportunityForOffre} onCloseOffreCreation={handleCloseOffreCreation} />
      )}
    </div>
  )
}
