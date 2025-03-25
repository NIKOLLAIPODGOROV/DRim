import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { UserRoutingModule } from './user-routing.module';
import { SignupComponent } from './signup/signup.component';
import {LoginComponent} from "./login/login.component";
import {FormsModule, ReactiveFormsModule} from "@angular/forms";
import {SharedModule} from "../../shared/shared.module";
import {PrivacyPolicyComponent} from "./privacy-policy/privacy-policy.component";
import {MatIconModule} from '@angular/material/icon';

export class AppModule {}


@NgModule({
  declarations: [
    LoginComponent,
    SignupComponent,
    PrivacyPolicyComponent,
  ],
  imports: [
    CommonModule,
    SharedModule,
    FormsModule,
    ReactiveFormsModule,
    UserRoutingModule,
    MatIconModule,
  ]
})
export class UserModule { }
