import { v2 as cloudinary } from 'cloudinary';
import config from '../config';
import multer from 'multer';

cloudinary.config({
  cloud_name: config.image_cloud_name,
  api_key: config.image_api_keys,
  api_secret: config.image_api_secret,
});

export const sendImageToClaudinary = (imageName: string, path: string) => {
  return new Promise((resolve, reject) => {
    cloudinary.uploader.upload(
      path,
      { public_id: imageName },
      function (error, result) {
        if (error) {
          reject(error);
        }
        resolve(result);
      },
    );
  });
};

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, process.cwd() + '/uploads/');
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
    cb(null, file.fieldname + '-' + uniqueSuffix);
  },
});

export const upload = multer({ storage: storage });
