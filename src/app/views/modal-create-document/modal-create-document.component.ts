import { Component, OnInit, ViewChild } from '@angular/core';
import { ModalDirective } from 'ngx-bootstrap/modal';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Document } from './../../models/document';
import { DocumentManagerService } from './../../services/managers/document.manager';
import { GlobalConstants } from '../../common/global-constants';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { ComfirmPopupComponent } from '../comfirm-popup/comfirm-popup.component';

@Component({
  selector: 'app-modal-create-document',
  templateUrl: './modal-create-document.component.html',
  styleUrls: ['./modal-create-document.component.css']
})
export class ModalCreateDocumentComponent implements OnInit {

  @ViewChild('documentModal') public documentModal: ModalDirective;

  public formDocument: FormGroup;
  public document: Document;
  public bsModalRef: BsModalRef;

  constructor(
    private fb: FormBuilder,
    private documentManagerService: DocumentManagerService,
    private modalService: BsModalService,
  ) {

    this.document = new Document();
    this.formDocument = this.fb.group({
      'title': [undefined, [Validators.required]],
      'announcementCode': [undefined, [Validators.required]],
      'description': [undefined, []],
      'file-input': [undefined, [Validators.required]],
    });
  }

  public get title() { return this.formDocument.get('title'); }
  public get announcementCode() { return this.formDocument.get('announcementCode'); }
  public get description() { return this.formDocument.get('description'); }
  public get fileInput() { return this.formDocument.get('file-input'); }

  ngOnInit(): void {
  }

  showModal() {
    this.documentModal.show();
  }

  hiddenModal() {
    this.documentModal.hide();
  }

  saveDocument() {
    if (!this.validateForm()) {
      this.showModalConfirm("Error en formulario", "faltan campos por llenar", "danger");
      return false;
    }
    this.setDocument();
    this.uploadFile();
  }

  validateForm() {
    if (this.formDocument.status === "VALID") {
      return true;
    }
    return false;
  }

  fileChange(event) {
    let fileList: FileList = event.target.files;
    this.document.fileInput = fileList;
  }

  setDocument() {
    this.document.title = this.title.value;
    this.document.announcementCode = this.announcementCode.value;
    this.document.description = this.description.value;
    //TO-DO Obtener el Id del usuario
    this.document.responsibleCode = GlobalConstants.responsibleCode;
    this.document.indexDoc = 0; //Para solo guardar el doc más no indexar
  }

  async uploadFile() {
    await this.documentManagerService.uploadFile(this.document).then(response => {
      if (response) {
        if (response.status_code === 201) {
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
      this.showModalConfirm("Error al guardar", "Hubo un problema al guardar el documento", "danger");
    })
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
