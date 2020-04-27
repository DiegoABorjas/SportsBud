import { Component } from "@angular/core";
import { NgForm } from '@angular/forms';
import { AuthService } from '../auth.service';

@Component({
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})

export class RegisterComponent {
  constructor(public authService: AuthService) {

  }

  onRegister(form: NgForm) {
    if (form.invalid) {
      return;
    }
    this.authService.createUser(form.value.name, form.value.email, form.value.password);
  }
}
