import { Component, Inject, OnInit} from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Rol } from '../../../../Interfaces/rol';
import { User } from '../../../../Interfaces/user';
import { RolService } from '../../../../Services/rol.service';
import { UserService } from '../../../../Services/user.service';
import { UtilityService } from '../../../../Reusable/utility.service';

@Component({
  selector: 'app-user-modal',
  templateUrl: './user-modal.component.html',
  styleUrls: ['./user-modal.component.css']
})

export class UserModalComponent implements OnInit {

  formUser: FormGroup;
  hidePassword: boolean = true;
  accionTitle:string ="Add"
  accionBoton: string = "Save";
  Rols: Rol[] = [];

  constructor(
    private modalCurrent: MatDialogRef<UserModalComponent>,
    @Inject(MAT_DIALOG_DATA) public userData: User,
    private fb: FormBuilder,
    private UtilityService: UtilityService,
    private _rolServicio: RolService,
    private _userServicio: UserService
  )
  {

    this.formUser = this.fb.group({
      fullName: ['', Validators.required],
      email: ['', Validators.required],
      idRol: ['', Validators.required],
      password: ['', Validators.required],
      isActive: ['1', Validators.required],
    })


    if (this.userData) {
      this.accionTitle = "Edit";
      this.accionBoton = "Update";
    }

    this._rolServicio.getAll().subscribe({
      next: (data) => {

        if (data.status) {
          this.Rols = data.value;
          if (this.userData)
            this.formUser.patchValue({
              idRol: this.userData.idRol
            })
        }
      },
      error: (e) => {
      },
      complete: () => {
      }
    })


  }

  ngOnInit(): void {

    if (this.userData) {

      this.formUser.patchValue({
        fullName: this.userData.fullName,
        email: this.userData.email,
        idRol: this.userData.idRol,
        rolDescription: this.userData.rolDescription,
        password: this.userData.password,
        isActive: this.userData.isActive.toString()
      })
   }

  }

  ngAfterViewInit() {

  }


  upsertUser() {

    const _user: User = {
      idUser: this.userData == null ? 0 : this.userData.idUser,
      fullName: this.formUser.value.fullName,
      email: this.formUser.value.email,
      idRol: this.formUser.value.idRol,
      rolDescription : "",
      password: this.formUser.value.password,
      isActive: parseInt(this.formUser.value.isActive)
    }


    if (this.userData) {

      this._userServicio.update(_user).subscribe({
        next: (data) => {

          if (data.status) {
            this.UtilityService.showAlert("The user was updated successfully.", "Done!");
            this.modalCurrent.close('Updated')
          } else {
            this.UtilityService.showAlert("The user could not be updated.", "Error");
          }
        },
        error: (e) => {
          console.log(e)
        },
        complete: () => {
        }
      })
    }
    else {
      this._userServicio.create(_user).subscribe({
        next: (data) => {
          if (data.status) {
            this.UtilityService.showAlert("The user was created successfully.", "Done");
            this.modalCurrent.close('Created')
          } else {
            this.UtilityService.showAlert("The user could not be created.", "Error");
          }
        },
        error: (e) => {
        },
        complete: () => {
        }
      })
    }
  }

}
