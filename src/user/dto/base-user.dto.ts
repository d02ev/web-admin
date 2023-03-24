export class BaseUserDto {
  fullName: string;
  email: string;
  passwordHash: string;
  role = 2; // 0 - admin, 1 - power user, 2 - user, 3 - support desk
}
