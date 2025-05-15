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

const isProd = process.env.NODE_ENV === 'production';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

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
      maxAge: 1000 * 60 * 60 * 24 * 7, // 7 jours (ou selon ta durée de session)
      path: '/',
    });
  }

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

  @Post('login')
  async login(
    @Body() body: { mail: string; password: string },
    @Res({ passthrough: true }) res: Response,
  ) {
    const loginResponse = await this.authService.login(body);

    this.setAuthCookies(
      res,
      loginResponse.access_token,
      loginResponse.refresh_token,
      loginResponse.idUtilisateur.toString() // Ajoute l'ID utilisateur dans les cookies
    );

    return {
      success: true,
      userId: loginResponse.idUtilisateur, // On retourne l'ID ici aussi si nécessaire
    };
  }
@Post('refresh')
async refresh(@Req() req: Request, @Res({ passthrough: true }) res: Response) {
  const refreshToken = req.cookies?.refresh_token;
  if (!refreshToken) throw new UnauthorizedException('Refresh token manquant');

  // Appel à la méthode refreshToken dans AuthService
  const newTokens = await this.authService.refreshToken(refreshToken);

  // On garde l'ID utilisateur et on met à jour les cookies
  this.setAuthCookies(res, newTokens.access_token, refreshToken, req.cookies['user_id']); // Utilisation de refresh_token ici

  return { success: true };
}


  @Post('logout')
  logout(@Res({ passthrough: true }) res: Response) {
    this.clearAuthCookies(res);
    return { message: 'Déconnecté avec succès' };
  }

@Get('is-authenticated')
async isAuthenticated(@Req() req: Request, @Res() res: Response) {
          console.error('Erreur lors du rafraîchissement du token:');

  const accessToken = req.cookies['access_token'];
  const refreshToken = req.cookies['refresh_token'];
  const userId = req.cookies['user_id'];

  if (!accessToken || !userId) {
    // Si l'access token ou l'ID utilisateur est manquant, rediriger vers non authentifié
    return res.status(401).json({ authenticated: false });
  }

  try {
    // Vérification du access token
    const payload = await this.authService.verifyToken(accessToken);
    return res.status(200).json({ authenticated: true, userId: payload.sub });
  } catch (e) {
    console.error('Erreur lors de la vérification du token:', e);

    // Si le access token est expiré, essayons de rafraîchir avec le refresh token
    if (refreshToken) {
      try {
        const newTokens = await this.authService.refreshToken(refreshToken); // Rafraîchit les tokens
        this.setAuthCookies(res, newTokens.access_token, refreshToken, userId);
        return res.status(200).json({ authenticated: true, userId: userId });
      } catch (refreshError) {
        console.error('Erreur lors du rafraîchissement du token:', refreshError);
        return res.status(401).json({ authenticated: false });
      }
    } else {
      // Si aucun refresh token, renvoyer non authentifié
      return res.status(401).json({ authenticated: false });
    }
  }
}


}
