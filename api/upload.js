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

// Simulação de armazenamento de imagens (em produção, usar S3, Cloudinary, etc.)
const uploadedImages = new Map();

const handler = async (req, res) => {
  try {
    if (req.method === 'POST') {
      const { type, imageData, filename } = req.body;
      
      if (!type || !imageData) {
        return res.status(400).json({
          success: false,
          message: 'Tipo e dados da imagem são obrigatórios'
        });
      }

      // Gerar ID único para a imagem
      const imageId = `${type}_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
      
      // Simular salvamento da imagem
      const imageInfo = {
        id: imageId,
        type: type,
        filename: filename || `${imageId}.png`,
        uploadDate: new Date().toISOString(),
        data: imageData // Em produção, salvar em storage externo
      };

      uploadedImages.set(imageId, imageInfo);

      res.status(200).json({
        success: true,
        message: 'Imagem enviada com sucesso',
        data: {
          id: imageId,
          url: `/api/images/${imageId}`,
          filename: imageInfo.filename
        }
      });

    } else if (req.method === 'GET') {
      // Listar imagens por tipo
      const { type } = req.query;
      
      let images = Array.from(uploadedImages.values());
      
      if (type) {
        images = images.filter(img => img.type === type);
      }

      // Remover dados da imagem da resposta (apenas metadados)
      const imageList = images.map(img => ({
        id: img.id,
        type: img.type,
        filename: img.filename,
        uploadDate: img.uploadDate,
        url: `/api/images/${img.id}`
      }));

      res.status(200).json({
        success: true,
        data: imageList
      });

    } else {
      res.status(405).json({
        success: false,
        message: 'Método não permitido'
      });
    }
  } catch (error) {
    console.error('Erro no upload:', error);
    res.status(500).json({
      success: false,
      message: 'Erro interno do servidor'
    });
  }
};

module.exports = allowCors(handler);
