import { Component, OnInit, ViewChild } from '@angular/core';

import { CommonPhraseManagerService } from './../../../services/managers/commonPhrase.manager';
import { PlagiarismDetectionManagerService } from './../../../services/managers/plagiarism-detection.manager';
import { CommonPhrase } from './../../../models/commonPhrase';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { ComfirmPopupComponent } from '../../comfirm-popup/comfirm-popup.component';
import { ModalCreateCommonPhraseComponent } from './../../../views/announcement/modal-create-common-phrase/modal-create-common-phrase.component';
import { Subscription } from 'rxjs';
import { ActivatedRoute } from '@angular/router';


@Component({
  selector: 'app-common-phrase-list',
  templateUrl: './common-phrase-list.component.html',
  styleUrls: ['./common-phrase-list.component.css']
})
export class CommonPhraseListComponent implements OnInit {

  @ViewChild('modalCreateCommonPhrase', { static: false })
  modalCreateCommonPhrase: ModalCreateCommonPhraseComponent;

  public commonPhrase: CommonPhrase;
  public bsModalRef: BsModalRef;
  private routeSub: Subscription;
  public announcementItems: any;

  constructor(
    private commonPhraseManagerService: CommonPhraseManagerService,
    private modalService: BsModalService,
    private route: ActivatedRoute,
    private plagiarismDetectionService: PlagiarismDetectionManagerService,) {
      this.commonPhrase = new CommonPhrase(); 
  }

  public commonPhrasesItems: any;
  private announcementID: number;
  public showSelectAnnouncement: boolean = true;

  async ngOnInit() {
    this.routeSub = this.route.params.subscribe(params => {
      this.announcementID = params['id'];
    });
    if(this.announcementID){
      this.showSelectAnnouncement = false;
      this.getCommonPhrases();
    }else{
      this.getAnnouncements();
    }
  }

  async getAnnouncements(){
    const lstReports = await this.plagiarismDetectionService.getAnnouncement();
    if(lstReports){
      this.announcementItems = lstReports.data.data.map(x =>{
        return{
          id: x.id,
          name: x.name,
          description: x.description,
          startDate: x.startDate,
          endDate: x.endDate,
          selected: false,
        }
      })
    }
  }

  onChangeAnnouncement(announcementId) {
    this.announcementID = announcementId;
    this.getCommonPhrases();
  }

  async getCommonPhrases(){
    const lstReports = await this.commonPhraseManagerService.getCommonPhrases(this.announcementID);
    if(lstReports){
      this.commonPhrasesItems = lstReports.data.data.map(x =>{
        return{
          id: x.id,
          description: x.description,
          phrase: x.phrase,
        }
      })
    }
  }

  addCommonPhrase(){
    this.modalCreateCommonPhrase.showModalCreate(this.announcementID);
  }

  editCommonPhrase(selectedItem: any){
    this.commonPhrase = selectedItem;
    this.modalCreateCommonPhrase.commonPhrase = this.commonPhrase;
    this.modalCreateCommonPhrase.setCommonPhraseForm();
    this.modalCreateCommonPhrase.showModalEdit();
  }

  async deleteCommonPhrase(selectedItem: any){
    this.commonPhrase.id = selectedItem.id;
    await this.commonPhraseManagerService.deleteCommonPhrase(this.commonPhrase).then(response => {
      if (response) {
        if (response.success) {
          this.showModalConfirm("Borrado exitoso", response.message, '', true);
        }
        else{
          this.showModalConfirm("Error al borrar", response.message, "danger");
        }
      }
    }).catch(error => {
      console.log(error);
    });
  }

  showModalConfirm(title, msg, modalType='', reload=false) {
    this.bsModalRef = this.modalService.show(ComfirmPopupComponent, {
      class: 'modal-auto siigo-popup',
      ignoreBackdropClick: true,
      backdrop: 'static',
    });
    this.bsModalRef.content.setOption(
      {
        title: title,
        msgConfirm: msg,
        hideCloseButton: false,
        hideCancelButton: true,
        confirmLabel: "Aceptar",
        modalType: modalType
      }
    );

    this.bsModalRef.content.responsePopup.subscribe(
      (confirm: boolean) => {
        if (confirm) {
          if(reload) location.reload();
        }
      }
    );
  }
}
