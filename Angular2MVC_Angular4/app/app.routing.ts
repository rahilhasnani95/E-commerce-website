import { ModuleWithProviders } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { HomeComponent } from './Components/Home/home.component';
import { UserComponent } from './Components/User/user.component';
import { CompanyComponent } from './Components/Company/company.component';
import { ProductComponent } from './Components/Product/product.component';
import { LoginComponent } from './Components/Login/login.component';
import { CartComponent } from './Components/Cart/cart.component';
import { AuthGuard } from './Components/Login/Guard/auth.guard';


const appRoutes: Routes = [
    //{ path: '', redirectTo: 'home', pathMatch: 'full' },
    { path: '', component: UserComponent, canActivate: [AuthGuard] },
    { path: 'login', component: LoginComponent },
    { path: 'home', component: HomeComponent, canActivate: [AuthGuard]},
    { path: 'user', component: UserComponent, canActivate: [AuthGuard]},
    { path: 'company', component: CompanyComponent, canActivate: [AuthGuard]},
    { path: 'product', component: ProductComponent, canActivate: [AuthGuard] },
    { path: 'cart', component: CartComponent, canActivate: [AuthGuard] },
];

export const routing: ModuleWithProviders =
    RouterModule.forRoot(appRoutes);

