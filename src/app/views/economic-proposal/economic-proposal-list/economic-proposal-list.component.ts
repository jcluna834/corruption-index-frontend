import { Component, OnInit, ViewChild, EventEmitter, Output } from '@angular/core';
import { BidRiggingManagerService } from './../../../services/managers/bidRigging.manager';
import { ModalCreateEconomicProposalComponent } from './../modal-create-economic-proposal/modal-create-economic-proposal.component';
import { Document } from './../../../models/document';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from "@angular/material/table";
import { ComfirmPopupComponent } from '../../comfirm-popup/comfirm-popup.component';
import { ModalBidRiggingAnalisisListComponent } from './../modal-bidRigging-analisis-list/modal-bidRigging-analisis-list.component';

export interface DocumentElement {
  status: number;
  title: string;
  id: string;
  description: string;
  announcementName: string;
  fileName: string;
  options: string;
  analysis: string;
}

@Component({
  selector: 'app-economic-proposal-list',
  templateUrl: './economic-proposal-list.component.html',
  styleUrls: ['./economic-proposal-list.component.css']
})
export class EconomicProposalListComponent implements OnInit {

  @ViewChild('modalCreateDocument', { static: false })
  modalCreateDocument: ModalCreateEconomicProposalComponent;

  @ViewChild('modalAnalysisList', { static: false })
  modalAnalysisList: ModalBidRiggingAnalisisListComponent;
  
  @ViewChild('paginator', { static: false })
  paginator: MatPaginator;

  @ViewChild(MatSort) sort: MatSort;

  public document: Document;
  public bsModalRef: BsModalRef;
  public downloadFIileURL: string = "http://localhost:5001/api/v1/bidrigging/downloadFile/";
  public dataSource: any;
  public showList: boolean = false;
  public showBtnsAnalysis: boolean = false;
  public showConfirmMsg: boolean = false;
  public confirmMsg: string;
  public displayedColumns: string[];
  private announcementCode: number;

  constructor(
    private bidRiggingManagerService: BidRiggingManagerService,
    private modalService: BsModalService) {
    this.document = new Document();
    this.dataSource = new MatTableDataSource<DocumentElement>();
  }

  public docsItems: any;

  ngOnInit(): void {
    //this.getDocuments();
  }

  ngAfterViewInit() {
    this.paginator._intl.itemsPerPageLabel="Elementos por página";
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();

    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }

  setAnnouncementCode(announcementCode){
    this.announcementCode = announcementCode;
  }

  async getDocuments(){
    this.showBtnsAnalysis = false
    const lstReports = await this.bidRiggingManagerService.getDocs(this.announcementCode);
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
      if(this.docsItems.length > 0) this.showBtnsAnalysis = true
    }
    
    //Lógica para aplicar datatable en la tabla
    this.dataSource = new MatTableDataSource(this.docsItems);
    this.displayedColumns = ['status', 'title', 'description', /*'announcementName',*/ 'options'];
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
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

  async deleteDocument(selectedItem: any){
    this.document.id = selectedItem.id;
    console.log("eliminar");
  }
  
  modalAnalisis(selectedItem: any){
    this.document = selectedItem;
    const message = "Está a punto de iniciar el análisis de detección de manipulación de ofertas, esto puede tardar varios minutos, un correo se le enviará cuando el proceso termine"
    this.showModalConfirm("Iniciar Análisis de manipulación de ofertas", message, '', false, false, true);
  }

  async executeBidRiggingAnalisis(){
    let dataSend = {
      announcementCode: this.announcementCode
    }
    await this.bidRiggingManagerService.executeBidRiggingAnalisis(dataSend).then(response => {
      if (response) {
        if (response.status_code === 200) {
          this.showModalConfirm("Análisis generado exitosamente", 'El análisis fue generado exitosamente, puede ver los resultados en la opción "Ver análisis". ');
        }
        else{
          this.showModalConfirm("Error al generar el análisis", response.message, "danger");
        }
      }
    }).catch(error => {
      console.log(error);
      this.showModalConfirm("Error al generar el análisis", error, "danger");
    })
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
          if(isAnalysis) this.executeBidRiggingAnalisis();
          if(reload) location.reload();
        }
      }
    );
  }

  showModalListAnalysis(){
    this.modalAnalysisList.showModal(this.announcementCode);
  }

}
