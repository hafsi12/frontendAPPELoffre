import React from 'react';
import { useParams } from 'react-router-dom';

function OpportunityDetails() {
  const { id } = useParams();

  // Tu peux récupérer l'opportunité via un fetch ou props, selon ton système
  // Pour l’exemple, on mettra des données mockées
  const opportunity = {
    id,
    projectName: "Exemple de projet",
    category: "IT",
    budget: "20000 MAD",
    deadline: "2025-07-15",
    description: "Développement d'une application web pour la gestion des offres publiques",
    files: ["CV_chef_de_projet.pdf", "Proposition.pdf"]
  };

  return (
    <div className="p-4">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2>Détails de l'opportunité</h2>
        <div>
          <button className="btn btn-success me-2">GO</button>
          <button className="btn btn-danger">NO GO</button>
        </div>
      </div>
      <table className="table table-bordered">
        <tbody>
          <tr><td>Nom du projet</td><td>{opportunity.projectName}</td></tr>
          <tr><td>Catégorie</td><td>{opportunity.category}</td></tr>
          <tr><td>Budget</td><td>{opportunity.budget}</td></tr>
          <tr><td>Deadline</td><td>{opportunity.deadline}</td></tr>
          <tr><td>Description</td><td>{opportunity.description}</td></tr>
          <tr>
            <td>Fichiers attachés</td>
            <td>
              <ul>
                {opportunity.files.map((file, idx) => (
                  <li key={idx}>{file}</li>
                ))}
              </ul>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  );
}

export default OpportunityDetails;
