import { Injectable } from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {UserInfoType} from "../../../types/user-info.type";
import {DefaultResponseType} from "../../../types/default-response.type";
import {Observable} from "rxjs";
import {environment} from "../../../environments/environment";
import {LoginResponseType} from "../../../types/login-response.type";
import {AuthService} from "../../core/auth/auth.service";

@Injectable({
  providedIn: 'root'
})
export class UserService {

  constructor(private http: HttpClient, private authService: AuthService) {

    const tokens = this.authService.getTokens();}

  getUserInfo(): Observable<UserInfoType | DefaultResponseType> {
    return this.http.get<UserInfoType | DefaultResponseType>(environment.api + 'users');
  }


  updateUserInfo(params: UserInfoType): Observable<DefaultResponseType> {
    return this.http.post<DefaultResponseType>(environment.api + 'users', params);
  }

  }
