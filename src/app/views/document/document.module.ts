import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ChartsModule } from 'ng2-charts';
import { BsDropdownModule } from 'ngx-bootstrap/dropdown';
import { ButtonsModule } from 'ngx-bootstrap/buttons';
import { AlertModule } from 'ngx-bootstrap/alert';

import { DocumentComponent } from './document.component';
import { DocumentRoutingModule } from './document-routing.module';
import { CommonModule } from '@angular/common';
import { ModalModule } from 'ngx-bootstrap/modal';
import { ModalCreateDocumentComponent } from './modal-create-document/modal-create-document.component';
import { DocumentListComponent } from './document-list/document-list.component';
import { DocumentSimilarityAnalisisComponent } from './document-similarity-analisis/document-similarity-analisis.component';
import { ModalSimilarityAnalisisListComponent } from './modal-similarity-analisis-list/modal-similarity-analisis-list.component';


@NgModule({
  imports: [
    FormsModule,
    DocumentRoutingModule,
    ChartsModule,
    BsDropdownModule,
    CommonModule,
    ButtonsModule.forRoot(),
    ModalModule.forRoot(),
    AlertModule.forRoot(),
    ReactiveFormsModule
  ],
  declarations: [ DocumentComponent, ModalCreateDocumentComponent, DocumentListComponent, DocumentSimilarityAnalisisComponent, ModalSimilarityAnalisisListComponent ],
  exports : [ModalCreateDocumentComponent, DocumentListComponent, DocumentSimilarityAnalisisComponent ]
})
export class DocumentModule { }
