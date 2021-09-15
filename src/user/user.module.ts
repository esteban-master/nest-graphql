import { Module } from "@nestjs/common";
import { MongooseModule } from "@nestjs/mongoose";
import { JwtModule } from "@nestjs/jwt";
import { User, UserSchema } from "./model/user.model";
import { UserResolver } from "./user.resolver";
import { UserService } from "./user.service";
import { hashSync } from "bcrypt";
import { ConfigModule, ConfigService } from "@nestjs/config";
import { JwtStrategy } from "./passport-strategies/jwt.strategy";

@Module({
  imports: [
    ConfigModule,
    MongooseModule.forFeatureAsync([
      {
        name: User.name,
        useFactory: () => {
          const schema = UserSchema;
          schema.pre("save", async function (next) {
            if (this.isModified("password")) {
              this.password = hashSync(this.password, 10);
              next();
            }
            next();
          });
          return schema;
        },
      },
    ]),
    JwtModule.registerAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => {
        return {
          secret: configService.get("jwt_config.secret"),
          signOptions: {
            expiresIn: configService.get("jwt_config.expire"),
          },
        };
      },
      inject: [ConfigService],
    }),
  ],
  providers: [UserResolver, UserService, JwtStrategy],
  exports: [UserService],
})
export class UserModule {}
