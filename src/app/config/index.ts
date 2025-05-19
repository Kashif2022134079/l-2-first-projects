import dotenv from 'dotenv';
import path from 'path';

dotenv.config({ path: path.join((process.cwd(), '.env')) });

export default {
  node_env: process.env.NODE_ENV,
  port: process.env.PORT,
  database_url: process.env.DATABASE_URL,
  bcrypt_salt_rounds: process.env.BCRYPT_SALT_ROUNDS,
  default_pass: process.env.DEFAULT_PASS,
  jwt_access_secret: process.env.JWT_ACCESS_SECRET,
  jwt_refresh_secret: process.env.JWT_REFRESH_SECRET,
  reset_password_ui_link: process.env.RESET_PASSWORD_UI_LINK,
  image_api_secret: process.env.IMAGE_API_SECRET,
  image_api_keys: process.env.IMAGE_API_KEYS,
  image_cloud_name: process.env.IMAGE_CLOUD_NAME,
};
