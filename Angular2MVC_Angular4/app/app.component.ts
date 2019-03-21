import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { AuthenticationService } from './Service/Login/auth.service';
import { AuthGuard } from './Components/Login/Guard/auth.guard';

@Component({
    selector: "user-app",
    template: `<div>
                    <nav [hidden]='!isLoggedIn' class='navbar navbar-inverse'>
                        <div class='container-fluid'>
                            <ul class='nav navbar-nav' style="font-size:17px;">
                                <li><a [routerLink]="['user']">Users</a></li>
                                <li><a [routerLink]="['company']">Companies</a></li>
                                <li ><a [routerLink]="['product']">Products</a></li>
                                <li style="margin-left:520px;"><a><b>Welcome {{ userDetails.FirstName}} !</b></a></li>
                                <li *ngIf="userDetails.UserRole==2 || userDetails.UserRole==3" style="color:white;padding-top:2px;"><span href=# [routerLink]="['cart']"><img title="Go To Cart" src="../../images/Cart.png" style="width:50px;height:50px;"/><u>Cart</u></span> | <span href=# (click)="logout()"><u title="Logout">Logout</u></span></li>
                                <li *ngIf="userDetails.UserRole!=2 && userDetails.UserRole!=3" style="color:white;padding-top:13px;"><span href=# (click)="logout()"><u title="Logout">Logout</u></span></li>
                            </ul>
                        </div>
                    </nav>
                   
                    <div class='container'>
                        <router-outlet></router-outlet>
                   </div>
                 </div>`
})

export class AppComponent implements OnInit {
    userDetails: any = {};
    isLoggedIn = false;
    loggedMessage: string;
    cartCount: number=0;
    constructor(
        private authenticationService: AuthenticationService,
        private router: Router,
        private authGuard: AuthGuard

    ) { }

    ngOnInit() {

        if (this.authGuard.IsUserLoggedIn())
        {
            this.userDetails = this.authGuard.getUserAndUrlDetail();
            this.isLoggedIn = true;
            this.loggedMessage = "You are already logged in";
        }
            

    }

    logout() {
        this.authenticationService.logout();
        this.isLoggedIn = false;
        this.loggedMessage = "You are successfully logged out";
        this.router.navigate(['login']);
        window.location.reload();
    }
}

