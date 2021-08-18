import { Component, OnInit, ViewChild } from '@angular/core';
import { PlagiarismDetectionManagerService } from './../../../services/managers/plagiarism-detection.manager';
import { ModalCreateAnnouncementComponent } from './../../../views/announcement/modal-create-announcement/modal-create-announcement.component';
import { Announcement } from './../../../models/announcement';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { ComfirmPopupComponent } from '../../comfirm-popup/comfirm-popup.component';

@Component({
  selector: 'app-announcement-list',
  templateUrl: './announcement-list.component.html',
  styleUrls: ['./announcement-list.component.css']
})
export class AnnouncementListComponent implements OnInit {

  @ViewChild('modalCreateAnnouncement', { static: false })
  modalCreateAnnouncement: ModalCreateAnnouncementComponent;

  public announcement: Announcement;
  public bsModalRef: BsModalRef;

  constructor(private plagiarismDetectionService: PlagiarismDetectionManagerService,
    private modalService: BsModalService) {
    this.announcement = new Announcement();
   }

  public docsItems: any;

  ngOnInit(): void {
    this.getAnnouncements();
  }

  async getAnnouncements(){
    const lstReports = await this.plagiarismDetectionService.getAnnouncement();
    if(lstReports){
      this.docsItems = lstReports.data.data.map(x =>{
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

  addAnnouncement(){
    this.modalCreateAnnouncement.showModalCreate();
  }

  editAnnouncement(selectedItem: any){
    this.announcement = selectedItem;
    this.modalCreateAnnouncement.announcement = this.announcement;
    this.modalCreateAnnouncement.setAnnouncementForm();
    this.modalCreateAnnouncement.showModalEdit();
  }

  async deleteAnnouncement(selectedItem: any){
    this.announcement.id = selectedItem.id;
    await this.plagiarismDetectionService.deleteAnnouncement(this.announcement).then(response => {
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
