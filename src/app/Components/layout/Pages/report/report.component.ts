import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { MAT_DATE_FORMATS } from '@angular/material/core';
import { Report } from '../../../../Interfaces/report';
import * as XLSX from 'xlsx';
import * as moment from 'moment';
import { SaleService } from '../../../../Services/sale.service';
import { UtilityService } from 'src/app/Reusable/utility.service';

export const MY_DATE_FORMATS = {
  parse: {
    dateInput: 'MM/DD/YYYY',
  },
  display: {
    dateInput: 'MM/DD/YYYY',
    monthYearLabel: 'MMMM YYYY',
    dateA11yLabel: 'LL',
    monthYearA11yLabel: 'MMMM YYYY'
  }
};


@Component({
  selector: 'app-report',
  templateUrl: './report.component.html',
  styleUrls: ['./report.component.css'],
  providers: [{provide: MAT_DATE_FORMATS,   useValue: {
    display: {
      dateInput: 'MM/DD/YYYY',
      monthYearLabel: 'MMMM YYYY',
      dateA11yLabel: 'LL',
      monthYearA11yLabel: 'MMMM YYYY'
    }
  }}]
})

export class ReportComponent implements OnInit {

  formGroup: FormGroup;
  reportList: Report[] = [];
  displayedColumns: string[] = ['timestamp','idNumber',  'paymentType', 'total', 'product','amount','price','totalSale'];
  dataSource = new MatTableDataSource(this.reportList);
  @ViewChild(MatPaginator) paginator!: MatPaginator;

  constructor(
    private fb: FormBuilder,
    private _saleService: SaleService,
    private _utilityService: UtilityService,
  ) {
    this.formGroup = this.fb.group({
      dateStart: [new Date(), Validators.required],
      dateEnd: [new Date(), Validators.required]
    })
  }

  ngOnInit(): void {
  }

  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
  }

  onSubmitForm() {

    const _dateStart: any = moment(this.formGroup.value.dateStart).format('DD/MM/YYYY')
    const _dateEnd: any = moment(this.formGroup.value.dateEnd).format('DD/MM/YYYY')
    if (_dateStart === "Invalid date" || _dateEnd === "Invalid date") {
      this._utilityService.showAlert("You need to add both dates.", 'Oops!');
      return;
    }

    this._saleService.report(
      _dateStart,
      _dateEnd,
    ).subscribe({
      next: (data) => {

        if (data.status) {
          console.log(data);
          this.reportList = data.value;
          this.dataSource.data = data.value;

        }
        else {
          this.reportList = [];
          this.dataSource.data = [];
          this._utilityService.showAlert("There is not date to show.", 'Oops!');
        }

      },
      error: (e) => {
      },
      complete: () => {

      }
    })

  }

  exportarExcel() {
    const wb = XLSX.utils.book_new();
    const ws = XLSX.utils.json_to_sheet(this.reportList);

    XLSX.utils.book_append_sheet(wb, ws, "Sale");
    XLSX.writeFile(wb, "Sale Report.xlsx")
  }
}
