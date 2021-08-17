import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ColorsComponent } from './colors.component';
import { AnnouncementListComponent } from './announcement-list/announcement-list.component';

const routes: Routes = [
  {
    path: '',
    data: {
      title: 'Announcement'
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
          title: 'list'
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
