import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';
import { RouterOutlet, RouterLink } from '@angular/router';
import { Caregiver } from '../../core/models/caregiver.model';
import { AppService } from '../../core/services/app.service';
import { CaregiverService } from '../../core/services/caregiver.service';

@Component({
  selector: 'app-caregiver-help',
  standalone: true,
  imports: [CommonModule, TranslateModule, RouterOutlet, RouterLink],
  templateUrl: './caregiver-help.component.html',
  styleUrls: ['./caregiver-help.component.css']
})
export class CaregiverHelpComponent implements OnInit {
  public caregiver!: Caregiver;

  constructor(
    public caregiverService: CaregiverService,
    public appService: AppService
  ) {}

  ngOnInit(): void {
    this.caregiver = this.caregiverService.getCurrentCaregiver()!;
  }

  public isRouteActive(route: string): boolean {
    return this.appService.isRouteActive(route);
  }

  hideHelp(): boolean {
    return this.isRouteActive('caregiver/help/profile');
  }
}