import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import {OrdersComponent} from "./orders/orders.component";
import {BestArticlesComponent} from "./best-articles/best-articles.component";

const routes: Routes = [
  {path: 'best', component: BestArticlesComponent},
  {path: 'orders', component: OrdersComponent},
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class PersonalRoutingModule { }
