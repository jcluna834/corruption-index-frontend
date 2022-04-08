import { Injectable } from "@angular/core";
import { GlobalConstants } from "../../common/global-constants";
import { HttpClient } from "@angular/common/http";

@Injectable({
  providedIn: "root",
})
export class BidRiggingManagerService {
  private UrlBidRiggingDetectionServices: string;

  constructor(private httpClient: HttpClient) {
    this.UrlBidRiggingDetectionServices =
      GlobalConstants.apiURLBidRiggingDetection;
  }

  async getDocs(): Promise<any> {
    try {
      const reports: any = await this.httpClient
        .get(this.UrlBidRiggingDetectionServices + "documents")
        .toPromise();
      return reports;
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
}
