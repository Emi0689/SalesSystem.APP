import { AfterViewInit, Component, OnInit, ViewChild } from '@angular/core';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { MatDialog } from '@angular/material/dialog';
import { UserModalComponent } from '../../Modals/user-modal/user-modal.component';
import { User } from '../../../../Interfaces/user';
import { UserService } from '../../../../Services/user.service';
import { UtilityService } from 'src/app/Reusable/utility.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-user',
  templateUrl: './user.component.html',
  styleUrls: ['./user.component.css']
})

export class UserComponent implements OnInit, AfterViewInit {
  displayedColumns: string[] = ['fullName', 'email', 'rolDescription','status', 'actions'];
  dataInit: User[] = [];
  dataSource = new MatTableDataSource(this.dataInit);

  @ViewChild('scheduledOrdersPaginator', {static: false}) set paginator(pager:MatPaginator) {
    if (pager) this.dataSource.paginator = pager;
  }

  @ViewChild(MatSort, {static: false}) set sort(sorter:MatSort) {
    if (sorter) this.dataSource.sort = sorter;
  }
  constructor(
    private dialog: MatDialog,
    private _userService: UserService,
    private _utilityService: UtilityService)
  {
  }

  ngOnInit(): void {
    this.showUsers();
  }

  ngAfterViewInit() {
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }

  showUsers() {
    this._userService.getAll().subscribe({
      next: (data) => {
        if(data.status)
          this.dataSource.data = data.value;
        else
          this._utilityService.showAlert("There is not user to show.", 'Oops!');
      },
      error: (e) => {
      },
      complete: () => {

      }
    })
  }

  createUser() {
    this.dialog.open(UserModalComponent, {
        disableClose: true
      }).afterClosed().subscribe(result => {

        if (result === "Created") {
          this.showUsers();
        }
      });
  }

  updateUser(user: User) {
    this.dialog.open(UserModalComponent, {
      disableClose: true,
      data: user
    }).afterClosed().subscribe(result => {

      if (result === "Updated")
        this.showUsers();
    });
  }

  deleteUser(user: User) {
    var userCurrent = this._utilityService.getUserSession();

    if(userCurrent.rolDescription != 'Administrador')
    {
      this._utilityService.showAlert("Only the administrator user can create or update user.", "Oops!");
    }
    else
    {
      Swal.fire({
      title: 'Do you want to delete the user?',
      text: user.fullName,
      icon: 'warning',
      confirmButtonColor: '#3085d6',
      confirmButtonText: 'Yes, delete',
      showCancelButton: true,
      cancelButtonColor: '#d33',
      cancelButtonText: 'No, back'
      }).then(result => {

        if (result.isConfirmed) {

          this._userService.delete(user.idUser).subscribe({
            next: (data) => {

              if (data.status) {
                this._utilityService.showAlert("The user was deleted.", "Done!")
                this.showUsers();
              } else {
                this._utilityService.showAlert("The user could not be deleted.", "Error");
              }
            },
            error: (e) => {
            },
            complete: () => {
            }
          })

        }

      });
    }
  }
}
