import {ActivatedRoute, Router} from "@angular/router";
import {ActiveParamsType} from "../../../../types/active-params.type";
import {ActiveParamsUtils} from "../../utils/active-params.utils";
import {Component, EventEmitter, Input, OnInit, Output} from "@angular/core";
import {CategoryWithTypeType} from "../../../../types/category-with-type.type";
import {CategoryType} from "../../../../types/category.type";

@Component({
  selector: 'category-filter',
  templateUrl: './category-filter.component.html',
  styleUrls: ['./category-filter.component.scss']
})
export class CategoryFilterComponent implements OnInit {

  @Input() categoryWithType: CategoryWithTypeType | null = null;
  @Input() category: string | null = null;
  // @Output() toggle = new EventEmitter<any[]>()
  open = false;
  activeParams: ActiveParamsType = {categories: []};
  checked: boolean = false;
  type: string | null = null;

  constructor(private router: Router, private activatedRoute: ActivatedRoute) {
  }

  ngOnInit(): void {
    this.activatedRoute.queryParams.subscribe(params => {
      this.activeParams = ActiveParamsUtils.processParams(params);

      if (this.category && params['categories']) {
        this.activeParams.categories = Array.isArray(params['categories']) ? params['categories'] : [params['categories']];
      }
      if (this.categoryWithType && this.categoryWithType.categories
        && this.categoryWithType.categories.length > 0 &&
        this.categoryWithType.categories.some(category => this.activeParams.categories.find(item => category.url === item))) {
        this.open = true;
      }
    });

  }

  toggle(): void {
    this.open = !this.open;
  }

  updateFilterParam(url: string, checked: boolean) {
    if (this.activeParams.categories && this.activeParams.categories.length > 0) {
      const existingTypeInParams = this.activeParams.categories.find(item => item === url);
      if (existingTypeInParams && !checked) {
        this.activeParams.categories = this.activeParams.categories.filter(item => item !== url);
      } else if (!existingTypeInParams && checked) {
         this.activeParams.categories.push(url);
        this.activeParams.categories = [...this.activeParams.categories, url];
      }
    } else if (checked) {
      this.activeParams.categories = [url];
    }

    this.activeParams.pages = 1;
    this.router.navigate(['/articles'], {
      queryParams: this.activeParams
    });
  }

}

