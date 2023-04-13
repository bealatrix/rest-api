const mysql = require('../mysql');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

exports.postUser = async (req, res, next) => {
    try {
        var queryUser = 'SELECT * FROM users WHERE email = ?';
        var result = await mysql.execute(queryUser, [req.body.email]);

        if (result.length > 0) {
            return res.status(409).send({ message: 'Usuário já cadastrado' });
        }
        const hash = await bcrypt.hashSync(req.body.password, 10);

        /*bcrypt.hash(req.body.password, 10, async (errBcrypt, hash) => {
            if (errBcrypt) {
                return res.status(500).send({ error: errBcrypt });
            }*/

        /*const users = req.body.users.map(user => [
            user.email,
            bcrypt.hashSy*/

        query = 'INSERT INTO users (email, password) VALUES (?,?)';
        const results = await mysql.execute(query, [req.body.email, hash]);

        const response = {
            message: 'Usuário criado com sucesso',
            createdUsers: {
                userId: results.insertId,
                email: req.body.email,
                hash: hash,
                password: req.body.password
            }
        }

        return res.status(201).send(response);
    } catch (error) {
        return res.status(500).send({ error: error });
    }
};

exports.login = async (req, res, next) => {
    try {
        const query = `SELECT * FROM users WHERE email = ?`;
        var result = await mysql.execute(query, [req.body.email]);

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
            users: resultConsulUs.map(user => {
                return {
                    userId: user.userId,
                    email: user.email
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
        var queryUser = 'SELECT * FROM users WHERE userId = ?';
        var result = await mysql.execute(queryUser, [req.body.userId]);
        
        console.log(result); 
         if (result.length === 0) {
             return res.status(409).send({ message: 'Usuário não encontrado' });
         }
 
         var query = 'DELETE FROM users WHERE userId = ?';
         var resultDel = await mysql.execute(query, [req.body.userId]);
 
         const response = {
             message: 'Usuario removido com sucesso'
         }

        return res.status(202).send(response);
    } catch (error) {
        return res.status(500).send({ error: error })
    }
}