import { Module } from "@nestjs/common";
import { GraphQLModule } from "@nestjs/graphql";
import { UserModule } from "./user/user.module";
import { DatabaseModule } from "./config/database/database.module";
import { ConfigModule } from "@nestjs/config";
import { FollowModule } from "./follow/follow.module";
import { PostModule } from "./post/post.module";
import databaseConfig from "./config/database/database.config";
import jwtConfig from "./config/database/jwt.config";

@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: `.env.${process.env.NODE_ENV || "development"}`,
      load: [databaseConfig, jwtConfig],
    }),
    GraphQLModule.forRoot({
      autoSchemaFile: "schema.gql",
    }),
    DatabaseModule,
    UserModule,
    FollowModule,
    PostModule,
  ],
  controllers: [],
  providers: [],
  exports: [],
})
export class AppModule {}
