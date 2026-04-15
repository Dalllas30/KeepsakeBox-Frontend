import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-popup-confirmation',
  standalone: true,
  imports: [CommonModule, TranslateModule],
  templateUrl: './popup-confirmation.component.html',
  styleUrls: ['./popup-confirmation.component.css']
})
export class PopupConfirmationComponent {

  @Input() message!: string;
  @Input() help!: string;
  @Input() showHelp = false;
  @Input() fullWindow = true;

  constructor(private activeModal: NgbActiveModal) {}

  public decline() {
    this.activeModal.close(false);
  }

  public accept() {
    this.activeModal.close(true);
  }

  public dismiss() {
    this.activeModal.dismiss();
  }
}