/* eslint-disable prettier/prettier */
import { registerAs } from '@nestjs/config';

export default registerAs('jwt_config', () => ({
  secret: process.env.JWT_SECRET,
  expire: process.env.JWT_EXPIRE,
}));
