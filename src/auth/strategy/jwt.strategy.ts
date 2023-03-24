import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy } from 'passport-local';
import { UserService } from 'src/user/user.service';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(private readonly _userService: UserService) {
    super();
  }

  public async validate(payload: { sub: string }) {
    const user = await this._userService.getUserById(payload.sub);
    delete user.passwordHash;

    return user;
  }
}
