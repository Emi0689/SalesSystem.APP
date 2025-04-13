import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { LayoutRoutingModule } from './layout-routing.module';
import { DashbordComponent } from './Pages/dashbord/dashbord.component';
import { UserComponent } from './Pages/user/user.component';
import { ProductComponent } from './Pages/product/product.component';
import { SaleComponent } from './Pages/sale/sale.component';
import { HistoryComponent } from './Pages/history/history.component';
import { ReportComponent } from './Pages/report/report.component';
import { SharedModule } from 'src/app/Reusable/shared/shared.module';
import { UserModalComponent } from './Modals/user-modal/user-modal.component';
import { MatPaginatorModule  } from '@angular/material/paginator';
import { ProductModalComponent } from './Modals/product-modal/product-modal.component';
import { SaleDetailsModalComponent } from './Modals/sale-details-modal/sale-details-modal.component';


@NgModule({
  declarations: [
    DashbordComponent,
    SaleComponent,
    ProductComponent,
    HistoryComponent,
    ReportComponent,
    UserComponent,
    UserModalComponent,
    ProductModalComponent,
    SaleDetailsModalComponent
  ],
  imports: [
    CommonModule,
    LayoutRoutingModule,
    SharedModule,
    FormsModule,
    ReactiveFormsModule,
    MatPaginatorModule
  ]
})
export class LayoutModule { }
