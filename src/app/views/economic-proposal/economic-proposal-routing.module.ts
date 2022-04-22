import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { EconomicProposalComponent } from './economic-proposal.component';
import { BidRiggingAnalisisComponent } from './economic-bidRigging-analisis/economic-bidRigging-analisis.component';

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
        path: 'economics',
        component: EconomicProposalComponent,
        data: {
          title: 'Económicas'
        }
      },
      {
        path: 'bidRiggingAnalysis/:id',
        component: BidRiggingAnalisisComponent,
        data: {
          title: 'Análisis de manipulación de ofertas'
        }
      }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class EconomicProposalRoutingModule {}