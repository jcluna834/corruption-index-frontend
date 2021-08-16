import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ChartsModule } from 'ng2-charts';
import { BsDropdownModule } from 'ngx-bootstrap/dropdown';
import { ButtonsModule } from 'ngx-bootstrap/buttons';

import { DashboardComponent } from './dashboard.component';
import { DashboardRoutingModule } from './dashboard-routing.module';
import { CommonModule } from '@angular/common';
import { ModalModule } from 'ngx-bootstrap/modal';
import { ModalCreateDocumentComponent } from './../modal-create-document/modal-create-document.component';
import { DocumentListComponent } from './../document-list/document-list.component';

@NgModule({
  imports: [
    FormsModule,
    DashboardRoutingModule,
    ChartsModule,
    BsDropdownModule,
    CommonModule,
    ButtonsModule.forRoot(),
    ModalModule.forRoot(),
    ReactiveFormsModule,
  ],
  declarations: [ DashboardComponent, ModalCreateDocumentComponent, DocumentListComponent ],
  exports : [ModalCreateDocumentComponent, DocumentListComponent]
})
export class DashboardModule { }
