import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { PersonalRoutingModule } from './personal-routing.module';
import { BestArticlesComponent } from './best-articles/best-articles.component';
import { OrdersComponent } from './orders/orders.component';
import {FormsModule, ReactiveFormsModule} from "@angular/forms";
import {SharedModule} from "../../shared/shared.module";


@NgModule({
  declarations: [
    BestArticlesComponent,
    OrdersComponent
  ],
  imports: [
    CommonModule,
    SharedModule,
    PersonalRoutingModule,
    FormsModule,
    ReactiveFormsModule
  ]
})
export class PersonalModule { }
