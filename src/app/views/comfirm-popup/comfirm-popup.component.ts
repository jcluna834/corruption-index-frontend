import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { BsModalRef } from 'ngx-bootstrap/modal';

@Component({
  selector: 'comfirm-popup',
  templateUrl: './comfirm-popup.component.html',
  styleUrls: ['./comfirm-popup.component.scss']
})
export class ComfirmPopupComponent implements OnInit {

  public title: string;
  public msgConfirm: string;
  public confirmLabel: string;
  public cancelLabel: string;
  public icon: string;
  public hideCancelButton: boolean = false;
  public hideCloseButton: boolean = false;
  public lblWishContinue: boolean = false;
  public msgWishContinue: string;
  public modalType: string;

  @Output() responsePopup: EventEmitter<any> = new EventEmitter();

  constructor(
    private popupRef: BsModalRef
  ) {
  }

  ngOnInit() { }


  setOption(options: any) {
    this.title = options.title ? options.title : '';
    this.icon = options.icon ? options.icon : '';
    this.msgConfirm = options.msgConfirm ? options.msgConfirm : '';
    this.cancelLabel = options.cancelLabel ? options.cancelLabel : this.cancelLabel;
    this.confirmLabel = options.confirmLabel ? options.confirmLabel : this.confirmLabel;
    this.hideCancelButton = options.hideCancelButton ? options.hideCancelButton : this.hideCancelButton;
    this.hideCloseButton = typeof options.hideCloseButton === 'boolean' ? options.hideCloseButton : this.hideCloseButton;
    this.lblWishContinue = options.lblWishContinue ? options.lblWishContinue : this.lblWishContinue;
    this.msgWishContinue = options.msgWishContinue ? options.msgWishContinue : '';
    this.modalType = options.modalType ? options.modalType : 'info';
  }

  confirm() {
    this.popupRef.hide();
    this.responsePopup.emit(true);
  }

  cancel() {
    this.popupRef.hide();
    this.responsePopup.emit(false);
  }

}
