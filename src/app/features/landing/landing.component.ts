import { Component } from '@angular/core';
import { AuthService } from '@/core/service/auth.service';
import { CardModule } from 'primeng/card';


@Component({
  selector: 'app-landing',
  imports: [CardModule],
  templateUrl: './landing.component.html',
  styleUrl: './landing.component.css'
})
export class LandingComponent {
  constructor(private authService: AuthService) {}

  login() {
    this.authService.login();
  }
  register() {
    this.authService.login();
    // window.location.href = 'https://keycloak.check-consulting.net/realms/master/login-actions/registration?client_id=scpi-invest-plus&tab_id=D5MMp0ZKslg&client_data=eyJydSI6Imh0dHA6Ly9sb2NhbGhvc3Q6NDIwMC9kYXNoYm9hcmQiLCJydCI6ImNvZGUiLCJzdCI6ImVtc3pNMWxZVWt4RFJIZEROR2xuWVM0emVucEJTMXB1V2xkUmJWSXRZa0ZSVWtNMFV6WXdZVEJ3YURSUiJ9';
  }
}


