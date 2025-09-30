const fs = require('fs');
const path = require('path');

const allowCors = fn => async (req, res) => {
  res.setHeader('Access-Control-Allow-Credentials', true)
  res.setHeader('Access-Control-Allow-Origin', '*')
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT')
  res.setHeader(
    'Access-Control-Allow-Headers',
    'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version'
  )
  if (req.method === 'OPTIONS') {
    res.status(200).end()
    return
  }
  return await fn(req, res)
}

// Simulação de banco de dados em memória (em produção, usar MongoDB/PostgreSQL)
let productsData = {
  "automation": {
    "products": [
      {
        "id": "smartpad_4",
        "name": "Smartpad 4 Teclas",
        "price": 890,
        "category": "automation",
        "description": "Controle inteligente com 4 teclas personalizáveis"
      },
      {
        "id": "smartpad_6",
        "name": "Smartpad 6 Teclas",
        "price": 1200,
        "category": "automation",
        "description": "Controle inteligente com 6 teclas personalizáveis"
      },
      {
        "id": "smartpad_8",
        "name": "Smartpad 8 Teclas",
        "price": 1450,
        "category": "automation",
        "description": "Controle inteligente com 8 teclas personalizáveis"
      },
      {
        "id": "dimmer_led",
        "name": "Dimmer LED",
        "price": 650,
        "category": "automation",
        "description": "Controle de intensidade para lâmpadas LED"
      },
      {
        "id": "sensor_presenca",
        "name": "Sensor de Presença",
        "price": 420,
        "category": "automation",
        "description": "Sensor inteligente de presença e movimento"
      },
      {
        "id": "controle_ar",
        "name": "Controle de Ar Condicionado",
        "price": 780,
        "category": "automation",
        "description": "Controle inteligente para ar condicionado"
      }
    ],
    "services": [
      {
        "id": "instalacao_automacao",
        "name": "Instalação e Configuração",
        "price": 2500,
        "category": "automation_service",
        "description": "Instalação completa e configuração do sistema"
      },
      {
        "id": "programacao_cenas",
        "name": "Programação de Cenas",
        "price": 800,
        "category": "automation_service",
        "description": "Criação e programação de cenas personalizadas"
      },
      {
        "id": "treinamento_usuario",
        "name": "Treinamento do Usuário",
        "price": 600,
        "category": "automation_service",
        "description": "Treinamento completo para uso do sistema"
      }
    ]
  },
  "sound": {
    "products": [
      {
        "id": "caixa_embutir_6",
        "name": "Caixa de Embutir 6\"",
        "price": 450,
        "category": "sound",
        "description": "Caixa acústica de embutir 6 polegadas"
      },
      {
        "id": "caixa_embutir_8",
        "name": "Caixa de Embutir 8\"",
        "price": 650,
        "category": "sound",
        "description": "Caixa acústica de embutir 8 polegadas"
      },
      {
        "id": "amplificador_4ch",
        "name": "Amplificador 4 Canais",
        "price": 2800,
        "category": "sound",
        "description": "Amplificador multicanal de alta qualidade"
      },
      {
        "id": "amplificador_8ch",
        "name": "Amplificador 8 Canais",
        "price": 4200,
        "category": "sound",
        "description": "Amplificador multicanal profissional"
      },
      {
        "id": "subwoofer",
        "name": "Subwoofer Ativo",
        "price": 1800,
        "category": "sound",
        "description": "Subwoofer ativo para graves profundos"
      },
      {
        "id": "central_audio",
        "name": "Central de Áudio",
        "price": 3500,
        "category": "sound",
        "description": "Central de áudio multizona"
      }
    ],
    "services": [
      {
        "id": "instalacao_som",
        "name": "Instalação Sistema de Som",
        "price": 1800,
        "category": "sound_service",
        "description": "Instalação completa do sistema de sonorização"
      },
      {
        "id": "calibracao_audio",
        "name": "Calibração de Áudio",
        "price": 900,
        "category": "sound_service",
        "description": "Calibração profissional do sistema de áudio"
      },
      {
        "id": "configuracao_zonas",
        "name": "Configuração de Zonas",
        "price": 1200,
        "category": "sound_service",
        "description": "Configuração de zonas independentes de áudio"
      }
    ]
  },
  "network": {
    "products": [
      {
        "id": "roteador_wifi6",
        "name": "Roteador Wi-Fi 6",
        "price": 1200,
        "category": "network",
        "description": "Roteador de alta performance Wi-Fi 6"
      },
      {
        "id": "access_point",
        "name": "Access Point Profissional",
        "price": 800,
        "category": "network",
        "description": "Ponto de acesso Wi-Fi profissional"
      },
      {
        "id": "switch_24p",
        "name": "Switch 24 Portas",
        "price": 1500,
        "category": "network",
        "description": "Switch gerenciável 24 portas Gigabit"
      },
      {
        "id": "cabo_cat6",
        "name": "Cabo Cat6 (metro)",
        "price": 8,
        "category": "network",
        "description": "Cabo de rede categoria 6 por metro"
      }
    ],
    "services": [
      {
        "id": "instalacao_rede",
        "name": "Instalação de Rede",
        "price": 2200,
        "category": "network_service",
        "description": "Instalação completa da infraestrutura de rede"
      },
      {
        "id": "configuracao_wifi",
        "name": "Configuração Wi-Fi",
        "price": 600,
        "category": "network_service",
        "description": "Configuração otimizada da rede Wi-Fi"
      }
    ]
  },
  "optional": [
    {
      "id": "projeto_executivo",
      "name": "Projeto Executivo",
      "price": 5000,
      "category": "optional",
      "description": "Projeto executivo completo com plantas e especificações"
    },
    {
      "id": "suporte_12m",
      "name": "Suporte Técnico 12 meses",
      "price": 2400,
      "category": "optional",
      "description": "Suporte técnico especializado por 12 meses"
    },
    {
      "id": "garantia_estendida",
      "name": "Garantia Estendida 3 anos",
      "price": 3600,
      "category": "optional",
      "description": "Garantia estendida de 3 anos para todos os equipamentos"
    }
  ]
};

const handler = async (req, res) => {
  try {
    if (req.method === 'GET') {
      // Retornar todos os produtos
      res.status(200).json({
        success: true,
        data: productsData
      });

    } else if (req.method === 'POST') {
      const { action, category, product } = req.body;
      
      if (action === 'add') {
        // Adicionar novo produto
        if (!category || !product) {
          return res.status(400).json({
            success: false,
            message: 'Categoria e produto são obrigatórios'
          });
        }

        // Gerar ID único se não fornecido
        if (!product.id) {
          product.id = `${category}_${Date.now()}`;
        }

        if (category === 'optional') {
          productsData.optional.push(product);
        } else {
          if (!productsData[category]) {
            productsData[category] = { products: [], services: [] };
          }
          
          if (product.category.includes('_service')) {
            productsData[category].services.push(product);
          } else {
            productsData[category].products.push(product);
          }
        }

        res.status(200).json({
          success: true,
          message: 'Produto adicionado com sucesso',
          data: product
        });

      } else if (action === 'update') {
        // Atualizar produto existente
        const { id } = product;
        let found = false;

        // Procurar e atualizar o produto
        Object.keys(productsData).forEach(cat => {
          if (cat === 'optional') {
            const index = productsData[cat].findIndex(p => p.id === id);
            if (index !== -1) {
              productsData[cat][index] = { ...productsData[cat][index], ...product };
              found = true;
            }
          } else {
            ['products', 'services'].forEach(type => {
              if (productsData[cat][type]) {
                const index = productsData[cat][type].findIndex(p => p.id === id);
                if (index !== -1) {
                  productsData[cat][type][index] = { ...productsData[cat][type][index], ...product };
                  found = true;
                }
              }
            });
          }
        });

        if (found) {
          res.status(200).json({
            success: true,
            message: 'Produto atualizado com sucesso'
          });
        } else {
          res.status(404).json({
            success: false,
            message: 'Produto não encontrado'
          });
        }

      } else if (action === 'delete') {
        // Remover produto
        const { id } = req.body;
        let found = false;

        Object.keys(productsData).forEach(cat => {
          if (cat === 'optional') {
            const index = productsData[cat].findIndex(p => p.id === id);
            if (index !== -1) {
              productsData[cat].splice(index, 1);
              found = true;
            }
          } else {
            ['products', 'services'].forEach(type => {
              if (productsData[cat][type]) {
                const index = productsData[cat][type].findIndex(p => p.id === id);
                if (index !== -1) {
                  productsData[cat][type].splice(index, 1);
                  found = true;
                }
              }
            });
          }
        });

        if (found) {
          res.status(200).json({
            success: true,
            message: 'Produto removido com sucesso'
          });
        } else {
          res.status(404).json({
            success: false,
            message: 'Produto não encontrado'
          });
        }

      } else {
        res.status(400).json({
          success: false,
          message: 'Ação inválida'
        });
      }

    } else {
      res.status(405).json({
        success: false,
        message: 'Método não permitido'
      });
    }
  } catch (error) {
    console.error('Erro na API de produtos:', error);
    res.status(500).json({
      success: false,
      message: 'Erro interno do servidor'
    });
  }
};

module.exports = allowCors(handler);
