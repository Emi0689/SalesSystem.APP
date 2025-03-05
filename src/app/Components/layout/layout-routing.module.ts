import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LayoutComponent } from './layout.component';
import { DashbordComponent } from './Pages/dashbord/dashbord.component';
import { UserComponent } from './Pages/user/user.component';
import { ProductComponent } from './Pages/product/product.component';
import { SaleComponent } from './Pages/sale/sale.component';
import { HistoryComponent } from './Pages/history/history.component';
import { ReportComponent } from './Pages/report/report.component';

const routes: Routes = [{
  path:'',
  component: LayoutComponent,
  children: [
    {path:'dashboard', component:DashbordComponent},
    {path:'user', component:UserComponent},
    {path:'product', component:ProductComponent},
    {path:'sale', component:SaleComponent},
    {path:'history', component:HistoryComponent},
    {path:'report', component:ReportComponent},
  ]
}];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class LayoutRoutingModule { }
