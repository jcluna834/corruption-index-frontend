import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { PlagiarismDetectionManagerService } from './../../../services/managers/plagiarism-detection.manager';
import { Pipe } from '@angular/core';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';


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
  
  cancel(selectedItem: any){
    console.log("cancelar");
    console.log(selectedItem);
  }

  setStyleHighlight(selectedItem: any){
    let text = selectedItem.highlight[0].content;
    let words = selectedItem.highlight[0].my_uncommon_words.filter(word => word.alerta != "None"); 
    words.forEach(word => {
      var regEx = new RegExp(word.uncommon_word, "i");
      text = text.replace(regEx, '<span title='+word.similar_word+' class="badge badge-'+word.alerta+'">'+word.uncommon_word+'</span>');
    });

    selectedItem.highlight[0].common_words.forEach(word => {
      var regEx = new RegExp(word, "i");
      text = text.replace(regEx, '<span title='+word+' class="badge badge-rojo">'+word+'</span>');
    });
    return text;
  }

}
