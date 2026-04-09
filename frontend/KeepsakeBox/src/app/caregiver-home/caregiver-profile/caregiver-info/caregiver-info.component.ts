import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';
import { RouterLink } from '@angular/router';
import { Caregiver } from '../../../core/models/caregiver.model';
import { CaregiverService } from '../../../core/services/caregiver.service';

@Component({
  selector: 'app-caregiver-info',
  standalone: true,
  imports: [CommonModule, TranslateModule, RouterLink],
  templateUrl: './caregiver-info.component.html',
  styleUrls: ['./caregiver-info.component.css']
})
export class CaregiverInfoComponent implements OnInit {
  public caregiver!: Caregiver;

  constructor(private caregiverService: CaregiverService) {}

  ngOnInit(): void {
    this.caregiver = this.caregiverService.getCurrentCaregiver()!;
  }
}