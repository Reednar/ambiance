import { Controller, Get, Post, Res, Body, Param } from '@nestjs/common';
import { Response, Request as ExpressRequest } from 'express';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { PaiementsService } from 'src/services/paiements/paiements.service';
import Stripe from 'stripe';

@Controller('paiements')
export class PaiementsController {
  private stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

  constructor(private readonly stripeService: PaiementsService) {}

  @Post('checkout')
  async checkout(@Res() res: Response, @Body() body: any) {
    const url = await this.stripeService.createCheckoutSession(body);
    res.json({ url });
  }

  @Post()
  @ApiOperation({ summary: 'Enregistrer un justificatif de paiement Stripe' })
  async create(@Res() res: Response, @Body() body: any) {
    try {
      const sessionId = body.sessionId;
      const userId = body.userId;
      if (!sessionId) {
        return res.status(400).json({ error: 'sessionId manquant' });
      }
      const paiement = await this.stripeService.savePaymentReceipt(
        sessionId,
        userId,
      );
      res.status(201).json(paiement);
    } catch (error) {
      res
        .status(400)
        .json({ error: 'Erreur lors de la création du paiement.' });
    }
  }

  @Get('session-status/:sessionId')
  async getSessionStatus(
    @Res() res: Response,
    @Param('sessionId') sessionId: string,
  ) {
    try {
      const session = await this.stripeService.getSessionStatus.call(
        { stripe: this.stripe },
        sessionId,
      );
      res.json({ status: session.payment_status });
    } catch (err) {
      res.status(400).json({ error: 'Session introuvable ou erreur Stripe.' });
    }
  }
}
