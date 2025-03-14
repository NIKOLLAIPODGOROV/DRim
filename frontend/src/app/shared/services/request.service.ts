import { Injectable } from '@angular/core';
import {DefaultResponseType} from "../../../types/default-response.type";
import {RequestsType} from "../../../types/requests.type";
import {environment} from "../../../environments/environment";
import {Observable} from "rxjs";
import {HttpClient} from "@angular/common/http";

@Injectable({
  providedIn: 'root'
})
export class RequestService {

  constructor(private http: HttpClient) {
  }

  // createAuthRequest(params: RequestsType): Observable<DefaultResponseType> {
  //   return this.http.post<DefaultResponseType>(environment.api + 'requests', params, {withCredentials: true});
  // }

  createRequest(params: RequestsType): Observable<DefaultResponseType> {
    return this.http.post<DefaultResponseType>(environment.api + 'requests', params);
  }

}

