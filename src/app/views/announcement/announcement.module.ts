// Angular
import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ModalModule } from 'ngx-bootstrap/modal';
import { AlertModule } from 'ngx-bootstrap/alert';
import { ColorsComponent } from './colors.component';

// Announcement Routing
import { AnnouncementRoutingModule } from './announcement-routing.module';
import { ModalCreateAnnouncementComponent } from './modal-create-announcement/modal-create-announcement.component';
import { AnnouncementListComponent } from './announcement-list/announcement-list.component';
import { CommonPhraseListComponent } from './common-phrase-list/common-phrase-list.component';
import { ModalCreateCommonPhraseComponent } from './modal-create-common-phrase/modal-create-common-phrase.component';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    AnnouncementRoutingModule,
    ModalModule.forRoot(),
    AlertModule.forRoot(),
    ReactiveFormsModule,
  ],
  declarations: [
    ColorsComponent, ModalCreateAnnouncementComponent, AnnouncementListComponent, CommonPhraseListComponent, ModalCreateCommonPhraseComponent
  ],
  exports : [ModalCreateAnnouncementComponent, AnnouncementListComponent]
})
export class AnnouncementModule { }
