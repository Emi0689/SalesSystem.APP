import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Category } from '../../../../Interfaces/category';
import { Product } from '../../../../Interfaces/product';
import { CategoryService } from '../../../../Services/category.service';
import { ProductService } from '../../../../Services/product.service';
import { UtilityService } from 'src/app/Reusable/utility.service';

@Component({
  selector: 'app-product-modal',
  templateUrl: './product-modal.component.html',
  styleUrls: ['./product-modal.component.css']
})

export class ProductModalComponent  implements OnInit {
  formProduct: FormGroup;
  accionTitle: string = "Add"
  accionBoton: string = "Save";
  categorys: Category[] = [];

  constructor(
    private dialogoReferencia: MatDialogRef<ProductModalComponent>,
    @Inject(MAT_DIALOG_DATA) public productEdit: Product,
    private fb: FormBuilder,
    private _UtilityService: UtilityService,
    private _categoryServicio: CategoryService,
    private _productServicio: ProductService
  ) {
    this.formProduct = this.fb.group({
      name: ['', Validators.required],
      idCategory: ['', Validators.required],
      stock: ['', Validators.required],
      price: ['', Validators.required],
      isActive: ['', Validators.required]
    })


    if (this.productEdit) {

      this.accionTitle = "Edit";
      this.accionBoton = "Update";
    }

    this._categoryServicio.getAll().subscribe({
      next: (data) => {

        if (data.status) {
          this.categorys = data.value;
          if (this.productEdit)
            this.formProduct.patchValue({
              idCategory: this.productEdit.idCategory
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

    if (this.productEdit) {
      this.formProduct.patchValue({
        name: this.productEdit.name,
        idCategory: this.productEdit.idCategory,
        stock: this.productEdit.stock,
        price:this.productEdit.price,
        isActive: this.productEdit.isActive.toString()
      })
    }
  }

  upsertProduct() {

    const _product: Product = {
      idProduct: this.productEdit == null ? 0 : this.productEdit.idProduct,
      name: this.formProduct.value.name,
      idCategory: this.formProduct.value.idCategory,
      categoryDescription : "",
      price: this.formProduct.value.price,
      stock: this.formProduct.value.stock,
      isActive: this.formProduct.value.isActive.toString()
    }



    if (this.productEdit) {

      this._productServicio.update(_product).subscribe({
        next: (data) => {

          if (data.status) {
            this._UtilityService.showAlert("The product was udpated successfully.", "Done!");
            this.dialogoReferencia.close('Updated')
          } else {
            this._UtilityService.showAlert("The product could not be updated.", "Error");
          }

        },
        error: (e) => {
          console.log(e)
        },
        complete: () => {
        }
      })


    } else {

      this._productServicio.create(_product).subscribe({
        next: (data) => {

          if (data.status) {
            this._UtilityService.showAlert("The product was created successfully.", "Done");
            this.dialogoReferencia.close('Created')
          } else {
            this._UtilityService.showAlert("The product could not be created.", "Error");
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
