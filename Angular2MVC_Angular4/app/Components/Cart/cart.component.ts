import { Component, OnInit, ViewChild } from '@angular/core';
import { UserService } from '../../Service/User/user.service';
import { Router, ActivatedRoute } from '@angular/router';
import { Cart } from '../../Model/Cart/cart';
import { IUser } from '../../Model/User/user';
import { DBOperation, Roles } from '../../Shared/enum';
import { Observable } from 'rxjs/Rx';
import { Global } from '../../Shared/global';
import { AuthGuard } from '../../Components/Login/Guard/auth.guard';

@Component({
    templateUrl: 'app/Components/Cart/cart.component.html'
})

export class CartComponent implements OnInit {
    constTax: number = 0.08;
    shipping: number = 0.01;
    cartList: Cart[];
    allCartItems: Cart[];
    cart: Cart;
    subTotalPrice: number = 0;
    loggedInUserDetails: IUser = this.authGuard.getUserAndUrlDetail();
   

    constructor(private _userService: UserService, private authGuard: AuthGuard, private router: Router) { }

    ngOnInit(): void {
      
        this.allCartItems =  JSON.parse(localStorage.getItem('cartItems'));
        if (this.allCartItems && this.allCartItems.filter(o => o.UserId == this.loggedInUserDetails.Id))
        {
            this.cartList = this.allCartItems.filter(o => o.UserId == this.loggedInUserDetails.Id);
            this.calculateTotalCost(this.cartList);
        }
            
        
    }
    quantityChanged(item: Cart, event: any): void {
        var val = event.target.value;
        if (Number.isNaN(val) || val <= 0)
            event.target.value = 1;
       
        for (var i = 0; i < this.allCartItems.length; i++) {
            if ((this.allCartItems[i].ProductID == item.ProductID) && (this.allCartItems[i].UserId == item.UserId)) {
                this.allCartItems[i].Quantity = parseInt(event.target.value);
                //break;
            }
        }
        this.cartList = this.allCartItems.filter(o => o.UserId == this.loggedInUserDetails.Id);
        this.calculateTotalCost(this.cartList);
        localStorage.setItem('cartItems', JSON.stringify(this.allCartItems));
    }
   
    removeFromCart(item: Cart): void {
        debugger;
        var itemIndex = this.allCartItems.indexOf(item);
        this.allCartItems.splice(itemIndex, 1); 
        this.cartList = this.allCartItems.filter(o => o.UserId == this.loggedInUserDetails.Id);
        this.calculateTotalCost(this.cartList);
        localStorage.setItem('cartItems', JSON.stringify(this.allCartItems));
    }
    continueShopping(): void {
        this.router.navigate(['/product']);
    }
    calculateTotalCost(cartList: Cart[]): void {
        this.subTotalPrice = 0;
        for (var i = 0; i < cartList.length; i++) {
            this.subTotalPrice += cartList[i].Quantity * cartList[i].Price;
        }
    }
    ConvertToPO() {
        var iye = localStorage.getItem('cartItems');
    }
   
}