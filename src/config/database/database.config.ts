import { registerAs } from "@nestjs/config";

export default registerAs("database_mongo", () => ({
  atlas_user: process.env.MONGO_ATLAS_USER,
  atlas_password: process.env.MONGO_ATLAS_PASSWORD,
  atlas_db: process.env.MONGO_ATLAS_DB,
}));
