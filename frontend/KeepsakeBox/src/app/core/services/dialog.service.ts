import { Injectable, TemplateRef } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { PersonalImage } from '../models/personal-image.model';
import { PopupConfirmationComponent } from '../../shared/popup-confirmation/popup-confirmation.component';
import { RtSessionPreviewImageComponent } from '../../caregiver-home/rt-session/rt-session-preview-image/rt-session-preview-image.component';

@Injectable({
  providedIn: 'root'
})

export class DialogService {

  toasts: any[] = [];

//  constructor(public dialog: MatDialog) {
  constructor(private modalService: NgbModal) {

  }

  // Push new Toasts to array with content and options
  show(textOrTpl: string | TemplateRef<any>, toastType: String, options: any = {}) {
    this.toasts.push({ textOrTpl, toastType, ...options });
  }

  showSuccessNotification(textOrTpl: string | TemplateRef<any>) {
    this.show(textOrTpl, 'S', {
      classname: 'bg-success text-light',
      autohide: true,
      //headertext: 'Bem sucedido',
      delay: 2000
    });
  }

  showErrorNotification(textOrTpl: string | TemplateRef<any>) {
    this.show(textOrTpl, 'E', {
      classname: 'bg-danger text-light',
      autohide: true,
      //headertext: 'Error!!!',
      delay: 2000 
    });
  }

  async imagePreview(img: PersonalImage): Promise<void> {
    const modalRef = this.modalService.open(RtSessionPreviewImageComponent, { size: 'lg', centered: false, scrollable: true});
    modalRef.componentInstance.img = img;
  }

  async askConfirmation(textOrTpl: string | TemplateRef<any>, helpMessage: string = ''): Promise<boolean> {
    var fsc = true;

    //const modalRef = this.modalService.open(PopupConfirmationComponent, { centered: false, scrollable: true });
    //const modalRef = this.modalService.open(PopupConfirmationComponent, { windowClass: 'modal-dialog', backdrop: false });
    //const modalRef = this.modalService.open(PopupConfirmationComponent, { backdrop: false });
    //const modalRef = this.modalService.open(PopupConfirmationComponent, { size: 'xl' });
    //const modalRef = this.modalService.open(PopupConfirmationComponent, { backdropClass: 'light-blue-backdrop' });
    //const modalRef = this.modalService.open(PopupConfirmationComponent, { windowClass: 'gr-modal-full' });
    //const modalRef = this.modalService.open(PopupConfirmationComponent, { windowClass: 'modal-fullscreen' });

    if (fsc) {
      const modalRef = this.modalService.open(PopupConfirmationComponent, {  windowClass: 'modal-fullscreen', backdrop: 'static' });
      modalRef.componentInstance.message = textOrTpl;
      modalRef.componentInstance.help = helpMessage;
      modalRef.componentInstance.fullWindow = true;
      return modalRef.result;
  
    } else {
      const modalRef = this.modalService.open(PopupConfirmationComponent, { centered: false, scrollable: true });
      modalRef.componentInstance.message = textOrTpl;
      modalRef.componentInstance.help = helpMessage;
      modalRef.componentInstance.fullWindow = false;  
      return modalRef.result;

    }

  }

  // Callback method to remove Toast DOM element from view
  remove(toast: any) {
    this.toasts = this.toasts.filter(t => t !== toast);
  }


}
