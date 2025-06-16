import { RenderMode, ServerRoute } from '@angular/ssr';

export const serverRoutes: ServerRoute[] = [
  { path: '', renderMode: RenderMode.Prerender },
  { path: 'catalog', renderMode: RenderMode.Prerender },
  { path: 'product-details/:id', renderMode: RenderMode.Server }, // SSR at request time
  { path: 'signin', renderMode: RenderMode.Prerender },
  { path: 'signup', renderMode: RenderMode.Prerender },
  { path: 'profile', renderMode: RenderMode.Server },
  { path: 'shopping-cart', renderMode: RenderMode.Prerender },
  { path: 'order', renderMode: RenderMode.Prerender },
  { path: 'navbar', renderMode: RenderMode.Prerender },
  { path: 'search', renderMode: RenderMode.Prerender },
  { path: 'map', renderMode: RenderMode.Client }, // Client-side rendering for interactive map
  { path: '**', renderMode: RenderMode.Server }
];
