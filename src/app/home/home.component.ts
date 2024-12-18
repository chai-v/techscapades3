import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {

  constructor(private router: Router) { }

  ngOnInit(): void { }

  goToRegisterPage() {
    this.router.navigate(['/register'])
  }

  goToLoginPage() {
    this.router.navigate(['/login'])
  }

  openWhatsApp(value: any) {
    switch (value) {
      case 1:
        window.open(this.getWhatsappLink('9502663840'), '_blank')
        break;
      case 2:
        window.open(this.getWhatsappLink('9059217499'), '_blank')
        break;
    }
  }

  getWhatsappLink(number: String) {
    return `https://api.whatsapp.com/send/?phone=91${number}&text&app_absent=0`
  }

}
