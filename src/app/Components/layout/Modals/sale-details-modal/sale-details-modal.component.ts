import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { SaleDetails } from '../../../../Interfaces/saleDetails';
import { Sale } from '../../../../Interfaces/sale';

@Component({
  selector: 'app-sale-detail-modal',
  templateUrl: './sale-detail-modal.component.html',
  styleUrls: ['./sale-details-modal.component.css']
})
export class SaleDetailsModalComponent implements OnInit {


  timestamp?: string = "";
  idNumber?: string = "";
  paymentType?: string = "";
  totalText?: string = "";
  saleDetails: SaleDetails[] = [
    {idProduct:1, productDescription:"",amount:0, priceText:"0",totalText:"0"},
  ]
  displayedColumns: string[] = ['product', 'amount', 'price', 'total'];


  constructor(@Inject(MAT_DIALOG_DATA) public _sale: Sale) {
    this.timestamp = _sale.timestamp;
    this.idNumber = _sale.idNumber;
    this.paymentType = _sale.paymentType;
    this.totalText = _sale.totalText;
    this.saleDetails = _sale.saleDetails == null ? [
      { idProduct: 1, productDescription: "", amount: 0, priceText: "0", totalText: "0" },
    ] : _sale.saleDetails;
  }

  ngOnInit(): void {

  }

}
