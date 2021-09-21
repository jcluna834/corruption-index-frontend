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
import { DocumentSimilarityAnalisisComponent, FunctionCallerPipe } from './document-similarity-analisis/document-similarity-analisis.component';
import { ModalSimilarityAnalisisListComponent } from './modal-similarity-analisis-list/modal-similarity-analisis-list.component';
import { AnnouncementModule } from './../announcement/announcement.module';
import { MatTableModule } from '@angular/material/table';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';

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
    ReactiveFormsModule,
    AnnouncementModule,
    MatTableModule,
    MatPaginatorModule,
    MatFormFieldModule,
    MatInputModule,
  ],
  declarations: [ 
    DocumentComponent, 
    ModalCreateDocumentComponent, 
    DocumentListComponent, 
    DocumentSimilarityAnalisisComponent, 
    ModalSimilarityAnalisisListComponent,
    FunctionCallerPipe,
  ],
  exports : [
    ModalCreateDocumentComponent, 
    DocumentListComponent, 
    DocumentSimilarityAnalisisComponent 
  ]
})
export class DocumentModule { }
