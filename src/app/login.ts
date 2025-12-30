import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class LoginService {
  
  constructor(private http: HttpClient) {

  }

  login(email: string, password: string) {
    const loginData = { email, password };
    console.log('Sending login data:', loginData);
    return this.http.post('http://localhost:8080/login', loginData);
  }

}
