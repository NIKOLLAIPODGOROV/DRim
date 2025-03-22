import {Component, ElementRef, Input, OnDestroy, TemplateRef, ViewChild,} from '@angular/core';
import {CategoryType} from "../../../../types/category.type";
import {MatDialog, MatDialogRef} from "@angular/material/dialog";
import {Router} from "@angular/router";
import {FormBuilder, Validators} from "@angular/forms";
import {DefaultResponseType} from "../../../../types/default-response.type";
import {RequestsType} from "../../../../types/requests.type";
import {RequestService} from "../../services/request.service";
import {HttpErrorResponse} from "@angular/common/http";
import {MatSnackBar} from "@angular/material/snack-bar";
import {Subscription} from "rxjs";

@Component({
  selector: 'app-footer',
  templateUrl: './footer.component.html',
  styleUrls: ['./footer.component.scss']
})
export class FooterComponent implements OnDestroy {

  @Input() categories: CategoryType[] = [];
  @Input() type!: string;
  isFormEmpty = false;

  requestForm = this.fb.group({
    name: ['', [Validators.required, Validators.pattern(/^[A-ЯЁ][а-яё]+(?:\s[A-ЯЁ][а-яё]+(?:\s[A-ЯЁ][а-яё]+(?:\s[а-яё]+)?)?)?$/)]],
    phone: ['', [Validators.required, Validators.pattern(/^((8|\+7)[\- ]?)?(\(?\d{3}\)?[\- ]?)?[\d\- ]{7,10}$/)]],
    type: ['consultation',],
  });

  @ViewChild('popup') popup!: TemplateRef<ElementRef>;
  dialogRef: MatDialogRef<any> | null = null;

  constructor(private router: Router,
              private requestService: RequestService,
              private _snackBar: MatSnackBar,
              private dialog: MatDialog,
              private fb: FormBuilder) {
  }

  private subscription: Subscription | null = null;

  createRequests() {
    if (this.requestForm.valid && this.requestForm.value.name
      && this.requestForm.value.phone) {

      const paramsObject: RequestsType = {
        name: this.requestForm.value.name,
        phone: this.requestForm.value.phone,
        type: 'consultation',
      };

      this.requestService.createRequest(paramsObject)
        .subscribe({
          next: (data: DefaultResponseType) => {
            if ((data as DefaultResponseType).error !== undefined) {
              this.isFormEmpty = true;
              throw new Error(((data as DefaultResponseType).message));
            }
          },
          error: (errorResponse: HttpErrorResponse) => {
            if (errorResponse.error && errorResponse.error.message) {
              this._snackBar.open(errorResponse.error.message);
            } else {
              this._snackBar.open('Ошибка заказа');
            }
          }
        });
    } else {
      this.isFormEmpty = false;
      this.requestForm.markAllAsTouched();
      this._snackBar.open('Заполните необходимые поля');
    }
  }

  closePopup() {
    this.dialogRef?.close();
    this.router.navigate(['/']);
  }

  call() {
    this.dialogRef = this.dialog.open(this.popup);
    this.dialogRef.backdropClick()
  }

  ngOnDestroy() {
    this.subscription?.unsubscribe()
  }
}
