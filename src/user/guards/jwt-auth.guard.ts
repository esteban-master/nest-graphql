import {
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from "@nestjs/common";
import { GqlExecutionContext } from "@nestjs/graphql";
import { AuthGuard } from "@nestjs/passport";

type ErrorJwt =
  | "TokenExpiredError"
  | "JsonWebTokenError"
  | "SyntaxError"
  | "Error";

@Injectable()
export class JwtAuthGuard extends AuthGuard("jwt") {
  handleRequest(err, user, info) {
    if (err || !user) {
      const nameError: ErrorJwt = info.name;
      switch (nameError) {
        case "JsonWebTokenError":
        case "SyntaxError":
          throw err || new UnauthorizedException("Token invalido");
        case "TokenExpiredError":
          throw err || new UnauthorizedException("Token expirado");
        case "Error":
          throw err || new UnauthorizedException("Error en el token");
        default:
          break;
      }
    }
    return user;
  }

  getRequest(context: ExecutionContext) {
    const ctx = GqlExecutionContext.create(context);
    return ctx.getContext().req;
  }
}
