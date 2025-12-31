import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { LoginService } from '../login';
import { Router, RouterLink } from "@angular/router";
import { App } from '../app';
import { routes } from '../app.routes';

@Component({
  selector: 'app-login',
  imports: [FormsModule, RouterLink],
  templateUrl: './login.html',
  styleUrl: './login.css',
})
export class Login {
email = '';
password = '';

constructor(private loginService: LoginService, private router: Router) {}

login(){
  this.loginService.login(this.email, this.password).subscribe(response => {
    console.log('Login successful', response);
    const userData: any = response;
    console.log('User Data:', userData.username, userData.email, userData.loggedIn, userData.verified);
    App.prototype.setLoggedIn(userData.loggedIn);
    App.prototype.setVerified(userData.verified)
    App.prototype.setUsername(userData.username);
    App.prototype.setEmail(userData.email);
    this.router.navigate(['/chats']);
  }, error => {
    console.error('Login failed', error);
  });
}
}
