import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { TranslateModule } from '@ngx-translate/core';
import { BirthDate } from '../../models/birth-date.model';

@Component({
  selector: 'app-birth-date-input',
  standalone: true,
  imports: [CommonModule, FormsModule, TranslateModule],
  templateUrl: './birth-date-input.component.html',
  styleUrls: ['./birth-date-input.component.css']
})
export class BirthDateInputComponent {

  public translateCache: string = navigator.language.startsWith('pt') ? 'pt' : 'en';

  @Input() birthDate!: BirthDate;

  private monthsWith30days = ['3','5','8','10'];
  private monthsWith31days = ['0','2','4','6','7','9','11'];

  public days = Array.from({ length: 31 }, (_, i) => i + 1);

  public monthsPT = [
    {id:0,name:"Janeiro"}, {id:1,name:"Fevereiro"}, {id:2,name:"Março"},
    {id:3,name:"Abril"}, {id:4,name:"Maio"}, {id:5,name:"Junho"},
    {id:6,name:"Julho"}, {id:7,name:"Agosto"}, {id:8,name:"Setembro"},
    {id:9,name:"Outubro"}, {id:10,name:"Novembro"}, {id:11,name:"Dezembro"}
  ];

  public monthsENG = [
    {id:0,name:"January"}, {id:1,name:"February"}, {id:2,name:"March"},
    {id:3,name:"April"}, {id:4,name:"May"}, {id:5,name:"June"},
    {id:6,name:"July"}, {id:7,name:"August"}, {id:8,name:"September"},
    {id:9,name:"October"}, {id:10,name:"November"}, {id:11,name:"December"}
  ];

  public years = this.getYears();

  getYears(): number[] {
    const currentYear = new Date().getFullYear();
    return Array.from({ length: currentYear - 1900 }, (_, i) => currentYear - i - 1);
  }

  validateSelectedDate() {
    if (this.birthDate.day && this.birthDate.month !== -1 && this.birthDate.year) {
      this.birthDate.validDate = this.yearDayValidation();
    } else {
      this.birthDate.validDate = true;
    }
  }

  yearDayValidation(): boolean {
    const y = this.birthDate.year;
    const isLeap = (y % 4 === 0 && y % 100 !== 0) || (y % 400 === 0);
    return isLeap ? this.validateLeap() : this.validateNormal();
  }

  validateLeap(): boolean {
    if (this.monthsWith30days.includes(this.birthDate.month.toString())) return this.birthDate.day <= 30;
    if (this.monthsWith31days.includes(this.birthDate.month.toString())) return this.birthDate.day <= 31;
    return this.birthDate.day <= 29;
  }

  validateNormal(): boolean {
    if (this.monthsWith30days.includes(this.birthDate.month.toString())) return this.birthDate.day <= 30;
    if (this.monthsWith31days.includes(this.birthDate.month.toString())) return this.birthDate.day <= 31;
    return this.birthDate.day <= 28;
  }
}