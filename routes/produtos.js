const express = require('express');
const router = express.Router();
const multer = require('multer');
const login = require('../middleware/login');


const ProdutosController = require('../controllers/produtos-controller');

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, './uploads/');
    },
    filename: function (req, file, cb) {
        cb(null, new Date().toISOString().replace(/:/g, '-') + file.originalname);
    }
});
const fileFilter = (req, file, cb) => {
    if (file.mimetype === 'image/jpeg' || file.mimetype === 'image/png') {
        cb(null, true);
    } else {
        cb(null, false);
    }
}
const upload = multer({
    storage: storage,
    limits: {
        fileSize: 1024 * 1024 * 5
    },

    fileFilter: fileFilter
});


//RETORNA TODOS OS PRODUTO
router.get('/', ProdutosController.getProdutos);

//RETORNA OS DETALHES DE UM PRODUTO EM ESPECIFICO
router.get('/:id_produto', ProdutosController.getUmProduto);

//INSERE UM PRODUTO
router.post(
    '/',
    login.obrigatorio,
    upload.single('produto_imagem'),
    ProdutosController.postProdutos
);

//ALTERA UM PRODUTO
router.patch('/:id_produto', login.obrigatorio, ProdutosController.updateProduto);

//EXCLUI UM PRODUTO
router.delete('/:id_produto', login.obrigatorio, ProdutosController.deleteProduto);

router.post(
    '/:id_produto/imagem', 
    upload.single('produto_imagem'), 
    login.obrigatorio,
    ProdutosController.postImagem
    );

module.exports = router;