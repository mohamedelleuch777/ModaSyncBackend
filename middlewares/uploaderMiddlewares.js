import multer from 'multer';
import path from 'path';

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
      // Define the destination folder for uploads.
      cb(null, 'uploads/img/');
    },
    filename: (req, file, cb) => {
      // Create a unique file name with original file extension.
      const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
      const ext = path.extname(file.originalname);
      cb(null, file.fieldname + '-' + uniqueSuffix + ext);
    }
});

// Filter the uploaded file types (e.g., allow only images).
const fileFilter = (req, file, cb) => {
    const allowedTypes = /jpeg|jpg|png|gif|bmp|tiff|svg/;
    const isValidExt = allowedTypes.test(path.extname(file.originalname).toLowerCase());
    const isValidMime = allowedTypes.test(file.mimetype);
    if (isValidExt && isValidMime) {
      cb(null, true);
    } else {
      cb(new Error('Only images (jpeg, jpg, png, gif, bmp, tiff, svg) are allowed'));
    }
};
  

// Create the multer middleware with a file size limit (here, 5 MB).
const upload = multer({
    storage: storage,
    limits: { fileSize: 5 * 1024 * 1024 }, // 5 MB
    fileFilter: fileFilter
}).single('picture'); // Expecting the form field to be named "picture"


const exportedFunctions = {
    upload
}
export default exportedFunctions; 
