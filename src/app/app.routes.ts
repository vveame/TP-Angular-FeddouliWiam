import { Routes } from '@angular/router';
import { CatalogComponent } from '../catalog/catalog.component';
import { ProductDetailsComponent } from '../product-details/product-details.component';
import { SigninComponent } from '../signin/signin.component';
import { ShoppingCartComponent } from '../shopping-cart/shopping-cart.component';
import { SearchBarComponent } from '../search-bar/search-bar.component';
import { SignupComponent } from '../signup/signup.component';
import { OrderPageComponent } from '../order-page/order-page.component';
import { MapComponent } from '../map/map.component';
import { ProfileComponent } from '../profile/profile.component';
import { OrderDetailsComponent } from '../order-details/order-details.component';
import { UserManagementComponent } from '../user-management/user-management.component';
import { AuthGuard } from '../guards/auth-guard';
import { AdminGuard } from '../guards/admin-guard';
import { StockMonitoringComponent } from '../stock-monitoring/stock-monitoring.component';
import { OfferManagementComponent } from '../offer-management/offer-management.component';

export const routes: Routes = [

    { path: 'catalog', component: CatalogComponent, title: 'Products Catalog' },
    { path: 'product-details/:id', component: ProductDetailsComponent, title: 'Product details'},
    { path: 'stock-monitoring', component: StockMonitoringComponent, title: 'Stock Monitoring', canActivate: [AuthGuard, AdminGuard] },
    { path: 'offers', component: OfferManagementComponent, title: 'Offers Management', canActivate: [AuthGuard, AdminGuard] },
    { path: 'signin', component: SigninComponent, title: 'Signin page' },
    { path: 'signup', component: SignupComponent, title: 'Signup page' },
    { path: 'profil', component: ProfileComponent, title: 'Profile page', canActivate: [AuthGuard] },
    { path: 'user-management', component: UserManagementComponent, title: 'Users Management', canActivate: [AuthGuard, AdminGuard] },
    { path: 'shopping-cart', component: ShoppingCartComponent, title: 'Shopping cart' },
    { path: 'order-page', component: OrderPageComponent, title: 'Order page',  canActivate: [AuthGuard] },
    { path: 'order-details/:id', component: OrderDetailsComponent, title: 'Order Details', canActivate: [AuthGuard] },
    { path: 'navbar', component: SearchBarComponent, title: 'Navbar' },
    { path: 'search', component: SearchBarComponent, title: 'Search' },
    { path: 'map', component: MapComponent, title: 'Map', canActivate: [AuthGuard]},
    { path: '', redirectTo: '/catalog', pathMatch: 'full' }, // optional default
    { path: '**', redirectTo: '/catalog' } // optional fallback

];
