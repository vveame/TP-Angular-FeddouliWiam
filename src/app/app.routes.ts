import { Routes } from '@angular/router';
import { CatalogComponent } from '../catalog-component/catalog.component';
import { ProductDetailsComponent } from '../product-details-component/product-details.component';
import { SigninComponent } from '../signin/signin.component';

export const routes: Routes = [

    { path: 'catalog', component: CatalogComponent, title: 'My Catalog products' },
    { path: 'product-details/:id', component: ProductDetailsComponent, title: 'Product details' },
    { path: 'signin', component: SigninComponent, title: 'My signin page' },
    { path: '', redirectTo: '/catalog', pathMatch: 'full' }, // optional default
    { path: '**', redirectTo: '/catalog' } // optional fallback

];
