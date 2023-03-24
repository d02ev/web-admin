import { SetMetadata } from '@nestjs/common';
import { Role } from '../enum/roles.enum';

export const UseRole = (role: Role) => SetMetadata('role', role);
