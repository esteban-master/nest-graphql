import { Injectable } from "@nestjs/common";
import { PassportStrategy } from "@nestjs/passport";
import { Strategy } from "passport-local";
import { User } from "src/user/model/user.model";
// import { AuthService } from '../../auth/auth.service';

@Injectable()
export class LocalStrategy extends PassportStrategy(Strategy) {
  // constructor(private authService: AuthService) {
  //   // Podemos pasar un objeto de opciones en la llamada a super() para personalizar el comportamiento de la estrategia de pasaporte.
  //   // En este ejemplo, la estrategia local de pasaporte espera de forma predeterminada las propiedades llamadas username y passworden el cuerpo de la solicitud.
  //   // Pasar un objeto de opciones para especificar diferentes nombres de propiedades, por ejemplo: super({ usernameField: 'email' })
  //   super({ usernameField: 'email' });
  // }
  // // El validate() método para cualquier estrategia de Passport seguirá un patrón similar,
  // // variando solo en los detalles de cómo se representan las credenciales. Si se encuentra un usuario y
  // // las credenciales son válidas, se devuelve el usuario para que Passport pueda completar sus tareas (por ejemplo, crear la propiedad user en el objeto Request)
  // // y la canalización de manejo de solicitudes puede continuar. Si no se encuentra, lanzamos una excepción
  // async validate(email: string, password: string): Promise<User> {
  //   return await this.authService.validateUser(email, password);
  // }
}
