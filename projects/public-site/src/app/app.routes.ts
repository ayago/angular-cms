import { Routes } from '@angular/router';
import { pageDataResolver } from './resolvers/page-data.resolver';

export const routes: Routes = [
  {
    path: '',
    resolve: {
      pageData: pageDataResolver
    },
    children: [
      {
        path: '',
        loadComponent: () => import('./pages/home/home.component').then(m => m.HomeComponent)
      },
      {
        path: ':slug',
        loadComponent: () => import('./pages/page/page.component').then(m => m.PageComponent)
      }
    ]
  }
];
