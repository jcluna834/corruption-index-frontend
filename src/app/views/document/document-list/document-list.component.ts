import { Component, OnInit, ViewChild, EventEmitter, Output } from '@angular/core';
import { PlagiarismDetectionManagerService } from './../../../services/managers/plagiarism-detection.manager';
import { DocumentManagerService } from './../../../services/managers/document.manager';
import { ModalCreateDocumentComponent } from './../modal-create-document/modal-create-document.component';
import { ModalSimilarityAnalisisListComponent } from './../modal-similarity-analisis-list/modal-similarity-analisis-list.component';
import { Document } from './../../../models/document';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { ComfirmPopupComponent } from '../../comfirm-popup/comfirm-popup.component';
import { interval, Subscription, timer } from 'rxjs';
import { Router } from '@angular/router';


@Component({
  selector: 'app-document-list',
  templateUrl: './document-list.component.html',
  styleUrls: ['./document-list.component.css']
})
export class DocumentListComponent implements OnInit {

  @ViewChild('modalCreateDocument', { static: false })
  modalCreateDocument: ModalCreateDocumentComponent;

  @ViewChild('modalAnalysisList', { static: false })
  modalAnalysisList: ModalSimilarityAnalisisListComponent;

  //@Output() documentSimilarityAnalisis: EventEmitter<any> = new EventEmitter<any>();

  public timerSubscription: Subscription;

  public document: Document;
  public bsModalRef: BsModalRef;
  public downloadFIileURL: string = "http://localhost:5000/api/v1/plagiarism/downloadFile/";


  constructor(
    private documentManagerService: DocumentManagerService,
    private plagiarismDetectionService: PlagiarismDetectionManagerService,
    private modalService: BsModalService,
    private router: Router) {
    this.document = new Document();
  }

  public docsItems: any;
  public analysisHistoryItems: any; 

  /*ngOnInit(): void {
    this.getDocuments();
    this.getAnalysisHistory();
  }*/

  ngOnInit(): void {
    this.getDocuments();
    this.getAnalysisHistory();
    //Cada n tiempo se revisa que no existan documentos en proceso de análisis
    const source = interval(30000); //30 seconds
    this.timerSubscription = source.subscribe(val => this.getAnalysisHistory());
  }
  
  ngOnDestroy(): void {
    this.timerSubscription.unsubscribe();
  }

  loadData(){
    console.log("entro");
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
          status: x.status,
          selected: false,
        }
      })
    }
  }

  async getAnalysisHistory(){
    const lstAnalysisHistory = await this.plagiarismDetectionService.getAnalisisHistory();
    if(lstAnalysisHistory){
      this.analysisHistoryItems = lstAnalysisHistory.data.data.map(x =>{
        return{
          id: x.documentId,
          documentId: x.documentCode,
          collectionId: x.collectionCode,
          createdDate: x.created_date,
          documentName: x.title,
          announcementName: x.announcementName,
          AnalysisType: x.AnalysisType,
          AnalysisTypeDesc: x.AnalysisTypeDesc,
          status: x.status
        }
      })
    }
  }

  addDocumnent(){
    this.modalCreateDocument.showModalCreate();
  }

  editDocument(selectedItem: any){
    this.document = selectedItem;
    this.modalCreateDocument.document = this.document;
    this.modalCreateDocument.setDocumentForm();
    this.modalCreateDocument.showModalEdit();
  }

  modalAnalisis(selectedItem: any){
    this.document = selectedItem;
    const message = "Está a punto de iniciar el análisis de similitud de documentos, esto puede tardar varios minutos, un correo se le enviará cuando el proceso termine"
    this.showModalConfirm("Iniciar Análisis de similitud", message, '', false, false, true);
  }

  async indexDocument(selectedItem: any){
    this.document = selectedItem;
    await this.documentManagerService.indexDocument(this.document).then(response => {
      if (response) {
        if (response.status_code === 200) {
          this.showModalConfirm("Indexado exitoso", response.message, '');
        }
        else{
          this.showModalConfirm("Error al indexar", response.message, "danger");
        }
      }
    }).catch(error => {
      console.log(error);
      this.showModalConfirm("Error al indexar", "Error en endpoint", "danger");
    });
  }

  

  showModalListAnalysis(selectedItem: any){
    this.modalAnalysisList.showModal(selectedItem.id);
  }

  showDocumentAnalisis(selectedItem: any){
    let url = `#/document/similarityAnalysis/`+selectedItem.id;
    this.router.navigate([]).then(result => { window.open(url, '_blank'); })
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

  async executeSimilarityAnalisis(){
    this.plagiarismDetectionService.executeSimilarityAnalisis(this.document);
    setInterval(function(){ location.reload(); }, 1000);
  }

  showModalConfirm(title, msg, modalType='', reload=false, hiddeBtnCancel=true, isAnalysis=false) {
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
          if(isAnalysis) this.executeSimilarityAnalisis();
          if(reload) location.reload();
        }
      }
    );
  }

}
