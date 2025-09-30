import { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card.jsx'
import { Badge } from '@/components/ui/badge.jsx'
import { Separator } from '@/components/ui/separator.jsx'
import { Calculator, Zap, Volume2, Plus } from 'lucide-react'

// Preços baseados no código Paulinho (dados_iniciais.sql)
const PRECOS_PADRAO = {
  // Automação - Produtos
  central: 4500.00,
  homeOne: 850.00,
  centralIR: 1200.00,
  emissorIR: 45.00,
  smartpad: 320.00,
  
  // Automação - Serviços
  engenharia: 1800.00,
  configCentral: 450.00,
  circuitoIluminacao: 180.00,
  instCircuito: 180.00,
  instSmartpad: 120.00,
  configSmartpad: 80.00,
  instConfigIR: 150.00,
  
  // Som - Produtos
  multiroom: 2800.00,
  condicionadorEnergia: 380.00,
  conversorDigital: 220.00,
  caixaJBL: 450.00,
  subwooferJBL: 1200.00,
  caboParalelo: 8.50,
  caboPhilipsRCA: 12.00,
  
  // Som - Serviços
  engenhariaSom: 2200.00,
  instRack: 280.00,
  instCaixaSom: 180.00,
  instMultiroom: 120.00,
  passagemCaboSom: 15.00
}

const CalculadoraCustos = ({ 
  ambientes = [], 
  selectedAutomacao = new Set(), 
  selectedSom = new Set(),
  opcionaisSelecionados = new Set(),
  precos = PRECOS_PADRAO 
}) => {
  const [custos, setCustos] = useState({
    automation: { total: 0, detalhes: {} },
    sound: { total: 0, detalhes: {} },
    opcionais: { total: 0, itens: [] },
    grandTotal: 0
  })

  const calcularCustos = () => {
    let totalAutomationCost = 0
    let totalSoundCost = 0
    let detalhesAutomacao = {}
    let detalhesSom = {}

    // Cálculos de Automação
    if (selectedAutomacao.size > 0) {
      // Produtos base
      totalAutomationCost += precos.central
      totalAutomationCost += precos.engenharia
      totalAutomationCost += precos.configCentral
      
      detalhesAutomacao.central = precos.central
      detalhesAutomacao.engenharia = precos.engenharia
      detalhesAutomacao.configCentral = precos.configCentral

      // Calcular totais por ambiente
      let totalCircuits = 0
      let totalTvs = 0
      let totalAcs = 0
      let totalSmartpads = 0

      Array.from(selectedAutomacao).forEach(id => {
        const ambiente = ambientes.find(a => a.id === id)
        if (ambiente) {
          totalCircuits += ambiente.circuitos || 0
          totalTvs += ambiente.tvs || 0
          totalAcs += ambiente.ar_condicionados || 0
          if (ambiente.smartpads_incluidos) {
            totalSmartpads += ambiente.smartpads_originais || 0
          }
        }
      })

      // Home One (1 para cada 15 circuitos)
      if (totalCircuits > 0) {
        const homeOneQty = Math.ceil(totalCircuits / 15)
        const homeOneCost = homeOneQty * precos.homeOne
        totalAutomationCost += homeOneCost
        detalhesAutomacao.homeOnes = { quantidade: homeOneQty, total: homeOneCost }
      }

      // Dispositivos IR
      const totalIRDevices = totalTvs + totalAcs
      if (totalIRDevices > 0) {
        const centralIRQty = Math.ceil(totalIRDevices / 3)
        const centralIRCost = centralIRQty * precos.centralIR
        const emissorIRCost = totalIRDevices * precos.emissorIR
        const servicoIRCost = totalIRDevices * precos.instConfigIR
        
        totalAutomationCost += centralIRCost + emissorIRCost + servicoIRCost
        detalhesAutomacao.infravermelhos = {
          centrais: { quantidade: centralIRQty, total: centralIRCost },
          emissores: { quantidade: totalIRDevices, total: emissorIRCost },
          servicos: { quantidade: totalIRDevices, total: servicoIRCost }
        }
      }

      // Circuitos de iluminação
      if (totalCircuits > 0) {
        const circuitosCost = totalCircuits * (precos.circuitoIluminacao + precos.instCircuito)
        totalAutomationCost += circuitosCost
        detalhesAutomacao.circuitos = { quantidade: totalCircuits, total: circuitosCost }
      }

      // Smartpads
      if (totalSmartpads > 0) {
        const smartpadsCost = totalSmartpads * (precos.smartpad + precos.instSmartpad + precos.configSmartpad)
        totalAutomationCost += smartpadsCost
        detalhesAutomacao.smartpads = { quantidade: totalSmartpads, total: smartpadsCost }
      }
    }

    // Cálculos de Som
    if (selectedSom.size > 0) {
      // Produtos base do sistema
      totalSoundCost += precos.multiroom
      totalSoundCost += precos.condicionadorEnergia
      totalSoundCost += (precos.conversorDigital * 2)
      totalSoundCost += precos.engenhariaSom
      totalSoundCost += (precos.instRack * 2)
      totalSoundCost += (50 * precos.caboPhilipsRCA)
      
      detalhesSom.sistemaBase = {
        multiroom: precos.multiroom,
        condicionador: precos.condicionadorEnergia,
        conversores: precos.conversorDigital * 2,
        engenharia: precos.engenhariaSom,
        instalacaoRack: precos.instRack * 2,
        cabosRCA: 50 * precos.caboPhilipsRCA
      }

      let totalCaixas = 0
      let totalSubwoofers = 0

      Array.from(selectedSom).forEach(id => {
        const ambiente = ambientes.find(a => a.id === id)
        if (ambiente) {
          totalCaixas += ambiente.caixas_som || 0
          if (ambiente.tem_subwoofer) {
            totalSubwoofers += 1
          }
        }
      })

      // Caixas de som
      if (totalCaixas > 0) {
        const caixasCost = totalCaixas * (precos.caixaJBL + precos.instCaixaSom)
        totalSoundCost += caixasCost
        detalhesSom.caixas = { quantidade: totalCaixas, total: caixasCost }
      }

      // Subwoofers
      if (totalSubwoofers > 0) {
        const subwoofersCost = totalSubwoofers * precos.subwooferJBL
        totalSoundCost += subwoofersCost
        detalhesSom.subwoofers = { quantidade: totalSubwoofers, total: subwoofersCost }
      }

      // Serviços e cabos por ambiente
      const ambientesCount = selectedSom.size
      const servicosCost = ambientesCount * (2 * precos.instMultiroom)
      const cabosCost = ambientesCount * (50 * precos.caboParalelo + 50 * precos.passagemCaboSom)
      
      totalSoundCost += servicosCost + cabosCost
      detalhesSom.servicos = { total: servicosCost }
      detalhesSom.cabos = { total: cabosCost }
    }

    const grandTotal = totalAutomationCost + totalSoundCost

    setCustos({
      automation: { total: totalAutomationCost, detalhes: detalhesAutomacao },
      sound: { total: totalSoundCost, detalhes: detalhesSom },
      opcionais: { total: 0, itens: [] }, // TODO: implementar opcionais
      grandTotal
    })
  }

  useEffect(() => {
    calcularCustos()
  }, [selectedAutomacao, selectedSom, ambientes, precos])

  const formatCurrency = (value) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(value)
  }

  const renderDetalhesAutomacao = () => {
    const detalhes = custos.automation.detalhes
    if (!detalhes || Object.keys(detalhes).length === 0) return null

    return (
      <div className="space-y-3">
        <h4 className="font-medium text-blue-900">Detalhamento - Automação</h4>
        
        {detalhes.central && (
          <div className="flex justify-between text-sm">
            <span>Central de Automação</span>
            <span>{formatCurrency(detalhes.central)}</span>
          </div>
        )}
        
        {detalhes.engenharia && (
          <div className="flex justify-between text-sm">
            <span>Engenharia e Projeto</span>
            <span>{formatCurrency(detalhes.engenharia)}</span>
          </div>
        )}
        
        {detalhes.homeOnes && (
          <div className="flex justify-between text-sm">
            <span>Módulos Home One ({detalhes.homeOnes.quantidade}x)</span>
            <span>{formatCurrency(detalhes.homeOnes.total)}</span>
          </div>
        )}
        
        {detalhes.circuitos && (
          <div className="flex justify-between text-sm">
            <span>Circuitos de Iluminação ({detalhes.circuitos.quantidade}x)</span>
            <span>{formatCurrency(detalhes.circuitos.total)}</span>
          </div>
        )}
        
        {detalhes.smartpads && (
          <div className="flex justify-between text-sm">
            <span>Smartpads ({detalhes.smartpads.quantidade}x)</span>
            <span>{formatCurrency(detalhes.smartpads.total)}</span>
          </div>
        )}
        
        {detalhes.infravermelhos && (
          <div className="space-y-1">
            <div className="flex justify-between text-sm">
              <span>Centrais IR ({detalhes.infravermelhos.centrais.quantidade}x)</span>
              <span>{formatCurrency(detalhes.infravermelhos.centrais.total)}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span>Emissores IR ({detalhes.infravermelhos.emissores.quantidade}x)</span>
              <span>{formatCurrency(detalhes.infravermelhos.emissores.total)}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span>Instalação IR ({detalhes.infravermelhos.servicos.quantidade}x)</span>
              <span>{formatCurrency(detalhes.infravermelhos.servicos.total)}</span>
            </div>
          </div>
        )}
      </div>
    )
  }

  const renderDetalhesSom = () => {
    const detalhes = custos.sound.detalhes
    if (!detalhes || Object.keys(detalhes).length === 0) return null

    return (
      <div className="space-y-3">
        <h4 className="font-medium text-purple-700">Detalhamento - Sonorização</h4>
        
        {detalhes.sistemaBase && (
          <div className="space-y-1">
            <div className="flex justify-between text-sm">
              <span>Sistema Multiroom</span>
              <span>{formatCurrency(detalhes.sistemaBase.multiroom)}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span>Condicionador de Energia</span>
              <span>{formatCurrency(detalhes.sistemaBase.condicionador)}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span>Conversores Digitais (2x)</span>
              <span>{formatCurrency(detalhes.sistemaBase.conversores)}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span>Engenharia de Som</span>
              <span>{formatCurrency(detalhes.sistemaBase.engenharia)}</span>
            </div>
          </div>
        )}
        
        {detalhes.caixas && (
          <div className="flex justify-between text-sm">
            <span>Caixas de Som ({detalhes.caixas.quantidade}x)</span>
            <span>{formatCurrency(detalhes.caixas.total)}</span>
          </div>
        )}
        
        {detalhes.subwoofers && (
          <div className="flex justify-between text-sm">
            <span>Subwoofers ({detalhes.subwoofers.quantidade}x)</span>
            <span>{formatCurrency(detalhes.subwoofers.total)}</span>
          </div>
        )}
        
        {detalhes.servicos && (
          <div className="flex justify-between text-sm">
            <span>Serviços de Instalação</span>
            <span>{formatCurrency(detalhes.servicos.total)}</span>
          </div>
        )}
        
        {detalhes.cabos && (
          <div className="flex justify-between text-sm">
            <span>Cabos e Passagens</span>
            <span>{formatCurrency(detalhes.cabos.total)}</span>
          </div>
        )}
      </div>
    )
  }

  return (
    <Card className="sticky top-4">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Calculator className="h-5 w-5" />
          Resumo do Orçamento
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Automação */}
        {custos.automation.total > 0 && (
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Zap className="h-4 w-4 text-blue-600" />
                <span className="font-medium">Automação</span>
              </div>
              <Badge variant="secondary">
                {formatCurrency(custos.automation.total)}
              </Badge>
            </div>
            {renderDetalhesAutomacao()}
          </div>
        )}

        {/* Som */}
        {custos.sound.total > 0 && (
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Volume2 className="h-4 w-4 text-purple-600" />
                <span className="font-medium">Sonorização</span>
              </div>
              <Badge variant="secondary">
                {formatCurrency(custos.sound.total)}
              </Badge>
            </div>
            {renderDetalhesSom()}
          </div>
        )}

        {/* Opcionais */}
        {custos.opcionais.total > 0 && (
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Plus className="h-4 w-4 text-yellow-600" />
                <span className="font-medium">Opcionais</span>
              </div>
              <Badge variant="secondary">
                {formatCurrency(custos.opcionais.total)}
              </Badge>
            </div>
          </div>
        )}

        {/* Total Geral */}
        {custos.grandTotal > 0 && (
          <>
            <Separator />
            <div className="flex items-center justify-between text-lg font-bold">
              <span>Total Geral</span>
              <span className="text-green-600">
                {formatCurrency(custos.grandTotal)}
              </span>
            </div>
          </>
        )}

        {custos.grandTotal === 0 && (
          <div className="text-center py-4 text-gray-500">
            <Calculator className="h-8 w-8 mx-auto mb-2 opacity-50" />
            <p className="text-sm">Selecione ambientes para ver o orçamento</p>
          </div>
        )}
      </CardContent>
    </Card>
  )
}

export default CalculadoraCustos
