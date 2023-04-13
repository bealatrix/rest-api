const express = require('express');
const router = express.Router();
const multer = require('multer');
const login = require('../middleware/login');


const ProductsController = require('../controllers/product-controller');

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

router.get ('/', ProductsController.getProducts);
router.get('/:productId', ProductsController.getProductDetail);

router.post(
    '/',
    login.required,
    upload.single('image'),
    ProductsController.postProduct
);

router.patch('/:productId', login.required, ProductsController.updateProduct);

router.delete('/delete', login.required, ProductsController.deleteProduct);

router.post(
    '/', 
    upload.single('image'), 
    login.required,
    ProductsController.postImage
);

router.get(
    '/:productId/images',
    ProductsController.getImages
);

module.exports = router;