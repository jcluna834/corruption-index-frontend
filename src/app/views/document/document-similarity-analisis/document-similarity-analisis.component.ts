import { Component, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { PlagiarismDetectionManagerService } from './../../../services/managers/plagiarism-detection.manager';
import { Pipe } from '@angular/core';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
import { ModalCreateCommonPhraseComponent } from './../../../views/announcement/modal-create-common-phrase/modal-create-common-phrase.component';


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

  private routeSub: Subscription;
  private myStyle: SafeHtml;
  
  constructor(private route: ActivatedRoute,
    private plagiarismDetectionService: PlagiarismDetectionManagerService,
    private sanitizer: DomSanitizer) { }
  
  private reportID: string;
  private infoReport: any;
  private documentInfo: any;
  private reportsES: any;
  private reportDate: string;

  private documentTitle: string;

  private styleBadge = `<style>
    .badge-amarillo {
      color: #23282c;
      background-color: #fffb07;
    }

    .badge-naranja {
      color: #23282c;
      background-color: #eb8b32;
    }

    .badge-rojo {
      color: #23282c;
      background-color: #f73c3c;
    }</style>`;

  ngOnInit() {
    this.routeSub = this.route.params.subscribe(params => {
      this.reportID = params['id'];
    });
    this.myStyle = this.sanitizer.bypassSecurityTrustHtml(this.styleBadge);
  }

  async ngAfterViewInit() {
    await this.getReports();
    this.reportDate = this.infoReport.AnalysisDate;
    await this.getDocumentInfo(this.infoReport.documentID);
    this.documentTitle = this.documentInfo.title;
  }

  async getReports(){
    const infoReport = await this.plagiarismDetectionService.getReportsSimilarityByID(this.reportID);
    this.infoReport = infoReport.data[0];
    if(this.infoReport.response_elastic){
      this.reportsES = this.infoReport.response_elastic.map(x =>{
        return{
          paragraph_text: x.paragraph_text,
          similarity_percentage: x.similarity_percentage,
          document: x.doc_,
          highlight: x.highlight,
        }
      })
    }
  }

  async getDocumentInfo(documentID){
    const response = await this.plagiarismDetectionService.getDocumentInfo(documentID);
    this.documentInfo = response.data;
  }
  
  addCommonPhrase(selectedItem: any){
    this.modalCreateCommonPhrase.showModalCreateFromAnalysis(this.documentInfo.announcementCode, selectedItem);
  }

  setStyleHighlight(selectedItem: any){
    let text = selectedItem.highlight[0].content;
    let words = selectedItem.highlight[0].my_uncommon_words.filter(word => word.alerta != "None"); 
    words.forEach(word => {
      var regEx = new RegExp(word.uncommon_word, "ig");
      text = text.replaceAll(regEx, '<span class="badge badge-'+word.alerta+'">'+word.uncommon_word+'</span>');
    });

    selectedItem.highlight[0].common_words.forEach(word => {
      var regEx = new RegExp(word, "ig");
      text = text.replaceAll(regEx, '<span class="badge badge-rojo">'+word+'</span>');
    });
    return text;
  }

  setStyleParragraph(selectedItem: any){
    let text = selectedItem.paragraph_text;
    let words = selectedItem.highlight[0].my_uncommon_words.filter(word => word.alerta != "None"); 
    words.forEach(word => {
      var regEx = new RegExp(word.similar_word, "ig");
      text = text.replaceAll(regEx, '<span class=" badge-'+word.alerta+'">'+word.similar_word+'</span>');
    });

    selectedItem.highlight[0].common_words.forEach(word => {
      var regEx = new RegExp(word, "ig");
      text = text.replaceAll(regEx, '<span class="badge badge-rojo">'+word+'</span>');
    });
    return text;
  }

}
