import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators  } from '@angular/forms';
import { MatTableDataSource } from '@angular/material/table';
import {  SaleDetails } from '../../../../Interfaces/saleDetails';
import { Product } from '../../../../Interfaces/product';
import { Sale } from '../../../../Interfaces/sale';
import { ProductService } from '../../../../Services/product.service';
import { SaleService } from '../../../../Services/sale.service';
import { UtilityService } from 'src/app/Reusable/utility.service';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-sale',
  templateUrl: './sale.component.html',
  styleUrls: ['./sale.component.css']
})

export class SaleComponent implements OnInit {
  products: Product[] = [];
  ELEMENT_DATA: SaleDetails[] = [];
  disabled: boolean = false;

  filteredProducts!: Product[];
  addProduct!: Product;
  paymentType: string = "Cash";
  totalPayment: number = 0;

  formGroup: FormGroup;
  displayedColumns: string[] = ['product', 'amount', 'priceText', 'total','accion'];
  dataSource = new MatTableDataSource(this.ELEMENT_DATA);

  constructor(
    private fb: FormBuilder,
    private _productServicio: ProductService,
    private _saleServicio: SaleService,
    private _utilityService: UtilityService,
  ) {

    this.formGroup = this.fb.group({
      product: ['', Validators.required],
      amount: ['', Validators.required]
    })

    this._productServicio.getAll().subscribe({
      next: (data) => {
        if (data.status)
        {
          const productsFound = data.value as Product[];
          this.products = productsFound.filter(p => p.isActive == 1 && p.stock > 0);
        }

      },
      error: (e) => {
      },
      complete: () => {

      }
    })

    this.formGroup.get('product')?.valueChanges.subscribe(value => {
      this.filteredProducts =  this._filter(value)
    })

  }

  ngOnInit(): void {

  }

  private _filter(value: any): Product[] {
    const filterValue = typeof value === "string" ? value.toLowerCase() : value.nombre.toLowerCase();
    return this.products.filter(p => p.name.toLowerCase().includes(filterValue));
  }


  displayProduct(product: Product): string {
    return product.name;
  }

  productSelected(event: any) {
    this.addProduct = event.option.value;
  }

  onSubmitForm() {

    const _amount: number = this.formGroup.value.amount;
    const _price: number = parseFloat(this.addProduct.price);
    const _total: number = _amount * _price;
    this.totalPayment = this.totalPayment + _total;

    this.ELEMENT_DATA.push(
      {
        idProduct: this.addProduct.idProduct,
        productDescription: this.addProduct.name,
        amount: _amount,
        priceText: String(_price.toFixed(2)), //2 decimals
        totalText: String(_total.toFixed(2))
      })

    this.dataSource = new MatTableDataSource(this.ELEMENT_DATA);  //update table

    this.formGroup.patchValue({
      product: '',
      amount: ''
    })

  }

  deleteProduct(item: SaleDetails) {

    this.totalPayment = this.totalPayment - parseFloat(item.totalText);
    this.ELEMENT_DATA = this.ELEMENT_DATA.filter(p => p.idProduct != item.idProduct)

    this.dataSource = new MatTableDataSource(this.ELEMENT_DATA); //update table
  }

  createSale() {

    if (this.ELEMENT_DATA.length > 0) {

      this.disabled = true;

      const saleDto: Sale = {
        paymentType: this.paymentType,
        totalText: String(this.totalPayment.toFixed(2)),
        saleDetails: this.ELEMENT_DATA
      }
      console.log(saleDto);
      this._saleServicio.create(saleDto).subscribe({
        next: (data) => {

          if (data.status) {
            this.totalPayment = 0.00;
            this.ELEMENT_DATA = [];
            this.dataSource = new MatTableDataSource(this.ELEMENT_DATA);
            this.paymentType = "Cash";

            Swal.fire({
              icon:'success',
              title: 'Sale created!',
              text: 'Invoice number: ' + data.value.idSale
            })

          } else {
            this._utilityService.showAlert("The system could not create the sale.", "Oops");
          }
        },
        error: (e) => {
        },
        complete: () => {
          this.disabled = false;
        }
      })
    }
  }
}
