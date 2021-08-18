import { Component, OnInit, ViewChild } from '@angular/core';
import { PlagiarismDetectionManagerService } from './../../../services/managers/plagiarism-detection.manager';
import { ModalCreateDocumentComponent } from './../modal-create-document/modal-create-document.component';

@Component({
  selector: 'app-document-list',
  templateUrl: './document-list.component.html',
  styleUrls: ['./document-list.component.css']
})
export class DocumentListComponent implements OnInit {

  @ViewChild('modalCreateDocument', { static: false })
  modalCreateDocument: ModalCreateDocumentComponent;

  constructor(private plagiarismDetectionService: PlagiarismDetectionManagerService) { }

  public docsItems: any;

  ngOnInit(): void {
    this.getDocuments();
  }

  async getDocuments(){
    const lstReports = await this.plagiarismDetectionService.getDocs();
    if(lstReports){
      this.docsItems = lstReports.data.data.map(x =>{
        return{
          id: x.id,
          title: x.title,
          description: x.description,
          selected: false,
        }
      })
    }
  }

  addDocumnent(){
    console.log(this.modalCreateDocument);
    this.modalCreateDocument.showModal();
  }

}
