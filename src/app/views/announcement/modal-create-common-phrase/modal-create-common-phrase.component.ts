import { Component, OnInit, ViewChild } from '@angular/core';
import { ModalDirective } from 'ngx-bootstrap/modal';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { CommonPhrase } from './../../../models/commonPhrase';
import { CommonPhraseManagerService } from './../../../services/managers/commonPhrase.manager';
import { PlagiarismDetectionManagerService } from './../../../services/managers/plagiarism-detection.manager';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { ComfirmPopupComponent } from '../../comfirm-popup/comfirm-popup.component';

@Component({
  selector: 'app-modal-create-common-phrase',
  templateUrl: './modal-create-common-phrase.component.html',
  styleUrls: ['./modal-create-common-phrase.component.css']
})
export class ModalCreateCommonPhraseComponent implements OnInit {

  @ViewChild('commonPhraseModal') public commonPhraseModal: ModalDirective;

  public formCommonPhrase: FormGroup;
  public commonPhrase: CommonPhrase;
  public bsModalRef: BsModalRef;
  public option: string = "Save";
  public titleModal: string = "Crear una frase común";
  private editJson: boolean = false;
  private reportsES: any;

  constructor(
    private fb: FormBuilder,
    private commonPhraseManagerService: CommonPhraseManagerService,
    private plagiarismDetectionService: PlagiarismDetectionManagerService,
    private modalService: BsModalService,
  ) {
    this.commonPhrase = new CommonPhrase();
    this.formCommonPhrase = this.fb.group({
      'description': [undefined, [Validators.required]],
      'phrase': [undefined, [Validators.required]],
      'announcementCode': [undefined, []],
    });
  }

  private announcementID: number;

  public get description() { return this.formCommonPhrase.get('description'); }
  public get phrase() { return this.formCommonPhrase.get('phrase'); }
  public get announcementCode() { return this.formCommonPhrase.get('announcementCode'); }

  ngOnInit(): void {
  }

  showModalCreate(announcementID: number){
    this.option = "Save";
    this.titleModal = "Crear una frase común";
    this.clearForm();
    this.announcementID = announcementID;
    this.announcementCode.setValue(this.announcementID);
    this.commonPhraseModal.show();
  }

  showModalCreateFromAnalysis(announcementID: number, content: any, flag: boolean){
    this.option = "Save";
    this.titleModal = "Crear una frase común";
    this.clearForm();
    this.announcementID = announcementID;
    this.announcementCode.setValue(this.announcementID);
    this.phrase.setValue(content.paragraph_text)
    //this.phrase.setValue(content.highlight[0].content)
    this.editJson = flag
    this.reportsES = content
    this.commonPhraseModal.show();
  }

  showModalEdit() {
    this.titleModal = "Editar una frase común";
    this.option = "Update";
    this.commonPhraseModal.show();
  }

  hiddenModal() {
    this.commonPhraseModal.hide();
  }

  saveCommonPhrase() {
    if (!this.validateForm()) {
      this.showModalConfirm("Error en formulario", "faltan campos por llenar o hay errores en los campos", "danger");
      return false;
    }
    this.setCommonPhrase();
    this.createUpdateCommonPhrase();
  }

  validateForm() {
    if (this.formCommonPhrase.status === "VALID") {
      return true;
    }
    return false;
  }

  setCommonPhrase() {
    this.commonPhrase.description = this.description.value;
    this.commonPhrase.phrase = this.phrase.value;
    this.commonPhrase.announcementCode = this.announcementCode.value;
  }

  setCommonPhraseForm() {
    this.description.setValue(this.commonPhrase.description);
    this.phrase.setValue(this.commonPhrase.phrase);
    this.announcementCode.setValue(this.commonPhrase.announcementCode);
  }

  clearForm() {
    this.description.setValue('');
    this.phrase.setValue('');
    this.announcementCode.setValue('');
  }

  createUpdateCommonPhrase(){
    if(this.option == "Save"){
      this.createCommonPhrase();
    }else{
      this.updateCommonPhrase();
    }
  }

  async createCommonPhrase() {
    await this.commonPhraseManagerService.saveCommonPhrase(this.commonPhrase).then(response => {
      if (response) {
        if (response.success) {
          this.hiddenModal();
          if(this.editJson){
            if(this.reportsES.collectionId){
              this.disableParagraph();
            }
          }
          this.showModalConfirm("Guardado exitoso", response.message, '', true);
          //location.reload();
        }
        else{
          this.showModalConfirm("Error al guardar", response.message, "danger");
        }
      }
    }).catch(error => {
      console.log(error);
      this.showModalConfirm("Error al guardar", "Hubo un problema al guardar la frase común", "danger");
    });
  }

  async disableParagraph(){
    const paragraph = {
      id: this.reportsES.collectionId,
      text: this.reportsES.paragraph_text
    };
    await this.plagiarismDetectionService.disableParagraph(paragraph);
  }

  async updateCommonPhrase() {
    await this.commonPhraseManagerService.updateCommonPhrase(this.commonPhrase).then(response => {
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
      this.showModalConfirm("Error al editar", "Hubo un problema al editar la frase común", "danger");
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
          if (reload) location.reload();
        }
      }
    );
  }

}
