import { Injectable } from '@nestjs/common'
import { AuthGuard } from '@nestjs/passport'

// @Injectable()
// export class UserGuard implements CanActivate {
//   constructor(private readonly jwtService: JwtService) {}
//   canActivate(context: ExecutionContext): boolean | Promise<boolean> | Observable<boolean> {
//     const request = context.switchToHttp().getRequest<Request>()
//     const accessToken = request.headers.authorization.slice(7)
//     const userInfo = this.jwtService.verifyAsync(accessToken, { secret: jwtSecret })
//     console.log(userInfo)
//     return true
//   }
// }

@Injectable()
export class LocalAuthGuard extends AuthGuard('local') {}

@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') {}
