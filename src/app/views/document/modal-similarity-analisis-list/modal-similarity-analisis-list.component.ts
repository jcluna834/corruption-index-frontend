import { Component, OnInit, ViewChild } from '@angular/core';
import { ModalDirective } from 'ngx-bootstrap/modal';
import { PlagiarismDetectionManagerService } from './../../../services/managers/plagiarism-detection.manager';
import { Router } from '@angular/router';


@Component({
  selector: 'app-modal-similarity-analisis-list',
  templateUrl: './modal-similarity-analisis-list.component.html',
  styleUrls: ['./modal-similarity-analisis-list.component.css']
})
export class ModalSimilarityAnalisisListComponent implements OnInit {

  @ViewChild('analysisListModal') public analysisListModal: ModalDirective;

  constructor( 
    private plagiarismDetectionService: PlagiarismDetectionManagerService,
    private router: Router ) { }

  public reportsItems: any;

  ngOnInit(): void {
  }

  showModal(documentID: any){
    this.getReports(documentID);
    this.analysisListModal.show();
  }

  async getReports(documentID: any){
    const lstReports = await this.plagiarismDetectionService.getReportsSimilarityByDocumentId(documentID);
    if(lstReports){
      this.reportsItems = lstReports.data.data.map(x =>{
        return{
          id: x.collectionCode,
          AnalysisDate: x.created_date,
          AnalysisType: x.AnalysisType
        }
      })
    }
  }

  showDocumentAnalysis(selectedItem: any){
    let url = `#/document/similarityAnalysis/`+selectedItem.id;
    this.router.navigate([]).then(result => { window.open(url, '_blank'); })
  }

}
