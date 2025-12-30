import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';

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

  signup() {
    console.log(this.username, this.email, this.password);
    // connect backend later
  }
}
