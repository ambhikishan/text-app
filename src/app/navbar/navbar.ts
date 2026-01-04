import { CommonModule } from '@angular/common';
import { ChangeDetectorRef, Component, Input, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { App } from '../app';

interface User {
  id: number;
  username: string;
  photoUrl?: string;
}

@Component({
  selector: 'app-navbar',
  imports: [CommonModule, FormsModule],
  templateUrl: './navbar.html',
  styleUrl: './navbar.css',
})
export class Navbar implements OnInit{
 query = '';
  results : any= [];
  @Input() username! : string ;
  me: User = {
    id: 1,
    username: ''
    
  };
  
   ngOnInit(): void {
    this.me.username = this.username;
    
    console.log('Navbar initialized for user:', this.username);
this.cdr.detectChanges();
  }
  ngOnChanges(): void {
    this.me.username = this.username;
    console.log('Navbar input changed, new username:', this.username);
    this.cdr.detectChanges();
  }

  constructor(private http: HttpClient,private cdr: ChangeDetectorRef) {}
 

  search() {
    if (!this.query.trim()) {
      this.results = [];
      return;
    }

    this.http.get(`http://${window.location.hostname}:8080/search/username?q=${this.query}`)
      .subscribe(data => this.results = data);
  }

  openChat(user: User) {
    console.log('Open chat with', user.username);
    this.results = [];
    this.query = '';
  }
 
  }

