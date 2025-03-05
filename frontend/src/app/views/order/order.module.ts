import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { OrderRoutingModule } from './order-routing.module';
import { OrderComponent } from './order/order.component';
import { CartComponent } from './cart/cart.component';
import {CarouselModule} from "ngx-owl-carousel-o";
import {MatDialogModule} from "@angular/material/dialog";
import {ReactiveFormsModule} from "@angular/forms";
import {SharedModule} from "../../shared/shared.module";


@NgModule({
  declarations: [
    OrderComponent,
    CartComponent
  ],
  imports: [
    SharedModule,
    CommonModule,
    ReactiveFormsModule,
    MatDialogModule,
    CarouselModule,
    OrderRoutingModule,
  ]
})
export class OrderModule { }
