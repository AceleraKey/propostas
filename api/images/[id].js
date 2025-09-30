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

// Simulação de armazenamento de imagens (compartilhado com upload.js)
const uploadedImages = new Map();

const handler = async (req, res) => {
  try {
    if (req.method === 'GET') {
      const { id } = req.query;
      
      const image = uploadedImages.get(id);
      
      if (!image) {
        return res.status(404).json({
          success: false,
          message: 'Imagem não encontrada'
        });
      }

      // Extrair tipo de conteúdo do base64
      const matches = image.data.match(/^data:([A-Za-z-+\/]+);base64,(.+)$/);
      
      if (!matches || matches.length !== 3) {
        return res.status(400).json({
          success: false,
          message: 'Formato de imagem inválido'
        });
      }

      const contentType = matches[1];
      const imageBuffer = Buffer.from(matches[2], 'base64');

      res.setHeader('Content-Type', contentType);
      res.setHeader('Content-Length', imageBuffer.length);
      res.setHeader('Cache-Control', 'public, max-age=31536000'); // Cache por 1 ano
      
      res.status(200).send(imageBuffer);

    } else {
      res.status(405).json({
        success: false,
        message: 'Método não permitido'
      });
    }
  } catch (error) {
    console.error('Erro ao servir imagem:', error);
    res.status(500).json({
      success: false,
      message: 'Erro interno do servidor'
    });
  }
};

module.exports = allowCors(handler);
