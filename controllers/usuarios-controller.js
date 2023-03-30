const mysql = require('../mysql');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

exports.cadastrarUsuario = async (req, res, next) => {
    try {
        const queryConsulUs = 'SELECT * FROM usuarios WHERE email = ?';
        const resultConsulUs = await mysql.execute(queryConsulUs, [req.body.email]);

        if (resultConsulUs.length > 0) {
            return res.status(409).send({ mensagem: 'Usuário já cadastrado' });
        }

        /*const users = req.body.users.map(user => [
            user.email,
            bcrypt.hashSync(user.password, 10)
        ])*/

        bcrypt.hash(req.body.senha, 10, async (err, hash) => {
            if (err) {
                return res.status(500).send({ error: err });
            }

            const queryInser = 'INSERT INTO usuarios (email, senha) VALUES (?,?)';
            const resultInser = await mysql.execute(queryInser, [req.body.email, hash]);

            const response = {
                mensagem: 'Usuário criado com sucesso',
                usuarioCriado: {
                    id_usuario: resultInser.insertId,
                    email: req.body.email
                }
            };
            return res.status(201).send(response);
        });
    } catch (error) {
        return res.status(500).send({ error: error });
    }
};

exports.loginUsuario = async (req, res, next) => {
    try {
        const query = `SELECT * FROM usuarios WHERE email = ?`;
        const result = await mysql.execute(query, [req.body.email]);

        if (results.length < 1) {
            return res.status(401).send({ mensagem: 'Falha na autenticação' });
        }
        if (await bcrypt.compareSync(req.body.senha, results[0].senha)) {
            const token = jwt.sign({
                id_usuario: results[0].id_usuario,
                email: results[0].email,
            }, 
            process.env.JWT_KEY, 
            {
                expiresIn: "1h"
            });
            return res.status(200).send({
                mensagem: 'Autenticado com sucesso',
                token: token
            });
        }

        return res.status(401).send({ message: 'Falha na autenticação' })
    } catch (error) {
        return res.status(500).send({ message: 'Falha na autenticação' });
    }
};


/*

TENTATIVA DE FAZER UM GET USUARIO PRA RETORNAR OS USUARIOS CADASTRADOS

exports.listarUsuarios = async (req, res, next) => {
    try {
        const queryConsulUs = 'SELECT * FROM usuarios WHERE email = ?';
        const resultConsulUs = await mysql.execute(queryConsulUs, [req.body.email]);
        const response = {
            quantidade: resultConsulUs.length,
            usuarios: resultConsulUs.map(usuarioCriado => {
                return {
                    id_usuario: usuarioCriado.id_usuario,
                    email: usuarioCriado.email,
                }
            })
        }

        return res.status(200).send(response);
    } catch (error) {
        return res.status(500).send({ error: error });
    }
};
*/