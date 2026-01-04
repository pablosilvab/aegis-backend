import { Injectable, Inject, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { IUserRepository } from '@domain/interfaces/user.repository.interface';
import { UserId } from '@domain/value-objects/user-id.vo';

export interface JwtPayload {
  sub: string;
  email: string;
}

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(
    @Inject('IUserRepository')
    private readonly userRepository: IUserRepository,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: process.env.JWT_SECRET || 'secret',
    });
  }

  async validate(payload: JwtPayload) {
    const userId = new UserId(payload.sub);
    const user = await this.userRepository.findById(userId);
    
    if (!user) {
      throw new UnauthorizedException('User not found');
    }

    return {
      userId: user.getId().toString(),
      email: user.getEmail(),
    };
  }
}

