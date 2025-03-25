import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {ProductCardComponent} from './components/product-card/product-card.component';
import {RouterModule} from "@angular/router";
import {FormsModule, ReactiveFormsModule} from "@angular/forms";
import {CategoryFilterComponent} from './components/category-filter/category-filter.component';
import {MatProgressSpinnerModule} from "@angular/material/progress-spinner";
import {CommentComponent} from "./components/comment/comment.component";
import {CountSelectorComponent} from "./components/count-selector/count-selector.component";
import {MatDialogModule} from "@angular/material/dialog";
import { LoaderComponent } from './components/loader/loader.component';
import { PhoneMaskPipe } from './pipes/phone-mask.pipe';

@NgModule({
  declarations: [
    ProductCardComponent,
    CategoryFilterComponent,
    CommentComponent,
    CountSelectorComponent,
    LoaderComponent,
    PhoneMaskPipe,
  ],
  imports: [
    FormsModule,
    CommonModule,
    RouterModule,
    MatProgressSpinnerModule,
    ReactiveFormsModule,
    MatDialogModule,
  ],
  exports: [ProductCardComponent, CategoryFilterComponent, CommentComponent, CountSelectorComponent, PhoneMaskPipe,],
})
export class SharedModule {
}
