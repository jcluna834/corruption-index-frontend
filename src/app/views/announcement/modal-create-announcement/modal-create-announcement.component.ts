import { Component, OnInit, ViewChild } from '@angular/core';
import { ModalDirective } from 'ngx-bootstrap/modal';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Announcement } from './../../../models/announcement';
import { PlagiarismDetectionManagerService } from './../../../services/managers/plagiarism-detection.manager';
import { GlobalConstants } from '../../../common/global-constants';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { ComfirmPopupComponent } from '../../comfirm-popup/comfirm-popup.component';

@Component({
  selector: 'app-modal-create-announcement',
  templateUrl: './modal-create-announcement.component.html',
  styleUrls: ['./modal-create-announcement.component.css']
})
export class ModalCreateAnnouncementComponent implements OnInit {

  @ViewChild('announcementModal') public announcementModal: ModalDirective;

  public formAnnouncement: FormGroup;
  public announcement: Announcement;
  public bsModalRef: BsModalRef;
  public option: string = "Save";
  public titleModal: string = "Crear una convocatoria";

  constructor(
    private fb: FormBuilder,
    private plagiarismDetectionService: PlagiarismDetectionManagerService,
    private modalService: BsModalService,
  ) {
    this.announcement = new Announcement();
    this.formAnnouncement = this.fb.group({
      'name': [undefined, [Validators.required]],
      'description': [undefined, [Validators.required]],
      'startDate': [undefined, [Validators.required]],
      'endDate': [undefined, [Validators.required]],
    });
  }

  public get name() { return this.formAnnouncement.get('name'); }
  public get description() { return this.formAnnouncement.get('description'); }
  public get startDate() { return this.formAnnouncement.get('startDate'); }
  public get endDate() { return this.formAnnouncement.get('endDate'); }

  ngOnInit(): void {
  }

  showModalCreate(){
    this.option = "Save";
    this.titleModal = "Crear una convocatoria";
    this.clearForm();
    this.announcementModal.show();
  }

  showModalEdit() {
    this.titleModal = "Editar una convocatoria";
    this.option = "Update";
    this.announcementModal.show();
  }

  hiddenModal() {
    this.announcementModal.hide();
  }

  saveAnnouncement() {
    if (!this.validateForm()) {
      this.showModalConfirm("Error en formulario", "faltan campos por llenar o hay errores en los campos", "danger");
      return false;
    }
    this.setAnnouncement();
    this.createUpdateAnnouncement();
  }

  validateForm() {
    if (this.formAnnouncement.status === "VALID") {
      return true;
    }
    return false;
  }

  setAnnouncement() {
    this.announcement.name = this.name.value;
    this.announcement.description = this.description.value;
    this.announcement.startDate = this.startDate.value;
    this.announcement.endDate = this.endDate.value;
    //TO-DO Obtener el Id del usuario
    this.announcement.responsibleCode = GlobalConstants.responsibleCode;
    this.announcement.entityCode = GlobalConstants.entityCode;
  }

  setDate(date: string){
    var date_ = new Date(date);
    var isoDateTime = new Date(date_.getTime() - (date_.getTimezoneOffset() * 60000));
    return isoDateTime;
  }

  setAnnouncementForm() {
    this.name.setValue(this.announcement.name);
    this.description.setValue(this.announcement.description);
    const startDate = this.setDate(this.announcement.startDate).toISOString().slice(0, 16);
    const endDate = this.setDate(this.announcement.endDate).toISOString().slice(0, 16);
    this.startDate.setValue(startDate);
    this.endDate.setValue(endDate);
  }

  clearForm() {
    this.name.setValue('');
    this.description.setValue('');
    this.startDate.setValue('');
    this.endDate.setValue('');
  }

  createUpdateAnnouncement(){
    if(this.option == "Save"){
      this.createAnnouncement();
    }else{
      this.updateAnnouncement();
    }
  }

  async createAnnouncement() {
    await this.plagiarismDetectionService.saveAnnouncement(this.announcement).then(response => {
      console.log(response);
      if (response) {
        if (response.success) {
          this.showModalConfirm("Guardado exitoso", response.message);
          this.hiddenModal();
          location.reload();
        }
        else{
          this.showModalConfirm("Error al guardar", response.message, "danger");
        }
      }
    }).catch(error => {
      console.log(error);
      this.showModalConfirm("Error al guardar", "Hubo un problema al guardar la convocatoria", "danger");
    });
  }

  async updateAnnouncement() {
    await this.plagiarismDetectionService.updateAnnouncement(this.announcement).then(response => {
      console.log(response);
      if (response) {
        if (response.success) {
          this.showModalConfirm("Edición exitosa", response.message);
          this.hiddenModal();
          //location.reload();
        }
        else{
          this.showModalConfirm("Error al editar", response.message, "danger");
        }
      }
    }).catch(error => {
      console.log(error);
      this.showModalConfirm("Error al editar", "Hubo un problema al editar la convocatoria", "danger");
    });
  }

  showModalConfirm(title, msg, modalType='') {
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
        }
      }
    );
  }

}
