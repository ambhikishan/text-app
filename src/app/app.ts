import { ChangeDetectorRef, Component, OnInit, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { Login } from "./login/login";
import { VerifyComponent } from "./verify/verify";
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, VerifyComponent,CommonModule],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App implements OnInit {
 private static accountVerified: boolean = false;
 private static isLoggedIn: boolean = false;
 private static username: string = '';
 private static email: string = '';

 constructor(private cdr: ChangeDetectorRef) {
  
 }
ngOnInit(): void {
this.cdr.detectChanges();
}
 public getUsername() {
  return App.username;
 }
 public setUsername(value: string) {
  App.username = value;
 }
 public getEmail() {
  return App.email;
 }
  public setEmail(value: string) {
  App.email = value;
 }

 public getLoggedIn() {
  return App.isLoggedIn;
 }
 public setLoggedIn(value: boolean) {
  App.isLoggedIn = value;
 }

 public getVerified() {
  return App.accountVerified;
 }
 public setVerified(value: boolean) {
  App.accountVerified = value;
 }
  protected readonly title = signal('text-app');
}
