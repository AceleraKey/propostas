import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card.jsx'
import { Button } from '@/components/ui/button.jsx'
import { Badge } from '@/components/ui/badge.jsx'
import { Separator } from '@/components/ui/separator.jsx'
import { FileText, Download, Eye, Loader2 } from 'lucide-react'

const PropostaGenerator = ({ 
  dadosCliente,
  dadosArquiteto, 
  ambientes,
  selectedAutomacao,
  selectedSom,
  coordenadasAmbientes,
  custos,
  onGerarProposta 
}) => {
  const [isGenerating, setIsGenerating] = useState(false)
  const [propostaGerada, setPropostaGerada] = useState(null)

  const formatCurrency = (value) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(value)
  }

  const gerarHTMLProposta = () => {
    // Baseado no template estudopadrao.html
    const ambientesSelecionadosAutomacao = Array.from(selectedAutomacao).map(id => 
      ambientes.find(a => a.id === id)
    ).filter(Boolean)
    
    const ambientesSelecionadosSom = Array.from(selectedSom).map(id => 
      ambientes.find(a => a.id === id)
    ).filter(Boolean)

    const htmlTemplate = `
<!DOCTYPE html>
<html lang="pt-BR">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Proposta Técnica - ${dadosCliente.nomeCliente}</title>
    <style>
        * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
        }
        
        body {
            font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
            line-height: 1.6;
            color: #333;
            background: #f8f9fa;
        }
        
        .container {
            max-width: 1200px;
            margin: 0 auto;
            background: white;
            box-shadow: 0 0 20px rgba(0,0,0,0.1);
        }
        
        .header {
            background: linear-gradient(135deg, #1e3a8a 0%, #3b82f6 100%);
            color: white;
            padding: 2rem;
            text-align: center;
        }
        
        .header h1 {
            font-size: 2.5rem;
            margin-bottom: 0.5rem;
            font-weight: 300;
        }
        
        .header .subtitle {
            font-size: 1.2rem;
            opacity: 0.9;
        }
        
        .client-info {
            background: #f1f5f9;
            padding: 1.5rem;
            border-left: 4px solid #3b82f6;
        }
        
        .client-info h2 {
            color: #1e3a8a;
            margin-bottom: 1rem;
        }
        
        .info-grid {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
            gap: 1rem;
        }
        
        .info-item {
            background: white;
            padding: 1rem;
            border-radius: 8px;
            border: 1px solid #e2e8f0;
        }
        
        .info-label {
            font-weight: 600;
            color: #64748b;
            font-size: 0.9rem;
            margin-bottom: 0.25rem;
        }
        
        .info-value {
            color: #1e293b;
            font-size: 1.1rem;
        }
        
        .section {
            padding: 2rem;
        }
        
        .section h2 {
            color: #1e3a8a;
            font-size: 1.8rem;
            margin-bottom: 1.5rem;
            border-bottom: 2px solid #e2e8f0;
            padding-bottom: 0.5rem;
        }
        
        .ambiente-card {
            background: #f8fafc;
            border: 1px solid #e2e8f0;
            border-radius: 12px;
            padding: 1.5rem;
            margin-bottom: 1rem;
            transition: all 0.3s ease;
        }
        
        .ambiente-card:hover {
            box-shadow: 0 4px 12px rgba(0,0,0,0.1);
            transform: translateY(-2px);
        }
        
        .ambiente-header {
            display: flex;
            align-items: center;
            justify-content: between;
            margin-bottom: 1rem;
        }
        
        .ambiente-nome {
            font-size: 1.3rem;
            font-weight: 600;
            color: #1e3a8a;
        }
        
        .ambiente-badge {
            background: #3b82f6;
            color: white;
            padding: 0.25rem 0.75rem;
            border-radius: 20px;
            font-size: 0.8rem;
            margin-left: auto;
        }
        
        .ambiente-details {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
            gap: 1rem;
        }
        
        .detail-item {
            display: flex;
            align-items: center;
            gap: 0.5rem;
            color: #64748b;
        }
        
        .detail-icon {
            width: 16px;
            height: 16px;
            color: #3b82f6;
        }
        
        .orcamento-section {
            background: linear-gradient(135deg, #f1f5f9 0%, #e2e8f0 100%);
            border-radius: 12px;
            padding: 2rem;
            margin: 2rem 0;
        }
        
        .orcamento-title {
            text-align: center;
            color: #1e3a8a;
            font-size: 2rem;
            margin-bottom: 2rem;
        }
        
        .orcamento-grid {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
            gap: 1.5rem;
            margin-bottom: 2rem;
        }
        
        .orcamento-card {
            background: white;
            border-radius: 12px;
            padding: 1.5rem;
            box-shadow: 0 2px 8px rgba(0,0,0,0.1);
        }
        
        .orcamento-card h3 {
            color: #1e3a8a;
            margin-bottom: 1rem;
            font-size: 1.2rem;
        }
        
        .orcamento-item {
            display: flex;
            justify-content: space-between;
            padding: 0.5rem 0;
            border-bottom: 1px solid #f1f5f9;
        }
        
        .orcamento-item:last-child {
            border-bottom: none;
            font-weight: 600;
            color: #1e3a8a;
        }
        
        .total-geral {
            background: #1e3a8a;
            color: white;
            padding: 1.5rem;
            border-radius: 12px;
            text-align: center;
            margin-top: 2rem;
        }
        
        .total-geral h3 {
            font-size: 1.5rem;
            margin-bottom: 0.5rem;
        }
        
        .total-valor {
            font-size: 2.5rem;
            font-weight: 700;
            color: #10b981;
        }
        
        .footer {
            background: #1e3a8a;
            color: white;
            padding: 2rem;
            text-align: center;
        }
        
        .footer h3 {
            margin-bottom: 1rem;
        }
        
        .footer p {
            opacity: 0.9;
            margin-bottom: 0.5rem;
        }
        
        @media print {
            body { background: white; }
            .container { box-shadow: none; }
        }
    </style>
</head>
<body>
    <div class="container">
        <!-- Header -->
        <div class="header">
            <h1>PROPOSTA TÉCNICA</h1>
            <div class="subtitle">Automação Residencial & Sonorização</div>
        </div>

        <!-- Informações do Cliente -->
        <div class="client-info">
            <h2>Informações do Projeto</h2>
            <div class="info-grid">
                <div class="info-item">
                    <div class="info-label">Cliente</div>
                    <div class="info-value">${dadosCliente.nomeCliente}</div>
                </div>
                <div class="info-item">
                    <div class="info-label">Arquiteto Responsável</div>
                    <div class="info-value">${dadosArquiteto.nomeArquiteto}</div>
                </div>
                ${dadosArquiteto.empresaArquiteto ? `
                <div class="info-item">
                    <div class="info-label">Empresa/Escritório</div>
                    <div class="info-value">${dadosArquiteto.empresaArquiteto}</div>
                </div>
                ` : ''}
                <div class="info-item">
                    <div class="info-label">Data da Proposta</div>
                    <div class="info-value">${new Date().toLocaleDateString('pt-BR')}</div>
                </div>
            </div>
        </div>

        ${ambientesSelecionadosAutomacao.length > 0 ? `
        <!-- Seção Automação -->
        <div class="section">
            <h2>🏠 Sistema de Automação</h2>
            <p style="margin-bottom: 2rem; color: #64748b; font-size: 1.1rem;">
                Sistema completo de automação residencial com controle inteligente de iluminação, 
                climatização e dispositivos infravermelhos.
            </p>
            
            ${ambientesSelecionadosAutomacao.map(ambiente => `
                <div class="ambiente-card">
                    <div class="ambiente-header">
                        <div class="ambiente-nome">${ambiente.nome}</div>
                        <div class="ambiente-badge">Automação</div>
                    </div>
                    <div class="ambiente-details">
                        <div class="detail-item">
                            <span class="detail-icon">💡</span>
                            <span>${ambiente.circuitos} Circuitos de Iluminação</span>
                        </div>
                        ${ambiente.smartpads_incluidos ? `
                        <div class="detail-item">
                            <span class="detail-icon">📱</span>
                            <span>${ambiente.smartpads_originais} Smartpad(s)</span>
                        </div>
                        ` : ''}
                        ${ambiente.tvs > 0 ? `
                        <div class="detail-item">
                            <span class="detail-icon">📺</span>
                            <span>${ambiente.tvs} TV(s)</span>
                        </div>
                        ` : ''}
                        ${ambiente.ar_condicionados > 0 ? `
                        <div class="detail-item">
                            <span class="detail-icon">❄️</span>
                            <span>${ambiente.ar_condicionados} Ar Condicionado(s)</span>
                        </div>
                        ` : ''}
                    </div>
                </div>
            `).join('')}
        </div>
        ` : ''}

        ${ambientesSelecionadosSom.length > 0 ? `
        <!-- Seção Sonorização -->
        <div class="section">
            <h2>🎵 Sistema de Sonorização</h2>
            <p style="margin-bottom: 2rem; color: #64748b; font-size: 1.1rem;">
                Sistema multiroom de alta qualidade com controle independente por ambiente 
                e integração completa com o sistema de automação.
            </p>
            
            ${ambientesSelecionadosSom.map(ambiente => `
                <div class="ambiente-card">
                    <div class="ambiente-header">
                        <div class="ambiente-nome">${ambiente.nome}</div>
                        <div class="ambiente-badge" style="background: #7c3aed;">Sonorização</div>
                    </div>
                    <div class="ambiente-details">
                        <div class="detail-item">
                            <span class="detail-icon">🔊</span>
                            <span>${ambiente.caixas_som} Caixa(s) de Som</span>
                        </div>
                        ${ambiente.tem_subwoofer === true ? `
                        <div class="detail-item">
                            <span class="detail-icon">🎛️</span>
                            <span>1 Subwoofer</span>
                        </div>
                        ` : ''}
                    </div>
                </div>
            `).join('')}
        </div>
        ` : ''}

        <!-- Orçamento -->
        <div class="orcamento-section">
            <h2 class="orcamento-title">💰 Orçamento Detalhado</h2>
            
            <div class="orcamento-grid">
                ${custos.automation.total > 0 ? `
                <div class="orcamento-card">
                    <h3>Sistema de Automação</h3>
                    <div class="orcamento-item">
                        <span>Central de Automação</span>
                        <span>${formatCurrency(4500)}</span>
                    </div>
                    <div class="orcamento-item">
                        <span>Engenharia e Projeto</span>
                        <span>${formatCurrency(1800)}</span>
                    </div>
                    <div class="orcamento-item">
                        <span>Módulos e Dispositivos</span>
                        <span>${formatCurrency(custos.automation.total - 6300)}</span>
                    </div>
                    <div class="orcamento-item">
                        <span><strong>Subtotal Automação</strong></span>
                        <span><strong>${formatCurrency(custos.automation.total)}</strong></span>
                    </div>
                </div>
                ` : ''}
                
                ${custos.sound.total > 0 ? `
                <div class="orcamento-card">
                    <h3>Sistema de Sonorização</h3>
                    <div class="orcamento-item">
                        <span>Sistema Multiroom</span>
                        <span>${formatCurrency(2800)}</span>
                    </div>
                    <div class="orcamento-item">
                        <span>Engenharia de Som</span>
                        <span>${formatCurrency(2200)}</span>
                    </div>
                    <div class="orcamento-item">
                        <span>Equipamentos e Instalação</span>
                        <span>${formatCurrency(custos.sound.total - 5000)}</span>
                    </div>
                    <div class="orcamento-item">
                        <span><strong>Subtotal Sonorização</strong></span>
                        <span><strong>${formatCurrency(custos.sound.total)}</strong></span>
                    </div>
                </div>
                ` : ''}
            </div>
            
            <div class="total-geral">
                <h3>Valor Total do Investimento</h3>
                <div class="total-valor">${formatCurrency(custos.grandTotal)}</div>
                <p style="margin-top: 1rem; opacity: 0.9;">
                    Proposta válida por 30 dias | Condições de pagamento a combinar
                </p>
            </div>
        </div>

        <!-- Footer -->
        <div class="footer">
            <h3>UNIKE Automação Premium</h3>
            <p>Transformando residências em lares inteligentes</p>
            <p>contato@unike.com.br | (71) 99999-9999</p>
            <p style="margin-top: 1rem; font-size: 0.9rem;">
                Esta proposta foi gerada automaticamente pelo Sistema de Propostas Unike
            </p>
        </div>
    </div>
</body>
</html>
    `

    return htmlTemplate
  }

  const handleGerarProposta = async () => {
    setIsGenerating(true)
    
    try {
      // Simular tempo de geração
      await new Promise(resolve => setTimeout(resolve, 2000))
      
      const htmlContent = gerarHTMLProposta()
      
      const proposta = {
        id: Date.now(),
        cliente: dadosCliente.nomeCliente,
        arquiteto: dadosArquiteto.nomeArquiteto,
        dataGeracao: new Date().toISOString(),
        htmlContent,
        valorTotal: custos.grandTotal,
        ambientesAutomacao: Array.from(selectedAutomacao).length,
        ambientesSom: Array.from(selectedSom).length
      }
      
      setPropostaGerada(proposta)
      
      if (onGerarProposta) {
        onGerarProposta(proposta)
      }
      
    } catch (error) {
      console.error('Erro ao gerar proposta:', error)
      alert('Erro ao gerar proposta. Tente novamente.')
    } finally {
      setIsGenerating(false)
    }
  }

  const downloadProposta = () => {
    if (!propostaGerada) return
    
    const blob = new Blob([propostaGerada.htmlContent], { type: 'text/html' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `proposta-${dadosCliente.nomeCliente.replace(/\s+/g, '-').toLowerCase()}-${Date.now()}.html`
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
  }

  const visualizarProposta = () => {
    if (!propostaGerada) return
    
    const newWindow = window.open('', '_blank')
    newWindow.document.write(propostaGerada.htmlContent)
    newWindow.document.close()
  }

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <FileText className="h-6 w-6" />
          Geração de Proposta
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Resumo dos dados */}
        <div className="bg-gray-50 p-4 rounded-lg">
          <h3 className="font-semibold mb-3">Resumo da Proposta</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
            <div>
              <p><strong>Cliente:</strong> {dadosCliente.nomeCliente}</p>
              <p><strong>Arquiteto:</strong> {dadosArquiteto.nomeArquiteto}</p>
              {dadosArquiteto.empresaArquiteto && (
                <p><strong>Empresa:</strong> {dadosArquiteto.empresaArquiteto}</p>
              )}
            </div>
            <div>
              <p><strong>Ambientes Automação:</strong> {Array.from(selectedAutomacao).length}</p>
              <p><strong>Ambientes Som:</strong> {Array.from(selectedSom).length}</p>
              <p><strong>Valor Total:</strong> {formatCurrency(custos.grandTotal)}</p>
            </div>
          </div>
        </div>

        {/* Botões de ação */}
        <div className="flex flex-col sm:flex-row gap-4">
          <Button 
            onClick={handleGerarProposta}
            disabled={isGenerating || custos.grandTotal === 0}
            className="flex-1"
          >
            {isGenerating ? (
              <>
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                Gerando Proposta...
              </>
            ) : (
              <>
                <FileText className="h-4 w-4 mr-2" />
                Gerar Proposta
              </>
            )}
          </Button>
          
          {propostaGerada && (
            <>
              <Button 
                variant="outline" 
                onClick={visualizarProposta}
                className="flex-1"
              >
                <Eye className="h-4 w-4 mr-2" />
                Visualizar
              </Button>
              
              <Button 
                variant="outline" 
                onClick={downloadProposta}
                className="flex-1"
              >
                <Download className="h-4 w-4 mr-2" />
                Download HTML
              </Button>
            </>
          )}
        </div>

        {/* Status da proposta gerada */}
        {propostaGerada && (
          <div className="bg-green-50 border border-green-200 p-4 rounded-lg">
            <div className="flex items-center gap-2 mb-2">
              <div className="w-3 h-3 bg-green-500 rounded-full"></div>
              <span className="font-semibold text-green-800">Proposta Gerada com Sucesso!</span>
            </div>
            <div className="text-sm text-green-700">
              <p>ID: {propostaGerada.id}</p>
              <p>Gerada em: {new Date(propostaGerada.dataGeracao).toLocaleString('pt-BR')}</p>
              <p>Valor: {formatCurrency(propostaGerada.valorTotal)}</p>
            </div>
          </div>
        )}

        {custos.grandTotal === 0 && (
          <div className="text-center py-8 text-gray-500">
            <FileText className="h-12 w-12 mx-auto mb-4 opacity-50" />
            <p>Selecione ambientes para gerar a proposta</p>
            <p className="text-sm">Configure os ambientes de automação ou sonorização para continuar</p>
          </div>
        )}
      </CardContent>
    </Card>
  )
}

export default PropostaGenerator
