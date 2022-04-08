import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { EconomicProposalComponent } from './economic-proposal.component';

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
      }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class EconomicProposalRoutingModule {}