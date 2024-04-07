import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Observable } from 'rxjs';

import { JwtService } from '@nestjs/jwt';
import { ROLES_KEY } from './users.decorator';
import { Role } from 'src/enum/roles.enum';

@Injectable()
export class UserGuard implements CanActivate {
  constructor(
    private reflecotr: Reflector,
    private jwt: JwtService,
  ) {}

  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    const requiredRoles = this.reflecotr.getAllAndOverride<Role[]>(ROLES_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);

    if (!requiredRoles || requiredRoles[0] !== 'user') {
      return true;
    }
    
    /* Decode Token */
    
    const res = context.switchToHttp().getRequest();
    const token = res.header('jwt');
    
    const payLoad = this.jwt.decode(token);
    
    if (payLoad) {
      if(!payLoad.isAdmin) return true;
    }

    return false;
  }
}
