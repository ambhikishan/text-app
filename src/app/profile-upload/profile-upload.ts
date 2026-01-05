import { ChangeDetectorRef, Component, NgZone, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { FormsModule } from '@angular/forms'; // IMPORT THIS
import { Navbar } from '../navbar/navbar';
import { App } from '../app';
import { LoginService } from '../login';
import { Router } from '@angular/router';

@Component({
  selector: 'app-profile-upload',
  standalone: true,
  imports: [CommonModule, FormsModule,Navbar], // Add FormsModule here
  templateUrl: './profile-upload.html',
  styleUrls: ['./profile-upload.css']
})
export class ProfileUpload implements OnInit {
updatedPicture = '';
  onFileSelected($event: Event) {
  console.log('File selection event:', this.selectedFile);
    const uploadBtn = document.getElementsByClassName("upload-btn").item(0);
          if (uploadBtn) {
            uploadBtn.textContent = "Upload";
          }
      const input = $event.target as HTMLInputElement;
      if (input.files && input.files[0]) {
      this.selectedFile = input.files[0];
  
      // Create a preview
      const reader = new FileReader();
      reader.onload = () => {
        this.imagePreview = reader.result;
        this.cdr.detectChanges();
      };
      if (this.selectedFile) {
        reader.readAsDataURL(this.selectedFile);
      }
    }
    
console.log('File selection event:', this.selectedFile);

  }

onUpload() {
if (!this.selectedFile) return;
   
    this.isUploading = true;
    const formData = new FormData();
    
    // IMPORTANT: The key 'filePart' must match your Spring @RequestPart name
    formData.append('filePart', this.selectedFile);

    // Get your JWT token (assuming it's in localStorage for this example)
    const token = localStorage.getItem('token'); 

    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}` 
      // Note: Do NOT set 'Content-Type' manually for FormData. 
      // Angular/Browser sets it automatically with the boundary.
    });

    this.http.post('http://localhost:8080/user/picture', formData, { headers })
      .subscribe({
        next: (response) => {
          console.log('Upload successful!', response);
          this.isUploading = false;
          this.selectedFile = null;
          const uploadBtn = document.getElementsByClassName("upload-btn").item(0);
          if (uploadBtn) {
            uploadBtn.textContent = "Uploaded";
          }
         this.updatedPicture = `http://${window.location.hostname}:8080/user/profile/${this.username}`;
         this.cdr.detectChanges();
        },
        error: (error) => {
          console.error('Upload failed', error);
          this.isUploading = false;
          this.router.navigate(['/login']);
          this.selectedFile = null;
        }
      });
  
}
ngOnChanges(): void {
  this.cdr.detectChanges();
}

  // Profile Photo Vars
  selectedFile: File | null = null;
  imagePreview: string | ArrayBuffer | null = '';
  isUploading = false;

  // User Detail Vars
  username: string = 'Loading...';
  email: string = '...';

  // Password Vars
  showPasswordForm = false;
  newPassword = '';
  confirmPassword = '';

  constructor(private http: HttpClient,private cdr: ChangeDetectorRef,private ngZone: NgZone,private loginService: LoginService,private router: Router) {}

  ngOnInit(): void {
    
    const token = localStorage.getItem('token');
    console.log('Retrieved token from localStorage:', token);
    this.loginService.validateToken(token || '').subscribe(response => {
      console.log('Token validation successful', response);
      const userData: any = response;
      this.imagePreview = `http://${window.location.hostname}:8080/user/profile/${userData.username}`;

      this.username = userData.username;
      this.email = userData.email;
      console.log('Username in chat component: ', this.username);
      this.cdr.detectChanges();
    }, error => {
      console.error('Token validation failed', error);
      localStorage.removeItem('token');
      this.router.navigate(['/login']);
    });
    this.loadUserProfile();
  }

  loadUserProfile() {
    // 1. Decode token or call API to get Name/Email/Current Photo
    // const token = localStorage.getItem('token');
    // if(token) {
    //     // Mocking data for now - Replace with your real API call or JWT decode
        
    //     // If you have a saved photo URL, set this.imagePreview here
    // }
  }

  // ... (Keep your existing onFileSelected and onUpload methods here) ...

  onChangePassword() {
    if (this.newPassword !== this.confirmPassword) {
      alert("Passwords do not match!");
      return;
    }

    const token = localStorage.getItem('authToken');
    const headers = new HttpHeaders({ 'Authorization': `Bearer ${token}` });
    
    const body = { password: this.newPassword };

    this.http.post('http://localhost:8080/user/change-password', body, { headers })
      .subscribe({
        next: () => {
          alert("Password changed successfully");
          this.showPasswordForm = false;
          this.newPassword = '';
          this.confirmPassword = '';
        },
        error: (err) => alert("Error changing password")
      });
  }
}