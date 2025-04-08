import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { MatTableDataSource, } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { MatDialog } from '@angular/material/dialog';
import { MAT_DATE_FORMATS} from '@angular/material/core';
import { Sale } from '../../../../Interfaces/sale';
import { SaleDetailsModalComponent } from '../../Modals/sale-details-modal/sale-details-modal.component';
import { SaleService } from '../../../../Services/sale.service';
import { UtilityService } from 'src/app/Reusable/utility.service';
import * as moment from 'moment';

export const MY_DATE_FORMATS = {
  parse: {
    dateInput: 'MM/DD/YYYY',
  },
  display: {
    dateInput: 'MM/DD/YYYY',
    monthYearLabel: 'MMMM YYYY',
    dateA11yLabel: 'LL',
    monthYearA11yLabel: 'MMMM YYYY'
  },
};

@Component({
  selector: 'app-history',
  templateUrl: './history.component.html',
  styleUrls: ['./history.component.css'],
  providers: [{provide: MAT_DATE_FORMATS,   useValue: {
    display: {
      dateInput: 'MM/DD/YYYY',
      monthYearLabel: 'MMMM YYYY',
      dateA11yLabel: 'LL',
      monthYearA11yLabel: 'MMMM YYYY'
    }
  }}]
})

export class HistoryComponent implements OnInit {
  formGroup: FormGroup;
  searchItem: any[] = [
    { value: "date", description: "By dates" },
    { value: "idnumber", description: "Sale number" }
  ]

  ELEMENT_DATA: Sale[] = [];
  displayedColumns: string[] = ['idnumber', 'timestamp', 'paymentType', 'total', 'accion'];
  dataSource = new MatTableDataSource(this.ELEMENT_DATA);
  @ViewChild(MatPaginator) paginator!: MatPaginator;

  constructor(
    private fb: FormBuilder,
    private dialog: MatDialog,
    private _saleServicio: SaleService,
    private _utilityService: UtilityService,
  ) {

    this.formGroup = this.fb.group({
      searchBy: ['date'],
      idNumber:[''],
      dateStart: [''],
      dateEnd: ['']
    })

    this.formGroup.get('searchBy')?.valueChanges.subscribe(value => {
      this.formGroup.patchValue({
        idNumber: "",
        dateStart: "",
        dateEnd: ""
      })
    })

  }

  ngOnInit(): void {
  }

  ngAfterViewInit() {
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }

  onSubmitForm() {

    const _dateStart: any = moment(this.formGroup.value.dateStart).format('MM/DD/YYYY');
    const _dateEnd: any = moment(this.formGroup.value.dateEnd).format('MM/DD/YYYY');

    if(this.formGroup.value.searchBy == "date")
    {
      if (_dateStart === "Invalid date" || _dateEnd === "Invalid date") {
        this._utilityService.showAlert("You need to add both dates.", 'Oops!');
        return;
      }
    }

    this._saleServicio.history(
      this.formGroup.value.searchBy,
      this.formGroup.value.idNumber,
      _dateStart,
      _dateEnd,
    ).subscribe({
      next: (data) => {

        if (data.status) {

          this.dataSource.data = data.value;
        }
        else
          this._utilityService.showAlert("There is not date to show.", 'Oops!');
      },
      error: (e) => {
      },
      complete: () => {

      }
    })
  }

  seeSaleDetails(_sale: Sale)
  {
    console.log(_sale);
    this.dialog.open(SaleDetailsModalComponent,{
      data: _sale,
      disableClose: true,
      width: '700px'
    })

  }
}
