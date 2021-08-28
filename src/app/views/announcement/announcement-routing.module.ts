import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { AnnouncementListComponent } from './announcement-list/announcement-list.component';
import { CommonPhraseListComponent } from './common-phrase-list/common-phrase-list.component';

const routes: Routes = [
  {
    path: '',
    data: {
      title: 'Convocatorias'
    },
    children: [
      {
        path: '',
        redirectTo: 'list'
      },
      {
        path: 'list',
        component: AnnouncementListComponent,
        data: {
          title: 'Lista'
        }
      },
      {
        path: 'commonPhrases',
        component: CommonPhraseListComponent,
        data: {
          title: 'Frases comúnes'
        }
      }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AnnouncementRoutingModule {}
