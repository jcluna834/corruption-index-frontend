import { Injectable } from '@angular/core';
import { GlobalConstants } from '../../common/global-constants';
import { HttpClient } from '@angular/common/http';

@Injectable({
    providedIn: 'root',
})

export class DocumentManagerService {

    private UrlPlagiarismDetectionServices: string;

    constructor(private httpClient: HttpClient) {
        this.UrlPlagiarismDetectionServices = GlobalConstants.apiURLPlagiarismDetection;
    }

    async uploadFile(data: any): Promise<any> {
        try {
            const formData = new FormData();
            formData.append('file', data.fileInput[0], data.fileInput[0].name);
            for (var key in data) {
                formData.append(key, data[key]);
            }
            const response: any = await this.httpClient.post(this.UrlPlagiarismDetectionServices + 'uploadFile', formData).toPromise();
            return response;
        }
        catch (error) {
            console.log(error);
            return;
        }
    }

    async editDocument(data: any): Promise<any> {
        try {
            const response: any = await this.httpClient.put(this.UrlPlagiarismDetectionServices + 'documents', data).toPromise();
            return response;
        }
        catch (error) {
            console.log(error);
            return;
        }
    }

    async indexDocument(data: any): Promise<any> {
        try {
            const response: any = await this.httpClient.post(this.UrlPlagiarismDetectionServices + 'indexDocument', data).toPromise();
            return response;
        }
        catch (error) {
            console.log(error);
            return;
        }
    }

}