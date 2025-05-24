import {
  Controller,
  Post,
  Body,
  Res,
  Req,
  UnauthorizedException,
  Get,
} from '@nestjs/common';
import { Request, Response } from 'express';
import { AuthService } from 'src/services/auth/auth.service';
import { JwtAuthGuard } from 'src/services/auth/jwt-auth.guard';
import { UsersService } from 'src/services/users/users.service';

// Détermine si l'environnement est en production
const isProd = process.env.NODE_ENV === 'production';

@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly userService: UsersService
  ) {}

  /**
   * Définit les cookies d'authentification (access, refresh, user_id)
   */
  private setAuthCookies(res: Response, accessToken: string, refreshToken: string, userId: string) {
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
    // Appel au service d'authentification
    const loginResponse = await this.authService.login(body);

    // Définition des cookies avec les tokens
    this.setAuthCookies(
      res,
      loginResponse.access_token,
      loginResponse.refresh_token,
      loginResponse.idUtilisateur.toString()
    );

    // Réponse JSON de succès
    return {
      success: true,
      userId: loginResponse.idUtilisateur, 
      emailConfirmed: loginResponse.emailConfirmed,
    };
  }

  /**
   * Route POST /auth/refresh
   * Rafraîchit le token d'accès à partir du refresh token stocké en cookie
   */
  @Post('refresh')
  async refresh(@Req() req: Request, @Res({ passthrough: true }) res: Response) {
    const refreshToken = req.cookies?.refresh_token;
    if (!refreshToken) throw new UnauthorizedException('Refresh token manquant');

    // Récupération des nouveaux tokens
    const newTokens = await this.authService.refreshToken(refreshToken);

    // Mise à jour des cookies
    this.setAuthCookies(res, newTokens.access_token, refreshToken, req.cookies['user_id']);

    return { success: true };
  }

  /**
   * Route POST /auth/logout
   * Déconnecte l'utilisateur en supprimant les cookies
   */
  @Post('logout')
  logout(@Res({ passthrough: true }) res: Response) {
    this.clearAuthCookies(res);
    return { message: 'Déconnecté avec succès' };
  }

  /**
   * Route GET /auth/is-authenticated
   * Vérifie si l'utilisateur est connecté en analysant les cookies
   */
  @Get('is-authenticated')
  async isAuthenticated(@Req() req: Request, @Res() res: Response) {
    const accessToken = req.cookies['access_token'];
    const refreshToken = req.cookies['refresh_token'];
    const userId = req.cookies['user_id'];

    if (!accessToken || !userId) {
      // Absence d'informations => utilisateur non authentifié
      return res.status(401).json({ authenticated: false });
    }

    try {
      // Vérification du access token
      const payload = await this.authService.verifyToken(accessToken);

      // Vérification que l'utilisateur existe
      const user = await this.userService.findEntityById(payload.sub);

      return res.status(200).json({
        authenticated: true,
        userId: payload.sub,
        emailConfirmed: user.emailConfirmed
      });

    } catch (e) {
      console.error('Erreur lors de la vérification du token:', e);

      // Tentative de rafraîchissement du token si expiré
      if (refreshToken) {
        try {
          const newTokens = await this.authService.refreshToken(refreshToken);
          this.setAuthCookies(res, newTokens.access_token, refreshToken, userId);

          return res.status(200).json({ authenticated: true, userId: userId });
        } catch (refreshError) {
          console.error('Erreur lors du rafraîchissement du token:', refreshError);
          return res.status(401).json({ authenticated: false });
        }
      } else {
        return res.status(401).json({ authenticated: false });
      }
    }
  }
}
