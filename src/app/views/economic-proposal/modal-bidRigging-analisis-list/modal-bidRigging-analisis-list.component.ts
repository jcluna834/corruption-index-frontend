import { Component, OnInit, ViewChild } from '@angular/core';
import { ModalDirective } from 'ngx-bootstrap/modal';
import { BidRiggingManagerService } from './../../../services/managers/bidRigging.manager';
import { Router } from '@angular/router';


@Component({
  selector: 'app-modal-bidRigging-analisis-list',
  templateUrl: './modal-bidRigging-analisis-list.component.html',
  styleUrls: ['./modal-bidRigging-analisis-list.component.css']
})
export class ModalBidRiggingAnalisisListComponent implements OnInit {

  @ViewChild('analysisListModal') public analysisListModal: ModalDirective;

  constructor( 
    private bidRiggingManagerService: BidRiggingManagerService,
    private router: Router ) { }

  public reportsItems: any;

  ngOnInit(): void {
  }

  showModal(announcementCode: any){
    this.getReports(announcementCode);
    this.analysisListModal.show();
  }

  async getReports(announcementCode: any){
    this.reportsItems = []
    const lstReports = await this.bidRiggingManagerService.getReportsBidRiggingByAnnouncement(announcementCode);
    if(lstReports){
      this.reportsItems = lstReports.data.map(x =>{
        return{
          id: x._id,
          AnalysisDate: x.AnalysisDate
        }
      })
    }
  }

  showDocumentAnalysis(selectedItem: any){
    let url = `#/economicProposal/bidRiggingAnalysis/`+selectedItem.id;
    this.router.navigate([]).then(result => { window.open(url, '_blank'); })
  }

}
