import multer from 'multer';
import path from 'path';
import * as imageRepository from '../repositories/image.repository.js';

const multerStorage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, './assets/images');
    },
    filename: (req, file, cb) => {
        cb(null, `image-${Date.now()}` + path.extname(file.originalname))
    }
});
const multerFilter = (req, file, cb) => {
    if (!file.originalname.match(/\.(png|jpg|gif)$/)) {
        return cb(new Error('Please upload a Image'))
    }
    cb(null, true)
};

const upload = multer({
    storage: multerStorage,
    fileFilter: multerFilter,
    limits: { fileSize: 7 * 1024 * 1024 }
});
async function uploadSingleImage(req, res, next) {
    const image = { filename: req.file.filename, eventId: req.body.eventId };
    await imageRepository.addImage(image);
    return res.status(200).json({ 'statusCode': 200, 'status': true, message: 'Image added', 'data': [] });

}
export { upload, uploadSingleImage };