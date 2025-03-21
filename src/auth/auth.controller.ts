import { BadRequestException, Body, Controller, Get, Inject, Post, Req } from '@nestjs/common';
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

  @Get('me')
  getMe(@Req() req: Request) {
    const authHeader = req.headers['authorization'];
    const token = authHeader?.replace('Bearer ', '');
    if (!token) {
      throw new BadRequestException('Authorization token is missing');
    }
    return this.authClient.send('me', token).pipe(
      catchError((error) => {
        throw new BadRequestException(error?.message || 'Get me failed');
      }),
    );
  }

  @Get('refresh')
  refreshToken(@Req() req: Request) {
    const authHeader = req.headers['authorization'];
    const token = authHeader?.replace('Bearer ', '');
    if (!token) {
      throw new BadRequestException('Authorization token is missing');
    }
    return this.authClient.send('refreshToken', token).pipe(
      catchError((error) => {
        throw new BadRequestException(error?.message || 'Refresh token failed');
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
