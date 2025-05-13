import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { UserService } from '../../Services/user.service';
import { Login } from '../../Interfaces/login';
import { UtilityService } from '../../Reusable/utility.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})


export class LoginComponent implements OnInit {

formLogin: FormGroup;
hidePassword: boolean = true;
showLoading: boolean = false;

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private _userService: UserService,
    private _utilityService: UtilityService)
  {
    this.formLogin = this.fb.group({
      email: ['', Validators.required],
      password: ['', Validators.required]
    });
  };

  ngOnInit(): void {
  }

  login(){
    this.showLoading = true;

    const request: Login = {
      email: this.formLogin.value.email,
      password: this.formLogin.value.password
    }

    this._userService.login(request).subscribe({
      next: (data) => {
        if(data.success)
        {
          this._utilityService.saveUserSession(data.value);
          this.router.navigate(["pages"]);
        }
        else
        {
          this._utilityService.showAlert("We could not find the user or password.", "Opps!")
        }
      },
      complete: () => {
        this.showLoading = false;
      },
      error: () =>
      {
        this._utilityService.showAlert("There is an error with this user.", "Opps!");
      }
    });
  }
}
