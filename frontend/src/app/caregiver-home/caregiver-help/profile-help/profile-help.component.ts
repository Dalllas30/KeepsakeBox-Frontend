import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { TranslateModule } from '@ngx-translate/core';
import { Caregiver } from '../../../core/models/caregiver.model';
import { CaregiverService } from '../../../core/services/caregiver.service';
import { RouterLink } from '@angular/router';


@Component({
  selector: 'app-profile-help',
  standalone: true,
  imports: [CommonModule, TranslateModule, RouterLink],
  templateUrl: './profile-help.component.html',
  styleUrls: ['./profile-help.component.css']
})
export class ProfileHelpComponent implements OnInit {

  //Current caregiver
  public caregiver!: Caregiver;

  constructor(public caregiverService: CaregiverService) { }

  ngOnInit(): void {
    this.caregiver = this.caregiverService.getCurrentCaregiver()!;
  }

}
