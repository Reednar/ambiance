import { Component, OnInit, OnDestroy } from '@angular/core';
import { MessagerieService } from '../../service/messagerie.service';

@Component({
  selector: 'app-messagerie',
  templateUrl: './messagerie.component.html',
  styleUrls: ['./messagerie.component.scss']
})
export class MessagerieComponent implements OnInit, OnDestroy {
  userId = Number(sessionStorage.getItem('id_utilisateur')); // À remplacer par l’ID de l’utilisateur connecté
  discussions: any[] = [];
  selectedDiscussion: any = null;
  messages: any[] = [];
  newMessage = '';

  constructor(private messagerieService: MessagerieService) {}

  ngOnInit() {
    this.messagerieService.connect(this.userId);

    this.messagerieService.getUserDiscussions(this.userId).subscribe(discussions => {
      this.discussions = discussions;
    });

    this.messagerieService.onMessage().subscribe(msg => {
      if (this.selectedDiscussion && msg.idDiscussion === this.selectedDiscussion.idDiscussion) {
        this.messages.push(msg);
      }
    });
  }

  ngOnDestroy() {
    this.messagerieService.disconnect();
  }

  selectDiscussion(discussion: any) {
    this.selectedDiscussion = discussion;
    this.messagerieService.getMessagesHistory(discussion.idDiscussion).subscribe(messages => {
      this.messages = messages;
    });
  }

  sendMessage() {
    if (this.newMessage.trim() && this.selectedDiscussion) {
      this.messagerieService.sendMessage(this.userId, this.selectedDiscussion.idDiscussion, this.newMessage);
      this.newMessage = '';
    }
  }
}
