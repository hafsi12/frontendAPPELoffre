"use client"
import Opportunite from "../opportunite"

export default function Page() {
  return (
    <div>
      <Opportunite
        onNavigateToOffre={(selectedOpportunity) => {
          alert(`Navigating to Offre for opportunity: ${selectedOpportunity.projectName}`)
        }}
      />
    </div>
  )
}
