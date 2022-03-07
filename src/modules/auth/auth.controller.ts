import { Controller, Get, UseGuards, Res, Req } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { AuthService } from './auth.service';

@Controller({
  path: 'auth',
  //   version: VERSION_NEUTRAL,
})
export class AuthController {
  constructor(private readonly userService: AuthService) {}
  /**
   * Method that provides path for google Auth
   */
  @Get()
  @UseGuards(AuthGuard('google'))
  googleLogin() {
    // initiates the Google OAuth2 login flow
  }

  /**
   * Callback URL that executes after google login
   *
   * @param response response from Service
   * @param request Calling action to get
   */
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

  /**
   * Route to check for JWT
   *
   * @returns string
   */
  @Get('auth/protected')
  @UseGuards(AuthGuard('jwt'))
  protectedResource() {
    return 'JWT is working!';
  }
}
