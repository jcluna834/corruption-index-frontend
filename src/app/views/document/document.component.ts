import { Component, OnInit, ViewChild } from '@angular/core';
import { DocumentListComponent } from './document-list/document-list.component';

@Component({
  templateUrl: 'document.component.html',
  selector: 'document',
})
export class DocumentComponent implements OnInit {

  @ViewChild('documentList', { static: false })
  documentList: DocumentListComponent;

  constructor() {
  }

  ngOnInit(): void {
  }
}
