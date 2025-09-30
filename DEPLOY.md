# 🚀 Guia de Deploy - Sistema de Propostas Unike

Este guia fornece instruções detalhadas para fazer deploy do sistema em produção.

## 📋 Pré-requisitos

- Conta no Vercel (recomendado) ou Netlify
- Repositório Git (GitHub, GitLab, Bitbucket)
- Node.js 18+ instalado localmente

## 🔧 Preparação para Deploy

### 1. Configuração do Projeto

```bash
# Certifique-se de que o projeto está funcionando localmente
cd sistema-propostas-unike
npm install
npm run dev
```

### 2. Build de Produção

```bash
# Teste o build de produção
npm run build
npm run preview
```

### 3. Configuração de Variáveis de Ambiente

Crie um arquivo `.env.production`:

```env
VITE_APP_TITLE="Sistema de Propostas Unike"
VITE_APP_VERSION="1.0.0"
VITE_COMPANY_NAME="Unike Automação Premium"
VITE_COMPANY_EMAIL="contato@unike.com.br"
VITE_COMPANY_PHONE="(71) 99999-9999"
```

## 🌐 Deploy no Vercel (Recomendado)

### Método 1: Via Interface Web

1. **Acesse**: [vercel.com](https://vercel.com)
2. **Login**: Faça login com sua conta GitHub/GitLab
3. **Import Project**: Clique em "New Project"
4. **Selecione Repositório**: Escolha o repositório do sistema
5. **Configure**:
   - Framework Preset: `Vite`
   - Root Directory: `./`
   - Build Command: `npm run build`
   - Output Directory: `dist`
6. **Deploy**: Clique em "Deploy"

### Método 2: Via CLI

```bash
# Instale a CLI do Vercel
npm i -g vercel

# Faça login
vercel login

# Deploy
vercel

# Para deploy de produção
vercel --prod
```

### Configurações Avançadas no Vercel

Crie `vercel.json` na raiz do projeto:

```json
{
  "version": 2,
  "name": "sistema-propostas-unike",
  "builds": [
    {
      "src": "package.json",
      "use": "@vercel/static-build",
      "config": {
        "distDir": "dist"
      }
    }
  ],
  "routes": [
    {
      "src": "/(.*)",
      "dest": "/index.html"
    }
  ],
  "env": {
    "VITE_APP_TITLE": "Sistema de Propostas Unike",
    "VITE_COMPANY_NAME": "Unike Automação Premium"
  }
}
```

## 🔷 Deploy no Netlify

### Método 1: Via Interface Web

1. **Acesse**: [netlify.com](https://netlify.com)
2. **Login**: Faça login com sua conta
3. **New Site**: Clique em "New site from Git"
4. **Conecte Repositório**: Escolha GitHub/GitLab/Bitbucket
5. **Configure**:
   - Build command: `npm run build`
   - Publish directory: `dist`
6. **Deploy**: Clique em "Deploy site"

### Método 2: Via CLI

```bash
# Instale a CLI do Netlify
npm install -g netlify-cli

# Login
netlify login

# Deploy
netlify deploy

# Deploy de produção
netlify deploy --prod
```

### Configurações do Netlify

Crie `netlify.toml` na raiz:

```toml
[build]
  command = "npm run build"
  publish = "dist"

[build.environment]
  VITE_APP_TITLE = "Sistema de Propostas Unike"
  VITE_COMPANY_NAME = "Unike Automação Premium"

[[redirects]]
  from = "/*"
  to = "/index.html"
  status = 200
```

## ☁️ Deploy no AWS S3 + CloudFront

### 1. Configuração do S3

```bash
# Instale AWS CLI
pip install awscli

# Configure credenciais
aws configure

# Crie bucket
aws s3 mb s3://sistema-propostas-unike

# Configure como site estático
aws s3 website s3://sistema-propostas-unike \
  --index-document index.html \
  --error-document index.html
```

### 2. Build e Upload

```bash
# Build do projeto
npm run build

# Upload para S3
aws s3 sync dist/ s3://sistema-propostas-unike --delete
```

### 3. CloudFront (CDN)

```bash
# Crie distribuição CloudFront
aws cloudfront create-distribution \
  --distribution-config file://cloudfront-config.json
```

## 🔒 Configurações de Segurança

### Headers de Segurança

Para Vercel, adicione em `vercel.json`:

```json
{
  "headers": [
    {
      "source": "/(.*)",
      "headers": [
        {
          "key": "X-Content-Type-Options",
          "value": "nosniff"
        },
        {
          "key": "X-Frame-Options",
          "value": "DENY"
        },
        {
          "key": "X-XSS-Protection",
          "value": "1; mode=block"
        }
      ]
    }
  ]
}
```

### HTTPS e Domínio Personalizado

1. **Vercel**: Automático com certificado SSL
2. **Netlify**: Automático com Let's Encrypt
3. **AWS**: Configure ACM (AWS Certificate Manager)

## 📊 Monitoramento e Analytics

### Google Analytics

Adicione no `index.html`:

```html
<!-- Google Analytics -->
<script async src="https://www.googletagmanager.com/gtag/js?id=GA_MEASUREMENT_ID"></script>
<script>
  window.dataLayer = window.dataLayer || [];
  function gtag(){dataLayer.push(arguments);}
  gtag('js', new Date());
  gtag('config', 'GA_MEASUREMENT_ID');
</script>
```

### Vercel Analytics

```bash
# Instale o pacote
npm install @vercel/analytics

# Adicione no App.jsx
import { Analytics } from '@vercel/analytics/react'

function App() {
  return (
    <>
      {/* Seu componente */}
      <Analytics />
    </>
  )
}
```

## 🔄 CI/CD Automático

### GitHub Actions

Crie `.github/workflows/deploy.yml`:

```yaml
name: Deploy to Vercel

on:
  push:
    branches: [ main ]

jobs:
  deploy:
    runs-on: ubuntu-latest
    
    steps:
    - uses: actions/checkout@v2
    
    - name: Setup Node.js
      uses: actions/setup-node@v2
      with:
        node-version: '18'
        
    - name: Install dependencies
      run: npm ci
      
    - name: Build
      run: npm run build
      
    - name: Deploy to Vercel
      uses: amondnet/vercel-action@v20
      with:
        vercel-token: ${{ secrets.VERCEL_TOKEN }}
        vercel-org-id: ${{ secrets.ORG_ID }}
        vercel-project-id: ${{ secrets.PROJECT_ID }}
        vercel-args: '--prod'
```

## 🌍 Domínio Personalizado

### Configuração DNS

1. **Compre domínio**: Ex: `propostas.unike.com.br`
2. **Configure DNS**:
   - Vercel: Adicione CNAME para `cname.vercel-dns.com`
   - Netlify: Adicione CNAME para `<site-name>.netlify.app`
3. **Verifique**: Aguarde propagação DNS (até 48h)

### Certificado SSL

- **Vercel/Netlify**: Automático
- **AWS**: Configure ACM e associe ao CloudFront

## 📱 PWA (Progressive Web App)

### Configuração PWA

Instale plugin Vite PWA:

```bash
npm install -D vite-plugin-pwa
```

Configure em `vite.config.js`:

```javascript
import { VitePWA } from 'vite-plugin-pwa'

export default {
  plugins: [
    VitePWA({
      registerType: 'autoUpdate',
      workbox: {
        globPatterns: ['**/*.{js,css,html,ico,png,svg}']
      },
      manifest: {
        name: 'Sistema de Propostas Unike',
        short_name: 'Propostas Unike',
        description: 'Geração rápida de orçamentos personalizados',
        theme_color: '#3b82f6',
        icons: [
          {
            src: 'icon-192x192.png',
            sizes: '192x192',
            type: 'image/png'
          }
        ]
      }
    })
  ]
}
```

## 🔍 SEO e Performance

### Meta Tags

Atualize `index.html`:

```html
<meta name="description" content="Sistema de geração rápida de propostas para automação residencial e sonorização">
<meta name="keywords" content="automação, sonorização, proposta, orçamento">
<meta property="og:title" content="Sistema de Propostas Unike">
<meta property="og:description" content="Geração rápida de orçamentos personalizados">
<meta property="og:image" content="/og-image.png">
```

### Performance

```bash
# Analise o bundle
npm run build
npx vite-bundle-analyzer dist
```

## 🚨 Troubleshooting

### Problemas Comuns

1. **Build falha**:
   ```bash
   # Limpe cache
   rm -rf node_modules package-lock.json
   npm install
   ```

2. **Rotas não funcionam**:
   - Configure redirects para SPA
   - Verifique configuração do servidor

3. **Assets não carregam**:
   - Verifique paths relativos
   - Configure base URL no Vite

### Logs e Debug

```bash
# Vercel
vercel logs

# Netlify
netlify logs

# Local debug
npm run build -- --debug
```

## 📞 Suporte

Para problemas de deploy:

1. **Documentação**: Consulte docs oficiais da plataforma
2. **Comunidade**: Stack Overflow, Discord
3. **Suporte Técnico**: Contate o suporte da plataforma

---

**✅ Deploy Concluído!**

Seu sistema estará disponível em:
- Vercel: `https://<project-name>.vercel.app`
- Netlify: `https://<site-name>.netlify.app`
- Domínio personalizado: `https://propostas.unike.com.br`
