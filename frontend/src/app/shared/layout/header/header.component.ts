import {Component, OnDestroy, OnInit} from '@angular/core';
import {AuthService} from "../../../core/auth/auth.service";
import {MatSnackBar} from "@angular/material/snack-bar";
import {Router} from "@angular/router";
import {DefaultResponseType} from "../../../../types/default-response.type";
import {HttpErrorResponse} from "@angular/common/http";
// import {LoaderService} from "../../services/loader.service";
import {UserInfoType} from "../../../../types/user-info.type";
import {UserService} from "../../services/user.service";
import {Subscription} from "rxjs";

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit, OnDestroy  {

  isLogged: boolean = false;
  user!: UserInfoType;

  constructor(private authService: AuthService,
              private _snackBar: MatSnackBar,
              private router: Router,
              private userService: UserService,
             //  private loaderService: LoaderService,
              ) {
    this.isLogged = this.authService.getIsLoggedIn();
  }

  private subscription: Subscription | null = null;

  ngOnInit(): void {
    // this.loaderService.show();
    this.authService.isLogged$.subscribe((isLoggedIn: boolean) => {
      this.isLogged = true;
    });

    this.subscription = this.userService.getUserInfo()
      .subscribe(data => {
       if (data) {
         this.user = data as UserInfoType;
       }
       console.log(this.user.name);
        this.isLogged = true;
      })
  }

  logout(): void {
    this.authService.logout()
      .subscribe({
        next: (data: DefaultResponseType) => {
          this.doLogout();
        },
        error: (error: HttpErrorResponse) => {
          this._snackBar.open('Разлогинен успешно');
          this.doLogout();
        }
      });
    this.isLogged = false;
  }

  doLogout(): void {
    this.authService.removeTokens();
    this.authService.userId = null;
    this.isLogged = false;
    this._snackBar.open('Разлогинен успешно');
    this.router.navigate(['/']);
  }

  ngOnDestroy() {
    this.subscription?.unsubscribe()
  }

}
