const mysql = require('../mysql');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

exports.createUser = async (req, res, next) => {
    try {
        const queryConsulUs = 'SELECT * FROM users WHERE email = ?';
        const resultConsulUs = await mysql.execute(queryConsulUs, [req.body.email]);

        if (resultConsulUs.length > 0) {
            return res.status(409).send({ mensagem: 'Usuário já cadastrado' });
        }

        /*const users = req.body.users.map(user => [
            user.email,
            bcrypt.hashSync(user.password, 10)
        ])*/

        bcrypt.hash(req.body.senha, 10, async (errBcrypt, hash) => {
            if (errBcrypt) {
                return res.status(500).send({ error: errBcrypt });
            }

            const queryInser = 'INSERT INTO users (email, password) VALUES (?,?)';
            const resultInser = await mysql.execute(queryInser, [req.body.email, hash]);

            const response = {
                message: 'Usuário criado com sucesso',
                createcUsers: {
                    userId: resultInser.insertId,
                    email: req.body.email
                }
            };
            return res.status(201).send(response);
        });
    } catch (error) {
        return res.status(500).send({ error: error });
    }
};

exports.login = async (req, res, next) => {
    try {
        const query = `SELECT * FROM users WHERE email = ?`;
        const result = await mysql.execute(query, [req.body.email]);

        if (result.length < 1) {
            return res.status(401).send({ message: 'Falha na autenticação' });
        }
        if (await bcrypt.compareSync(req.body.password, result[0].password)) {
            const token = jwt.sign({
                userId: result[0].userId,
                email: result[0].email,
            }, 
            process.env.JWT_KEY, 
            {
                expiresIn: "1h"
            });
            return res.status(200).send({
                message: 'Autenticado com sucesso',
                token: token
            });
        }

        return res.status(401).send({ message: 'Falha na autenticação' })
    } catch (error) {
        return res.status(500).send({ message: 'Falha na autenticação' });
    }
};

exports.listUsers = async (req, res, next) => {
    try {
        const resultConsulUs = await mysql.execute("SELECT * FROM users;")
        
        const response = {
            quantity: resultConsulUs.length,
            users: resultConsulUs.map(usuario => {
                return {
                    userId: usuario.userId,
                    email: usuario.email
                }
            })
        }
        return res.status(200).send(response);
    } catch (error) {
        return res.status(500).send({ error: error });
    }
};

exports.deleteUser = async (req, res, next) => {
    try {

        const query = 'DELETE FROM users WHERE userId = ?';
        const resultDel = await mysql.execute(query, [req.body.id_usuario]);

        const response = {
            message: 'Usuario removido com sucesso'
        }
        return res.status(202).send(response);
    }catch (error) {
        return res.status(500).send({ error: error })
    }
}