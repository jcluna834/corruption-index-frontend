import { Component, OnInit, ViewChild } from '@angular/core';
import { PlagiarismDetectionManagerService } from './../../../services/managers/plagiarism-detection.manager';
import { ModalCreateDocumentComponent } from './../modal-create-document/modal-create-document.component';
import { Document } from './../../../models/document';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { ComfirmPopupComponent } from '../../comfirm-popup/comfirm-popup.component';

@Component({
  selector: 'app-document-list',
  templateUrl: './document-list.component.html',
  styleUrls: ['./document-list.component.css']
})
export class DocumentListComponent implements OnInit {

  @ViewChild('modalCreateDocument', { static: false })
  modalCreateDocument: ModalCreateDocumentComponent;

  public document: Document;
  public bsModalRef: BsModalRef;
  public downloadFIileURL: string = "http://localhost:5000/api/v1/plagiarism/downloadFile/";

  constructor(private plagiarismDetectionService: PlagiarismDetectionManagerService,
    private modalService: BsModalService) {
    this.document = new Document();
   }

  public docsItems: any;

  ngOnInit(): void {
    this.getDocuments();
  }

  async getDocuments(){
    const lstReports = await this.plagiarismDetectionService.getDocs();
    if(lstReports){
      this.docsItems = lstReports.data.data.map(x =>{
        return{
          id: x.documentId,
          title: x.title,
          description: x.documentDescription,
          announcementCode: x.announcementCode,
          announcementName: x.announcementName,
          fileName: x.fileName,
          selected: false,
        }
      })
    }
  }

  addDocumnent(){
    console.log(this.modalCreateDocument);
    this.modalCreateDocument.showModalCreate();
  }

  editDocument(selectedItem: any){
    console.log("editar");
    this.document = selectedItem;
    this.modalCreateDocument.document = this.document;
    this.modalCreateDocument.setDocumentForm();
    this.modalCreateDocument.showModalEdit();
  }

  modalAnalisis(selectedItem: any){
    this.document.id = selectedItem.id;
    const message = "Está a puntio de iniciar el análisis de similitud de documentos, esto puede tardar varios minutos, un correo se le enviará cuando el proceso termine"
    this.showModalConfirm("Iniciar Análisis de similitud", message, '', false, false);

  }

  async deleteDocument(selectedItem: any){
    this.document.id = selectedItem.id;
    console.log("eliminar");
    //TODO: Implementar el endpoint - lógica que alerte si el doc tiene análisis y en dado caso eliminar del index (marcar como is_deleted = 1)

    /*await this.plagiarismDetectionService.deleteDocument(this.document).then(response => {
      if (response) {
        if (response.success) {
          this.showModalConfirm("Borrado exitoso", response.message, '', true);
        }
        else{
          this.showModalConfirm("Error al borrar", response.message, "danger");
        }
      }
    }).catch(error => {
      console.log(error);
    });*/
  }

  showModalConfirm(title, msg, modalType='', reload=false, hiddeBtnCancel=true) {
    this.bsModalRef = this.modalService.show(ComfirmPopupComponent, {
      class: 'modal-auto siigo-popup',
      ignoreBackdropClick: true,
      backdrop: 'static',
    });
    this.bsModalRef.content.setOption(
      {
        title: title,
        msgConfirm: msg,
        hideCloseButton: false,
        hideCancelButton: hiddeBtnCancel,
        confirmLabel: "Aceptar",
        modalType: modalType
      }
    );

    this.bsModalRef.content.responsePopup.subscribe(
      (confirm: boolean) => {
        if (confirm) {
          if(reload) location.reload();
        }
      }
    );
  }

}
