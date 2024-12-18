import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { environment } from 'src/environments/environment';


@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss']
})
export class RegisterComponent implements OnInit {

  formData = new FormGroup({
    teamName: new FormControl('', Validators.required),
    captainName: new FormControl('', Validators.required),
    captainRegNum: new FormControl('', Validators.required),
    captainContactNum: new FormControl('', Validators.required),
    captainBranch: new FormControl('', Validators.required),
    captainYear: new FormControl('', Validators.required),
    p1Name: new FormControl('', Validators.required),
    p1RegNum: new FormControl('', Validators.required),
    p2Name: new FormControl('', Validators.required),
    p2RegNum: new FormControl('', Validators.required),
    captainMailId: new FormControl('', Validators.required),
    password1: new FormControl('', Validators.required),
    password2: new FormControl('', Validators.required),
  })

  constructor(private http: HttpClient) { }

  ngOnInit(): void { }

  register() {
    const pass1 = this.formData.controls.password1.value
    const pass2 = this.formData.controls.password2.value
    if (!this.formData.valid) {
      alert('Fill all the details')
      return
    } else if (pass1 != pass2) {
      alert('Passwords do not match')
      return
    }
    this.http.post(environment.endpoint + '/register', this.formData.value).subscribe((res: any) => {
      if (res.status) {
        alert('Registered user successfully')
      } else {
        alert('User already exists')
      }
    })
  }

}
