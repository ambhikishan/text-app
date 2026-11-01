import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import SockJS from 'sockjs-client';
import { Client } from '@stomp/stompjs';
import { debounceTime, Subject } from 'rxjs';
import {ChangeDetectorRef, NgZone } from '@angular/core';
import { LoginService } from '../login';
import { Router } from '@angular/router';
import { Navbar } from '../navbar/navbar';
import { ChatHistory } from '../chat-history';


interface ChatMessage {
  username: string;
  lastMessage: string;
  avatar: string;
  messages: { sender: 'me' | 'other'; text: string; time: string }[];
  isTyping: boolean;
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
      messages: [],
      isTyping: false
    });
    this.activeChat = this.chats[this.chats.length - 1]; 
    this.fetchTargetUserConversationHistory($event.username);
  }


  private messages$ = new Subject<any>();
  private typingSubject = new Subject<void>();
  private client!: Client;

constructor(private ngZone: NgZone, private cdr: ChangeDetectorRef,private loginService: LoginService, private router: Router,private chatHistory: ChatHistory) {}
 userName! : string ;
  ngOnInit(): void {
    this.typingSubject.pipe(
      debounceTime(500) // Wait for 500ms pause in typing
    ).subscribe(() => {
      this.sendTypingSignal();
    });
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
   const parsedBody = JSON.parse(msg.body);

    if(this.chats.find(chat => chat.username === JSON.parse(msg.body).from)){
      
      if (parsedBody.message === "#usertyping") {
        
        const chat = this.chats.find(c => c.username === parsedBody.from);
        if (chat) {
          chat.isTyping = true;
          this.cdr.detectChanges();
          setTimeout(() => {
            chat.isTyping = false;
            this.cdr.detectChanges();
          }, 5000);
          return;
        }
      }
    this.chats.find(chat => chat.username === JSON.parse(msg.body).from)?.messages.push({
      sender: 'other',
      text: JSON.parse(msg.body).message,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    });
    this.chats.find(chat => chat.username === JSON.parse(msg.body).from)!.lastMessage = JSON.parse(msg.body).message.message.substring(0,25)+"...";
    }
    else{
      if(JSON.parse(msg.body).message === "#usertyping"){
        return;
      }
      this.chats.push({
        username: JSON.parse(msg.body).from,
        lastMessage: JSON.parse(msg.body).message.substring(0,25)+"...",
        avatar: `http://${window.location.hostname}:8080/user/profile/${JSON.parse(msg.body).from}`,
        messages: [{ sender: 'other', text: JSON.parse(msg.body).message, time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) }],
        isTyping: false
      });
    
  }
   this.cdr.detectChanges();
        
  });
      });
    };

    this.client.activate();
    
// this.fetchAllMessagesHistory();//loading the chat history from the database.

  }

  fetchAllMessagesHistory()
  {
    this.chatHistory.getConversations().subscribe(data=>{
      console.log(data[0]);
    });
  }
  
  fetchTargetUserConversationHistory(targetUser:string)
  {
    this.chatHistory.getTargetChatHistory(targetUser).subscribe(data=>{
      for(let i=0;i<data.length;i++)
      { 
        if(data[i].to===targetUser)
        {
          this.activeChat.messages.push({sender:'me',text:data[i].message,time:'00:00'})
        }
        else
        {
          this.activeChat.messages.push({sender:'other',text:data[i].message,time:'00:00'})
        }
      
      }
        if(data[data.length-1].message.length>25)
      {this.activeChat.lastMessage= data[data.length-1].message.substring(0,25)+'...';}
        else
        {this.activeChat.lastMessage= data[data.length-1].message;}
      this.cdr.detectChanges();
    });
  }


  onTyping() {
    this.typingSubject.next();
  }
  sendTypingSignal() {
    console.log("Calling API: User is typing...");
    if (this.client && this.client.connected) {
      this.client.publish({
        destination: '/app/sendPersonalMessage',
        body: JSON.stringify({ from: this.userName, to: this.activeChat.username, message: "#usertyping" })
      });
    }
   
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

    this.activeChat.lastMessage = this.newMessage.substring(0,25)+"...";
    this.newMessage = '';
  }

  chats: ChatMessage[] = [
    
    
  ];

  activeChat = this.chats[0];
  newMessage:string = '';

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

    this.activeChat.lastMessage = this.newMessage.substring(0,25)+"...";
    this.newMessage = '';
  }
}
