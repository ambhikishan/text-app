import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Login } from '../login/login';
import { LoginService } from '../login';
import { App } from '../app';
import { routes } from '../app.routes';
import { Router } from '@angular/router';

@Component({
  selector: 'app-otp',
  imports: [FormsModule],
  templateUrl: './otp.html',
  styleUrl: './otp.css',
})
export class Otp implements OnInit {
email = App.prototype.getEmail();
  constructor(private loginService: LoginService, private routes: Router) { }

  
  ngOnInit() {  

      this.loginService.sendOtp(this.email).subscribe(response => {
        console.log('OTP sent successfully', response);
      }, error => {
        console.error('Failed to send OTP', error);
      });
  }

resendOtp() {
this.ngOnInit();
}
  otp1: string = '';
  otp2: string = '';
  otp3: string = '';
  otp4: string = '';
  otp5: string = '';
  otp6: string = '';

  verifyOtp() {
  const otp = `${this.otp1}${this.otp2}${this.otp3}${this.otp4}${this.otp5}${this.otp6}`;
  console.log('Entered OTP:', otp);
  this.loginService.verifyOtp(this.email,otp).subscribe(res =>{
    console.log('OTP verified successfully', res);
    const responseData: any = res;
    App.prototype.setVerified(true);
    this.routes.navigate(['/chats']);
  });
}
}