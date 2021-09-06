import { Injectable } from '@angular/core';
import { GlobalConstants } from '../../common/global-constants';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})

export class PlagiarismDetectionManagerService {

  private UrlPlagiarismDetectionServices: string;

  /*OBSERVADORES*/
  private IdAnnouncement = new BehaviorSubject<any>(null);
  IdAnnouncement$ = this.IdAnnouncement.asObservable();
  /*END OBSERVADORES*/


  constructor(private httpClient: HttpClient) {
    this.UrlPlagiarismDetectionServices = GlobalConstants.apiURLPlagiarismDetection;
  }

  /*OBSERVADORES*/
  setIdAnnouncement(value: any) {
    this.IdAnnouncement.next(value);
  }
  /*END OBSERVADORES*/

  async getReports(): Promise<any> {
    try {
      const reports: any = await this.httpClient.get(this.UrlPlagiarismDetectionServices + 'getReportsSimilarity').toPromise();
      return reports
    }
    catch (error) {
      console.log(error);
      return;
    }
  }

  async getReportsSimilarityByDocumentId(documentID: any): Promise<any> {
    try {
      const reports: any = await this.httpClient.get(this.UrlPlagiarismDetectionServices + 'getReportsSimilarityByDocumentId/' + documentID).toPromise();
      return reports
    }
    catch (error) {
      console.log(error);
      return;
    }
  }

  async getDocumentInfo(documentID: any): Promise<any> {
    try {
      const reports: any = await this.httpClient.get(this.UrlPlagiarismDetectionServices + 'getDocumentInfo/' + documentID).toPromise();
      return reports
    }
    catch (error) {
      console.log(error);
      return;
    }
  }

  async getReportsSimilarityByID(ID: any): Promise<any> {
    try {
      const reports: any = await this.httpClient.get(this.UrlPlagiarismDetectionServices + 'getReport/' + ID).toPromise();
      return reports
    }
    catch (error) {
      console.log(error);
      return;
    }
  }

  async getReportAnalysisInfo(ID: any): Promise<any> {
    try {
      const reports: any = await this.httpClient.get(this.UrlPlagiarismDetectionServices + 'getReportAnalysis/' + ID).toPromise();
      return reports
    }
    catch (error) {
      console.log(error);
      return;
    }
  }

  async getDocs(): Promise<any> {
    try {
      const reports: any = await this.httpClient.get(this.UrlPlagiarismDetectionServices + 'documents').toPromise();
      return reports
    }
    catch (error) {
      console.log(error);
      return;
    }
  }

  async getAnnouncement(): Promise<any> {
    try {
      const announcements: any = await this.httpClient.get(this.UrlPlagiarismDetectionServices + 'announcement').toPromise();
      this.setIdAnnouncement(announcements);
      return announcements
    }
    catch (error) {
      console.log(error);
      return;
    }
  }

  async saveAnnouncement(data: any): Promise<any> {
    try {
      const response: any = await this.httpClient.post(this.UrlPlagiarismDetectionServices + 'announcement', data).toPromise();
      return response;
    }
    catch (error) {
      console.log(error);
      return;
    }
  }

  async updateAnnouncement(data: any): Promise<any> {
    try {
      const response: any = await this.httpClient.put(this.UrlPlagiarismDetectionServices + 'announcement', data).toPromise();
      return response;
    }
    catch (error) {
      console.log(error);
      return;
    }
  }

  async deleteAnnouncement(data: any): Promise<any> {
    try {
      const options = {
        headers: new HttpHeaders({
          'Content-Type': 'application/json',
        }),
        body: data.id,
      };
      const response: any = await this.httpClient.delete(this.UrlPlagiarismDetectionServices + 'announcement', options).toPromise();
      return response;
    }
    catch (error) {
      console.log(error);
      return;
    }
  }

  async executeSimilarityAnalisis(data: any): Promise<any> {
    try {
      const response: any = await this.httpClient.post(this.UrlPlagiarismDetectionServices + 'executeSimilarityAnalisis', data).toPromise(); //SimulateExecuteSimilarityAnalisis
      return response;
    }
    catch (error) {
      console.log(error);
      return;
    }
  }

  async executeSimilarityAnalisisBetweenDocs(data: any): Promise<any> {
    try {
      const response: any = await this.httpClient.post(this.UrlPlagiarismDetectionServices + 'executeSimilarityAnalisisBetweenDocs', data).toPromise();
      return response;
    }
    catch (error) {
      console.log(error);
      return;
    }
  }

  async getAnalisisHistory(): Promise<any> {
    try {
      const response: any = await this.httpClient.get(this.UrlPlagiarismDetectionServices + 'analysisHistory').toPromise();
      return response;
    }
    catch (error) {
      console.log(error);
      return;
    }
  }

  async disableParagraph(data: any): Promise<any> {
    try {
      const response: any = await this.httpClient.post(this.UrlPlagiarismDetectionServices + 'disableHighlight', data).toPromise();
      return response;
    }
    catch (error) {
      console.log(error);
      return;
    }
  }

  async getSimilarDocumentsInfo(data: any): Promise<any> {
    try {
      let params = new HttpParams().set('documentID', data);
      const CommonPhrases: any = await this.httpClient.get(this.UrlPlagiarismDetectionServices + 'getSimilarDocumentsInfo', { params: params }).toPromise();
      return CommonPhrases
    }
    catch (error) {
      console.log(error);
      return;
    }
  }

}