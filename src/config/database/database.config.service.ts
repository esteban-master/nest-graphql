import { Injectable } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import {
  MongooseModuleOptions,
  MongooseOptionsFactory,
} from "@nestjs/mongoose";

@Injectable()
export class MongooseConfigService implements MongooseOptionsFactory {
  constructor(private configService: ConfigService) {}
  createMongooseOptions(): MongooseModuleOptions {
    const user = this.configService.get("database_mongo.atlas_user");
    const password = this.configService.get("database_mongo.atlas_password");
    const db = this.configService.get("database_mongo.atlas_db");

    return {
      uri: `mongodb+srv://${user}:${password}@cluster0.1gsco.mongodb.net/${db}`,
    };
  }
}
