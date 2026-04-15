import { Component, TemplateRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NgbToastModule } from '@ng-bootstrap/ng-bootstrap';
import { DialogService } from '../core/services/dialog.service';

@Component({
  selector: 'app-toasts',
  standalone: true,
  imports: [CommonModule, NgbToastModule],
  templateUrl: './toast.component.html',
  styleUrls: ['./toast.component.css'],
  host: { '[class.ngb-toasts]': 'true' }
})
export class ToastComponent {

  constructor(public dialogService: DialogService) {}

  isTemplate(toast: any) {
    return toast.textOrTpl instanceof TemplateRef;
  }

  isSuccess(toast: any): boolean {
    return toast.toastType === 'S';
  }

  isError(toast: any): boolean {
    return toast.toastType === 'E';
  }

  isInformation(toast: any): boolean {
    return toast.toastType === 'I';
  }
}