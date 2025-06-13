import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { Publication } from '../models/publications';

@Injectable({
  providedIn: 'root',
})
export class PaiementsService {
  private readonly url = `${environment.baseUrl}/paiements`;

  constructor(private readonly http: HttpClient) {}

  checkout(publication: Publication): Observable<any> {
    return this.http.post(`${this.url}/checkout`, publication, {
      withCredentials: true,
    });
  }

  getSessionStatus(sessionId: string): Promise<any> {
    return this.http.get(`${this.url}/session-status/${sessionId}`, { withCredentials: true }).toPromise();
  }

  create(sessionId: string): Observable<any> {
    // recupérer l'id de l'utilisateur connecté
    const userId = sessionStorage.getItem('id_utilisateur');
    return this.http.post(`${this.url}`, { sessionId, userId }, {
      withCredentials: true,
    });
  }
}