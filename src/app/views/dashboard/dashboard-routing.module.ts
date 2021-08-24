import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { DashboardComponent } from './dashboard.component';
import { DocumentSimilarityAnalisisComponent } from './document-similarity-analisis/document-similarity-analisis.component';

const routes: Routes = [
  {
    path: '',
    data: {
      title: 'Dashboard'
    },
    children: [
      {
        path: '',
        redirectTo: 'list',
        pathMatch: 'full'
      },
      {
        path: 'list',
        component: DashboardComponent,
        data: {
          title: 'list'
        }
      },
      {
        path: 'similarityAnalysis/:id',
        component: DocumentSimilarityAnalisisComponent,
        data: {
          title: 'similarityAnalysis'
        }
      }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class DashboardRoutingModule {}
