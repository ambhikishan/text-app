import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { LoginService } from '../login';

@Component({
  standalone: true,
  selector: 'app-create-account',
  imports: [CommonModule, FormsModule, RouterLink],
  templateUrl: './create-account.html',
  styleUrls: ['./create-account.css']
})
export class CreateAccount {

  username = '';
  email = '';
  password = '';

  constructor(private loginService: LoginService,private router: Router) {}
  signup() {
    console.log(this.username, this.email, this.password);
    this.loginService.signup(this.username,this.email,this.password).subscribe(response => {
      console.log('Signup successful', response);
      this.router.navigate(['/login']);
    }, error => {
      console.error('Signup failed', error);
    });
  }
}
