import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Paiement } from 'src/entities/paiements.entity';
import { User } from 'src/entities/users.entity';
import Stripe from 'stripe';
import { Repository } from 'typeorm';


@Injectable()
export class PaiementsService {
  constructor(
    private readonly stripe: Stripe,
    @InjectRepository(Paiement)
    private readonly paiementRepository: Repository<Paiement>,
    @InjectRepository(User)
    private readonly userRepository: Repository<User>
  ) { }

  async createCheckoutSession(data?: any): Promise<string> {
    const prix = Number(data?.prix);
    if (isNaN(prix) || prix <= 0) {
      throw new Error('Le prix envoyé est invalide ou manquant.');
    }
    const line_items = data?.line_items || [
      {
        price_data: {
          currency: 'eur',
          product_data: {
            name: data?.titre || 'Produit',
            description: data?.description || 'Description du produit'
          },
          unit_amount: Math.round(prix * 100), // Montant en centimes
        },
        quantity: 1,
      },
    ];
    const session = await this.stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items,
      mode: 'payment',
      success_url: `http://localhost:4200/publication-show/${data?.idPublication}?paymentStatus=success&session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `http://localhost:4200/publication-show/${data?.idPublication}?paymentStatus=cancel&session_id={CHECKOUT_SESSION_ID}`,
    });

    return session.url;
  }

  getSessionStatus(sessionId: string): Promise<Stripe.Checkout.Session> {
    return this.stripe.checkout.sessions.retrieve(sessionId);
  }

  /**
   * Enregistre un justificatif de paiement Stripe en base de données
   */
  async savePaymentReceipt(sessionId: string, userId: number): Promise<Paiement> {
    try {
      if (!userId) {
        throw new Error('idUtilisateur manquant dans la session Stripe');
      }
      if (!sessionId) {
        throw new Error('sessionId manquant');
      }
      // Vérifier que l'utilisateur existe
      const user = await this.userRepository.findOne({ where: { idUtilisateur: userId } });
      if (!user) {
        throw new Error('Utilisateur non trouvé');
      }
      // Récupérer la session Stripe avec le PaymentIntent
      const session = await this.stripe.checkout.sessions.retrieve(sessionId, {
        expand: ['payment_intent'],
      });
      if (!session) {
        throw new Error('Session Stripe introuvable');
      }

      const justificatif = {
        id: session.id,
        amount_total: session.amount_total,
        currency: session.currency,
        payment_status: session.payment_status,
        customer_email: session.customer_email,
        payment_intent: session.payment_intent,
        created: session.created,
        url: session.url,
      };
      const paiement = this.paiementRepository.create({
        montant: session.amount_total ? session.amount_total / 100 : 0,
        datePaiement: new Date(),
        justificatif: JSON.stringify(justificatif),
        idUtilisateur: user,
      });
      return await this.paiementRepository.save(paiement);
    } catch (error) {
      console.error('Erreur lors de l’enregistrement du justificatif de paiement :', error);
      throw new Error(
        error instanceof Error ? error.message : 'Erreur inconnue lors de l’enregistrement du paiement.'
      );
    }
  }
}
