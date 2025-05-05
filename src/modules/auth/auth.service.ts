import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { UsersService } from '../user/user.service';
import { IUser } from '../user/interfaces/user.interface';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
  ) {}

  async validateUser(email: string, password: string): Promise<IUser> {
    const user = await this.usersService.findByEmail(email);
    if (!user) throw new UnauthorizedException('Invalid credentials');
    if (!(await bcrypt.compare(password, user.password))) throw new UnauthorizedException('Invalid credentials');
    return user;
  }

  async login(user: IUser): Promise<{ access_token: string }> {
    const payload = { sub: user._id, email: user.email, roles: user.roles };
    return { access_token: this.jwtService.sign(payload) };
  }
  
  async login(user: IUser) {
    const refreshToken = this.jwtService.sign({ sub: user._id }, { expiresIn: '7d' });
    await this.redisService.set(`refresh:${user._id}`, refreshToken, 604800); // 7 days
    return { accessToken, refreshToken };
  }

  async register(email: string, password: string, roles: string[] = ['customer']): Promise<IUser> {
    return this.usersService.createUser(email, password, roles);
  }
}
