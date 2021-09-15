import { Module } from "@nestjs/common";
import { ConfigModule } from "@nestjs/config";
import { MongooseModule } from "@nestjs/mongoose";
import { MongooseConfigService } from "./database.config.service";

@Module({
  imports: [
    MongooseModule.forRootAsync({
      imports: [ConfigModule],
      useClass: MongooseConfigService,
    }),
  ],
})
export class DatabaseModule {}
