import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { DocumentComponent } from './document.component';
import { DocumentSimilarityAnalisisComponent } from './document-similarity-analisis/document-similarity-analisis.component';

const routes: Routes = [
  {
    path: '',
    data: {
      title: 'Propuestas'
    },
    children: [
      {
        path: '',
        redirectTo: 'list',
        pathMatch: 'full'
      },
      {
        path: 'technical',
        component: DocumentComponent,
        data: {
          title: 'Lista'
        }
      },
      {
        path: 'similarityAnalysis/:id',
        component: DocumentSimilarityAnalisisComponent,
        data: {
          title: 'Análisis de similitud'
        }
      }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class DocumentRoutingModule {}
