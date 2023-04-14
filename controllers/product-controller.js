const mysql = require('../mysql');

exports.getProducts = async (req, res, next) => {
    try {
        const result = await mysql.execute("SELECT * FROM products;")
        const response = {
            quantity: result.length,
            products: result.map(prod => {
                return {
                    productId: prod.productId,
                    name: prod.name,
                    price: prod.price,
                    productImage: prod.imagem_produto,
                    request: {
                        type: 'GET',
                        description: 'Retorna os detalhes de um produto específico',
                        url: 'http://localhost:3000/products/' + prod.productId
                    }
                }
            })
        }
        return res.status(200).send(response);
    } catch (error) {
        return res.status(500).send({ error: error });
    }
};

exports.postProduct = async (req, res, next) => {
    try {
        const query = 'INSERT INTO products (name, price, productImage) VALUES (?,?,?)';
        const result = await mysql.execute(query, [
            req.body.name,
            req.body.price,
            req.file.path
        ]);

        const response = {
            message: 'Produto inserido com sucesso',
            createdProduct: {
                productId: result.insertId,
                name: req.body.name,
                price: req.body.price,
                productImage: req.file.path,
                request: {
                    type: 'GET',
                    description: 'Retorna todos os produtos',
                    url: 'http://localhost:3000/products'
                }
            }
        }
        return res.status(201).send(response);
    } catch (error) {
        return res.status(500).send({ error: error });
    }
};

exports.getProductDetail = async (req, res, next) => {
    try {
        const query = 'SELECT * FROM products WHERE productId= ?;';
        const result = await mysql.execute(query, [req.params.productId]);

        if (result.length == 0) {
            return res.status(404).send({
                message: 'Não foi encontrado produto com este ID'
            })
        }

        const response = {
            product: {
                productId: result[0].productId,
                name: result[0].name,
                price: result[0].price,
                productImage: result[0].productImage,
                request: {
                    type: 'GET',
                    description: 'Retorna todos os produtos',
                    url: 'http://localhost:3000/products'
                }
            }
        }

        return res.status(200).send(response);
    } catch (error) {
        return res.status(500).send({ error: error })
    }
};

exports.updateProduct = async (req, res, next) => {
    try {
        var queryProd = 'SELECT * FROM products WHERE productId = ?';
        var result = await mysql.execute(queryProd, [req.body.productId]);
        
        console.log(result); 
         if (result.length === 0) {
             return res.status(409).send({ message: 'Produto não encontrado' });
        }

        var query = `UPDATE products 
                          SET name        = ?, 
                              price       = ? 
                        WHERE productId  = ?`;

        var resultUp =await mysql.execute(query, [
            req.body.name,
            req.body.price,
            req.body.productId]);

        const response = {
            message: 'Produto atualizado com sucesso',
            updateProduct: {
                productId: req.body.productId,
                name: req.body.name,
                price: req.body.price,
                request: {
                    type: 'GET',
                    description: 'Retorna os detalhes de um produto específico',
                    url: 'http://localhost:3000/products/' + req.body.productId
                }
            }
        }
        return res.status(200).send(response);
    } catch {
        return res.status(500).send({ error: error })
    }
};

exports.deleteProduct = async (req, res, next) => {
    try {
        var queryProd = 'SELECT * FROM products WHERE productId = ?';
        var result = await mysql.execute(queryProd, [req.body.productId]);
        
        console.log(result); 
         if (result.length === 0) {
             return res.status(409).send({ message: 'Produto não encontrado' });
        }

        var query = 'DELETE FROM product WHERE productId = ?';
        var resultDel = mysql.execute(query, [req.body.productId]);

        const response = {
            message: 'Produto removido com sucesso',
            request: {
                type: 'POST',
                description: 'Insere um produto',
                url: 'http://localhost:3000/products',
                body: {
                    name: 'String',
                    price: 'Number'
                }
            }
        }

        return res.status(200).send(response);
    } catch {
        return res.status(500).send({ error: error })
    }
};

exports.postImage = async (req, res, next) => {
    try {
        const query = 'INSERT INTO productImages (productId, path) VALUES (?,?)';
        const result = mysql.execute(query, [
            req.params.productId,
            req.file.path
        ]);

        const response = {
            message: 'Imagem inserida com sucesso',
            createdImage: {
                productId: parseInt(req.params.productId),
                imageId: result.insertId,
                path: req.file.path,
                request: {
                    type: 'GET',
                    description: 'Retorna todas as imagens',
                    url: 'http://localhost:3000/products/'+ req.params.productId + '/images'
                }
            }
        }

        return res.status(201).send(response);
    } catch (error) {
        return res.status(500).send({ error: error });
    }
};

exports.getImages = async (req, res, next) => {
    try {
        const query = 'SELECT * FROM productImages WHERE productId = ?;';
        const result = await mysql.execute(query, [req.params.productId]);
        const response = {
            quantity: result.length,
            images: result.map(img => {
                return {
                    productId: parseInt(req.params.productId),
                    imageId: img.imageId,
                    path: img.path
                }
            })
        }
        return res.status(200).send(response);
    } catch (error) {
        return res.status(500).send({ error: error });
    }
};