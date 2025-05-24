import { Injectable } from '@angular/core';
import { io, Socket } from 'socket.io-client';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

@Injectable({ providedIn: 'root' })
export class MessagerieService {
  private socket!: Socket;
  private apiUrl = `${environment.baseUrl}`; // Remplace par ton URL backend
  private socketUrl = `${this.apiUrl}`;  // Remplace par ton URL socket
  constructor(private http: HttpClient) {}

  connect(userId: number) {
    var liveCHatUrl = this.socketUrl.split("/api")[0]
    this.socket = io(liveCHatUrl, { query: { userId } });
  }

  disconnect() {
    if (this.socket) this.socket.disconnect();
  }

  sendMessage(senderId: number, discussionId: number, content: string) {
    this.socket.emit('sendMessage', { senderId, discussionId, content });
  }

  onMessage(): Observable<any> {
    return new Observable(observer => {
      this.socket.on('receiveMessage', (msg) => observer.next(msg));
    });
  }

  getUserDiscussions(userId: number) {
    return this.http.post<any[]>(`${this.apiUrl}/discussions/user-discussions`, { userId }, { withCredentials: true });
  }

  getMessagesHistory(discussionId: number) {
    return this.http.post<any[]>(`${this.apiUrl}/discussions/messages-history`, { discussionId }, { withCredentials: true });
  }

  getPublicationIdByDiscussionId(discussionId: number) {
    return this.http.get<{ publicationId: number }>(`${this.apiUrl}/discussions/publication-id/${discussionId}`, { withCredentials: true });
  }
}