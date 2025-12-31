import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from "@angular/router";

@Component({
  standalone: true,
  selector: 'app-verify',
  imports: [CommonModule, RouterLink],
  template: `
    <div class="verify-container">
      <h3>⚠️ Please verify your account</h3>
      <p>Check your email and click the <a routerLink="/verifywithotp">verification link.</a></p>
    </div>
  `,
  styles: [`
    .verify-container {
      margin: 40px auto;
      width: 400px;
      padding: 20px;
      text-align: center;
      border-radius: 8px;
      background: #fff3cd;
      color: #856404;
      border: 1px solid #ffeeba;
    }
  `]
})
export class VerifyComponent {}
