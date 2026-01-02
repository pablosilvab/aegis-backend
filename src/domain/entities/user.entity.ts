import { UserId } from '../value-objects/user-id.vo';

export class User {
  private constructor(
    private readonly id: UserId,
    private email: string,
    private name: string,
    private passwordHash: string | null,
    private googleId: string | null,
    private readonly createdAt: Date,
    private updatedAt: Date,
  ) {
    this.validate();
  }

  static create(
    id: string,
    email: string,
    name: string,
    passwordHash?: string,
    googleId?: string,
  ): User {
    return new User(
      new UserId(id),
      email,
      name,
      passwordHash || null,
      googleId || null,
      new Date(),
      new Date(),
    );
  }

  static fromPersistence(
    id: string,
    email: string,
    name: string,
    passwordHash: string | null,
    googleId: string | null,
    createdAt: Date,
    updatedAt: Date,
  ): User {
    return new User(
      new UserId(id),
      email,
      name,
      passwordHash,
      googleId,
      createdAt,
      updatedAt,
    );
  }

  private validate(): void {
    // Validar email
    if (!this.email || this.email.trim().length === 0) {
      throw new Error('User email cannot be empty');
    }
    
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(this.email)) {
      throw new Error('User email must be a valid email address');
    }

    // Validar name
    if (!this.name || this.name.trim().length === 0) {
      throw new Error('User name cannot be empty');
    }
    if (this.name.length > 200) {
      throw new Error('User name cannot exceed 200 characters');
    }

    // Validar que tenga al menos un método de autenticación
    if (!this.passwordHash && !this.googleId) {
      throw new Error('User must have either passwordHash or googleId');
    }
  }

  // Getters
  getId(): UserId {
    return this.id;
  }

  getEmail(): string {
    return this.email;
  }

  getName(): string {
    return this.name;
  }

  getPasswordHash(): string | null {
    return this.passwordHash;
  }

  getGoogleId(): string | null {
    return this.googleId;
  }

  getCreatedAt(): Date {
    return this.createdAt;
  }

  getUpdatedAt(): Date {
    return this.updatedAt;
  }

  // Business logic
  updateEmail(email: string): void {
    this.email = email;
    this.validate();
    this.updatedAt = new Date();
  }

  updateName(name: string): void {
    this.name = name;
    this.validate();
    this.updatedAt = new Date();
  }

  updatePasswordHash(passwordHash: string): void {
    this.passwordHash = passwordHash;
    this.validate();
    this.updatedAt = new Date();
  }

  linkGoogleAccount(googleId: string): void {
    this.googleId = googleId;
    this.validate();
    this.updatedAt = new Date();
  }

  hasPassword(): boolean {
    return this.passwordHash !== null;
  }

  hasGoogleAccount(): boolean {
    return this.googleId !== null;
  }
}

