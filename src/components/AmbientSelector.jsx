import { useState, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card.jsx'
import { Button } from '@/components/ui/button.jsx'
import { Badge } from '@/components/ui/badge.jsx'
import { Zap, Volume2, Tv, Snowflake, Lightbulb, Tablet } from 'lucide-react'

const AmbientSelector = ({ 
  ambientes = [], 
  selectedAutomacao = new Set(), 
  selectedSom = new Set(),
  onSelectionChange,
  onSmartpadToggle,
  onSubwooferToggle 
}) => {
  
  const toggleSelection = (ambienteId, type) => {
    if (type === 'automacao') {
      const newSelection = new Set(selectedAutomacao)
      
      // Lógica especial para circulação (baseada no código Paulinho)
      if (ambienteId === 'circulacao') {
        const isSelected = newSelection.has('circulacao')
        const relatedId = 'circulacao-intimo'
        
        if (isSelected) {
          newSelection.delete('circulacao')
          newSelection.delete(relatedId)
        } else {
          newSelection.add('circulacao')
          newSelection.add(relatedId)
        }
      } else {
        if (newSelection.has(ambienteId)) {
          newSelection.delete(ambienteId)
        } else {
          newSelection.add(ambienteId)
        }
      }
      
      onSelectionChange('automacao', newSelection)
    } else if (type === 'som') {
      const newSelection = new Set(selectedSom)
      
      if (newSelection.has(ambienteId)) {
        newSelection.delete(ambienteId)
      } else {
        newSelection.add(ambienteId)
      }
      
      onSelectionChange('som', newSelection)
    }
  }

  const renderAmbienteCard = (ambiente, type) => {
    const isSelected = type === 'automacao' 
      ? selectedAutomacao.has(ambiente.id)
      : selectedSom.has(ambiente.id)
    
    const selectedClass = isSelected 
      ? (type === 'automacao' 
          ? (ambiente.highlight ? 'bg-yellow-600 text-white' : 'bg-blue-900 text-white')
          : 'bg-purple-700 text-white')
      : 'bg-white hover:bg-gray-50'
    
    const borderClass = isSelected 
      ? 'border-transparent' 
      : 'border-gray-200 hover:border-gray-300'

    return (
      <Card 
        key={`${ambiente.id}-${type}`}
        className={`cursor-pointer transition-all duration-200 transform hover:scale-105 ${selectedClass} ${borderClass}`}
        onClick={() => toggleSelection(ambiente.id, type)}
      >
        <CardContent className="p-4">
          <div className="flex justify-between items-start mb-3">
            <h3 className="font-semibold text-sm leading-tight">{ambiente.nome}</h3>
            <div className={`rounded-full w-5 h-5 flex items-center justify-center text-lg transition-transform ${isSelected ? 'rotate-45' : ''}`}>
              <span className={isSelected ? 'text-white' : 'text-gray-600'}>+</span>
            </div>
          </div>
          
          <div className="space-y-1.5 text-xs">
            {type === 'automacao' && (
              <>
                <div className="flex items-center gap-1.5">
                  <Lightbulb className="h-3.5 w-3.5" />
                  <span>{ambiente.circuitos} Circuitos</span>
                </div>
                
                {ambiente.smartpads_originais > 0 && (
                  <div className={`flex items-center gap-1.5 ${!ambiente.smartpads_incluidos && !isSelected ? 'text-red-500' : ''}`}>
                    <Tablet className="h-3.5 w-3.5" />
                    <span>{ambiente.smartpads_incluidos ? ambiente.smartpads_originais : 0} Smartpads</span>
                  </div>
                )}
                
                {ambiente.tvs > 0 && (
                  <div className="flex items-center gap-1.5">
                    <Tv className="h-3.5 w-3.5" />
                    <span>{ambiente.tvs} TV</span>
                  </div>
                )}
                
                {ambiente.ar_condicionados > 0 && (
                  <div className="flex items-center gap-1.5">
                    <Snowflake className="h-3.5 w-3.5" />
                    <span>{ambiente.ar_condicionados} Ar Condicionado</span>
                  </div>
                )}
              </>
            )}
            
            {type === 'som' && (
              <div className="flex items-center gap-1.5">
                <Volume2 className="h-3.5 w-3.5" />
                <span>{ambiente.caixas_som} caixas de som</span>
              </div>
            )}
          </div>
          
          {/* Controles específicos quando selecionado */}
          {isSelected && (
            <div className="mt-4 pt-3 border-t border-white/20">
              {type === 'automacao' && ambiente.smartpads_originais > 0 && (
                <div className="space-y-2">
                  <p className="text-xs font-medium opacity-90">SMARTPADS?</p>
                  <div className="flex gap-2">
                    <Button
                      size="sm"
                      variant={!ambiente.smartpads_incluidos ? "destructive" : "outline"}
                      className="flex-1 text-xs h-7"
                      onClick={(e) => {
                        e.stopPropagation()
                        onSmartpadToggle(ambiente.id, false)
                      }}
                    >
                      NÃO
                    </Button>
                    <Button
                      size="sm"
                      variant={ambiente.smartpads_incluidos ? "default" : "outline"}
                      className="flex-1 text-xs h-7 bg-green-600 hover:bg-green-700"
                      onClick={(e) => {
                        e.stopPropagation()
                        onSmartpadToggle(ambiente.id, true)
                      }}
                    >
                      SIM
                    </Button>
                  </div>
                </div>
              )}
              
              {type === 'som' && (
                <div className="space-y-2">
                  <p className="text-xs font-medium opacity-90">Ambiente tem Subwoofer?</p>
                  <div className="flex gap-2">
                    <Button
                      size="sm"
                      variant={ambiente.tem_subwoofer === false ? "destructive" : "outline"}
                      className="flex-1 text-xs h-7"
                      onClick={(e) => {
                        e.stopPropagation()
                        onSubwooferToggle(ambiente.id, false)
                      }}
                    >
                      NÃO
                    </Button>
                    <Button
                      size="sm"
                      variant={ambiente.tem_subwoofer === true ? "default" : "outline"}
                      className="flex-1 text-xs h-7 bg-green-600 hover:bg-green-700"
                      onClick={(e) => {
                        e.stopPropagation()
                        onSubwooferToggle(ambiente.id, true)
                      }}
                    >
                      SIM
                    </Button>
                  </div>
                </div>
              )}
            </div>
          )}
        </CardContent>
      </Card>
    )
  }

  return (
    <div className="space-y-8">
      {/* Seção de Automação */}
      <div>
        <div className="flex items-center gap-3 mb-6">
          <div className="bg-blue-900 text-white p-2 rounded-lg">
            <Zap className="h-6 w-6" />
          </div>
          <div>
            <h2 className="text-xl font-semibold text-gray-900">Automação</h2>
            <p className="text-sm text-gray-600">Selecione os ambientes para automação</p>
          </div>
          {selectedAutomacao.size > 0 && (
            <Badge variant="secondary" className="ml-auto">
              {selectedAutomacao.size} selecionado(s)
            </Badge>
          )}
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {ambientes.map(ambiente => renderAmbienteCard(ambiente, 'automacao'))}
        </div>
      </div>

      {/* Seção de Som */}
      <div>
        <div className="flex items-center gap-3 mb-6">
          <div className="bg-purple-700 text-white p-2 rounded-lg">
            <Volume2 className="h-6 w-6" />
          </div>
          <div>
            <h2 className="text-xl font-semibold text-gray-900">Sonorização</h2>
            <p className="text-sm text-gray-600">Selecione os ambientes para sonorização</p>
          </div>
          {selectedSom.size > 0 && (
            <Badge variant="secondary" className="ml-auto">
              {selectedSom.size} selecionado(s)
            </Badge>
          )}
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {ambientes.map(ambiente => renderAmbienteCard(ambiente, 'som'))}
        </div>
      </div>
    </div>
  )
}

export default AmbientSelector
