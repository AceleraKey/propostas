import { useState, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card.jsx'
import { Button } from '@/components/ui/button.jsx'
import { Input } from '@/components/ui/input.jsx'
import { Label } from '@/components/ui/label.jsx'
import { Textarea } from '@/components/ui/textarea.jsx'
import { Badge } from '@/components/ui/badge.jsx'
import { Separator } from '@/components/ui/separator.jsx'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs.jsx'
import { 
  Settings, 
  Package, 
  DollarSign, 
  Plus, 
  Edit3, 
  Trash2, 
  Save, 
  X,
  Zap,
  Volume2,
  Upload,
  Download
} from 'lucide-react'

// Dados iniciais baseados no arquivo dados_iniciais.sql
const PRODUTOS_INICIAIS = {
  automacao: [
    { id: 'central', nome: 'Central de Automação', preco: 4500.00, categoria: 'produto', descricao: 'Central principal do sistema de automação' },
    { id: 'homeOne', nome: 'Módulo Home One', preco: 850.00, categoria: 'produto', descricao: 'Módulo para controle de até 15 circuitos' },
    { id: 'centralIR', nome: 'Central IR', preco: 1200.00, categoria: 'produto', descricao: 'Central para controle infravermelho' },
    { id: 'emissorIR', nome: 'Emissor IR', preco: 45.00, categoria: 'produto', descricao: 'Emissor infravermelho individual' },
    { id: 'smartpad', nome: 'Smartpad', preco: 320.00, categoria: 'produto', descricao: 'Painel de controle touch' },
    { id: 'engenharia', nome: 'Engenharia e Projeto', preco: 1800.00, categoria: 'servico', descricao: 'Projeto técnico e engenharia' },
    { id: 'configCentral', nome: 'Configuração Central', preco: 450.00, categoria: 'servico', descricao: 'Configuração da central de automação' },
    { id: 'circuitoIluminacao', nome: 'Circuito de Iluminação', preco: 180.00, categoria: 'servico', descricao: 'Instalação por circuito' },
    { id: 'instCircuito', nome: 'Instalação Circuito', preco: 180.00, categoria: 'servico', descricao: 'Mão de obra por circuito' },
    { id: 'instSmartpad', nome: 'Instalação Smartpad', preco: 120.00, categoria: 'servico', descricao: 'Instalação do smartpad' },
    { id: 'configSmartpad', nome: 'Configuração Smartpad', preco: 80.00, categoria: 'servico', descricao: 'Configuração do smartpad' },
    { id: 'instConfigIR', nome: 'Instalação IR', preco: 150.00, categoria: 'servico', descricao: 'Instalação e configuração IR' }
  ],
  som: [
    { id: 'multiroom', nome: 'Sistema Multiroom', preco: 2800.00, categoria: 'produto', descricao: 'Sistema central de áudio multiroom' },
    { id: 'condicionadorEnergia', nome: 'Condicionador de Energia', preco: 380.00, categoria: 'produto', descricao: 'Proteção elétrica do sistema' },
    { id: 'conversorDigital', nome: 'Conversor Digital', preco: 220.00, categoria: 'produto', descricao: 'Conversor de áudio digital' },
    { id: 'caixaJBL', nome: 'Caixa de Som JBL', preco: 450.00, categoria: 'produto', descricao: 'Caixa de som embutir JBL' },
    { id: 'subwooferJBL', nome: 'Subwoofer JBL', preco: 1200.00, categoria: 'produto', descricao: 'Subwoofer JBL para graves' },
    { id: 'caboParalelo', nome: 'Cabo Paralelo (metro)', preco: 8.50, categoria: 'produto', descricao: 'Cabo paralelo por metro' },
    { id: 'caboPhilipsRCA', nome: 'Cabo RCA Philips (metro)', preco: 12.00, categoria: 'produto', descricao: 'Cabo RCA de qualidade' },
    { id: 'engenhariaSom', nome: 'Engenharia de Som', preco: 2200.00, categoria: 'servico', descricao: 'Projeto acústico e engenharia' },
    { id: 'instRack', nome: 'Instalação Rack', preco: 280.00, categoria: 'servico', descricao: 'Instalação do rack de equipamentos' },
    { id: 'instCaixaSom', nome: 'Instalação Caixa Som', preco: 180.00, categoria: 'servico', descricao: 'Instalação por caixa de som' },
    { id: 'instMultiroom', nome: 'Instalação Multiroom', preco: 120.00, categoria: 'servico', descricao: 'Configuração multiroom por ambiente' },
    { id: 'passagemCaboSom', nome: 'Passagem Cabo Som (metro)', preco: 15.00, categoria: 'servico', descricao: 'Passagem de cabo por metro' }
  ]
}

const AdminPanel = ({ onProdutosChange }) => {
  const [produtos, setProdutos] = useState(PRODUTOS_INICIAIS)
  const [editingItem, setEditingItem] = useState(null)
  const [newItem, setNewItem] = useState({
    nome: '',
    preco: '',
    categoria: 'produto',
    descricao: ''
  })
  const [activeTab, setActiveTab] = useState('automacao')

  useEffect(() => {
    // Notificar mudanças nos produtos para o componente pai
    if (onProdutosChange) {
      onProdutosChange(produtos)
    }
  }, [produtos, onProdutosChange])

  const formatCurrency = (value) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(value)
  }

  const handleEditItem = (categoria, item) => {
    setEditingItem({
      categoria,
      id: item.id,
      nome: item.nome,
      preco: item.preco.toString(),
      descricao: item.descricao,
      categoriaItem: item.categoria
    })
  }

  const handleSaveEdit = () => {
    if (!editingItem) return

    setProdutos(prev => ({
      ...prev,
      [editingItem.categoria]: prev[editingItem.categoria].map(item =>
        item.id === editingItem.id
          ? {
              ...item,
              nome: editingItem.nome,
              preco: parseFloat(editingItem.preco) || 0,
              descricao: editingItem.descricao,
              categoria: editingItem.categoriaItem
            }
          : item
      )
    }))
    setEditingItem(null)
  }

  const handleCancelEdit = () => {
    setEditingItem(null)
  }

  const handleDeleteItem = (categoria, itemId) => {
    if (confirm('Tem certeza que deseja excluir este item?')) {
      setProdutos(prev => ({
        ...prev,
        [categoria]: prev[categoria].filter(item => item.id !== itemId)
      }))
    }
  }

  const handleAddItem = (categoria) => {
    if (!newItem.nome || !newItem.preco) {
      alert('Preencha nome e preço')
      return
    }

    const id = newItem.nome.toLowerCase().replace(/\s+/g, '').replace(/[^a-z0-9]/g, '')
    
    setProdutos(prev => ({
      ...prev,
      [categoria]: [
        ...prev[categoria],
        {
          id,
          nome: newItem.nome,
          preco: parseFloat(newItem.preco) || 0,
          categoria: newItem.categoria,
          descricao: newItem.descricao
        }
      ]
    }))

    setNewItem({
      nome: '',
      preco: '',
      categoria: 'produto',
      descricao: ''
    })
  }

  const exportarDados = () => {
    const dataStr = JSON.stringify(produtos, null, 2)
    const dataBlob = new Blob([dataStr], { type: 'application/json' })
    const url = URL.createObjectURL(dataBlob)
    const link = document.createElement('a')
    link.href = url
    link.download = `produtos-unike-${new Date().toISOString().split('T')[0]}.json`
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
    URL.revokeObjectURL(url)
  }

  const importarDados = (event) => {
    const file = event.target.files[0]
    if (!file) return

    const reader = new FileReader()
    reader.onload = (e) => {
      try {
        const importedData = JSON.parse(e.target.result)
        setProdutos(importedData)
        alert('Dados importados com sucesso!')
      } catch (error) {
        alert('Erro ao importar dados. Verifique o formato do arquivo.')
      }
    }
    reader.readAsText(file)
  }

  const resetarDados = () => {
    if (confirm('Tem certeza que deseja resetar todos os dados para os valores padrão?')) {
      setProdutos(PRODUTOS_INICIAIS)
      alert('Dados resetados para os valores padrão!')
    }
  }

  const renderItemsList = (categoria) => {
    const items = produtos[categoria] || []
    
    return (
      <div className="space-y-4">
        {/* Cabeçalho da categoria */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            {categoria === 'automacao' ? (
              <Zap className="h-5 w-5 text-blue-600" />
            ) : (
              <Volume2 className="h-5 w-5 text-purple-600" />
            )}
            <h3 className="text-lg font-semibold">
              {categoria === 'automacao' ? 'Automação' : 'Sonorização'}
            </h3>
            <Badge variant="secondary">{items.length} itens</Badge>
          </div>
        </div>

        {/* Lista de itens */}
        <div className="grid gap-4">
          {items.map((item) => (
            <Card key={item.id} className="relative">
              <CardContent className="p-4">
                {editingItem && editingItem.id === item.id ? (
                  // Modo de edição
                  <div className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <Label>Nome</Label>
                        <Input
                          value={editingItem.nome}
                          onChange={(e) => setEditingItem(prev => ({ ...prev, nome: e.target.value }))}
                        />
                      </div>
                      <div>
                        <Label>Preço (R$)</Label>
                        <Input
                          type="number"
                          step="0.01"
                          value={editingItem.preco}
                          onChange={(e) => setEditingItem(prev => ({ ...prev, preco: e.target.value }))}
                        />
                      </div>
                    </div>
                    <div>
                      <Label>Descrição</Label>
                      <Textarea
                        value={editingItem.descricao}
                        onChange={(e) => setEditingItem(prev => ({ ...prev, descricao: e.target.value }))}
                        rows={2}
                      />
                    </div>
                    <div className="flex gap-2">
                      <Button size="sm" onClick={handleSaveEdit}>
                        <Save className="h-4 w-4 mr-1" />
                        Salvar
                      </Button>
                      <Button size="sm" variant="outline" onClick={handleCancelEdit}>
                        <X className="h-4 w-4 mr-1" />
                        Cancelar
                      </Button>
                    </div>
                  </div>
                ) : (
                  // Modo de visualização
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <h4 className="font-medium">{item.nome}</h4>
                        <Badge variant={item.categoria === 'produto' ? 'default' : 'secondary'}>
                          {item.categoria === 'produto' ? 'Produto' : 'Serviço'}
                        </Badge>
                      </div>
                      <p className="text-sm text-gray-600 mb-2">{item.descricao}</p>
                      <p className="text-lg font-semibold text-green-600">
                        {formatCurrency(item.preco)}
                      </p>
                    </div>
                    <div className="flex gap-2">
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleEditItem(categoria, item)}
                      >
                        <Edit3 className="h-4 w-4" />
                      </Button>
                      <Button
                        size="sm"
                        variant="destructive"
                        onClick={() => handleDeleteItem(categoria, item.id)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Formulário para adicionar novo item */}
        <Card className="border-dashed">
          <CardHeader>
            <CardTitle className="text-base flex items-center gap-2">
              <Plus className="h-4 w-4" />
              Adicionar Novo Item
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label>Nome *</Label>
                <Input
                  placeholder="Nome do produto/serviço"
                  value={newItem.nome}
                  onChange={(e) => setNewItem(prev => ({ ...prev, nome: e.target.value }))}
                />
              </div>
              <div>
                <Label>Preço (R$) *</Label>
                <Input
                  type="number"
                  step="0.01"
                  placeholder="0,00"
                  value={newItem.preco}
                  onChange={(e) => setNewItem(prev => ({ ...prev, preco: e.target.value }))}
                />
              </div>
            </div>
            <div>
              <Label>Tipo</Label>
              <select
                className="w-full p-2 border rounded-md"
                value={newItem.categoria}
                onChange={(e) => setNewItem(prev => ({ ...prev, categoria: e.target.value }))}
              >
                <option value="produto">Produto</option>
                <option value="servico">Serviço</option>
              </select>
            </div>
            <div>
              <Label>Descrição</Label>
              <Textarea
                placeholder="Descrição do item"
                value={newItem.descricao}
                onChange={(e) => setNewItem(prev => ({ ...prev, descricao: e.target.value }))}
                rows={2}
              />
            </div>
            <Button onClick={() => handleAddItem(categoria)} className="w-full">
              <Plus className="h-4 w-4 mr-2" />
              Adicionar Item
            </Button>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Settings className="h-6 w-6" />
            Painel Administrativo
          </CardTitle>
          <CardDescription>
            Gerencie produtos, serviços e preços do sistema de propostas
          </CardDescription>
        </CardHeader>
        <CardContent>
          {/* Ações gerais */}
          <div className="flex flex-wrap gap-4 mb-6">
            <Button variant="outline" onClick={exportarDados}>
              <Download className="h-4 w-4 mr-2" />
              Exportar Dados
            </Button>
            
            <div className="relative">
              <input
                type="file"
                accept=".json"
                onChange={importarDados}
                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
              />
              <Button variant="outline">
                <Upload className="h-4 w-4 mr-2" />
                Importar Dados
              </Button>
            </div>
            
            <Button variant="destructive" onClick={resetarDados}>
              Resetar para Padrão
            </Button>
          </div>

          <Separator className="my-6" />

          {/* Tabs para categorias */}
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="automacao">
                <Zap className="h-4 w-4 mr-2" />
                Automação
              </TabsTrigger>
              <TabsTrigger value="som">
                <Volume2 className="h-4 w-4 mr-2" />
                Sonorização
              </TabsTrigger>
            </TabsList>
            
            <TabsContent value="automacao" className="mt-6">
              {renderItemsList('automacao')}
            </TabsContent>
            
            <TabsContent value="som" className="mt-6">
              {renderItemsList('som')}
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  )
}

export default AdminPanel
