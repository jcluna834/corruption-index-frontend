import { Component, OnInit, AfterViewInit, ViewChild } from '@angular/core';
import { getStyle, hexToRgba } from '@coreui/coreui/dist/js/coreui-utilities';
import { CustomTooltips } from '@coreui/coreui-plugin-chartjs-custom-tooltips';
import { PlagiarismDetectionManagerService } from './../../services/managers/plagiarism-detection.manager';
import { DocumentListComponent } from './document-list/document-list.component';

@Component({
  templateUrl: 'document.component.html',
  selector: 'document',
})
export class DocumentComponent implements OnInit {

  @ViewChild('documentList', { static: false })
  documentList: DocumentListComponent;

  constructor( private plagiarismDetectionService: PlagiarismDetectionManagerService ) {
  }

  public reportsItems: any;
  public docsItems: any;

  ngOnInit(): void {
  }
}
