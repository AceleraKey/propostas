#!/bin/bash

# Script para deploy direto do Cursor para Vercel
echo "🚀 Iniciando deploy para Vercel..."

# Configurar token do Vercel
export VERCEL_TOKEN="2JQNrwWquYYkVujhFZV3J3Il"

# Fazer commit das mudanças
echo "📝 Fazendo commit das mudanças..."
git add .
git commit -m "Deploy automático do Cursor - $(date)"

# Push para GitHub
echo "⬆️ Enviando para GitHub..."
git push origin main

# Deploy no Vercel
echo "🌐 Fazendo deploy no Vercel..."
npx vercel --prod --token="$VERCEL_TOKEN"

echo "✅ Deploy concluído!"
echo "🔗 Acesse: https://propostas-9x4s.vercel.app"
