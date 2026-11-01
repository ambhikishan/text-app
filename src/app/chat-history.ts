import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders} from '@angular/common/http'; 
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class ChatHistory {

 token:any;
 headers:any;

  constructor(private httpClient : HttpClient){
  this.token = localStorage.getItem('token'); // Retrieve your token here

  // 2. Create the headers object
    this.headers = new HttpHeaders({
      'Authorization': `Bearer ${this.token}`
    });
  }

  getConversations(): Observable<any>
  {
    return this.httpClient.get(`http://${window.location.hostname}:8085/`,{headers:this.headers})
  }

  getTargetChatHistory(targetUser:string) : Observable<any>
  {
    return this.httpClient.get(`http://${window.location.hostname}:8085/conversation/${targetUser}`,{headers:this.headers});
  }

}
