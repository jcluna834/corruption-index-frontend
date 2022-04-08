import { Component, OnInit, ViewChild, EventEmitter, Output } from '@angular/core';
import { BidRiggingManagerService } from './../../../services/managers/bidRigging.manager';
import { ModalCreateEconomicProposalComponent } from './../modal-create-economic-proposal/modal-create-economic-proposal.component';
import { Document } from './../../../models/document';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { ComfirmPopupComponent } from '../../comfirm-popup/comfirm-popup.component';
import { interval, Subscription, timer } from 'rxjs';
import { Router } from '@angular/router';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from "@angular/material/table";

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
  
  @ViewChild('paginator', { static: false })
  paginator: MatPaginator;

  @ViewChild(MatSort) sort: MatSort;

  public document: Document;
  public bsModalRef: BsModalRef;
  public downloadFIileURL: string = "http://localhost:5001/api/v1/bidrigging/downloadFile/";
  public dataSource: any;
  public displayedColumns: string[];

  constructor(
    private bidRiggingManagerService: BidRiggingManagerService,
    private modalService: BsModalService) {
    this.document = new Document();
    this.dataSource = new MatTableDataSource<DocumentElement>();
  }

  public docsItems: any;

  ngOnInit(): void {
    this.getDocuments();
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

  async getDocuments(){
    const lstReports = await this.bidRiggingManagerService.getDocs();
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
    
    //Lógica para aplicar datatable en la tabla
    this.dataSource = new MatTableDataSource(this.docsItems);
    this.displayedColumns = ['status', 'title', 'description', 'announcementName', 'options', 'analysis'];
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

}
