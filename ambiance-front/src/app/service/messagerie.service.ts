import { Injectable } from '@angular/core';
import { io, Socket } from 'socket.io-client';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

@Injectable({ providedIn: 'root' })
export class MessagerieService {
  private socket!: Socket;
  private apiUrl = `${environment.baseUrl}`; // Remplace par ton URL backend

  constructor(private http: HttpClient) {}

  connect(userId: number) {
    this.socket = io(this.apiUrl, { query: { userId } });
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
}