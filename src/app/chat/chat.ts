import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import SockJS from 'sockjs-client';
import { Client } from '@stomp/stompjs';
import { Subject } from 'rxjs';
import { App } from '../app';
import {ChangeDetectorRef, NgZone } from '@angular/core';


interface ChatMessage {
  username: string;
  lastMessage: string;
  avatar: string;
  messages: { sender: 'me' | 'other'; text: string; time: string }[];
}

@Component({
  selector: 'app-whatsapp-chat',
  imports: [FormsModule,CommonModule],
  templateUrl: './chat.html',
  styleUrls: ['./chat.css']
})
export class Chat implements OnInit {
  private messages$ = new Subject<any>();
  private client!: Client;

constructor(private ngZone: NgZone, private cdr: ChangeDetectorRef) {}

  ngOnInit(): void {
   const socket = new SockJS('http://localhost:8082/ws');
   console.log('Username in chat component: ', App.prototype.getUsername());
   this.client = new Client({
      webSocketFactory: () => socket,
      reconnectDelay: 5000
    });
    this.client.onConnect = () => {
      this.client.subscribe('/topic/'+App.prototype.getUsername(), msg => {
        this.messages$.next(JSON.parse(msg.body));
        console.log('Message received: ', msg.body);
        this.ngZone.run(() => {
        this.activeChat.messages.push({
      sender: 'other',
      text: msg.body.slice( msg.body.indexOf('"message":"') + 11, msg.body.lastIndexOf('"') ),
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    });
        this.cdr.detectChanges();
  });
      });
    };

    this.client.activate();

  }
  public sendMessageToServer(to: string, message: string) {
    if (this.client && this.client.connected) {
      this.client.publish({
        destination: '/app/sendPersonalMessage',
        body: JSON.stringify({ from:App.prototype.getUsername(), to: to, message: message })
      });
    }
    this.activeChat.messages.push({
      sender: 'me',
      text: this.newMessage,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    });

    this.activeChat.lastMessage = this.newMessage;
    this.newMessage = '';
  }

  chats: ChatMessage[] = [
    {
      username: 'ishan',
      lastMessage: 'See you soon',
      avatar: 'https://i.pravatar.cc/150?img=1',
      messages: [
        { sender: 'other', text: 'Hey!', time: '10:20' },
        { sender: 'me', text: 'Hi 😄', time: '10:21' }
      ]
    },
    {
      username: 'ishanambhik',
      lastMessage: 'Thanks!',
      avatar: 'https://i.pravatar.cc/150?img=5',
      messages: [
        { sender: 'other', text: 'Did you finish?', time: '09:10' }
      ]
    }
  ];

  activeChat = this.chats[0];
  newMessage = '';

  selectChat(chat: ChatMessage) {
    this.activeChat = chat;
  }

  sendMessage() {
    if (!this.newMessage.trim()) return;

    this.activeChat.messages.push({
      sender: 'me',
      text: this.newMessage,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    });

    this.activeChat.lastMessage = this.newMessage;
    this.newMessage = '';
  }
}
