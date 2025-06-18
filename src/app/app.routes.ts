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

export const routes: Routes = [

    { path: 'catalog', component: CatalogComponent, title: 'My Catalog products' },
    { path: 'product-details/:id', component: ProductDetailsComponent, title: 'Product details'},
    { path: 'stock-monitoring', component: StockMonitoringComponent, title: 'Stock Monitoring', canActivate: [AuthGuard, AdminGuard] },
    { path: 'signin', component: SigninComponent, title: 'My signin page' },
    { path: 'signup', component: SignupComponent, title: 'My signup page' },
    { path: 'profil', component: ProfileComponent, title: 'My profile page', canActivate: [AuthGuard] },
    { path: 'user-management', component: UserManagementComponent, title: 'Users Management', canActivate: [AuthGuard, AdminGuard] },
    { path: 'shopping-cart', component: ShoppingCartComponent, title: 'My shopping cart' },
    { path: 'order-page', component: OrderPageComponent, title: 'My order page',  canActivate: [AuthGuard] },
    { path: 'order-details/:id', component: OrderDetailsComponent, title: 'Order Details', canActivate: [AuthGuard] },
    { path: 'navbar', component: SearchBarComponent, title: 'My navbar' },
    { path: 'search', component: SearchBarComponent, title: 'Search' },
    { path: 'map', component: MapComponent, title: 'My map', canActivate: [AuthGuard]},
    { path: '', redirectTo: '/catalog', pathMatch: 'full' }, // optional default
    { path: '**', redirectTo: '/catalog' } // optional fallback

];
