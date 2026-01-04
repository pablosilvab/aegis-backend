import { Injectable, Inject, UnauthorizedException, ConflictException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { randomUUID } from 'crypto';
import * as bcrypt from 'bcrypt';
import { User } from '@domain/entities/user.entity';
import { UserId } from '@domain/value-objects/user-id.vo';
import { IUserRepository } from '@domain/interfaces/user.repository.interface';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';
import { GoogleLoginDto } from './dto/google-login.dto';
import { AuthResponseDto } from './dto/auth-response.dto';

@Injectable()
export class AuthService {
  constructor(
    @Inject('IUserRepository')
    private readonly userRepository: IUserRepository,
    private readonly jwtService: JwtService,
  ) {}

  async register(registerDto: RegisterDto): Promise<AuthResponseDto> {
    const existingUser = await this.userRepository.findByEmail(registerDto.email);
    if (existingUser) {
      throw new ConflictException('User with this email already exists');
    }
    const passwordHash = await bcrypt.hash(registerDto.password, 12);

    const userId = randomUUID();
    const user = User.create(
      userId,
      registerDto.email,
      registerDto.name,
      passwordHash,
    );

    const savedUser = await this.userRepository.save(user);

    const tokens = await this.generateTokens(savedUser);

    return {
      accessToken: tokens.accessToken,
      refreshToken: tokens.refreshToken,
      user: {
        id: savedUser.getId().toString(),
        email: savedUser.getEmail(),
        name: savedUser.getName(),
      },
    };
  }

  async login(loginDto: LoginDto): Promise<AuthResponseDto> {
    const user = await this.userRepository.findByEmail(loginDto.email);
    if (!user) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const passwordHash = user.getPasswordHash();
    if (!passwordHash) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const isPasswordValid = await bcrypt.compare(loginDto.password, passwordHash);
    if (!isPasswordValid) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const tokens = await this.generateTokens(user);

    return {
      accessToken: tokens.accessToken,
      refreshToken: tokens.refreshToken,
      user: {
        id: user.getId().toString(),
        email: user.getEmail(),
        name: user.getName(),
      },
    };
  }

  async loginWithGoogle(googleLoginDto: GoogleLoginDto): Promise<AuthResponseDto> {
    try {
      const userInfoResponse = await fetch('https://www.googleapis.com/oauth2/v2/userinfo', {
        headers: {
          Authorization: `Bearer ${googleLoginDto.googleToken}`,
        },
      });

      if (!userInfoResponse.ok) {
        throw new UnauthorizedException('Invalid Google access token');
      }

      const googleUserInfo = await userInfoResponse.json();

      if (googleUserInfo.id !== googleLoginDto.googleId || googleUserInfo.email !== googleLoginDto.email) {
        throw new UnauthorizedException('Google token information mismatch');
      }
    } catch (error) {
      if (error instanceof UnauthorizedException) {
        throw error;
      }
      throw new UnauthorizedException('Failed to verify Google access token');
    }

    let user = await this.userRepository.findByGoogleId(googleLoginDto.googleId);

    if (!user) {
      user = await this.userRepository.findByEmail(googleLoginDto.email);

      if (user) {
        if (!user.getGoogleId()) {
          user.linkGoogleAccount(googleLoginDto.googleId);
          user = await this.userRepository.save(user);
        }
      } else {
        const userId = randomUUID();
        user = User.create(
          userId,
          googleLoginDto.email,
          googleLoginDto.name,
          undefined,
          googleLoginDto.googleId,
        );
        user = await this.userRepository.save(user);
      }
    }

    const tokens = await this.generateTokens(user);

    return {
      accessToken: tokens.accessToken,
      refreshToken: tokens.refreshToken,
      user: {
        id: user.getId().toString(),
        email: user.getEmail(),
        name: user.getName(),
      },
    };
  }

  async validateUser(userId: string): Promise<User | null> {
    const userIdVo = new UserId(userId);
    const user = await this.userRepository.findById(userIdVo);
    return user;
  }

  async refreshToken(refreshToken: string): Promise<{ accessToken: string }> {
    try {
      const payload = this.jwtService.verify(refreshToken, {
        secret: process.env.JWT_REFRESH_SECRET || 'refresh-secret',
      });

      const user = await this.validateUser(payload.sub);
      if (!user) {
        throw new UnauthorizedException('User not found');
      }

      const accessToken = this.jwtService.sign(
        { sub: user.getId().toString(), email: user.getEmail() },
        {
          secret: process.env.JWT_SECRET || 'secret',
          expiresIn: process.env.JWT_EXPIRATION || '15m',
        } as any,
      );

      return { accessToken };
    } catch (error) {
      throw new UnauthorizedException('Invalid refresh token');
    }
  }

  private async generateTokens(user: User): Promise<{ accessToken: string; refreshToken: string }> {
    const payload = {
      sub: user.getId().toString(),
      email: user.getEmail(),
    };

    const accessToken = this.jwtService.sign(payload, {
      secret: process.env.JWT_SECRET || 'secret',
      expiresIn: process.env.JWT_EXPIRATION || '15m',
    } as any);

    const refreshToken = this.jwtService.sign(payload, {
      secret: process.env.JWT_REFRESH_SECRET || 'refresh-secret',
      expiresIn: process.env.JWT_REFRESH_EXPIRATION || '7d',
    } as any);

    return { accessToken, refreshToken };
  }
}

