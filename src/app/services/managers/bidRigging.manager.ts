import { Injectable } from "@angular/core";
import { GlobalConstants } from "../../common/global-constants";
import { HttpClient, HttpParams } from '@angular/common/http';

@Injectable({
  providedIn: "root",
})
export class BidRiggingManagerService {
  private UrlBidRiggingDetectionServices: string;

  constructor(private httpClient: HttpClient) {
    this.UrlBidRiggingDetectionServices =
      GlobalConstants.apiURLBidRiggingDetection;
  }

  async getDocs(announcementCode: any): Promise<any> {
    try {
      let params = new HttpParams().set('announcementCode', announcementCode);
      const reports: any = await this.httpClient
        .get(`${this.UrlBidRiggingDetectionServices}documents`, { params: params } )
        .toPromise();
      return reports;
    } catch (error) {
      console.log(error);
      return;
    }
  }

  async getDocsList(documentsIds: any): Promise<any> {
    try {
      const data = {
        docsIds: documentsIds
      }
      
      const reports: any = await this.httpClient
        .post(`${this.UrlBidRiggingDetectionServices}getDocsList`, data )
        .toPromise();
      return reports.data.data;
    } catch (error) {
      console.log(error);
      return;
    }
  }

  async uploadFile(data: any): Promise<any> {
    try {
      const formData = new FormData();
      formData.append("file", data.fileInput[0], data.fileInput[0].name);
      for (var key in data) {
        formData.append(key, data[key]);
      }
      const response: any = await this.httpClient
        .post(this.UrlBidRiggingDetectionServices + "uploadFile", formData)
        .toPromise();
      return response;
    } catch (error) {
      console.log(error);
      return;
    }
  }

  async executeBidRiggingAnalisis(data: any): Promise<any> {
    try {
      const response: any = await this.httpClient.post(`${this.UrlBidRiggingDetectionServices}detect/executeBidRiggingAnalisis`, data).toPromise();
      return response;
    }
    catch (error) {
      console.log(error);
      return;
    }
  }

  async getReportsBidRiggingByAnnouncement(announcementCode: any): Promise<any> {
    try {
      const reports: any = await this.httpClient.get(`${this.UrlBidRiggingDetectionServices}detect/getReportsBidRiggingByAnnouncement/${announcementCode}`).toPromise();
      return reports
    }
    catch (error) {
      console.log(error);
      return;
    }
  }
  

  async getReportBidRiggingByID(ID: any): Promise<any> {
    try {
      const reports: any = await this.httpClient.get(`${this.UrlBidRiggingDetectionServices}detect/getReport/${ID}`).toPromise();
      return reports
    }
    catch (error) {
      console.log(error);
      return;
    }
  }

  async getAnnouncementInfo(ID: any): Promise<any> {
    try {
      const reports: any = await this.httpClient.get(`${this.UrlBidRiggingDetectionServices}getAnnouncementInfo/${ID}`).toPromise();
      return reports
    }
    catch (error) {
      console.log(error);
      return;
    }
  }
}
