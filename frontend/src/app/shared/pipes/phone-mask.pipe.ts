import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'phoneMask'
})
export class PhoneMaskPipe implements PipeTransform {

  transform(value: string): string {
    if (value.length >= 11 && value.length < 13) {
      return value.replace(/^((8|\+7)[\- ]?)?(\(?\d{3}\)?[\- ]?)?[\d\- ]{7,10}$/, '$1 ($3) 343-13-34');
    }
    return '';
  }

}
