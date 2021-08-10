import { Injectable } from '@angular/core';
import { GlobalConstants } from '../../common/global-constants';
import { HttpClient } from '@angular/common/http';

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

}