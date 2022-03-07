import { Controller, Get, UseGuards, Res, Req } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { AuthService } from './auth.service';

@Controller({
  path: 'auth',
  //   version: VERSION_NEUTRAL,
})
export class AuthController {
  constructor(private readonly userService: AuthService) {}

  @Get()
  @UseGuards(AuthGuard('google'))
  googleLogin() {
    // initiates the Google OAuth2 login flow
  }

  @Get('google/callback')
  @UseGuards(AuthGuard('google'))
  googleLoginCallback(@Req() req, @Res() res) {
    // handles the Google OAuth2 callback
    const jwt: string = req.user.jwt;
    const dataFromGoogle: string = req.user;
    if (jwt) {
      const result = {
        statusCode: 200,
        success: true,
        message: 'Google Callback return result',
        data: {
          dataFromGoogle,
        },
      };

      res.json(result);
    } else {
      res.redirect('http://localhost:4200/login/failure');
    }
  }

  @Get('auth/protected')
  @UseGuards(AuthGuard('jwt'))
  protectedResource() {
    return 'JWT is working!';
  }
}
