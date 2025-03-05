import {Component, ElementRef, Input, OnInit, TemplateRef, ViewChild,} from '@angular/core';
import {CategoryType} from "../../../../types/category.type";
import {MatDialog, MatDialogRef} from "@angular/material/dialog";
import {Router} from "@angular/router";
import {FormBuilder, Validators} from "@angular/forms";
import {UserInfoType} from "../../../../types/user-info.type";
import {UserService} from "../../services/user.service";
import {DefaultResponseType} from "../../../../types/default-response.type";
import {AuthService} from "../../../core/auth/auth.service";
import {RequestsType} from "../../../../types/requests.type";
import {RequestService} from "../../services/request.service";
import {HttpErrorResponse} from "@angular/common/http";
import {MatSnackBar} from "@angular/material/snack-bar";

@Component({
  selector: 'app-footer',
  templateUrl: './footer.component.html',
  styleUrls: ['./footer.component.scss']
})
export class FooterComponent implements OnInit {

  @Input() categories: CategoryType[] = [];
  @Input() type!: string;
  isFormEmpty = false;

  requestForm = this.fb.group({
    name: ['', Validators.required],
    phone: ['', Validators.required],
    type: ['consultation',],
  });

  @ViewChild('popup') popup!: TemplateRef<ElementRef>;
  dialogRef: MatDialogRef<any> | null = null;

  constructor(private router: Router,
              private requestService: RequestService,
              private authService: AuthService,
              private userService: UserService,
              private _snackBar: MatSnackBar,
              private dialog: MatDialog,
              private fb: FormBuilder
             ) { }

  ngOnInit(): void {
    if (this.authService.getIsLoggedIn()) {
      this.userService.getUserInfo()
        .subscribe((data: UserInfoType | DefaultResponseType) => {
          if ((data as DefaultResponseType).error !== undefined) {
            throw new Error((data as DefaultResponseType).message);
          }

          const userInfo = data as UserInfoType;

          const paramsToUpdate = {
            name: userInfo.name ? userInfo.name : '',
          };

          // this.requestForm.setValue(paramsToUpdate);
          // if (userInfo.deliveryType) {
          //   this.requestType = userInfo.deliveryType;
          // }
        });
    }

  }

  createRequest() {
    if (this.requestForm.valid && this.requestForm.value.name
      && this.requestForm.value.phone) {

      const paramsObject: RequestsType = {
        name: this.requestForm.value.name,
        phone: this.requestForm.value.phone,
        type: 'consulatation',
      };

      this.requestService.createRequest(paramsObject)
        .subscribe({
          next: (data:DefaultResponseType) => {
            if ((data as DefaultResponseType).error !== undefined) {
              throw new Error(((data as DefaultResponseType).message));
            }
            this.dialogRef = this.dialog.open(this.popup);
            this.dialogRef.backdropClick()
              .subscribe(() => {
                this.router.navigate(['/']);
              });
          },
          error: (errorResponse: HttpErrorResponse) => {
            if (errorResponse.error && errorResponse.error.message) {
              this._snackBar.open(errorResponse.error.message);
            } else {
              this._snackBar.open('Ошибка заказа');
              this.isFormEmpty = false;
            }
          }
        });
    } else {
      this.requestForm.markAllAsTouched();
      this._snackBar.open('Заполните необходимые поля');
    }
  }

  closePopup() {
    this.dialogRef?.close();
    this.router.navigate(['/']);
    this.isFormEmpty = false;
  }

  call() {
this.createRequest()
    this.dialogRef = this.dialog.open(this.popup);
    this.dialogRef.backdropClick()
      .subscribe(() => {
        this.router.navigate(['/']);
      });

    this.isFormEmpty = true;
  }

}
