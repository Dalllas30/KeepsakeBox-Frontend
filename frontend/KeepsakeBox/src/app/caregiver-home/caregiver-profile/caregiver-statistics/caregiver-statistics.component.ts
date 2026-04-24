/**
 * @author Bruna Vieites - fc55792
 */

/* TODO: migrate RtSessionService, CaregiverService, and RtSessionImageService to return Observables:
         RtSessionService.getSessionListByCaregiverHistory, getSessionListByDateCaregiver still use .toPromise()
         CaregiverService.getCaregiverPatients still uses .toPromise()
         RtSessionImageService.getSessionPatientImageInformation still uses .toPromise()
         update these methods to subscribe */

import { Component, inject, OnInit, AfterViewInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';
import Chart from 'chart.js/auto';
import { ChartConfiguration } from 'chart.js';
import ChartDataLabels from 'chartjs-plugin-datalabels';
import { Session } from '../../../core/models/session.model';
import { AuthenticationService } from '../../../core/services/authentication.service';
import { RtSessionService } from '../../../core/services/rt-session.service';
import { Patient } from '../../../core/models/patient.model';
import { CaregiverService } from '../../../core/services/caregiver.service';
import { RtSessionImageService } from '../../../core/services/rt-session-image.service';
import { CategoryService } from '../../../core/services/category.service';

@Component({
  selector: 'app-caregiver-statistics',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule, TranslateModule],
  templateUrl: './caregiver-statistics.component.html',
  styleUrl: './caregiver-statistics.component.css'
})
export class CaregiverStatisticsComponent implements OnInit, AfterViewInit {
  private authenticationService = inject(AuthenticationService);
  private sessionService = inject(RtSessionService);
  private caregiverService = inject(CaregiverService);
  private rtSessionImageService = inject(RtSessionImageService);
  private categoryService = inject(CategoryService);
  private cdr = inject(ChangeDetectorRef);

  translateCache = navigator.language.startsWith('pt') ? 'pt' : 'en';

  public open: boolean = false;
  public close: boolean = true;

  public months: { id: number; name: string }[] = [
    { id: 0, name: 'allMonths' },
    { id: 1, name: 'january' },
    { id: 2, name: 'february' },
    { id: 3, name: 'march' },
    { id: 4, name: 'april' },
    { id: 5, name: 'may' },
    { id: 6, name: 'june' },
    { id: 7, name: 'july' },
    { id: 8, name: 'august' },
    { id: 9, name: 'september' },
    { id: 10, name: 'october' },
    { id: 11, name: 'november' },
    { id: 12, name: 'december' }
  ];

  public caregiverSessions: Session[] = [];
  public pList: Patient[] = [];
  public caregiverSessionsSize: number = 0;

  public tittleCharts: Array<string> = ['sessions', 'mostCoveredThemes'];
  public zoomTittle: string = '';

  public chartNPNS: any;
  public chartMTC: Chart | undefined;

  public countPositive: number = 0;
  public countNeutral: number = 0;
  public countNegative: number = 0;

  public labelsMCT: string[] = [];
  public countLabelsMCT: number[] = [];

  public monthOption: any;
  public yearsArray: number[] = [];
  public yearsSession: Session[] = [];
  public pwDArray: { id: string; name: string }[] = [];

  public imagesCategory: string[] = [];
  public imagesCategoryPerSession: { cat: string; name: string }[] = [];
  public theme1Patients: string[] = [];
  public theme2Patients: string[] = [];
  public theme3Patients: string[] = [];
  public theme4Patients: string[] = [];

  public configMCTAllPatients: any;
  public configSessionsPANAllPatients: any;

  public aferLabelPatientPositive: string[] = [];
  public aferLabelPatientNeutral: string[] = [];
  public aferLabelPatientNegative: string[] = [];

  public yearSelected: string = '';
  public monthSelected: string = '';
  public pwDSelected: string = '';

  public numberSessions: number = 0;
  public averageDurationsSessions: string = '';
  public finalAverageDurationsSessions: string = '';

  public tittleChart: string = '';

  constructor() {
    Chart.defaults.font.size = 16;
  }

  async ngOnInit(): Promise<void> {
    this.caregiverSessions = await this.sessionService.getSessionListByCaregiverHistory(
      this.authenticationService.getCurrentCaregiverToken()!
    );
    this.caregiverSessionsSize = this.caregiverSessions.length;

    this.countPositive = 0;
    this.countNeutral = 0;
    this.countNegative = 0;
    this.aferLabelPatientPositive = [];
    this.aferLabelPatientNeutral = [];
    this.aferLabelPatientNegative = [];

    this.open = false;
    this.cdr.detectChanges();
    this.close = true;

    this.yearsArray = [];
    this.pwDArray = [];

    if (this.translateCache === 'en') {
      this.pwDArray.push({ id: 'Todos', name: 'All' });
    } else {
      this.pwDArray.push({ id: 'Todos', name: 'Todos' });
    }

    this.imagesCategory = [];
    this.imagesCategoryPerSession = [];
    this.labelsMCT = [];
    this.countLabelsMCT = [];

    await this.getYears();
    await this.getPwD();

    this.monthSelected = 'allMonths';
    this.yearSelected = this.yearsArray[0]?.toString() ?? '';
    if (this.translateCache === 'en') {
      this.pwDSelected = 'All';
    } else {
      this.pwDSelected = 'Todos';
    }

    this.caregiverSessions = await this.sessionService.getSessionListByDateCaregiver(
      this.authenticationService.getCurrentCaregiverToken()!,
      this.monthSelected,
      this.yearSelected,
      this.pwDSelected
    );
    await this.countDataChart();
    await this.getConfigChartAllPatients();
    this.createChartNPNS('stackedBarChart', this.configSessionsPANAllPatients);

    await this.getLabelsMCT();
    await this.getConfigChartMostCoveredThemesAllPatients();
    this.createChartMostCoveredThemes('horizontalBarChart', this.configMCTAllPatients);

    this.countNumberSessions(this.caregiverSessions);
    this.averageDurationSessions(this.caregiverSessions);
  }

  async ngAfterViewInit(): Promise<void> {
    this.caregiverSessions = await this.sessionService.getSessionListByDateCaregiver(
      this.authenticationService.getCurrentCaregiverToken()!,
      this.monthSelected,
      this.yearSelected,
      this.pwDSelected
    );
    await this.getPwD();
    await this.countDataChart();
    await this.getConfigChartAllPatients();
    this.createChartNPNS('stackedBarChart', this.configSessionsPANAllPatients);

    await this.getLabelsMCT();
    await this.getConfigChartMostCoveredThemesAllPatients();
    this.createChartMostCoveredThemes('horizontalBarChart', this.configMCTAllPatients);

    this.countNumberSessions(this.caregiverSessions);
    this.averageDurationSessions(this.caregiverSessions);
  }

  translate(): string[] {
    if (this.translateCache === 'en') {
      return [
        'Positives',
        'Neutrals',
        'Negatives',
        'Number of Sessions',
        'Topics',
        'Emotional Reactions',
        ' hour',
        ' hours',
        ' minute ',
        ' minutes ',
        ' second',
        ' seconds'
      ];
    } else {
      return [
        'Positivas',
        'Neutras',
        'Negativas',
        'Número de Sessões',
        'Temas',
        'Reações Emocionais',
        ' hora',
        ' horas',
        ' minuto ',
        ' minutos ',
        ' segundo',
        ' segundos'
      ];
    }
  }

  async getPwD(): Promise<void> {
    this.pwDArray = [];
    if (this.translateCache === 'en') {
      this.pwDArray.push({ id: 'Todos', name: 'All' });
    } else {
      this.pwDArray.push({ id: 'Todos', name: 'Todos' });
    }
    const patientList = await this.caregiverService.getCaregiverPatients(
      this.authenticationService.getCurrentCaregiverToken()!
    );
    if(!patientList) return;
    for (let p = 0; p < (patientList?.length ?? 0); p++) {
      if (
        !this.pwDArray.some(
          (item) =>
            item.id === patientList[p].id && item.name === patientList[p].name
        )
      ) {
        this.pwDArray.push({ id: patientList[p].id, name: patientList[p].name });
      }
    }
  }

  async getYears(): Promise<void> {
    this.yearsSession = await this.sessionService.getSessionListByDateCaregiver(
      this.authenticationService.getCurrentCaregiverToken()!,
      '',
      '',
      'Todos'
    );
    for (let session = 0; session < this.yearsSession.length; session++) {
      const date = this.yearsSession[session].end_session;
      const yearString = date.toLocaleString();
      const year = Number(yearString.substring(0, 4));
      if (!this.yearsArray.includes(year)) {
        this.yearsArray.push(year);
      }
    }
  }

  async createChartNPNS(chartName: string, config: any): Promise<void> {
    const canvas = document.getElementById(chartName) as HTMLCanvasElement;
    if (canvas == null) {
      this.caregiverSessions = await this.sessionService.getSessionListByDateCaregiver(
        this.authenticationService.getCurrentCaregiverToken()!,
        this.monthSelected,
        this.yearSelected,
        this.pwDSelected
      );
      await this.countDataChart();
      if (this.pwDSelected === 'Todos' || this.pwDSelected === 'All') {
        await this.getConfigChartAllPatients();
        this.chartNPNS = new Chart(
          document.getElementById('stackedBarChart') as HTMLCanvasElement,
          config
        );
      } else {
        this.chartNPNS = new Chart(
          document.getElementById('stackedBarChart') as HTMLCanvasElement,
          this.getConfigChart()
        );
      }
    } else {
      this.chartNPNS = new Chart(canvas, config);
    }
  }

  async createChartMostCoveredThemes(
    chartName: string,
    config: any
  ): Promise<void> {
    this.chartMTC = new Chart(
      document.getElementById(chartName) as HTMLCanvasElement,
      config
    );
  }

  async getLabelsMCT(): Promise<void> {
    let count: { [key: string]: number } = {};
    let countPatients: { [key: string]: number } = {};
    this.countLabelsMCT = [];
    this.imagesCategory = [];
    this.imagesCategoryPerSession = [];
    this.theme1Patients = [];
    this.theme2Patients = [];
    this.theme3Patients = [];
    this.theme4Patients = [];

    this.caregiverSessions = await this.sessionService.getSessionListByDateCaregiver(
      this.authenticationService.getCurrentCaregiverToken()!,
      this.monthSelected,
      this.yearSelected,
      this.pwDSelected
    );

    for (let s = 0; s < this.caregiverSessions.length; s++) {
      let imagesSession = await this.rtSessionImageService.getSessionPatientImageInformation(
        this.authenticationService.getCurrentCaregiverToken()!,
        this.caregiverSessions[s].id
      );

      if (this.translateCache === 'en') {
        for (let image = 0; image < imagesSession.length; image++) {
          const translatedCategory = this.categoryService.categoryTranslation(
            imagesSession[image].category,
            'en'
          );
          imagesSession[image].category = translatedCategory;
        }
      }

      imagesSession.sort((a, b) => (a.category > b.category ? 1 : -1));

      for (let i = 0; i < imagesSession.length; i++) {
        if (!this.imagesCategory.includes(imagesSession[i].category)) {
          this.imagesCategory.push(imagesSession[i].category);
          this.imagesCategoryPerSession.push({
            cat: imagesSession[i].category,
            name: this.caregiverSessions[s].full_name
          });
        }
      }
      this.imagesCategory = [];
    }

    for (let image = 0; image < this.imagesCategoryPerSession.length; image++) {
      if (!this.labelsMCT.includes(this.imagesCategoryPerSession[image].cat)) {
        this.labelsMCT.push(this.imagesCategoryPerSession[image].cat);
      }
    }

    for (let index = 0; index < this.imagesCategoryPerSession.length; index++) {
      const element = this.imagesCategoryPerSession[index].cat;
      if (count[element]) {
        count[element] += 1;
      } else {
        count[element] = 1;
      }
    }

    const json = JSON.parse(JSON.stringify(count));
    this.labelsMCT.sort((a, b) => (a > b ? 1 : -1));
    this.labelsMCT.sort((a, b) => (count[a] > count[b] ? -1 : 1));

    this.countLabelsMCT.push(json[this.labelsMCT[0]]);
    this.countLabelsMCT.push(json[this.labelsMCT[1]]);
    this.countLabelsMCT.push(json[this.labelsMCT[2]]);
    this.countLabelsMCT.push(json[this.labelsMCT[3]]);

    let catPacients: string[] = [];
    for (let index = 0; index < 4; index++) {
      for (let p = 0; p < this.imagesCategoryPerSession.length; p++) {
        if (
          this.labelsMCT[index] ===
          this.imagesCategoryPerSession[p].cat
        ) {
          catPacients.push(this.imagesCategoryPerSession[p].name);
        }
      }

      for (let cat = 0; cat < catPacients.length; cat++) {
        const element = catPacients[cat];
        if (countPatients[element]) {
          countPatients[element] += 1;
        } else {
          countPatients[element] = 1;
        }
      }

      catPacients.sort((a, b) =>
        countPatients[a] > countPatients[b] ? -1 : 1
      );

      for (let pp = 0; pp < catPacients.length; pp++) {
        if (index === 0) {
          if (this.theme1Patients.length < 5) {
            if (!this.theme1Patients.includes(catPacients[pp])) {
              this.theme1Patients.push(catPacients[pp]);
            }
          } else {
            break;
          }
        } else if (index === 1) {
          if (this.theme2Patients.length < 5) {
            if (!this.theme2Patients.includes(catPacients[pp])) {
              this.theme2Patients.push(catPacients[pp]);
            }
          } else {
            break;
          }
        } else if (index === 2) {
          if (this.theme3Patients.length < 5) {
            if (!this.theme3Patients.includes(catPacients[pp])) {
              this.theme3Patients.push(catPacients[pp]);
            }
          } else {
            break;
          }
        } else if (index === 3) {
          if (this.theme4Patients.length < 5) {
            if (!this.theme4Patients.includes(catPacients[pp])) {
              this.theme4Patients.push(catPacients[pp]);
            }
          } else {
            break;
          }
        }
      }

      countPatients = {};
      catPacients = [];
    }
  }

  async getConfigChartMostCoveredThemesAllPatients(): Promise<void> {
    const dataAllSessionsMCT = [
      { patients: this.theme1Patients, count: this.countLabelsMCT[0] },
      { patients: this.theme2Patients, count: this.countLabelsMCT[1] },
      { patients: this.theme3Patients, count: this.countLabelsMCT[2] },
      { patients: this.theme4Patients, count: this.countLabelsMCT[3] }
    ];
    this.configMCTAllPatients = {
      type: 'bar',
      data: {
        labels: this.labelsMCT,
        datasets: [
          {
            data: dataAllSessionsMCT,
            maxBarThickness: 80,
            backgroundColor: ['rgba(0, 64, 128, 1)'],
            borderColor: ['rgba(0, 0, 82, 1)'],
            borderWidth: 2
          }
        ]
      },
      options: {
        parsing: {
          xAxisKey: 'count',
          yAxisKey: 'count'
        },
        indexAxis: 'y',
        plugins: {
          legend: {
            display: false
          },
          tooltip: {
            callbacks: {
              afterLabel: (context: any) => {
                let label = 'Top 5 : ';
                for (let axis = 0; axis < 4; axis++) {
                  if (
                    context.parsed.x !== null &&
                    context.parsed.y === axis
                  ) {
                    for (
                      let d = 0;
                      d < dataAllSessionsMCT[axis].patients.length;
                      d++
                    ) {
                      if (dataAllSessionsMCT[axis].patients.length > 1) {
                        if (
                          d ===
                          dataAllSessionsMCT[axis].patients.length - 1
                        ) {
                          label +=
                            'e ' + dataAllSessionsMCT[axis].patients[d];
                        } else if (
                          d ===
                          dataAllSessionsMCT[axis].patients.length - 2
                        ) {
                          label +=
                            dataAllSessionsMCT[axis].patients[d] + ' ';
                        } else {
                          label +=
                            dataAllSessionsMCT[axis].patients[d] + ', ';
                        }
                      } else {
                        label += dataAllSessionsMCT[axis].patients[d];
                      }
                    }
                  }
                }
                return label;
              }
            }
          }
        },
        scales: {
          x: {
            ticks: {
              stepSize: 1
            },
            title: {
              display: true,
              text: this.translate()[3],
              color: '#000052',
              font: {
                weight: 'bold'
              }
            }
          },
          y: {
            title: {
              display: true,
              text: this.translate()[4],
              color: '#000052',
              font: {
                weight: 'bold'
              }
            }
          }
        }
      }
    };
  }

  getConfigChartMostCoveredThemes(): ChartConfiguration {
    const dataMCoveredThemes = {
      labels: this.labelsMCT,
      datasets: [
        {
          data: this.countLabelsMCT,
          maxBarThickness: 80,
          backgroundColor: ['rgba(0, 64, 128, 1)'],
          borderColor: ['rgba(0, 0, 82, 1)'],
          borderWidth: 2
        }
      ]
    };
    const configMCoveredThemes: ChartConfiguration = {
      type: 'bar',
      data: dataMCoveredThemes,
      options: {
        indexAxis: 'y',
        plugins: {
          legend: {
            display: false
          }
        },
        scales: {
          x: {
            ticks: {
              stepSize: 1
            },
            title: {
              display: true,
              text: this.translate()[3],
              color: '#000052',
              font: {
                weight: 'bold'
              }
            }
          },
          y: {
            title: {
              display: true,
              text: this.translate()[4],
              color: '#000052',
              font: {
                weight: 'bold'
              }
            }
          }
        }
      }
    };
    return configMCoveredThemes;
  }

  async getConfigChartAllPatients(): Promise<void> {
    const dataAllSessions = [
      {
        patients: this.aferLabelPatientPositive,
        count: this.countPositive
      },
      {
        patients: this.aferLabelPatientNeutral,
        count: this.countNeutral
      },
      {
        patients: this.aferLabelPatientNegative,
        count: this.countNegative
      }
    ];
    this.configSessionsPANAllPatients = {
      plugins: [ChartDataLabels],
      type: 'bar',
      data: {
        labels: [
          this.translate()[0],
          this.translate()[1],
          this.translate()[2]
        ],
        datasets: [
          {
            data: dataAllSessions,
            maxBarThickness: 80,
            backgroundColor: [
              'rgba(0, 92, 0, 1)',
              'rgb(117, 117, 117)',
              'rgba(168, 0, 0, 1)'
            ]
          }
        ]
      },
      options: {
        parsing: {
          xAxisKey: 'count',
          yAxisKey: 'count'
        },
        plugins: {
          datalabels: {
            color: '#FFFFFF',
            formatter: (context: any) => {
              return JSON.stringify(context.count);
            }
          },
          legend: {
            display: false
          },
          tooltip: {
            callbacks: {
              afterLabel: (context: any) => {
                let label = 'Top 5 : ';
                for (let axis = 0; axis < 3; axis++) {
                  if (
                    context.parsed.y !== null &&
                    context.parsed.x === axis
                  ) {
                    for (
                      let d = 0;
                      d < dataAllSessions[axis].patients.length;
                      d++
                    ) {
                      if (dataAllSessions[axis].patients.length > 1) {
                        if (
                          d ===
                          dataAllSessions[axis].patients.length - 1
                        ) {
                          label +=
                            'e ' + dataAllSessions[axis].patients[d];
                        } else if (
                          d ===
                          dataAllSessions[axis].patients.length - 2
                        ) {
                          label +=
                            dataAllSessions[axis].patients[d] + ' ';
                        } else {
                          label +=
                            dataAllSessions[axis].patients[d] + ', ';
                        }
                      } else {
                        label += dataAllSessions[axis].patients[d];
                      }
                    }
                  }
                }
                return label;
              }
            }
          }
        },
        scales: {
          x: {
            stacked: true,
            title: {
              display: true,
              text: this.translate()[5],
              color: '#000052',
              font: {
                weight: 'bold'
              }
            }
          },
          y: {
            stacked: true,
            ticks: {
              stepSize: 1
            },
            title: {
              display: true,
              text: this.translate()[3],
              color: '#000052',
              font: {
                weight: 'bold'
              }
            }
          }
        }
      }
    };
  }

  getConfigChart(): ChartConfiguration {
    const dataSessions = {
      labels: [
        this.translate()[0],
        this.translate()[1],
        this.translate()[2]
      ],
      datasets: [
        {
          data: [this.countPositive, this.countNeutral, this.countNegative],
          maxBarThickness: 80,
          backgroundColor: [
            'rgba(0, 92, 0, 1)',
            'rgb(117, 117, 117)',
            'rgba(168, 0, 0, 1)'
          ]
        }
      ]
    };
    const configSessionsPAN: ChartConfiguration = {
      plugins: [ChartDataLabels],
      type: 'bar',
      data: dataSessions,
      options: {
        plugins: {
          datalabels: {
            color: '#FFFFFF'
          },
          legend: {
            display: false
          }
        },
        scales: {
          x: {
            stacked: true,
            title: {
              display: true,
              text: this.translate()[5],
              color: '#000052',
              font: {
                weight: 'bold'
              }
            }
          },
          y: {
            stacked: true,
            ticks: {
              stepSize: 1
            },
            title: {
              display: true,
              text: this.translate()[3],
              color: '#000052',
              font: {
                weight: 'bold'
              }
            }
          }
        }
      }
    };
    return configSessionsPAN;
  }

  async countDataChart(): Promise<void> {
    const countP: { [key: string]: number } = {};
    const countNeu: { [key: string]: number } = {};
    const countNeg: { [key: string]: number } = {};

    this.countPositive = 0;
    this.countNeutral = 0;
    this.countNegative = 0;

    const patientPositive: string[] = [];
    const allPatientPositive: string[] = [];
    const patientNeutral: string[] = [];
    const allPatientNeutral: string[] = [];
    const patientNegative: string[] = [];
    const allPatientNegative: string[] = [];

    this.aferLabelPatientPositive = [];
    this.aferLabelPatientNeutral = [];
    this.aferLabelPatientNegative = [];

    for (let i = 0; i < this.caregiverSessions.length; i++) {
      if (
        this.caregiverSessions[i].patient_feedback === 1 ||
        this.caregiverSessions[i].patient_feedback === 2
      ) {
        this.countNegative++;
        patientNegative.push(this.caregiverSessions[i].full_name);
      } else if (this.caregiverSessions[i].patient_feedback === 3) {
        this.countNeutral++;
        patientNeutral.push(this.caregiverSessions[i].full_name);
      } else if (
        this.caregiverSessions[i].patient_feedback === 4 ||
        this.caregiverSessions[i].patient_feedback === 5
      ) {
        this.countPositive++;
        patientPositive.push(this.caregiverSessions[i].full_name);
      }
    }

    for (let pp = 0; pp < patientPositive.length; pp++) {
      if (!allPatientPositive.includes(patientPositive[pp])) {
        allPatientPositive.push(patientPositive[pp]);
      }
    }

    for (let index = 0; index < patientPositive.length; index++) {
      const element = patientPositive[index];
      if (countP[element]) {
        countP[element] += 1;
      } else {
        countP[element] = 1;
      }
    }
    allPatientPositive.sort((a, b) => (countP[a] > countP[b] ? -1 : 1));

    for (let pp = 0; pp < 5; pp++) {
      if (allPatientPositive[pp] != null) {
        this.aferLabelPatientPositive.push(allPatientPositive[pp]);
      }
    }

    for (let pn = 0; pn < patientNeutral.length; pn++) {
      if (!allPatientNeutral.includes(patientNeutral[pn])) {
        allPatientNeutral.push(patientNeutral[pn]);
      }
    }

    for (let index = 0; index < patientNeutral.length; index++) {
      const element = patientNeutral[index];
      if (countNeu[element]) {
        countNeu[element] += 1;
      } else {
        countNeu[element] = 1;
      }
    }
    allPatientNeutral.sort((a, b) => (countNeu[a] > countNeu[b] ? -1 : 1));

    for (let pp = 0; pp < 5; pp++) {
      if (allPatientNeutral[pp] != null) {
        this.aferLabelPatientNeutral.push(allPatientNeutral[pp]);
      }
    }

    for (let pn = 0; pn < patientNegative.length; pn++) {
      if (!allPatientNegative.includes(patientNegative[pn])) {
        allPatientNegative.push(patientNegative[pn]);
      }
    }

    for (let index = 0; index < patientNegative.length; index++) {
      const element = patientNegative[index];
      if (countNeg[element]) {
        countNeg[element] += 1;
      } else {
        countNeg[element] = 1;
      }
    }
    allPatientNegative.sort((a, b) => (countNeg[a] > countNeg[b] ? -1 : 1));

    for (let pp = 0; pp < 5; pp++) {
      if (allPatientNegative[pp] != null) {
        this.aferLabelPatientNegative.push(allPatientNegative[pp]);
      }
    }
  }

  async showChart(
    filterPatient: any,
    filtersMonth: any,
    filtersYear: any
  ): Promise<void> {
    this.caregiverSessions = await this.sessionService.getSessionListByDateCaregiver(
      this.authenticationService.getCurrentCaregiverToken()!,
      filtersMonth,
      filtersYear,
      this.pwDSelected
    );
    if (this.caregiverSessions.length !== 0) {
      this.chartNPNS.destroy();
      if (this.chartMTC) {
        this.chartMTC.destroy();
      }

      if (this.open) {
        if (this.tittleChart === 'sessions') {
          await this.countDataChart();
          if (
            this.pwDSelected === 'Todos' ||
            this.pwDSelected === 'All'
          ) {
            await this.getConfigChartAllPatients();
            this.createChartNPNS(
              'stackedBarChart',
              this.configSessionsPANAllPatients
            );
          } else {
            this.createChartNPNS('stackedBarChart', this.getConfigChart());
          }
        } else if (this.tittleChart === 'mostCoveredThemes') {
          await this.getLabelsMCT();
          if (
            this.pwDSelected === 'Todos' ||
            this.pwDSelected === 'All'
          ) {
            await this.getConfigChartMostCoveredThemesAllPatients();
            this.createChartMostCoveredThemes(
              'horizontalBarChart',
              this.configMCTAllPatients
            );
          } else {
            this.createChartMostCoveredThemes(
              'horizontalBarChart',
              this.getConfigChartMostCoveredThemes()
            );
          }
        }
      } else {
        await this.countDataChart();
        if (
          this.pwDSelected === 'Todos' ||
          this.pwDSelected === 'All'
        ) {
          await this.getConfigChartAllPatients();
          if (this.chartNPNS) {
            await this.chartNPNS.destroy();
          }
          this.createChartNPNS(
            'stackedBarChart',
            this.configSessionsPANAllPatients
          );
        } else {
          this.createChartNPNS('stackedBarChart', this.getConfigChart());
        }

        await this.getLabelsMCT();
        if (
          this.pwDSelected === 'Todos' ||
          this.pwDSelected === 'All'
        ) {
          await this.getConfigChartMostCoveredThemesAllPatients();
          this.createChartMostCoveredThemes(
            'horizontalBarChart',
            this.configMCTAllPatients
          );
        } else {
          this.createChartMostCoveredThemes(
            'horizontalBarChart',
            this.getConfigChartMostCoveredThemes()
          );
        }

        this.countNumberSessions(this.caregiverSessions);
        this.averageDurationSessions(this.caregiverSessions);
      }
    }
  }

  async onPwDChanged(filtersPwD: any): Promise<void> {
    const pwDString = filtersPwD.target.value;
    this.pwDSelected = pwDString;

    this.showChart(this.pwDSelected, this.monthSelected, this.yearSelected);
  }

  async onYearChanged(filtersYear: any): Promise<void> {
    const yearString = filtersYear.target.value;
    this.yearSelected = yearString;

    this.showChart(this.pwDSelected, this.monthSelected, this.yearSelected);
  }

  async onMonthChanged(filtersMonth: any): Promise<void> {
    this.monthSelected = this.months[filtersMonth.target.value].name;

    this.showChart(this.pwDSelected, this.monthSelected, this.yearSelected);
  }

  countNumberSessions(session: Session[]): void {
    this.numberSessions = session.length;
  }

  averageDurationSessions(session: Session[]): void {
    let totalDuration = '00:00:00';

    for (let s = 0; s < session.length; s++) {
      const a = totalDuration.split(':');
      const seconds = +a[0] * 60 * 60 + +a[1] * 60 + +a[2];

      const nduration = session[s].duration.toLocaleString();
      const b = nduration.split(':');
      const seconds2 = +b[0] * 60 * 60 + +b[1] * 60 + +b[2];

      const date = new Date(1970, 0, 1);
      date.setSeconds(seconds + seconds2);

      const c = date
        .toTimeString()
        .replace(/.*(\d{2}:\d{2}:\d{2}).*/, '$1');
      totalDuration = c;
    }

    const d = totalDuration.split(':');
    const convertSecondsToTime = (
      (+d[0] * 60 * 60 + +d[1] * 60 + +d[2]) /
      session.length
    );

    this.averageDurationsSessions = new Date(convertSecondsToTime * 1000)
      .toISOString()
      .substr(11, 8);

    const hour = this.averageDurationsSessions.substring(0, 2);
    const minute = this.averageDurationsSessions.substring(3, 5);
    const second = this.averageDurationsSessions.substring(6, 8);
    let finalHour: string;
    let finalMinute: string;
    let finalSecond: string;

    if (hour === '00') {
      finalHour = '';
    } else if (hour === '01') {
      finalHour =
        this.averageDurationsSessions.substring(1, 2) +
        this.translate()[6] +
        ' ';
    } else if (this.averageDurationsSessions.substring(0, 1) === '0') {
      finalHour =
        this.averageDurationsSessions.substring(1, 2) +
        this.translate()[7] +
        ' ';
    } else {
      finalHour = hour + this.translate()[7];
    }

    if (minute === '00') {
      finalMinute = '';
    } else if (minute === '01') {
      finalMinute =
        this.averageDurationsSessions.substring(4, 5) +
        this.translate()[8];
    } else if (this.averageDurationsSessions.substring(3, 4) === '0') {
      finalMinute =
        this.averageDurationsSessions.substring(4, 5) +
        this.translate()[9];
    } else {
      finalMinute = minute + this.translate()[9];
    }

    if (second === '00') {
      finalSecond = '';
    } else if (second === '01') {
      finalSecond =
        this.averageDurationsSessions.substring(7, 8) +
        this.translate()[10];
    } else if (this.averageDurationsSessions.substring(6, 7) === '0') {
      finalSecond =
        this.averageDurationsSessions.substring(7, 8) +
        this.translate()[11];
    } else {
      finalSecond = second + this.translate()[11];
    }

    this.finalAverageDurationsSessions =
      finalHour + finalMinute + finalSecond;
  }

  async openChart(tittle: string): Promise<void> {
    this.tittleChart = tittle;

    this.open = !this.open;
    this.close = false;
    this.zoomTittle = tittle;

    this.showChart(this.pwDSelected, this.monthSelected, this.yearSelected);
  }

  async closeChart(): Promise<void> {
    this.close = !this.close;
    this.open = false;

    this.showChart(this.pwDSelected, this.monthSelected, this.yearSelected);
  }
}
