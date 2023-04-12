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

exports.getDetailsProduct = async (req, res, next) => {
    try {
        const query = 'SELECT * FROM produtos WHERE id_produto= ?;';
        const result = await mysql.execute(query, [req.params.id_produto]);

        if (result.length == 0) {
            return res.status(404).send({
                mensagem: 'Não foi encontrado produto com este ID'
            })
        }

        const response = {
            produto: {
                id_produto: result[0].id_produto,
                nome: result[0].nome,
                preco: result[0].preco,
                imagem_produto: result[0].imagem_produto,
                request: {
                    tipo: 'GET',
                    descricao: 'Retorna todos os produtos',
                    url: 'http://localhost:3000/produtos'
                }
            }
        }

        return res.status(200).send(response);
    } catch (error) {
        return res.status(500).send({ error: error })
    }
};

exports.updateProduto = async (req, res, next) => {
    try {
        const query = `UPDATE produtos 
        SET nome        = ?, 
            preco       = ? 
      WHERE id_produto  = ?`;

        await mysql.execute(query, [
            req.body.nome,
            req.body.preco,
            req.body.id_produto]);

        const response = {
            mensagem: 'Produto atualizado com sucesso',
            produtoAtualizado: {
                id_produto: req.body.id_produto,
                nome: req.body.nome,
                preco: req.body.preco,
                request: {
                    tipo: 'GET',
                    descricao: 'Retorna os detalhes de um produto específico',
                    url: 'http://localhost:3000/produtos/' + req.body.id_produto
                }
            }
        }
        return res.status(200).send(response);
    } catch {
        return res.status(500).send({ error: error })
    }
};

exports.deleteProduto = async (req, res, next) => {
    try {

        const query = 'DELETE FROM produtos WHERE id_produto = ?';
        await mysql.execute(query, [req.body.id_produto]);

        const response = {
            mensagem: 'Produto removido com sucesso',
            request: {
                tipo: 'POST',
                descricao: 'Insere um produto',
                url: 'http://localhost:3000/produtos',
                body: {
                    nome: 'String',
                    preco: 'Number'
                }
            }
        }

        return res.status(200).send(response);
    } catch {
        return res.status(500).send({ error: error })
    }
};

exports.postImagem = async (req, res, next) => {
    try {
        const query = 'INSERT INTO imagens_produtos (id_produto, caminho) VALUES (?,?)';
        const result = mysql.execute(query, [
            req.params.id_produto,
            req.file.path
        ]);

        const response = {
            mensagem: 'Imagem inserida com sucesso',
            imagemCriada: {
                id_produto: parseInt(req.params.id_produto),
                id_imagem: result.insertId,
                imagem_produto: req.file.path,
                request: {
                    tipo: 'GET',
                    descricao: 'Retorna todas as imagens',
                    url: 'http://localhost:3000/produtos/'+ req.params.id_produto + '/imagens'
                }
            }
        }

        return res.status(201).send(response);
    } catch (error) {
        return res.status(500).send({ error: error });
    }
};

exports.getImagens = async (req, res, next) => {
    try {
        const query = 'SELECT * FROM imagens_produtos WHERE id_produto= ?;';
        const result = await mysql.execute(query, [req.params.id_produto]);
        const response = {
            quantidade: result.length,
            imagens: result.map(img => {
                return {
                    id_produto: parseInt(req.params.id_produto),
                    id_imagem: img.id_imagem,
                    caminho: img.caminho
                }
            })
        }
        return res.status(200).send(response);
    } catch (error) {
        return res.status(500).send({ error: error });
    }
};