import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { SaleDetail } from '../../../../Interfaces/sale-detail';
import { Sale } from '../../../../Interfaces/sale';

@Component({
  selector: 'app-sale-detail-modal',
  templateUrl: './sale-detail-modal.component.html',
  styleUrls: ['./sale-detail-modal.component.css']
})
export class SaleDetailModalComponent implements OnInit {


  timestamp?: string = "";
  idNumber?: string = "";
  paymentType?: string = "";
  totalText?: string = "";
  saleDetail: SaleDetail[] = [
    {idProduct:1, productDescription:"",amount:0, priceText:"0",totalText:"0"},
  ]
  displayedColumns: string[] = ['product', 'amount', 'price', 'total'];


  constructor(@Inject(MAT_DIALOG_DATA) public _sale: Sale) {
    this.timestamp = _sale.timestamp;
    this.idNumber = _sale.idNumber;
    this.paymentType = _sale.paymentType;
    this.totalText = _sale.totalText;
    this.saleDetail = _sale.saleDetail == null ? [
      { idProduct: 1, productDescription: "", amount: 0, priceText: "0", totalText: "0" },
    ] : _sale.saleDetail;
  }

  ngOnInit(): void {

  }

}
