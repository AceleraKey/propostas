import { useState, useRef, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card.jsx'
import { Button } from '@/components/ui/button.jsx'
import { Input } from '@/components/ui/input.jsx'
import { Label } from '@/components/ui/label.jsx'
import { MapPin, Plus, Trash2, Edit3 } from 'lucide-react'

const PlantaBaixa = ({ 
  plantaBaixaUrl, 
  ambientes = [], 
  coordenadasAmbientes = {},
  selectedAutomacao = new Set(),
  selectedSom = new Set(),
  onCoordenadasChange 
}) => {
  const [isEditMode, setIsEditMode] = useState(false)
  const [selectedAmbiente, setSelectedAmbiente] = useState(null)
  const [isDrawing, setIsDrawing] = useState(false)
  const [startPoint, setStartPoint] = useState(null)
  const [tempRect, setTempRect] = useState(null)
  const canvasRef = useRef(null)
  const imageRef = useRef(null)

  const handleImageLoad = () => {
    if (canvasRef.current && imageRef.current) {
      const canvas = canvasRef.current
      const img = imageRef.current
      canvas.width = img.naturalWidth
      canvas.height = img.naturalHeight
      redrawCanvas()
    }
  }

  const redrawCanvas = () => {
    if (!canvasRef.current || !imageRef.current) return
    
    const canvas = canvasRef.current
    const ctx = canvas.getContext('2d')
    const img = imageRef.current
    
    // Limpar canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height)
    
    // Desenhar retângulos dos ambientes
    Object.entries(coordenadasAmbientes).forEach(([ambienteId, coords]) => {
      const ambiente = ambientes.find(a => a.id === ambienteId)
      if (!ambiente || !coords) return
      
      const isSelectedAutomacao = selectedAutomacao.has(ambienteId)
      const isSelectedSom = selectedSom.has(ambienteId)
      
      // Definir cor baseada na seleção
      let fillColor = 'rgba(200, 200, 200, 0.3)'
      let strokeColor = 'rgba(100, 100, 100, 0.8)'
      
      if (isSelectedAutomacao && isSelectedSom) {
        fillColor = 'rgba(147, 51, 234, 0.4)' // Roxo para ambos
        strokeColor = 'rgba(147, 51, 234, 1)'
      } else if (isSelectedAutomacao) {
        fillColor = ambiente.highlight 
          ? 'rgba(202, 138, 4, 0.4)' // Amarelo para highlight
          : 'rgba(23, 37, 84, 0.4)' // Azul para automação
        strokeColor = ambiente.highlight ? 'rgba(202, 138, 4, 1)' : 'rgba(23, 37, 84, 1)'
      } else if (isSelectedSom) {
        fillColor = 'rgba(107, 33, 168, 0.4)' // Roxo para som
        strokeColor = 'rgba(107, 33, 168, 1)'
      }
      
      // Desenhar retângulo
      ctx.fillStyle = fillColor
      ctx.strokeStyle = strokeColor
      ctx.lineWidth = 2
      
      ctx.fillRect(coords.x, coords.y, coords.width, coords.height)
      ctx.strokeRect(coords.x, coords.y, coords.width, coords.height)
      
      // Desenhar label do ambiente
      ctx.fillStyle = strokeColor
      ctx.font = '12px Arial'
      ctx.textAlign = 'center'
      ctx.fillText(
        ambiente.nome, 
        coords.x + coords.width / 2, 
        coords.y + coords.height / 2
      )
    })
    
    // Desenhar retângulo temporário durante o desenho
    if (tempRect) {
      ctx.fillStyle = 'rgba(59, 130, 246, 0.3)'
      ctx.strokeStyle = 'rgba(59, 130, 246, 1)'
      ctx.lineWidth = 2
      ctx.fillRect(tempRect.x, tempRect.y, tempRect.width, tempRect.height)
      ctx.strokeRect(tempRect.x, tempRect.y, tempRect.width, tempRect.height)
    }
  }

  useEffect(() => {
    redrawCanvas()
  }, [coordenadasAmbientes, selectedAutomacao, selectedSom, tempRect])

  const getCanvasCoordinates = (e) => {
    const canvas = canvasRef.current
    const rect = canvas.getBoundingClientRect()
    const scaleX = canvas.width / rect.width
    const scaleY = canvas.height / rect.height
    
    return {
      x: (e.clientX - rect.left) * scaleX,
      y: (e.clientY - rect.top) * scaleY
    }
  }

  const handleCanvasMouseDown = (e) => {
    if (!isEditMode || !selectedAmbiente) return
    
    const coords = getCanvasCoordinates(e)
    setIsDrawing(true)
    setStartPoint(coords)
  }

  const handleCanvasMouseMove = (e) => {
    if (!isDrawing || !startPoint) return
    
    const coords = getCanvasCoordinates(e)
    const width = coords.x - startPoint.x
    const height = coords.y - startPoint.y
    
    setTempRect({
      x: width > 0 ? startPoint.x : coords.x,
      y: height > 0 ? startPoint.y : coords.y,
      width: Math.abs(width),
      height: Math.abs(height)
    })
  }

  const handleCanvasMouseUp = (e) => {
    if (!isDrawing || !startPoint || !selectedAmbiente) return
    
    const coords = getCanvasCoordinates(e)
    const width = coords.x - startPoint.x
    const height = coords.y - startPoint.y
    
    const newCoords = {
      x: width > 0 ? startPoint.x : coords.x,
      y: height > 0 ? startPoint.y : coords.y,
      width: Math.abs(width),
      height: Math.abs(height)
    }
    
    // Só salvar se o retângulo tem tamanho mínimo
    if (newCoords.width > 10 && newCoords.height > 10) {
      onCoordenadasChange(selectedAmbiente, newCoords)
    }
    
    setIsDrawing(false)
    setStartPoint(null)
    setTempRect(null)
    setSelectedAmbiente(null)
  }

  const removeAmbienteCoordenadas = (ambienteId) => {
    onCoordenadasChange(ambienteId, null)
  }

  if (!plantaBaixaUrl) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <MapPin className="h-5 w-5" />
            Planta Baixa
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8 text-gray-500">
            <MapPin className="h-12 w-12 mx-auto mb-4 opacity-50" />
            <p>Nenhuma planta baixa carregada</p>
            <p className="text-sm">Faça upload de uma planta baixa para mapear os ambientes</p>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              <MapPin className="h-5 w-5" />
              Mapeamento de Ambientes
            </CardTitle>
            <Button
              variant={isEditMode ? "destructive" : "outline"}
              size="sm"
              onClick={() => {
                setIsEditMode(!isEditMode)
                setSelectedAmbiente(null)
              }}
            >
              <Edit3 className="h-4 w-4 mr-2" />
              {isEditMode ? 'Sair do Modo Edição' : 'Editar Coordenadas'}
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          {isEditMode && (
            <div className="mb-4 p-4 bg-blue-50 rounded-lg">
              <h3 className="font-medium mb-2">Modo de Edição Ativo</h3>
              <p className="text-sm text-gray-600 mb-3">
                Selecione um ambiente abaixo e depois clique e arraste na planta para definir sua área.
              </p>
              
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2">
                {ambientes.map(ambiente => (
                  <Button
                    key={ambiente.id}
                    variant={selectedAmbiente === ambiente.id ? "default" : "outline"}
                    size="sm"
                    className="text-xs"
                    onClick={() => setSelectedAmbiente(ambiente.id)}
                  >
                    {ambiente.nome}
                  </Button>
                ))}
              </div>
              
              {selectedAmbiente && (
                <p className="text-sm text-blue-600 mt-2">
                  Clique e arraste na planta para definir a área do ambiente: {ambientes.find(a => a.id === selectedAmbiente)?.nome}
                </p>
              )}
            </div>
          )}
          
          <div className="relative border rounded-lg overflow-hidden">
            <img
              ref={imageRef}
              src={plantaBaixaUrl}
              alt="Planta Baixa"
              className="w-full h-auto"
              onLoad={handleImageLoad}
            />
            <canvas
              ref={canvasRef}
              className="absolute top-0 left-0 w-full h-full cursor-crosshair"
              onMouseDown={handleCanvasMouseDown}
              onMouseMove={handleCanvasMouseMove}
              onMouseUp={handleCanvasMouseUp}
              style={{ pointerEvents: isEditMode ? 'auto' : 'none' }}
            />
          </div>
          
          {/* Lista de ambientes mapeados */}
          <div className="mt-4">
            <h3 className="font-medium mb-2">Ambientes Mapeados</h3>
            <div className="space-y-2">
              {Object.entries(coordenadasAmbientes).map(([ambienteId, coords]) => {
                const ambiente = ambientes.find(a => a.id === ambienteId)
                if (!ambiente) return null
                
                const isSelectedAutomacao = selectedAutomacao.has(ambienteId)
                const isSelectedSom = selectedSom.has(ambienteId)
                
                return (
                  <div key={ambienteId} className="flex items-center justify-between p-2 bg-gray-50 rounded">
                    <div className="flex items-center gap-2">
                      <div 
                        className="w-4 h-4 rounded border-2"
                        style={{
                          backgroundColor: isSelectedAutomacao && isSelectedSom 
                            ? 'rgba(147, 51, 234, 0.4)'
                            : isSelectedAutomacao 
                              ? (ambiente.highlight ? 'rgba(202, 138, 4, 0.4)' : 'rgba(23, 37, 84, 0.4)')
                              : isSelectedSom 
                                ? 'rgba(107, 33, 168, 0.4)'
                                : 'rgba(200, 200, 200, 0.3)',
                          borderColor: isSelectedAutomacao && isSelectedSom 
                            ? 'rgba(147, 51, 234, 1)'
                            : isSelectedAutomacao 
                              ? (ambiente.highlight ? 'rgba(202, 138, 4, 1)' : 'rgba(23, 37, 84, 1)')
                              : isSelectedSom 
                                ? 'rgba(107, 33, 168, 1)'
                                : 'rgba(100, 100, 100, 0.8)'
                        }}
                      />
                      <span className="text-sm font-medium">{ambiente.nome}</span>
                      <span className="text-xs text-gray-500">
                        ({Math.round(coords.x)}, {Math.round(coords.y)}) - {Math.round(coords.width)}x{Math.round(coords.height)}
                      </span>
                    </div>
                    {isEditMode && (
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => removeAmbienteCoordenadas(ambienteId)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    )}
                  </div>
                )
              })}
            </div>
            
            {Object.keys(coordenadasAmbientes).length === 0 && (
              <p className="text-sm text-gray-500 italic">
                Nenhum ambiente mapeado ainda. Use o modo de edição para mapear os ambientes.
              </p>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

export default PlantaBaixa
