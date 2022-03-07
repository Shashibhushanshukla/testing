import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy } from 'passport-google-oauth20';
import { AuthService, Provider } from '../auth.service';

@Injectable()
export class GoogleStrategy extends PassportStrategy(
  Strategy,
  process.env.GOOGLE_STRATEGY,
) {
  constructor(private readonly authService: AuthService) {
    super({
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_SECRET_ID,
      callbackURL: process.env.GOOGLE_CALLBACK_URL,
      passReqToCallback: true,
      scope: ['profile', 'email'],
    });
  }

  /**
   * Method that provide UserData from google Auth and validate
   *
   * @param request
   * @param accessToken string
   * @param refreshToken string
   * @param profile userData
   * @param done function
   */
  async validate(
    request: any,
    accessToken: string,
    refreshToken: string,
    profile,
    done: Function,
  ) {
    try {
      const { name, emails, photos } = profile;
      const userDetail = {
        email: emails[0].value,
        firstName: name.givenName,
        lastName: name.familyName,
        picture: photos[0].value,
      };

      const jwt: string = await this.authService.validateOAuthLogin(
        profile.id,
        Provider.GOOGLE,
        userDetail,
      );
      const user = {
        jwt,
        userDetail,
      };

      done(null, user);
    } catch (err) {
      done(err, false);
    }
  }
}
