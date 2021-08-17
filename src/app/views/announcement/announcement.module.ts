// Angular
import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ModalModule } from 'ngx-bootstrap/modal';

import { ColorsComponent } from './colors.component';

// Announcement Routing
import { AnnouncementRoutingModule } from './announcement-routing.module';
import { ModalCreateAnnouncementComponent } from './modal-create-announcement/modal-create-announcement.component';
import { AnnouncementListComponent } from './announcement-list/announcement-list.component';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    AnnouncementRoutingModule,
    ModalModule.forRoot(),
    ReactiveFormsModule,
  ],
  declarations: [
    ColorsComponent, ModalCreateAnnouncementComponent, AnnouncementListComponent
  ],
  exports : [ModalCreateAnnouncementComponent, AnnouncementListComponent]
})
export class AnnouncementModule { }
