import { Routes } from '@angular/router';
import { CatalogComponent } from '../catalog/catalog.component';
import { ProductDetailsComponent } from '../product-details/product-details.component';
import { SigninComponent } from '../signin/signin.component';
import { ShoppingCartComponent } from '../shopping-cart/shopping-cart.component';
import { SearchBarComponent } from '../search-bar/search-bar.component';
import { SignupComponent } from '../signup/signup.component';
import { RenderMode } from '@angular/ssr';

export const routes: Routes = [

    { path: 'catalog', component: CatalogComponent, title: 'My Catalog products' },
    { path: 'product-details/:id', component: ProductDetailsComponent, title: 'Product details'},
    { path: 'signin', component: SigninComponent, title: 'My signin page' },
    { path: 'signup', component: SignupComponent, title: 'My signup page' },
    { path: 'shopping-cart', component: ShoppingCartComponent, title: 'My shopping cart' },
    { path: 'navbar', component: SearchBarComponent, title: 'My navbar' },
    { path: 'search', component: SearchBarComponent, title: 'Search' },
    { path: '', redirectTo: '/catalog', pathMatch: 'full' }, // optional default
    { path: '**', redirectTo: '/catalog' } // optional fallback

];
