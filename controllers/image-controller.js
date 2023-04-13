const mysql = require('../mysql');

exports.deleteImage = async (req, res, next) => {
    try {
        var queryIma = 'SELECT * FROM productImages WHERE imageId = ?';
        var result = await mysql.execute(queryIma, [req.body.imageId]);
        
        console.log(result); 
         if (result.length === 0) {
             return res.status(409).send({ message: 'Imagem não encontrado' });
        }

        var query = 'DELETE FROM productImages WHERE imageId = ?';
        var resultIma = await mysql.execute(query, [req.params.imageId]);

        const response = {
            message: 'Imagem removida com sucesso',
            request: {
                type: 'POST',
                description: 'Insere uma imagem',
                url: 'http://localhost:3000/products/' + req.body.productId + '/image',
                body: {
                    productId: 'Number',
                    path: 'File'
                }
            }
        }
        return res.status(202).send(response);
    } catch (error) {
        console.error(error)
        return res.status(500).send({ error: error })
    }
};
