import { PassportSerializer } from '@nestjs/passport';
import { Injectable } from '@nestjs/common';
import { UserService } from 'src/user/user.service';

@Injectable()
export class SessionSerializer extends PassportSerializer {
  constructor(private readonly _userService: UserService) {
    super();
  }

  serializeUser(user: any, done: (err: Error, user: any) => void): any {
    done(null, user);
  }

  async deserializeUser(
    payload: any,
    done: (err: Error, payload: string) => void,
  ) {
    done(null, payload);
  }
}
