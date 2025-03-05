import {ActiveParamsType} from "../../../types/active-params.type";
import {Params} from "@angular/router";
import {CategoryType} from "../../../types/category.type";


export class ActiveParamsUtils {
  static processParams(params: Params): ActiveParamsType {
     const activeParams: ActiveParamsType = {categories: []};

    if (params.hasOwnProperty('categories')) {
      activeParams.categories = params['categories'] ? params['categories'] : [params['categories']];
    }
    if (params.hasOwnProperty('pages')) {
      activeParams.pages = +params['pages'];
    }
    if (params.hasOwnProperty('categories')) {
      activeParams.categories = params['categories'];
    }
    // if (params.hasOwnProperty('order')) {
    //   activeParams.types = params['order'];
    // }
    // if (params.hasOwnProperty('consultation')) {
    //   activeParams.types = params['consultation'];
    // }
    return activeParams;
  }
}
