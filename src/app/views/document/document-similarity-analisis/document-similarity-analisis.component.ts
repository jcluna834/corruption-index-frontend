import { Component, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { PlagiarismDetectionManagerService } from './../../../services/managers/plagiarism-detection.manager';
import { Pipe } from '@angular/core';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
import { ModalCreateCommonPhraseComponent } from './../../../views/announcement/modal-create-common-phrase/modal-create-common-phrase.component';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { ComfirmPopupComponent } from '../../comfirm-popup/comfirm-popup.component';
import { SimilarDocument } from '../../../models/similarDocument';
import { ReportAnalysis } from '../../../models/reportAnalysis';
import { GlobalConstants } from '../../../common/global-constants';


@Pipe({name: 'functionCaller'})
export class FunctionCallerPipe {
    transform(func: any, args: any[]): any {
        return func(args);
    }
}

@Component({
  selector: 'app-document-similarity-analisis',
  templateUrl: './document-similarity-analisis.component.html',
  styleUrls: ['./document-similarity-analisis.component.css']
})

export class DocumentSimilarityAnalisisComponent implements OnInit {

  @ViewChild('modalCreateCommonPhrase', { static: false })
  modalCreateCommonPhrase: ModalCreateCommonPhraseComponent;

  //Variables para reporte global
  private paragraphLenght: number = 0;
  private paragraphSimilarityLenght: number = 0;
  private tokensQuantity: number = 0;
  private maxSimilarityQuantity: number = 0;
  private middleMaxSimilarityQuantity: number = 0;
  private middleMinSimilarityQuantity: number = 0;
  private minSimilarityQuantity: number = 0;
  private umbralSimilarity: number = GlobalConstants.umbral;
  private documentSimilarity: number = 0;
  private infoTableGlobal: any;
  
  //Variables para reporte global
  private routeSub: Subscription;
  private myStyle: SafeHtml;
  public bsModalRef: BsModalRef;
  public similarDocument: SimilarDocument;
  public reportAnalysis: ReportAnalysis;
  
  constructor(private route: ActivatedRoute,
    private plagiarismDetectionService: PlagiarismDetectionManagerService,
    private modalService: BsModalService,
    private router: Router,
    private sanitizer: DomSanitizer) {
      this.similarDocument = new SimilarDocument();
      this.reportAnalysis = new ReportAnalysis();
    }
  
  private reportID: string;
  private infoReport: any;
  private documentInfo: any;
  private reportsES: any;
  private similarDocs: any;
  private reportDate: string;

  private documentTitle: string;
  private similarDocumentTitle: string;

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
    this.myStyle = this.sanitizer.bypassSecurityTrustHtml(this.styleBadge);
    await this.getReports();
    await this.getReportAnalysisInfo();
    
    this.reportDate = this.infoReport.AnalysisDate;
    await this.getDocumentInfo(this.infoReport.documentID);
    this.documentTitle = this.documentInfo.title;
    this.getSimilarDocs();
    //Se contruye reporte global
    this.buildGlobalReport();
  }

  async ngAfterViewInit() {
  }

  async getReports(){
    const infoReport = await this.plagiarismDetectionService.getReportsSimilarityByID(this.reportID);
    this.infoReport = infoReport.data[0];
    if(this.infoReport.response_elastic){
      this.reportsES = 
      this.infoReport.response_elastic
      .filter(x => x.status == 0 && x.highlight[0].phrase_similarity_percentage > 0)
      .map(x =>{
        return{
          collectionId: this.reportID,
          paragraph_text: x.paragraph_text,
          similarity_percentage_ES: x.similarity_percentage,
          document: x.doc_,
          highlight: x.highlight,
        }
      })
    }
  }

  buildGlobalReport(){
    let similarity_percentage_acum = 0;
    this.paragraphLenght = this.infoReport.response_elastic.length;
    this.infoReport.response_elastic
      .filter(x => x.status == 0)
      .map(x =>{
        //Se arma reporte de cantidad por umbral this.umbralSimilarity
        const similarity_percentage = x.highlight[0].phrase_similarity_percentage;
        if(similarity_percentage>0) this.paragraphSimilarityLenght ++;

        if(similarity_percentage >= GlobalConstants.maxSimilarity){
          this.maxSimilarityQuantity ++;
        }else if(similarity_percentage >= GlobalConstants.middleSimilarity && similarity_percentage < GlobalConstants.maxSimilarity){
          this.middleMaxSimilarityQuantity ++;
        }else if(similarity_percentage >= GlobalConstants.umbral && similarity_percentage < GlobalConstants.middleSimilarity){
          this.middleMinSimilarityQuantity ++;
        }else{
          this.minSimilarityQuantity ++;
        }
        this.tokensQuantity += x.highlight[0].my_words.length
        similarity_percentage_acum += similarity_percentage
      })
    this.documentSimilarity = +(similarity_percentage_acum/this.paragraphLenght).toFixed(2);

    this.infoTableGlobal = [
      {range:"Mayor o igual a " + GlobalConstants.maxSimilarity + "%", quantity:this.maxSimilarityQuantity},
      {range:"Entre " + GlobalConstants.middleSimilarity + "% y " + GlobalConstants.umbral + "%", quantity:this.middleMaxSimilarityQuantity},
      {range:"Entre " + GlobalConstants.umbral + "% y " + GlobalConstants.middleSimilarity + "%", quantity:this.middleMinSimilarityQuantity},
      {range:"Menor a " + GlobalConstants.umbral + "%", quantity:this.minSimilarityQuantity},
    ]
  }

  async getReportAnalysisInfo(){
    const infoReport = await this.plagiarismDetectionService.getReportAnalysisInfo(this.reportID);
    if(infoReport){
      this.reportAnalysis = infoReport.data.data[0];
    }
    if(this.reportAnalysis.AnalysisTypeID == 4){
      this.similarDocumentTitle = this.infoReport.response_elastic[0].doc_.title;
    }
  }

  async getDocumentInfo(documentID){
    const response = await this.plagiarismDetectionService.getDocumentInfo(documentID);
    this.documentInfo = response.data;
  }
  
  addCommonPhrase(selectedItem: any){
    this.modalCreateCommonPhrase.showModalCreateFromAnalysis(this.documentInfo.announcementCode, selectedItem, true);
  }

  setStyleHighlight(selectedItem: any){
    let text = selectedItem.highlight[0].content;
    if(text != ""){
      let words = selectedItem.highlight[0].my_uncommon_words.filter(word => word.alerta != "None"); 
      words.forEach(word => {
        var regEx = new RegExp(word.uncommon_word, "ig");
        text = text.replaceAll(regEx, '<span class="badge badge-'+word.alerta+'">'+word.uncommon_word+'</span>');
      });
  
      selectedItem.highlight[0].common_words.forEach(word => {
        var regEx = new RegExp(word, "ig");
        text = text.replaceAll(regEx, '<span class="badge badge-rojo">'+word+'</span>');
      });
    }
    return text;
  }

  setStyleParragraph(selectedItem: any){
    let text = selectedItem.paragraph_text;
    let content = selectedItem.highlight[0].content;
    if(content != ""){
      let words = selectedItem.highlight[0].my_uncommon_words.filter(word => word.alerta != "None"); 
      words.forEach(word => {
        var regEx = new RegExp(word.similar_word, "ig");
        text = text.replaceAll(regEx, '<span class="badge badge-'+word.alerta+'">'+word.similar_word+'</span>');
      });
  
      selectedItem.highlight[0].common_words.forEach(word => {
        var regEx = new RegExp(word, "ig");
        text = text.replaceAll(regEx, '<span class="badge badge-rojo">'+word+'</span>');
      });
    }
    return text;
  }

  async getSimilarDocs(){
    
    const lstSimilarDocs = await this.plagiarismDetectionService.getSimilarDocumentsInfo(this.infoReport.documentID);
    if(lstSimilarDocs){
      this.similarDocs = lstSimilarDocs.data.data.map(x =>{
        return{
          id: x.id,
          documentTitle: x.title,
          documentId: x.documentId,
          announcementName: x.announcementName,
          documentDescription: x.documentDescription,
          fileName: x.fileName,
          similarDocStatus: x.similarDocStatus,
          collectionCode: x.collectionCode
        }
      })
    }
  }

  modalAnalisis(selectedItem: any){
    this.similarDocument.id = selectedItem.id;
    this.similarDocument.similarDocumentCode = selectedItem.documentId;
    this.similarDocument.analysisDocumentCode = this.documentInfo.id;
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
          if(isAnalysis) this.executeSimilarityAnalisis();
          if(reload) location.reload();
        }
      }
    );
  }

  async executeSimilarityAnalisis(){
    this.plagiarismDetectionService.executeSimilarityAnalisisBetweenDocs(this.similarDocument);
    let url = `#/document/list`;
    this.router.navigate(['document']);
  }

}
