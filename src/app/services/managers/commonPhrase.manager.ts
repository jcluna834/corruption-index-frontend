import { Injectable } from '@angular/core';
import { GlobalConstants } from '../../common/global-constants';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})

export class CommonPhraseManagerService {

  private UrlPlagiarismDetectionServices: string;

  constructor(private httpClient: HttpClient) { 
      this.UrlPlagiarismDetectionServices = GlobalConstants.apiURLPlagiarismDetection;
  }

  async getCommonPhrases(data: any): Promise<any>{
    try{

      let params = new HttpParams().set('announcementCode', data);
      const CommonPhrases: any = await this.httpClient.get(this.UrlPlagiarismDetectionServices+'commonPhrase', { params: params }).toPromise();
      return CommonPhrases
    }
    catch(error){
      console.log(error);
      return;
    }
  }

  /*async getReportsSimilarityByDocumentId(documentID: any): Promise<any>{
    try{
      const reports: any = await this.httpClient.get(this.UrlPlagiarismDetectionServices+'getReportsSimilarityByDocumentId/' + documentID).toPromise();
      return reports
    }
    catch(error){
      console.log(error);
      return;
    }
  }*/

  async saveCommonPhrase(data: any): Promise<any>{
    try{
      const response: any = await this.httpClient.post(this.UrlPlagiarismDetectionServices + 'commonPhrase', data).toPromise();
      return response;
    }
    catch(error){
        console.log(error);
        return;
    }
  }

  async updateCommonPhrase(data: any): Promise<any>{
    try{
      const response: any = await this.httpClient.put(this.UrlPlagiarismDetectionServices + 'commonPhrase', data).toPromise();
      return response;
    }
    catch(error){
        console.log(error);
        return;
    }
  }

  async deleteCommonPhrase(data: any): Promise<any>{
    try{
      const options = {
        headers: new HttpHeaders({
          'Content-Type': 'application/json',
        }),
        body: data.id,
      };
      const response: any = await this.httpClient.delete(this.UrlPlagiarismDetectionServices + 'commonPhrase', options).toPromise();
      return response;
    }
    catch(error){
        console.log(error);
        return;
    }
  }

}