import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import SockJS from 'sockjs-client';
import { Client } from '@stomp/stompjs';
import { Subject } from 'rxjs';
import {ChangeDetectorRef, NgZone } from '@angular/core';
import { LoginService } from '../login';
import { Router } from '@angular/router';
import { Navbar } from '../navbar/navbar';


interface ChatMessage {
  username: string;
  lastMessage: string;
  avatar: string;
  messages: { sender: 'me' | 'other'; text: string; time: string }[];
}

@Component({
  selector: 'app-whatsapp-chat',
  imports: [FormsModule,CommonModule,Navbar],
  templateUrl: './chat.html',
  styleUrls: ['./chat.css']
})
export class Chat implements OnInit {

openChat($event: any) {
  if(this.chats.find(chat => chat.username === $event.username)){
    this.activeChat = this.chats.find(chat => chat.username === $event.username)!;
    return;
  }
    this.chats.push({
      username: $event.username,
      lastMessage: '',
      avatar: `http://${window.location.hostname}:8080/user/profile/${$event.username}`,
      messages: []
    });
    this.activeChat = this.chats[this.chats.length - 1]; 
  }


  private messages$ = new Subject<any>();
  private client!: Client;

constructor(private ngZone: NgZone, private cdr: ChangeDetectorRef,private loginService: LoginService, private router: Router) {}
 userName! : string ;
  ngOnInit(): void {
    const token = localStorage.getItem('token');
    console.log('Retrieved token from localStorage:', token);
    this.loginService.validateToken(token || '').subscribe(response => {
      console.log('Token validation successful', response);
      const userData: any = response;
    

      this.userName = userData.username;
      console.log('Username in chat component: ', this.userName);
      this.cdr.detectChanges();
    }, error => {
      console.error('Token validation failed', error);
      localStorage.removeItem('token');
      this.router.navigate(['/login']);
    });
   const socket = new SockJS(`http://${window.location.hostname}:8082/ws`);
   
   this.client = new Client({
      webSocketFactory: () => socket,
      connectHeaders: {
        Authorization: `Bearer ${token}`
      },
      debug: (str) => {
        console.log(str);
      },
      reconnectDelay: 5000
    });
    this.client.onConnect = () => {
      this.client.subscribe('/topic/'+this.userName, msg => {
        this.messages$.next(JSON.parse(msg.body));
        console.log('Message received: ', msg.body);
        this.ngZone.run(() => {
   

    if(this.chats.find(chat => chat.username === JSON.parse(msg.body).from)){
    this.chats.find(chat => chat.username === JSON.parse(msg.body).from)?.messages.push({
      sender: 'other',
      text: JSON.parse(msg.body).message,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    });
    this.chats.find(chat => chat.username === JSON.parse(msg.body).from)!.lastMessage = JSON.parse(msg.body).message;
    }
    else{
      this.chats.push({
        username: JSON.parse(msg.body).from,
        lastMessage: JSON.parse(msg.body).message,
        avatar: '',
        messages: [{ sender: 'other', text: JSON.parse(msg.body).message, time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) }]
      });}
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
        body: JSON.stringify({ from: this.userName, to: to, message: message })
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
      username: 'ishanambhik',
      lastMessage: 'Thanks!',
      avatar: `http://${window.location.hostname}:8080/api/user/profile/ishanambhik`,
      messages: [
        
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
