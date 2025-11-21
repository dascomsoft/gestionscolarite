
import { useEffect } from 'react'
import React, { useState } from 'react'
import { FEES } from '../lib/fees'
import '../Styles/Palier.css'

export function Palier({ onSectionSelect, navigateTo }) {
  const [selectedSection, setSelectedSection] = useState('')
  const [selectedLevel, setSelectedLevel] = useState('')
  const [selectedClass, setSelectedClass] = useState('')

  const sections = [
    { id: 'im1', name: 'Section Francophone', description: 'Programme francophone' },
    { id: 'im2', name: 'Section Anglophone', description: 'Programme anglophone' }
  ]

  const handleSectionSelect = (sectionId) => {
    setSelectedSection(sectionId)
    setSelectedLevel('')
    setSelectedClass('')
  }

  const handleLevelSelect = (level) => {
    setSelectedLevel(level)
    setSelectedClass('')
  }

  const handleClassSelect = (className) => {
    setSelectedClass(className)
  }

  const handleContinue = () => {
    if (selectedSection && selectedClass) {
      onSectionSelect(selectedSection, selectedClass)
    }
  }

  const getLevels = () => {
    if (!selectedSection) return []
    const section = FEES[selectedSection]
    return Object.keys(section)
  }

  const getClasses = () => {
    if (!selectedSection || !selectedLevel) return []
    const section = FEES[selectedSection]
    return section[selectedLevel]?.classes || []
  }

  const getLevelName = (level) => {
    const names = {
      nursery: 'Maternelle',
      primary: 'Primaire',
      maternelle: 'Maternelle',
      sil_cm1: 'SIL - CM1',
      cm2: 'CM2'
    }
    return names[level] || level
  }

     useEffect(() =>{
       window.scrollTo(0,0)
     },[])
   

  return (
    <div className="palier-container">
      <div className="palier-content">
        <div className="text-center mb-8">
          <h1 className="palier-title">Choisir la section et la classe</h1>
          <p className="palier-subtitle">Sélectionnez la section et la classe de l'élève</p>
        </div>

        {/* Sélection de la section */}
        <div className="selection-card">
          <h2 className="selection-title">1. Choisir la section</h2>
          <div className="sections-grid">
            {sections.map((section) => (
              <button
                key={section.id}
                onClick={() => handleSectionSelect(section.id)}
                className={`section-button ${
                  selectedSection === section.id ? 'section-button-selected' : 'section-button-default'
                }`}
              >
                <h3 className="section-name">{section.name}</h3>
                <p className="section-description">{section.description}</p>
              </button>
            ))}
          </div>
        </div>

        {/* Sélection du niveau */}
        {selectedSection && (
          <div className="selection-card">
            <h2 className="selection-title">2. Choisir le niveau</h2>
            <div className="levels-grid">
              {getLevels().map((level) => (
                <button
                  key={level}
                  onClick={() => handleLevelSelect(level)}
                  className={`level-button ${
                    selectedLevel === level ? 'level-button-selected' : 'level-button-default'
                  }`}
                >
                  <span className="level-name">{getLevelName(level)}</span>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Sélection de la classe */}
        {selectedLevel && (
          <div className="selection-card">
            <h2 className="selection-title">3. Choisir la classe</h2>
            <div className="classes-grid">
              {getClasses().map((className) => (
                <button
                  key={className}
                  onClick={() => handleClassSelect(className)}
                  className={`class-button ${
                    selectedClass === className ? 'class-button-selected' : 'class-button-default'
                  }`}
                >
                  <span className="class-name">{className}</span>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Informations sur les frais */}
        {selectedClass && (
          <div className="selection-card">
            <h2 className="selection-title">Frais de scolarité</h2>
            <div className="fees-info">
              <div className="fees-grid">
                <div>
                  <span className="fees-label">Section:</span>{' '}
                  {sections.find(s => s.id === selectedSection)?.name}
                </div>
                <div>
                  <span className="fees-label">Classe:</span> {selectedClass}
                </div>
                <div>
                  <span className="fees-label">Niveau:</span> {getLevelName(selectedLevel)}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Boutons d'action */}
        {selectedClass && (
          <div className="actions-container">
            <button
              onClick={() => navigateTo('students')}
              className="btn-secondary"
            >
              Voir tous les élèves
            </button>
            
            <button
              onClick={handleContinue}
              className="btn-primary"
            >
              Continuer vers le paiement
            </button>
          </div>
        )}
      </div>
    </div>
  )
}