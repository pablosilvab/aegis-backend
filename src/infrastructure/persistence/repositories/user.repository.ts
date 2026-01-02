import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from '@domain/entities/user.entity';
import { UserId } from '@domain/value-objects/user-id.vo';
import { IUserRepository } from '@domain/interfaces/user.repository.interface';
import { UserEntity } from '../entities/user.entity';

@Injectable()
export class UserRepository implements IUserRepository {
  constructor(
    @InjectRepository(UserEntity)
    private readonly typeOrmRepository: Repository<UserEntity>,
  ) {}

  async save(user: User): Promise<User> {
    const entity = this.toEntity(user);
    const saved = await this.typeOrmRepository.save(entity);
    return this.toDomain(saved);
  }

  async findById(id: UserId): Promise<User | null> {
    const entity = await this.typeOrmRepository.findOne({
      where: { id: id.toString() },
    });
    return entity ? this.toDomain(entity) : null;
  }

  async findByEmail(email: string): Promise<User | null> {
    const entity = await this.typeOrmRepository.findOne({
      where: { email },
    });
    return entity ? this.toDomain(entity) : null;
  }

  async findByGoogleId(googleId: string): Promise<User | null> {
    const entity = await this.typeOrmRepository.findOne({
      where: { googleId },
    });
    return entity ? this.toDomain(entity) : null;
  }

  private toEntity(user: User): UserEntity {
    const entity = new UserEntity();
    entity.id = user.getId().toString();
    entity.email = user.getEmail();
    entity.name = user.getName();
    entity.passwordHash = user.getPasswordHash();
    entity.googleId = user.getGoogleId();
    entity.createdAt = user.getCreatedAt();
    entity.updatedAt = user.getUpdatedAt();
    return entity;
  }

  private toDomain(entity: UserEntity): User {
    return User.fromPersistence(
      entity.id,
      entity.email,
      entity.name,
      entity.passwordHash,
      entity.googleId,
      entity.createdAt,
      entity.updatedAt,
    );
  }
}

