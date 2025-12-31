import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { App } from './app';

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

  signup(username: string, email: string, password: string) {
    const signupData = { username, email, password };
    console.log('Sending signup data:', signupData);
    return this.http.post('http://localhost:8080/create-account', signupData);
  }

  sendOtp(email: string) {
    
    if (!email) {
      console.error('Email is not set in App state.');
      throw new Error('Email is not set.');
    }
    console.log('Sending OTP data:');
    return this.http.get('http://localhost:8080/verify?'+'email='+email);
  }

  verifyOtp(email: string, otp: string) {
    const otpData = { email, otp };
    console.log('Sending OTP verification data:', otpData);
    return this.http.post('http://localhost:8080/verify', otpData);
  }
}
