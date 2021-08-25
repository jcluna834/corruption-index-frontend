import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { PlagiarismDetectionManagerService } from './../../../services/managers/plagiarism-detection.manager';

@Component({
  selector: 'app-document-similarity-analisis',
  templateUrl: './document-similarity-analisis.component.html',
  styleUrls: ['./document-similarity-analisis.component.css']
})
export class DocumentSimilarityAnalisisComponent implements OnInit {

  private routeSub: Subscription;
  
  constructor(private route: ActivatedRoute,
    private plagiarismDetectionService: PlagiarismDetectionManagerService,) { }
  
  private reportID: string;
  private infoReport: any;
  private documentInfo: any;
  private reportsES: any;
  private reportDate: string;

  private documentTitle: string;

  ngOnInit() {
    this.routeSub = this.route.params.subscribe(params => {
      this.reportID = params['id'];
    });
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
        }
      })
    }
  }

  async getDocumentInfo(documentID){
    const response = await this.plagiarismDetectionService.getDocumentInfo(documentID);
    this.documentInfo = response.data;
  }
  
  cancel(){
    console.log("cancelar");
  }

}
