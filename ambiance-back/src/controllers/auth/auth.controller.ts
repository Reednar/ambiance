import {
  Controller,
  Post,
  Body,
  Res,
  Req,
  UnauthorizedException,
  Get,
  Logger,
} from '@nestjs/common';
import { Request, Response } from 'express';
import { AuthService } from 'src/services/auth/auth.service';
import { JwtAuthGuard } from 'src/services/auth/jwt-auth.guard';
import { MailService } from 'src/services/mail.service';
import { UsersService } from 'src/services/users/users.service';

// Détermine si l'environnement est en production
const isProd = process.env.NODE_ENV === 'production';

@Controller('auth')
export class AuthController {
  private readonly logger = new Logger(AuthController.name);

  constructor(
    private readonly authService: AuthService,
    private readonly userService: UsersService,
    private readonly mailService: MailService,
  ) {}

  /**
   * Définit les cookies d'authentification (access, refresh, user_id)
   */
  private setAuthCookies(
    res: Response,
    accessToken: string,
    refreshToken: string,
    userId: string,
    isAdmin: boolean = false,
  ) {
    res.cookie('access_token', accessToken, {
      httpOnly: true,
      secure: isProd,
      sameSite: 'lax',
      maxAge: 1000 * 60 * 15, // 15 minutes
      path: '/',
    });

    res.cookie('refresh_token', refreshToken, {
      httpOnly: true,
      secure: isProd,
      sameSite: 'lax',
      maxAge: 1000 * 60 * 60 * 24 * 7, // 7 jours
      path: '/',
    });

    res.cookie('user_id', userId, {
      httpOnly: true,
      secure: isProd,
      sameSite: 'lax',
      maxAge: 1000 * 60 * 60 * 24 * 7, // 7 jours
      path: '/',
    });

    res.cookie('isAdmin', isAdmin, {
      httpOnly: true,
      secure: isProd,
      sameSite: 'lax',
      maxAge: 1000 * 60 * 60 * 24 * 7, // 7 jours
      path: '/',
    });
  }

  /**
   * Supprime les cookies d'authentification
   */
  private clearAuthCookies(res: Response) {
    res.clearCookie('access_token', {
      httpOnly: true,
      secure: isProd,
      sameSite: 'lax',
      path: '/',
    });
    res.clearCookie('refresh_token', {
      httpOnly: true,
      secure: isProd,
      sameSite: 'lax',
      path: '/',
    });
    res.clearCookie('user_id', {
      httpOnly: true,
      secure: isProd,
      sameSite: 'lax',
      path: '/',
    });
  }

  /**
   * Route POST /auth/login
   * Authentifie l'utilisateur, génère les tokens et les stocke en cookie
   */
  @Post('login')
  async login(
    @Body() body: { mail: string; password: string },
    @Res({ passthrough: true }) res: Response,
  ) {
    this.logger.log(
      '[INFO] [POST /auth/login] Login attempt',
      { email: body.mail }
    );

    try {
      // Appel au service d'authentification
      const loginResponse = await this.authService.login(body);

      // Définition des cookies avec les tokens
      this.setAuthCookies(
        res,
        loginResponse.access_token,
        loginResponse.refresh_token,
        loginResponse.idUtilisateur.toString(),
        loginResponse.isAdmin,
      );

      this.logger.log(
        '[INFO] [POST /auth/login] Login successful',
        { 
          userId: loginResponse.idUtilisateur,
          emailConfirmed: loginResponse.emailConfirmed
        }
      );

      // Réponse JSON de succès
      return {
        success: true,
        userId: loginResponse.idUtilisateur,
        emailConfirmed: loginResponse.emailConfirmed,
        isAdmin: loginResponse.isAdmin,
      };
    } catch (error) {
      this.logger.warn(
        '[WARN] [POST /auth/login] Login failed',
        { email: body.mail, error: error.message }
      );
      throw error;
    }
  }

  /**
   * Route POST /auth/refresh
   * Rafraîchit le token d'accès à partir du refresh token stocké en cookie
   */
  @Post('refresh')
  async refresh(
    @Req() req: Request,
    @Res({ passthrough: true }) res: Response,
  ) {
    this.logger.log('[INFO] [POST /auth/refresh] Token refresh attempt');

    const refreshToken = req.cookies?.refresh_token;
    if (!refreshToken) {
      this.logger.warn('[WARN] [POST /auth/refresh] Refresh token missing');
      throw new UnauthorizedException('Refresh token manquant');
    }

    try {
      // Récupération des nouveaux tokens
      const newTokens = await this.authService.refreshToken(refreshToken);

      // Mise à jour des cookies
      this.setAuthCookies(
        res,
        newTokens.access_token,
        refreshToken,
        req.cookies['user_id'],
      );

      this.logger.log(
        '[INFO] [POST /auth/refresh] Token refreshed successfully',
        { userId: req.cookies['user_id'] }
      );

      return { success: true };
    } catch (error) {
      this.logger.warn(
        '[WARN] [POST /auth/refresh] Token refresh failed',
        { error: error.message }
      );
      throw error;
    }
  }

  /**
   * Route POST /auth/logout
   * Déconnecte l'utilisateur en supprimant les cookies
   */
  @Post('logout')
  logout(@Res({ passthrough: true }) res: Response) {
    this.logger.log('[INFO] [POST /auth/logout] User logout');
    this.clearAuthCookies(res);
    return { message: 'Déconnecté avec succès' };
  }

  /**
   * Route GET /auth/is-authenticated
   * Vérifie si l'utilisateur est connecté en analysant les cookies
   */
  @Get('is-authenticated')
  async isAuthenticated(@Req() req: Request, @Res() res: Response) {
    this.logger.log('[INFO] [GET /auth/is-authenticated] Authentication check');

    const accessToken = req.cookies['access_token'];
    const refreshToken = req.cookies['refresh_token'];
    const userId = req.cookies['user_id'];
    const isAdmin = req.cookies['isAdmin'] == 'true';

    if (!accessToken || !userId) {
      this.logger.log(
        '[INFO] [GET /auth/is-authenticated] User not authenticated - missing tokens',
        { hasAccessToken: !!accessToken, hasUserId: !!userId }
      );
      return res.status(401).json({ authenticated: false });
    }

    try {
      // Vérification du access token
      const payload = await this.authService.verifyToken(accessToken);

      // Vérification que l'utilisateur existe
      const user = await this.userService.findEntityById(payload.sub);

      this.logger.log(
        '[INFO] [GET /auth/is-authenticated] User authenticated successfully',
        { userId: payload.sub, emailConfirmed: user.emailConfirmed }
      );

      return res.status(200).json({
        authenticated: true,
        userId: payload.sub,
        emailConfirmed: user.emailConfirmed,
        isAdmin: isAdmin,
      });
    } catch (e) {
      this.logger.warn(
        '[WARN] [GET /auth/is-authenticated] Token verification failed',
        { error: e.message, hasRefreshToken: !!refreshToken }
      );

      // Tentative de rafraîchissement du token si expiré
      if (refreshToken) {
        try {
          const newTokens = await this.authService.refreshToken(refreshToken);
          this.setAuthCookies(
            res,
            newTokens.access_token,
            refreshToken,
            userId,
          );

          this.logger.log(
            '[INFO] [GET /auth/is-authenticated] Token refreshed during auth check',
            { userId }
          );

          return res.status(200).json({ authenticated: true, userId: userId });
        } catch (refreshError) {
          this.logger.error(
            '[ERROR] [GET /auth/is-authenticated] Token refresh failed',
            { error: refreshError.message, userId }
          );
          return res.status(401).json({ authenticated: false });
        }
      } else {
        return res.status(401).json({ authenticated: false });
      }
    }
  }

  @Post('send-2fa-code')
  async send2FACode(@Body() body: { mail: string }) {
    this.logger.log(
      '[INFO] [POST /auth/send-2fa-code] 2FA code requested',
      { email: body.mail }
    );

    const user = await this.userService.findOneByMail(body.mail);
    if (!user) {
      this.logger.warn(
        '[WARN] [POST /auth/send-2fa-code] User not found for 2FA',
        { email: body.mail }
      );
      throw new UnauthorizedException('Utilisateur non trouvé');
    }

    const code = Math.floor(100000 + Math.random() * 900000).toString();
    const expires = new Date(Date.now() + 5 * 60 * 1000); // 5 min

    user.codeDoubleAuthent = code;
    user.dateCodeDoubleAuthent = expires;
    await this.userService.save(user);

    await this.mailService.sendTwoFactorCodeEmail(user.mail, code);

    this.logger.log(
      '[INFO] [POST /auth/send-2fa-code] 2FA code sent successfully',
      { userId: user.idUtilisateur, email: body.mail }
    );

    return { success: true };
  }

  @Post('login-2fa')
  async loginWith2FA(
    @Body() body: { mail: string; password: string; code: string },
    @Res({ passthrough: true }) res: Response,
  ) {
    this.logger.log(
      '[INFO] [POST /auth/login-2fa] 2FA login attempt',
      { email: body.mail, hasCode: !!body.code }
    );

    const { mail, code } = body;
    const user = await this.userService.findOneByMail(mail);
    if (!user) {
      this.logger.warn(
        '[WARN] [POST /auth/login-2fa] User not found for 2FA login',
        { email: mail }
      );
      throw new UnauthorizedException('Utilisateur non trouvé');
    }

    if (user.doubleAuthent == null || user.doubleAuthent == false) {
      this.logger.log(
        '[INFO] [POST /auth/login-2fa] 2FA not enabled, proceeding with normal login',
        { userId: user.idUtilisateur }
      );
      return this.login({ mail: body.mail, password: body.password }, res);
    } else if (user.codeDoubleAuthent == null || code == '' || code == null) {
      this.logger.log(
        '[INFO] [POST /auth/login-2fa] 2FA code required, sending new code',
        { userId: user.idUtilisateur }
      );
      this.send2FACode({ mail: body.mail });
      return { twoFactorRequired: true, message: 'Code 2FA envoyé par mail' };
    } else if (user.codeDoubleAuthent != null) {
      const now = new Date();
      if (
        !user.codeDoubleAuthent ||
        user.codeDoubleAuthent !== code ||
        !user.dateCodeDoubleAuthent ||
        user.dateCodeDoubleAuthent.getTime() < now.getTime()
      ) {
        this.logger.warn(
          '[WARN] [POST /auth/login-2fa] Invalid or expired 2FA code',
          { userId: user.idUtilisateur, codeProvided: !!code }
        );
        user.codeDoubleAuthent = null;
        user.dateCodeDoubleAuthent = null;
        await this.userService.save(user);
        return {
          twoFactorRequired: true,
          message: 'Code 2FA invalide ou expiré',
        };
      }

      this.logger.log(
        '[INFO] [POST /auth/login-2fa] 2FA code valid, proceeding with login',
        { userId: user.idUtilisateur }
      );

      // Nettoyage du code
      user.codeDoubleAuthent = null;
      user.dateCodeDoubleAuthent = null;
      await this.userService.save(user);

      // Appel direct à login avec les bons params
      return this.login({ mail: body.mail, password: body.password }, res);
    }
  }
}
