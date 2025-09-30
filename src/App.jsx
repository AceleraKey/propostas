import { useState } from 'react'
import { Button } from '@/components/ui/button.jsx'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card.jsx'
import { Input } from '@/components/ui/input.jsx'
import { Label } from '@/components/ui/label.jsx'
import { Textarea } from '@/components/ui/textarea.jsx'
import { Checkbox } from '@/components/ui/checkbox.jsx'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs.jsx'
import { Upload, Camera, MapPin, User, Building, FileText, Zap, Volume2, Wifi, Cable, ArrowLeft, ArrowRight } from 'lucide-react'
import AmbientSelector from './components/AmbientSelector.jsx'
import PlantaBaixa from './components/PlantaBaixa.jsx'
import CalculadoraCustos from './components/CalculadoraCustos.jsx'
import PropostaGenerator from './components/PropostaGenerator.jsx'
import AdminPanel from './components/AdminPanel.jsx'
import './App.css'

// Dados de ambientes padrão baseados no código Paulinho
const AMBIENTES_PADRAO = [
  { id: 'sala', nome: 'Sala de Estar', circuitos: 8, tvs: 1, ar_condicionados: 1, smartpads_originais: 2, smartpads_incluidos: false, caixas_som: 4, tem_subwoofer: null },
  { id: 'cozinha', nome: 'Cozinha', circuitos: 6, tvs: 1, ar_condicionados: 0, smartpads_originais: 1, smartpads_incluidos: false, caixas_som: 2, tem_subwoofer: null },
  { id: 'suite-master', nome: 'Suíte Master', circuitos: 8, tvs: 1, ar_condicionados: 1, smartpads_originais: 2, smartpads_incluidos: false, caixas_som: 2, tem_subwoofer: null },
  { id: 'suite-2', nome: 'Suíte 2', circuitos: 6, tvs: 1, ar_condicionados: 1, smartpads_originais: 1, smartpads_incluidos: false, caixas_som: 2, tem_subwoofer: null },
  { id: 'suite-3', nome: 'Suíte 3', circuitos: 6, tvs: 1, ar_condicionados: 1, smartpads_originais: 1, smartpads_incluidos: false, caixas_som: 2, tem_subwoofer: null },
  { id: 'varanda', nome: 'Varanda', circuitos: 4, tvs: 0, ar_condicionados: 0, smartpads_originais: 1, smartpads_incluidos: false, caixas_som: 4, tem_subwoofer: null },
  { id: 'lavabo', nome: 'Lavabo', circuitos: 2, tvs: 0, ar_condicionados: 0, smartpads_originais: 1, smartpads_incluidos: false, caixas_som: 1, tem_subwoofer: null },
  { id: 'circulacao', nome: 'Circulação Social', circuitos: 6, tvs: 0, ar_condicionados: 0, smartpads_originais: 1, smartpads_incluidos: false, caixas_som: 2, tem_subwoofer: null, highlight: true },
  { id: 'circulacao-intimo', nome: 'Circulação Íntimo', circuitos: 4, tvs: 0, ar_condicionados: 0, smartpads_originais: 1, smartpads_incluidos: false, caixas_som: 2, tem_subwoofer: null }
]

function App() {
  const [currentView, setCurrentView] = useState('form') // 'form' ou 'selector'
  const [currentStep, setCurrentStep] = useState(1)
  const totalSteps = 4

  // Estados do formulário
  const [formData, setFormData] = useState({
    nomeCliente: '',
    emailCliente: '',
    telefoneCliente: '',
    nomeArquiteto: '',
    empresaArquiteto: '',
    emailArquiteto: '',
    categorias: [],
    heroImages: [],
    plantaBaixa: null,
    observacoes: ''
  })

  // Estados do sistema de seleção
  const [ambientes, setAmbientes] = useState(AMBIENTES_PADRAO)
  const [selectedAutomacao, setSelectedAutomacao] = useState(new Set())
  const [selectedSom, setSelectedSom] = useState(new Set())
  const [selectedOpcionais, setSelectedOpcionais] = useState(new Set())
  const [coordenadasAmbientes, setCoordenadasAmbientes] = useState({})
  const [plantaBaixaUrl, setPlantaBaixaUrl] = useState(null)

  const categorias = [
    { id: 'som', label: 'Sonorização', icon: Volume2, color: 'text-purple-600' },
    { id: 'automacao', label: 'Automação', icon: Zap, color: 'text-blue-600' },
    { id: 'cabeamento', label: 'Cabeamento Estruturado', icon: Cable, color: 'text-green-600' },
    { id: 'rede', label: 'Rede Wi-Fi', icon: Wifi, color: 'text-orange-600' }
  ]

  const handleInputChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }))
  }

  const handleCategoriaChange = (categoriaId, checked) => {
    setFormData(prev => ({
      ...prev,
      categorias: checked 
        ? [...prev.categorias, categoriaId]
        : prev.categorias.filter(id => id !== categoriaId)
    }))
  }

  const handleFileUpload = (field, files) => {
    if (field === 'heroImages') {
      setFormData(prev => ({
        ...prev,
        [field]: [...prev[field], ...Array.from(files)]
      }))
    } else if (field === 'plantaBaixa') {
      const file = files[0]
      setFormData(prev => ({
        ...prev,
        [field]: file
      }))
      // Criar URL para preview
      if (file) {
        const url = URL.createObjectURL(file)
        setPlantaBaixaUrl(url)
      }
    }
  }

  const removeHeroImage = (index) => {
    setFormData(prev => ({
      ...prev,
      heroImages: prev.heroImages.filter((_, i) => i !== index)
    }))
  }

  const nextStep = () => {
    if (currentStep < totalSteps) {
      setCurrentStep(currentStep + 1)
    }
  }

  const prevStep = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1)
    }
  }

  const handleSubmit = () => {
    console.log('Dados do formulário:', formData)
    setCurrentView('selector')
  }

  const handleSelectionChange = (type, newSelection) => {
    if (type === 'automacao') {
      setSelectedAutomacao(newSelection)
    } else if (type === 'som') {
      setSelectedSom(newSelection)
    }
  }

  const handleSmartpadToggle = (ambienteId, incluir) => {
    setAmbientes(prev => prev.map(ambiente => 
      ambiente.id === ambienteId 
        ? { ...ambiente, smartpads_incluidos: incluir }
        : ambiente
    ))
  }

  const handleSubwooferToggle = (ambienteId, temSubwoofer) => {
    setAmbientes(prev => prev.map(ambiente => 
      ambiente.id === ambienteId 
        ? { ...ambiente, tem_subwoofer: temSubwoofer }
        : ambiente
    ))
  }

  const handleCoordenadasChange = (ambienteId, coordenadas) => {
    setCoordenadasAmbientes(prev => {
      if (coordenadas === null) {
        const { [ambienteId]: removed, ...rest } = prev
        return rest
      }
      return {
        ...prev,
        [ambienteId]: coordenadas
      }
    })
  }

  const voltarParaFormulario = () => {
    setCurrentView('form')
  }

  const gerarProposta = () => {
    const dadosCompletos = {
      cliente: formData,
      ambientes: ambientes,
      selecoes: {
        automacao: Array.from(selectedAutomacao),
        som: Array.from(selectedSom),
        opcionais: Array.from(selectedOpcionais)
      },
      coordenadas: coordenadasAmbientes
    }
    
    console.log('Gerando proposta com dados:', dadosCompletos)
    alert('Proposta gerada com sucesso! Em breve será implementada a geração do PDF.')
  }

  if (currentView === 'selector') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
        {/* Header do Sistema de Seleção */}
        <header className="bg-white shadow-sm border-b">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <img 
                  src="/src/assets/Logo.png" 
                  alt="Unike Logo" 
                  className="h-12 w-auto"
                />
                <div>
                  <h1 className="text-2xl font-bold text-gray-900">Sistema de Seleção</h1>
                  <p className="text-sm text-gray-600">Cliente: {formData.nomeCliente} | Arquiteto: {formData.nomeArquiteto}</p>
                </div>
              </div>
              <div className="flex items-center gap-4">
                <Button variant="outline" onClick={voltarParaFormulario}>
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  Voltar ao Formulário
                </Button>
                <Button onClick={gerarProposta} className="bg-green-600 hover:bg-green-700">
                  Gerar Proposta
                </Button>
              </div>
            </div>
          </div>
        </header>

        {/* Conteúdo Principal */}
        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
            {/* Coluna Principal - Seleção e Planta */}
            <div className="lg:col-span-3 space-y-8">
              <Tabs defaultValue="ambientes" className="w-full">
                <TabsList className="grid w-full grid-cols-4">
                  <TabsTrigger value="ambientes">Seleção de Ambientes</TabsTrigger>
                  <TabsTrigger value="planta">Planta Baixa</TabsTrigger>
                  <TabsTrigger value="proposta">Gerar Proposta</TabsTrigger>
                  <TabsTrigger value="admin">Administração</TabsTrigger>
                </TabsList>
                
                <TabsContent value="ambientes" className="space-y-6">
                  <AmbientSelector
                    ambientes={ambientes}
                    selectedAutomacao={selectedAutomacao}
                    selectedSom={selectedSom}
                    onSelectionChange={handleSelectionChange}
                    onSmartpadToggle={handleSmartpadToggle}
                    onSubwooferToggle={handleSubwooferToggle}
                  />
                </TabsContent>
                
                <TabsContent value="planta">
                  <PlantaBaixa
                    plantaBaixaUrl={plantaBaixaUrl}
                    ambientes={ambientes}
                    coordenadasAmbientes={coordenadasAmbientes}
                    selectedAutomacao={selectedAutomacao}
                    selectedSom={selectedSom}
                    onCoordenadasChange={handleCoordenadasChange}
                  />
                </TabsContent>
                
                <TabsContent value="proposta">
                  <PropostaGenerator
                    dadosCliente={formData}
                    dadosArquiteto={{
                      nomeArquiteto: formData.nomeArquiteto,
                      empresaArquiteto: formData.empresaArquiteto,
                      emailArquiteto: formData.emailArquiteto
                    }}
                    ambientes={ambientes}
                    selectedAutomacao={selectedAutomacao}
                    selectedSom={selectedSom}
                    coordenadasAmbientes={coordenadasAmbientes}
                    custos={{
                      automation: { total: selectedAutomacao.size > 0 ? 12070 : 0 },
                      sound: { total: selectedSom.size > 0 ? 8500 : 0 },
                      grandTotal: (selectedAutomacao.size > 0 ? 12070 : 0) + (selectedSom.size > 0 ? 8500 : 0)
                    }}
                    onGerarProposta={(proposta) => {
                      console.log('Proposta gerada:', proposta)
                    }}
                  />
                </TabsContent>
                
                <TabsContent value="admin">
                  <AdminPanel
                    onProdutosChange={(novosProdutos) => {
                      console.log('Produtos atualizados:', novosProdutos)
                    }}
                  />
                </TabsContent>
              </Tabs>
            </div>

            {/* Coluna Lateral - Calculadora */}
            <div className="lg:col-span-1">
              <CalculadoraCustos
                ambientes={ambientes}
                selectedAutomacao={selectedAutomacao}
                selectedSom={selectedSom}
                opcionaisSelecionados={selectedOpcionais}
              />
            </div>
          </div>
        </main>
      </div>
    )
  }

  // Renderização do formulário (código anterior mantido)
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <img 
                src="/src/assets/Logo.png" 
                alt="Unike Logo" 
                className="h-12 w-auto"
              />
              <div>
                <h1 className="text-2xl font-bold text-gray-900">Sistema de Propostas</h1>
                <p className="text-sm text-gray-600">Geração rápida de orçamentos personalizados</p>
              </div>
            </div>
            <div className="text-right">
              <p className="text-sm text-gray-500">Etapa {currentStep} de {totalSteps}</p>
              <div className="w-32 bg-gray-200 rounded-full h-2 mt-1">
                <div 
                  className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                  style={{ width: `${(currentStep / totalSteps) * 100}%` }}
                ></div>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        
        {/* Step 1: Dados do Cliente */}
        {currentStep === 1 && (
          <Card className="w-full">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <User className="h-6 w-6 text-blue-600" />
                Dados do Cliente
              </CardTitle>
              <CardDescription>
                Informe os dados do cliente e do projeto
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="nomeCliente">Nome do Cliente *</Label>
                  <Input
                    id="nomeCliente"
                    placeholder="Ex: João Silva"
                    value={formData.nomeCliente}
                    onChange={(e) => handleInputChange('nomeCliente', e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="emailCliente">Email do Cliente</Label>
                  <Input
                    id="emailCliente"
                    type="email"
                    placeholder="cliente@email.com"
                    value={formData.emailCliente}
                    onChange={(e) => handleInputChange('emailCliente', e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="telefoneCliente">Telefone do Cliente</Label>
                  <Input
                    id="telefoneCliente"
                    placeholder="(71) 99999-9999"
                    value={formData.telefoneCliente}
                    onChange={(e) => handleInputChange('telefoneCliente', e.target.value)}
                  />
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Step 2: Dados do Arquiteto */}
        {currentStep === 2 && (
          <Card className="w-full">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Building className="h-6 w-6 text-blue-600" />
                Dados do Arquiteto
              </CardTitle>
              <CardDescription>
                Informe os dados do arquiteto responsável pelo projeto
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="nomeArquiteto">Nome do Arquiteto *</Label>
                  <Input
                    id="nomeArquiteto"
                    placeholder="Ex: Maria Arquiteta"
                    value={formData.nomeArquiteto}
                    onChange={(e) => handleInputChange('nomeArquiteto', e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="empresaArquiteto">Empresa/Escritório</Label>
                  <Input
                    id="empresaArquiteto"
                    placeholder="Ex: Estúdio de Arquitetura"
                    value={formData.empresaArquiteto}
                    onChange={(e) => handleInputChange('empresaArquiteto', e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="emailArquiteto">Email do Arquiteto</Label>
                  <Input
                    id="emailArquiteto"
                    type="email"
                    placeholder="arquiteto@email.com"
                    value={formData.emailArquiteto}
                    onChange={(e) => handleInputChange('emailArquiteto', e.target.value)}
                  />
                </div>
              </div>

              {/* Categorias da Proposta */}
              <div className="space-y-4">
                <Label className="text-base font-semibold">Categorias da Proposta *</Label>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {categorias.map((categoria) => {
                    const IconComponent = categoria.icon
                    return (
                      <div key={categoria.id} className="flex items-center space-x-3 p-4 border rounded-lg hover:bg-gray-50 transition-colors">
                        <Checkbox
                          id={categoria.id}
                          checked={formData.categorias.includes(categoria.id)}
                          onCheckedChange={(checked) => handleCategoriaChange(categoria.id, checked)}
                        />
                        <IconComponent className={`h-5 w-5 ${categoria.color}`} />
                        <Label htmlFor={categoria.id} className="cursor-pointer flex-1">
                          {categoria.label}
                        </Label>
                      </div>
                    )
                  })}
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Step 3: Upload de Imagens */}
        {currentStep === 3 && (
          <Card className="w-full">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Camera className="h-6 w-6 text-blue-600" />
                Imagens do Projeto
              </CardTitle>
              <CardDescription>
                Faça upload das imagens para a seção hero e da planta baixa
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Hero Images */}
              <div className="space-y-4">
                <Label className="text-base font-semibold">Imagens Hero Section</Label>
                <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-gray-400 transition-colors">
                  <Upload className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <p className="text-sm text-gray-600 mb-4">
                    Clique para selecionar ou arraste as imagens aqui
                  </p>
                  <input
                    type="file"
                    multiple
                    accept="image/*"
                    onChange={(e) => handleFileUpload('heroImages', e.target.files)}
                    className="hidden"
                    id="heroImages"
                  />
                  <Button 
                    variant="outline" 
                    onClick={() => document.getElementById('heroImages').click()}
                  >
                    Selecionar Imagens
                  </Button>
                </div>
                
                {/* Preview das imagens hero */}
                {formData.heroImages.length > 0 && (
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                    {formData.heroImages.map((file, index) => (
                      <div key={index} className="relative group">
                        <img
                          src={URL.createObjectURL(file)}
                          alt={`Hero ${index + 1}`}
                          className="w-full h-32 object-cover rounded-lg"
                        />
                        <Button
                          variant="destructive"
                          size="sm"
                          className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity"
                          onClick={() => removeHeroImage(index)}
                        >
                          ×
                        </Button>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Planta Baixa */}
              <div className="space-y-4">
                <Label className="text-base font-semibold">Planta Baixa (PNG) *</Label>
                <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-gray-400 transition-colors">
                  <MapPin className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <p className="text-sm text-gray-600 mb-4">
                    Selecione a planta baixa em formato PNG
                  </p>
                  <input
                    type="file"
                    accept="image/png"
                    onChange={(e) => handleFileUpload('plantaBaixa', e.target.files)}
                    className="hidden"
                    id="plantaBaixa"
                  />
                  <Button 
                    variant="outline" 
                    onClick={() => document.getElementById('plantaBaixa').click()}
                  >
                    Selecionar Planta Baixa
                  </Button>
                </div>
                
                {/* Preview da planta baixa */}
                {formData.plantaBaixa && (
                  <div className="mt-4">
                    <img
                      src={URL.createObjectURL(formData.plantaBaixa)}
                      alt="Planta Baixa"
                      className="max-w-full h-64 object-contain mx-auto border rounded-lg"
                    />
                    <p className="text-sm text-gray-600 text-center mt-2">
                      {formData.plantaBaixa.name}
                    </p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Step 4: Observações e Finalização */}
        {currentStep === 4 && (
          <Card className="w-full">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FileText className="h-6 w-6 text-blue-600" />
                Observações e Finalização
              </CardTitle>
              <CardDescription>
                Adicione observações adicionais e finalize a criação da proposta
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="observacoes">Observações Adicionais</Label>
                <Textarea
                  id="observacoes"
                  placeholder="Adicione qualquer informação adicional sobre o projeto..."
                  rows={4}
                  value={formData.observacoes}
                  onChange={(e) => handleInputChange('observacoes', e.target.value)}
                />
              </div>

              {/* Resumo dos dados */}
              <div className="bg-gray-50 p-4 rounded-lg">
                <h3 className="font-semibold mb-3">Resumo da Proposta</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                  <div>
                    <p><strong>Cliente:</strong> {formData.nomeCliente || 'Não informado'}</p>
                    <p><strong>Arquiteto:</strong> {formData.nomeArquiteto || 'Não informado'}</p>
                  </div>
                  <div>
                    <p><strong>Categorias:</strong> {formData.categorias.length > 0 ? formData.categorias.join(', ') : 'Nenhuma selecionada'}</p>
                    <p><strong>Imagens Hero:</strong> {formData.heroImages.length} imagem(ns)</p>
                    <p><strong>Planta Baixa:</strong> {formData.plantaBaixa ? 'Enviada' : 'Não enviada'}</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Navigation Buttons */}
        <div className="flex justify-between mt-8">
          <Button 
            variant="outline" 
            onClick={prevStep}
            disabled={currentStep === 1}
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Anterior
          </Button>
          
          {currentStep < totalSteps ? (
            <Button onClick={nextStep}>
              Próximo
              <ArrowRight className="h-4 w-4 ml-2" />
            </Button>
          ) : (
            <Button 
              onClick={handleSubmit}
              className="bg-blue-600 hover:bg-blue-700"
              disabled={!formData.nomeCliente || !formData.nomeArquiteto || formData.categorias.length === 0}
            >
              Iniciar Seleção
              <ArrowRight className="h-4 w-4 ml-2" />
            </Button>
          )}
        </div>
      </main>
    </div>
  )
}

export default App
