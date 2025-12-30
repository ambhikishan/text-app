import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { LoginService } from '../login';
import { RouterLink } from "@angular/router";

@Component({
  selector: 'app-login',
  imports: [FormsModule, RouterLink],
  templateUrl: './login.html',
  styleUrl: './login.css',
})
export class Login {
email = '';
password = '';

constructor(private loginService: LoginService) {}

login(){
  this.loginService.login(this.email, this.password).subscribe(response => {
    console.log('Login successful', response);
  }, error => {
    console.error('Login failed', error);
  });
}
}
