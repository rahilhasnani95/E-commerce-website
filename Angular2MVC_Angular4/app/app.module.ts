import { NgModule } from '@angular/core';
import { APP_BASE_HREF } from '@angular/common';
import { BrowserModule } from '@angular/platform-browser';

import { AppComponent } from './app.component';
import { Ng2Bs3ModalModule } from 'ng2-bs3-modal/ng2-bs3-modal';
import { HttpModule } from '@angular/http';
import { routing } from './app.routing';
import { UserService } from './Service/User/user.service'
import { UserComponent } from './Components/User/user.component';
import { HomeComponent } from './Components/Home/home.component';
import { CompanyService } from './Service/Company/company.service';
import { CompanyComponent } from './Components/Company/company.component';
import { ProductService } from './Service/Product/product.service';
import { ProductComponent } from './Components/Product/product.component';

import { UserFilterPipe } from './Components/filter/user.pipe';
import { ProductFilterPipe } from './Components/filter/product.pipe';
import { SearchComponent } from './Components/Search/search.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { LoginComponent } from './Components/Login/login.component';
import { AuthenticationService } from './Service/Login/auth.service';
import { AuthGuard } from './Components/Login/Guard/auth.guard';

import { CartComponent } from './Components/Cart/cart.component';


@NgModule({
    imports: [BrowserModule, ReactiveFormsModule, FormsModule, HttpModule, routing, Ng2Bs3ModalModule],
    declarations: [AppComponent, UserComponent, HomeComponent, CompanyComponent, ProductComponent, UserFilterPipe, ProductFilterPipe, SearchComponent, LoginComponent, CartComponent],
    providers: [{ provide: APP_BASE_HREF, useValue: '/' }, UserService, CompanyService, ProductService, AuthGuard, AuthenticationService],
    bootstrap: [AppComponent]

})


export class AppModule { }
