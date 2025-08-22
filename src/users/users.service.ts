import { Injectable, ConflictException, NotFoundException, ForbiddenException } from '@nestjs/common';
import { UpdateUserDto } from './dto/update-user.dto';
import * as bcrypt from 'bcrypt';
import { UsersRepository } from './users.repository';
import { CurrentUserDto } from 'src/auth/dto/current-user.dto';

@Injectable()
export class UsersService {
  constructor(private readonly usersRepository: UsersRepository) {}

  findAll() {
    return this.usersRepository.findAll();
  }

  async findOne(id: number) {
    const user = await this.usersRepository.findOne(id);

    if (user.length === 0) {
      throw new NotFoundException('Usuário não encontrado');
    }

    return user[0];
  }

  async findByEmail(email: string) {
    return this.usersRepository.findByEmail(email);
  }

  async update(id: number, updateUserDto: UpdateUserDto, user: CurrentUserDto) {
    await this.findOne(id);

    if (user.role === 'user' && user.id !== id) {
      throw new ForbiddenException('Você não tem permissão para atualizar este usuário');
    }

    // Se está atualizando email, verificar se não está em uso
    if (updateUserDto.email) {
      const existingUser = await this.findByEmail(updateUserDto.email);

      if (existingUser.length > 0 && existingUser[0].id !== id) {
        throw new ConflictException('Email já está em uso');
      }
    }

    // Se está atualizando senha, fazer hash
    const updateData: any = { ...updateUserDto };
    const saltRounds = 10;
    if (updateUserDto.password) {
      updateData.password = await bcrypt.hash(updateUserDto.password, saltRounds);
    }

    return this.usersRepository.update(id, updateData);
  }

  async remove(id: number) {
    await this.findOne(id);

    return this.usersRepository.remove(id);
  }

  async toggleActive(id: number) {
    const user = await this.findOne(id);
    const newStatus = user.isActive === true ? false : true;

    return this.usersRepository.update(id, { isActive: newStatus });
  }
}
