import { Component, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { BidRiggingManagerService } from './../../../services/managers/bidRigging.manager';
import { Pipe } from '@angular/core';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { ComfirmPopupComponent } from '../../comfirm-popup/comfirm-popup.component';
import { SimilarDocument } from '../../../models/similarDocument';
import { ReportAnalysis } from '../../../models/reportAnalysis';


@Pipe({name: 'functionCaller'})
export class FunctionCallerPipe {
    transform(func: any, args: any[]): any {
        return func(args);
    }
}

@Component({
  selector: 'app-bidRigging-analisis',
  templateUrl: './economic-bidRigging-analisis.component.html',
  styleUrls: ['./economic-bidRigging-analisis.component.css']
})

export class BidRiggingAnalisisComponent implements OnInit {
  
  //Variables para reporte global
  private routeSub: Subscription;
  public bsModalRef: BsModalRef;
  public similarDocument: SimilarDocument;
  public reportAnalysis: ReportAnalysis;
  
  constructor(private route: ActivatedRoute,
    private bidRiggingManagerService: BidRiggingManagerService,
    private modalService: BsModalService,
    private router: Router,
    private sanitizer: DomSanitizer) {
      this.similarDocument = new SimilarDocument();
      this.reportAnalysis = new ReportAnalysis();
    }
  
  private reportID: string;
  private infoReport: any;
  private announcementInfo: any;
  private reportProducts: any;
  private reportTotals: any;
  private reportLexRank: any = [];
  private docsIds: any = [];
  private reportDate: string;

  private announcementName: string;

  private styleBadge = `<style>
    .badge-amarillo {
      color: #23282c;
      background-color: #fffb07;
    }

    .badge {
      font-size: 90% !important;
    }

    .badge-naranja {
      color: #23282c;
      background-color: #eb8b32;
    }

    .badge-rojo {
      color: #23282c;
      background-color: #f73c3c;
    }</style>`;

  async ngOnInit() {
    this.routeSub = this.route.params.subscribe(params => {
      this.reportID = params['id'];
    });
    await this.getReportInfo();
    await this.getAnnouncementInfo(this.infoReport.announcementCode);
    this.announcementName = this.announcementInfo.name;
  }

  async ngAfterViewInit() {
  }

  async getReportInfo(){
    const infoReport = await this.bidRiggingManagerService.getReportBidRiggingByID(this.reportID);
    this.infoReport = infoReport.data[0];
    if(this.infoReport.productsAnalysis){
      this.reportProducts = 
      this.infoReport.productsAnalysis
      .map(x =>{
        return{
          PROD_ID: x.PROD_ID,
          PROD_NAME: x.PROD_NAME,
          MAX: Math.max(...x.PROD_LIST).toFixed(2),
          MIN: Math.min(...x.PROD_LIST).toFixed(2),
          AVG: this.calculateAVG(x.PROD_LIST).toFixed(2),
          VariationCoeff: (x.Anaylis.VariationCoeff * 100).toFixed(2),
          KurtosisCoeff: x.Anaylis.KurtosisCoeff.toFixed(2),
          PercentageDifference:(x.Anaylis.PercentageDifference * 100).toFixed(2),
          RelativeDifference: x.Anaylis.RelativeDifference.toFixed(2),
          NormalizeRelativeDifference: x.Anaylis.NormalizeRelativeDifference.toFixed(2),
        }
      })
      this.reportDate = this.infoReport.AnalysisDate
      this.reportTotals = this.infoReport.totalAnalysis
      this.infoReport.documentsProbabilityLexRank
      .map(x =>{
        this.docsIds.push(x.docId)
      })
      
      const responseDocs = await this.bidRiggingManagerService.getDocsList(this.docsIds);
      
      console.log(this.infoReport.documentsProbabilityLexRank)
      for (var i = 0; i < responseDocs.length; i++) {
        console.log(responseDocs[i]["documentId"])
        var probabilityLexRank = 0
        for (var j = 0; j < this.infoReport.documentsProbabilityLexRank.length; j++) {
          if(this.infoReport.documentsProbabilityLexRank[i]["docId"] == responseDocs[i]["documentId"]){
            probabilityLexRank = this.infoReport.documentsProbabilityLexRank[i]["probabilityLexRank"]
          }
        }
        console.log("doc: ", probabilityLexRank)

        this.reportLexRank.push({
          documentId: responseDocs[i]["documentId"],
          documentName: responseDocs[i]["title"],
          probabilityLexRank: probabilityLexRank
        }) 
      }

      for (var key in this.reportTotals) {
        if(key == "VariationCoeff" || key == "PercentageDifference"){
          this.reportTotals[key] = (this.reportTotals[key] * 100).toFixed(2)
        }else{
          this.reportTotals[key] = this.reportTotals[key].toFixed(2)
        }
      }
    }
  }

  calculateAVG(list){
    const sum = list.reduce((a, b) => a + b, 0);
    const avg = (sum / list.length) || 0;
    return avg
  }

  async getAnnouncementInfo(announcementCode){
    const response = await this.bidRiggingManagerService.getAnnouncementInfo(announcementCode);
    this.announcementInfo = response.data;
  }

  modalAnalisis(selectedItem: any){
    this.similarDocument.id = selectedItem.id;
    this.similarDocument.similarDocumentCode = selectedItem.documentId;
    this.similarDocument.analysisDocumentCode = this.announcementInfo.id;
    const message = "Está a punto de iniciar el análisis de similitud de documentos, esto puede tardar varios minutos, un correo se le enviará cuando el proceso termine"
    this.showModalAnalysis("Iniciar Análisis de similitud", message, '', false, false, true);
  }

  showAnalysis(selectedItem: any){
    let url = `#/document/similarityAnalysis/`+selectedItem.collectionCode;
    this.router.navigate([]).then(result => { window.open(url, '_blank'); })
  }

  showModalAnalysis(title, msg, modalType='', reload=false, hiddeBtnCancel=true, isAnalysis=false) {
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
