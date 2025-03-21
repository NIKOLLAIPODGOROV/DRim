import {ServeNameType} from "../../../types/serve-name.type";
import {Params} from "@angular/router";

export class ServeNameUtils {
  static processParams(params: Params): ServeNameType {
    const activeName: ServeNameType = {name: ''};

    if (params.hasOwnProperty('name')) {
      activeName.name = params['name'] ? params['name'] : [params['name']];
    }
    if (params.hasOwnProperty('Копирайтинг')) {
      activeName.name = params['Копирайтинг'];
    }
    if (params.hasOwnProperty('Реклама')) {
      activeName.name = params['Реклама'];
    }
    if (params.hasOwnProperty('Продвижение')) {
      activeName.name = params['Продвижение'];
    }
    if (params.hasOwnProperty('Создание сайтов')) {
      activeName.name = params['Создание сайтов'];
    }
    return activeName;
  }
}
