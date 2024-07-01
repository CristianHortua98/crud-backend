import { CanActivate, ExecutionContext, Injectable, UnauthorizedException } from '@nestjs/common';
import { Observable } from 'rxjs';
import { JwtService } from '@nestjs/jwt';
import { AuthService } from '../auth.service';
import { JwtPayload } from '../interfaces/jwt-payload.interface';

@Injectable()
export class AuthGuard implements CanActivate {

  constructor(
    private jwtService:JwtService,
    private authService:AuthService
  ){}

  async canActivate(context: ExecutionContext ): Promise<boolean>{

    //INFORMACION DE LA SOLICITUD
    const request = context.switchToHttp().getRequest();
    // console.log({request});
    const token = this.extractTokenFromHeader(request);
    // console.log({token});

    if(!token){
      throw new UnauthorizedException(`No existe el Token en la peticion.`);
    }

    try {

      const payload = await this.jwtService.verifyAsync<JwtPayload>(token, {secret: process.env.JWT_SEED});

      //INFORMACION DE VARIABLES CARGADAS EN EL PAYLOAD
      // console.log({payload});

      const user = await this.authService.buscarUsuarioById(payload.id);

      if(!user){
        throw new UnauthorizedException(`El usuario no existe.`);
      }

      if(Number(user.isActive) !== 1){
        throw new UnauthorizedException('El usuario no esta activo');
      }

      request['infoUser'] = user;

      // console.log({request});
      
    }catch(error){

      throw new UnauthorizedException(error);
      
    }

    return true;
  }

  private extractTokenFromHeader(request: Request): string | undefined {
    const [type, token] = request.headers['authorization']?.split(' ') ?? [];
    return type === 'Bearer' ? token : undefined;
  }
}
