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

// Simulação de banco de dados de propostas
const proposals = new Map();

const handler = async (req, res) => {
  try {
    if (req.method === 'POST') {
      const proposalData = req.body;
      
      if (!proposalData.clientName) {
        return res.status(400).json({
          success: false,
          message: 'Nome do cliente é obrigatório'
        });
      }

      // Gerar ID único para a proposta
      const proposalId = `proposal_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
      
      const proposal = {
        id: proposalId,
        clientName: proposalData.clientName,
        architect: proposalData.architect || '',
        categories: proposalData.categories || [],
        environments: proposalData.environments || {},
        floorPlan: proposalData.floorPlan || null,
        heroImages: proposalData.heroImages || [],
        selectedProducts: proposalData.selectedProducts || {},
        totalValue: proposalData.totalValue || 0,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };

      proposals.set(proposalId, proposal);

      res.status(200).json({
        success: true,
        message: 'Proposta salva com sucesso',
        data: {
          id: proposalId,
          clientName: proposal.clientName,
          totalValue: proposal.totalValue,
          createdAt: proposal.createdAt
        }
      });

    } else if (req.method === 'GET') {
      const { id } = req.query;
      
      if (id) {
        // Buscar proposta específica
        const proposal = proposals.get(id);
        
        if (!proposal) {
          return res.status(404).json({
            success: false,
            message: 'Proposta não encontrada'
          });
        }

        res.status(200).json({
          success: true,
          data: proposal
        });
      } else {
        // Listar todas as propostas (apenas metadados)
        const proposalList = Array.from(proposals.values()).map(p => ({
          id: p.id,
          clientName: p.clientName,
          architect: p.architect,
          totalValue: p.totalValue,
          createdAt: p.createdAt,
          updatedAt: p.updatedAt
        }));

        res.status(200).json({
          success: true,
          data: proposalList
        });
      }

    } else if (req.method === 'PUT') {
      const { id } = req.query;
      const updateData = req.body;
      
      if (!id) {
        return res.status(400).json({
          success: false,
          message: 'ID da proposta é obrigatório'
        });
      }

      const proposal = proposals.get(id);
      
      if (!proposal) {
        return res.status(404).json({
          success: false,
          message: 'Proposta não encontrada'
        });
      }

      // Atualizar proposta
      const updatedProposal = {
        ...proposal,
        ...updateData,
        id: proposal.id, // Manter ID original
        createdAt: proposal.createdAt, // Manter data de criação
        updatedAt: new Date().toISOString()
      };

      proposals.set(id, updatedProposal);

      res.status(200).json({
        success: true,
        message: 'Proposta atualizada com sucesso',
        data: updatedProposal
      });

    } else if (req.method === 'DELETE') {
      const { id } = req.query;
      
      if (!id) {
        return res.status(400).json({
          success: false,
          message: 'ID da proposta é obrigatório'
        });
      }

      if (proposals.has(id)) {
        proposals.delete(id);
        res.status(200).json({
          success: true,
          message: 'Proposta removida com sucesso'
        });
      } else {
        res.status(404).json({
          success: false,
          message: 'Proposta não encontrada'
        });
      }

    } else {
      res.status(405).json({
        success: false,
        message: 'Método não permitido'
      });
    }
  } catch (error) {
    console.error('Erro na API de propostas:', error);
    res.status(500).json({
      success: false,
      message: 'Erro interno do servidor'
    });
  }
};

module.exports = allowCors(handler);
