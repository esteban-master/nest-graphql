import { Injectable } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { PassportStrategy } from "@nestjs/passport";
import { ExtractJwt, Strategy } from "passport-jwt";
import { UserService } from "src/user/user.service";

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(private userService: UserService, configService: ConfigService) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: configService.get("jwt_config.secret"),
    });
  }

  // Para la estrategia jwt, Passport primero verifica la firma del JWT y decodifica el JSON.
  // Luego invoca nuestro validate() método pasando el JSON decodificado como su único parámetro.
  // Según la forma en que funciona la firma de JWT, tenemos la garantía de que estamos recibiendo un token válido que hemos firmado
  // y emitido previamente a un usuario válido.
  async validate({ _id }: { _id: string }) {
    return this.userService.getUserById({ userId: _id });
  }
}
