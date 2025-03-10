import {Component, Input, OnInit} from '@angular/core';
import {environment} from "../../../../environments/environment";
import {ArticleType} from "../../../../types/article.type";
import {CategoryType} from "../../../../types/category.type";

@Component({
  selector: 'product-card',
  templateUrl: './product-card.component.html',
  styleUrls: ['./product-card.component.scss']
})
export class ProductCardComponent implements OnInit {

  @Input() categories: CategoryType[] = [];
  @Input() category!: CategoryType;
  @Input() article!: ArticleType;

  serverStaticPath = environment.serverStaticPath;

  constructor() {
  }

  ngOnInit(): void {
  }
}
