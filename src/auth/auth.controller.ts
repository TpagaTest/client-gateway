import { BadRequestException, Body, Controller, Inject, Post } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { catchError } from 'rxjs';
import { AUTH_SERVICE } from '../config';

@Controller('auth')
export class AuthController {
  constructor(
    @Inject(AUTH_SERVICE) private readonly authClient: ClientProxy,
  ) {}

  @Post('signup')
  signup(@Body() body: any) {
    return this.authClient.send('signup', body).pipe(
      catchError((error) => {
        throw new BadRequestException(error?.message || 'Signup failed');
      }),
    );
  }

  @Post('login')
  login(@Body() body: any) {
    return this.authClient.send('login', body).pipe(
      catchError((error) => {
        throw new BadRequestException(error?.message || 'Login failed');
      }),
    );
  }
}
