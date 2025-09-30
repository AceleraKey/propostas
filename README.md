# Sistema de Propostas Unike

Sistema web completo para geração rápida de propostas personalizadas de automação residencial e sonorização.

## 🚀 Funcionalidades

### 📋 Landing Page de Coleta de Dados
- **Formulário Multi-etapas**: Coleta dados do cliente, arquiteto e projeto
- **Upload de Imagens**: Hero section e planta baixa em PNG
- **Seleção de Categorias**: Automação, Sonorização, Cabeamento, Rede Wi-Fi
- **Interface Responsiva**: Design moderno com Tailwind CSS

### 🏠 Sistema de Seleção de Ambientes
- **Ambientes Pré-configurados**: 9 ambientes padrão baseados no código Paulinho
- **Configuração Automação**: Circuitos, TVs, Ar condicionados, Smartpads
- **Configuração Sonorização**: Caixas de som, Subwoofers por ambiente
- **Seleção Visual**: Interface intuitiva com cards interativos

### 🗺️ Visualização de Planta Baixa
- **Upload de Planta**: Suporte a arquivos PNG
- **Coordenadas de Ambientes**: Mapeamento visual dos espaços
- **Seleção Interativa**: Clique na planta para selecionar ambientes
- **Sincronização**: Integração com sistema de seleção

### 💰 Calculadora de Custos
- **Cálculo Automático**: Baseado nas seleções do usuário
- **Preços Dinâmicos**: Produtos e serviços configuráveis
- **Detalhamento**: Breakdown completo dos custos
- **Resumo Visual**: Interface clara e profissional

### 📄 Gerador de Propostas
- **Template HTML**: Baseado no modelo padrão da empresa
- **Personalização**: Dados específicos do cliente
- **Design Profissional**: Layout responsivo e moderno
- **Export**: Download em HTML para impressão/envio

### ⚙️ Painel Administrativo
- **Gestão de Produtos**: CRUD completo para automação e sonorização
- **Controle de Preços**: Atualização em tempo real
- **Import/Export**: Backup e restauração de dados
- **Categorização**: Produtos e serviços organizados

## 🛠️ Tecnologias Utilizadas

- **Frontend**: React 18 + Vite
- **UI Components**: shadcn/ui + Tailwind CSS
- **Icons**: Lucide React
- **Estado**: React Hooks (useState, useEffect)
- **Styling**: CSS Modules + Tailwind

## 📁 Estrutura do Projeto

```
sistema-propostas-unike/
├── src/
│   ├── components/
│   │   ├── AmbientSelector.jsx      # Seleção de ambientes
│   │   ├── PlantaBaixa.jsx          # Visualização da planta
│   │   ├── CalculadoraCustos.jsx    # Cálculo de orçamentos
│   │   ├── PropostaGenerator.jsx    # Geração de propostas
│   │   └── AdminPanel.jsx           # Painel administrativo
│   ├── App.jsx                      # Componente principal
│   └── App.css                      # Estilos globais
├── public/
│   └── imagens/                     # Assets do modelo padrão
└── README.md                        # Esta documentação
```

## 🎯 Fluxo de Uso

1. **Coleta de Dados**: Cliente preenche formulário multi-etapas
2. **Upload de Arquivos**: Imagens hero e planta baixa
3. **Seleção de Ambientes**: Escolha ambientes para automação/som
4. **Configuração**: Ajuste circuitos, dispositivos por ambiente
5. **Visualização**: Mapeamento na planta baixa (opcional)
6. **Cálculo**: Sistema calcula custos automaticamente
7. **Geração**: Proposta HTML personalizada criada
8. **Entrega**: Download e envio para cliente

## 💡 Algoritmo Baseado no Código Paulinho

O sistema utiliza a lógica do arquivo `paulinho.html` para:

- **Cálculo de Custos**: Algoritmos de precificação por ambiente
- **Seleção de Ambientes**: Interface de cards interativos
- **Configuração de Dispositivos**: Smartpads, TVs, Ar condicionados
- **Integração Visual**: Seleção na planta baixa sincronizada

## 🔧 Configuração e Instalação

### Pré-requisitos
- Node.js 18+
- npm ou yarn

### Instalação
```bash
# Clone o repositório
git clone <repository-url>

# Entre no diretório
cd sistema-propostas-unike

# Instale dependências
npm install

# Inicie o servidor de desenvolvimento
npm run dev
```

### Build para Produção
```bash
# Gere build otimizado
npm run build

# Preview do build
npm run preview
```

## 📊 Banco de Dados

### Estrutura de Produtos

#### Automação
- Central de Automação (R$ 4.500,00)
- Módulo Home One (R$ 850,00)
- Central IR (R$ 1.200,00)
- Emissor IR (R$ 45,00)
- Smartpad (R$ 320,00)
- Serviços de engenharia e instalação

#### Sonorização
- Sistema Multiroom (R$ 2.800,00)
- Caixas JBL (R$ 450,00)
- Subwoofer JBL (R$ 1.200,00)
- Cabos e acessórios
- Serviços de instalação e configuração

### Ambientes Padrão
1. **Sala de Estar** - 8 circuitos, 1 TV, 1 AC, 4 caixas som
2. **Cozinha** - 6 circuitos, 1 TV, 2 caixas som
3. **Suíte Master** - 8 circuitos, 1 TV, 1 AC, 2 caixas som
4. **Suíte 2** - 6 circuitos, 1 TV, 1 AC, 2 caixas som
5. **Suíte 3** - 6 circuitos, 1 TV, 1 AC, 2 caixas som
6. **Varanda** - 4 circuitos, 4 caixas som
7. **Lavabo** - 2 circuitos, 1 caixa som
8. **Circulação Social** - 6 circuitos, 2 caixas som
9. **Circulação Íntimo** - 4 circuitos, 2 caixas som

## 🎨 Design e UX

### Princípios de Design
- **Hierarquia Visual**: Informações organizadas por importância
- **Contraste**: Cores e tipografia para facilitar leitura
- **Consistência**: Padrões visuais em todo o sistema
- **Responsividade**: Adaptação para diferentes dispositivos

### Paleta de Cores
- **Primária**: Azul (#3b82f6) - Confiança e tecnologia
- **Secundária**: Roxo (#7c3aed) - Criatividade e inovação
- **Sucesso**: Verde (#10b981) - Confirmações e valores
- **Alerta**: Vermelho (#ef4444) - Ações destrutivas

## 🔒 Segurança e Performance

### Validações
- Campos obrigatórios no formulário
- Validação de tipos de arquivo (PNG para planta)
- Sanitização de dados de entrada

### Performance
- Lazy loading de componentes
- Otimização de imagens
- Bundle splitting automático
- Cache de dados calculados

## 📈 Métricas e Analytics

### KPIs do Sistema
- Tempo médio de geração de proposta
- Taxa de conversão por categoria
- Valor médio das propostas
- Ambientes mais selecionados

### Dados Coletados
- Informações do cliente e projeto
- Seleções de ambientes e dispositivos
- Valores calculados e propostas geradas
- Timestamps de cada etapa

## 🚀 Deploy e Produção

### Opções de Deploy
1. **Vercel** (Recomendado)
   - Deploy automático via Git
   - CDN global
   - Domínio personalizado

2. **Netlify**
   - Build automático
   - Formulários integrados
   - Edge functions

3. **AWS S3 + CloudFront**
   - Controle total
   - Escalabilidade
   - Integração com outros serviços AWS

### Configurações de Produção
```bash
# Variáveis de ambiente
VITE_APP_TITLE="Sistema de Propostas Unike"
VITE_API_URL="https://api.unike.com.br"
VITE_STORAGE_URL="https://storage.unike.com.br"
```

## 🔄 Atualizações e Manutenção

### Roadmap
- [ ] Integração com CRM
- [ ] API para sincronização de dados
- [ ] Relatórios avançados
- [ ] Assinatura digital de propostas
- [ ] Integração com WhatsApp
- [ ] App mobile

### Manutenção
- Backup automático de dados
- Monitoramento de performance
- Atualizações de segurança
- Logs de auditoria

## 📞 Suporte

Para suporte técnico ou dúvidas sobre o sistema:
- **Email**: suporte@unike.com.br
- **Telefone**: (71) 99999-9999
- **Documentação**: [docs.unike.com.br](https://docs.unike.com.br)

---

**Desenvolvido com ❤️ para Unike Automação Premium**

*Sistema de geração rápida de propostas - Transformando residências em lares inteligentes*
