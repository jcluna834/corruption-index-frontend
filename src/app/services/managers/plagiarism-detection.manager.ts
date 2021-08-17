import { Injectable } from '@angular/core';
import { GlobalConstants } from '../../common/global-constants';
import { HttpClient, HttpHeaders } from '@angular/common/http';

@Injectable({
  providedIn: 'root',
})

export class PlagiarismDetectionManagerService {

  private UrlPlagiarismDetectionServices: string;

  constructor(private httpClient: HttpClient) { 
      this.UrlPlagiarismDetectionServices = GlobalConstants.apiURLPlagiarismDetection;
  }

  async getReports(): Promise<any>{
    try{
      const reports: any = await this.httpClient.get(this.UrlPlagiarismDetectionServices+'getReportsSimilarity').toPromise();
      return reports
    }
    catch(error){
      console.log(error);
      return;
    }
  }

  async getDocs(): Promise<any>{
    try{
      const reports: any = await this.httpClient.get(this.UrlPlagiarismDetectionServices+'documents').toPromise();
      return reports
    }
    catch(error){
      console.log(error);
      return;
    }
  }

  async getAnnouncement(): Promise<any>{
    try{
      const announcement: any = await this.httpClient.get(this.UrlPlagiarismDetectionServices+'announcement').toPromise();
      return announcement
    }
    catch(error){
      console.log(error);
      return;
    }
  }

  async saveAnnouncement(data: any): Promise<any>{
    try{
      const response: any = await this.httpClient.post(this.UrlPlagiarismDetectionServices + 'announcement', data).toPromise();
      return response;
    }
    catch(error){
        console.log(error);
        return;
    }
  }

  async deleteAnnouncement(data: any): Promise<any>{
    try{
      const options = {
        headers: new HttpHeaders({
          'Content-Type': 'application/json',
        }),
        body: data.id,
      };
      const response: any = await this.httpClient.delete(this.UrlPlagiarismDetectionServices + 'announcement', options).toPromise();
      return response;
    }
    catch(error){
        console.log(error);
        return;
    }
  }

}