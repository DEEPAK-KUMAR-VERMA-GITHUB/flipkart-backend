import { HttpException, HttpStatus } from '@nestjs/common';

export class UserAlreadyExistsException extends HttpException {
  constructor(email: string) {
    super(
      {
        success: false,
        message: 'User already exists',
        error: `User with email ${email} already exists`,
        timestamp: new Date().toISOString(),
      },
      HttpStatus.CONFLICT,
    );
  }
}

export class InvalidCredentialsException extends HttpException {
  constructor() {
    super(
      {
        success: false,
        message: 'Invalid credentials',
        error: 'Email or password is incorrect',
        timestamp: new Date().toISOString(),
      },
      HttpStatus.UNAUTHORIZED,
    );
  }
}

export class UserNotFoundException extends HttpException {
  constructor(id: number) {
    super(
      {
        success: false,
        message: 'User not found',
        error: `User with id ${id} not found`,
        timestamp: new Date().toISOString(),
      },
      HttpStatus.NOT_FOUND,
    );
  }
}
