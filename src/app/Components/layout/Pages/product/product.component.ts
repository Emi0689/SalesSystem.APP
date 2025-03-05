import { AfterViewInit, Component, OnInit, ViewChild } from '@angular/core';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { MatDialog } from '@angular/material/dialog';
import { ProductModalComponent } from '../../Modals/product-modal/product-modal.component';
import { Product } from '../../../../Interfaces/product';
import { ProductService } from '../../../../Services/product.service';
import { UtilityService } from 'src/app/Reusable/utility.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-product',
  templateUrl: './product.component.html',
  styleUrls: ['./product.component.css']
})

export class ProductComponent implements OnInit, AfterViewInit {
  displayedColumns: string[] = ['name', 'categoryDescription', 'stock', 'price', 'status', 'actions'];
  dataInit: Product[] = [];
  dataSource = new MatTableDataSource(this.dataInit);

  @ViewChild('paginator', {static: false}) set paginator(pager:MatPaginator) {
    this.dataSource.paginator = pager;
  }

  @ViewChild(MatSort, {static: false}) set sort(sorter:MatSort) {
    if (sorter) this.dataSource.sort = sorter;
  }
  constructor(
    private dialog: MatDialog,
    private _productService: ProductService,
    private _utilityService: UtilityService)
  {
  }

  ngOnInit(): void {
    this.showProducts();
  }

  ngAfterViewInit() {

  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }

  showProducts() {
    this._productService.getAll().subscribe({
      next: (data) => {
        if(data.status)
          this.dataSource.data = data.value;
        else
          this._utilityService.showAlert("There is not product to show.", 'Oops!');
      },
      error: (e) => {
      },
      complete: () => {

      }
    })
  }

  createProduct() {
    this.dialog.open(ProductModalComponent, {
        disableClose: true
      }).afterClosed().subscribe(result => {

        if (result === "Created") {
          this.showProducts();
        }
      });
  }

  updateProduct(product: Product) {
    this.dialog.open(ProductModalComponent, {
      disableClose: true,
      data: product
    }).afterClosed().subscribe(result => {

      if (result === "Updated")
        this.showProducts();
    });
  }

  deleteProduct(product: Product) {
   Swal.fire({
    title: 'Do you want to delete the product?',
    text: product.name,
    icon: 'warning',
    confirmButtonColor: '#3085d6',
    confirmButtonText: 'Yes, delete',
    showCancelButton: true,
    cancelButtonColor: '#d33',
    cancelButtonText: 'No, back'
    }).then(result => {

      if (result.isConfirmed) {

        this._productService.delete(product.idProduct).subscribe({
          next: (data) => {

            if (data.status) {
              this._utilityService.showAlert("The product was deleted.", "Done!")
              this.showProducts();
            } else {
              this._utilityService.showAlert("The product could not be deleted.", "Error");
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
