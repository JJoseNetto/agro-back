import { ConflictException, Injectable, UnauthorizedException } from '@nestjs/common';
import { UsersService } from '../users/users.service';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { CreateUserDto } from 'src/users/dto/create-user.dto';
import { UsersRepository } from 'src/users/users.repository'; 

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private usersRepository: UsersRepository,
    private jwtService: JwtService,
  ) {}

  async register(createUserDto: CreateUserDto){
      const existingUser = await this.usersService.findByEmail(createUserDto.email);

      if (existingUser.length > 0) {
        throw new ConflictException('Email já está em uso');
      }
      const saltRounds = 10;
      const hashedPassword = await bcrypt.hash(createUserDto.password, saltRounds);
  
      return this.usersRepository.create(createUserDto, hashedPassword);
  }

  async validateUser(email: string, password: string): Promise<any> {
    const users = await this.usersService.findByEmail(email);
    
    if (users.length === 0) {
      return null;
    }

    const user = users[0];
    
    if (user.isActive === false) {
      throw new UnauthorizedException('Usuário inativo');
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    
    if (isPasswordValid) {
      const { password, ...result } = user;
      return result;
    }
    
    return null;
  }

  async login(user: any) {
    const payload = { 
      email: user.email, 
      sub: user.id,
      nome: user.nome,
      role: user.role 
    };
    
    return {
      access_token: this.jwtService.sign(payload),
      user: {
        id: user.id,
        email: user.email,
        nome: user.nome,
        role: user.role,
      }
    };
  }
}