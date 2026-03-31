import { Component, EventEmitter, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';
import { Caregiver } from '../../models/caregiver.model';
import { AppService } from '../../services/app.service';
import { CaregiverService } from '../../services/caregiver.service';

@Component({
  selector: 'app-cancel-screen',
  standalone: true,
  imports: [CommonModule, TranslateModule],
  providers: [AppService, CaregiverService],
  templateUrl: './cancel-screen.component.html',
  styleUrls: ['./cancel-screen.component.css']
})
export class CancelScreenComponent {

  // língua simples (igual ao que fizeste antes)
  public translateCache: string = navigator.language.startsWith('pt') ? 'pt' : 'en';

  @Output() answeredNo = new EventEmitter<void>();
  @Output() answeredYes = new EventEmitter<void>();

  public caregiver!: Caregiver | null;

  constructor(
    private appService: AppService,
    private caregiverService: CaregiverService
  ) {
    // 👇 em vez de ngOnInit (mais simples)
    this.caregiver = this.caregiverService.getCurrentCaregiver();
  }

  isRouteActive(route: string): boolean {
    return this.appService.isRouteActive(route);
  }

  clickedNo(): void {
    this.answeredNo.emit();
  }

  clickedYes(): void {
    this.answeredYes.emit();
  }
}