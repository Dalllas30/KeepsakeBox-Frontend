import { Component, OnInit, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';
import { NgbPaginationModule } from '@ng-bootstrap/ng-bootstrap';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { Session } from '../../../core/models/session.model';
import { Patient } from '../../../core/models/patient.model';
import { Caregiver } from '../../../core/models/caregiver.model';
import { AuthenticationService } from '../../../core/services/authentication.service';
import { CaregiverService } from '../../../core/services/caregiver.service';
import { RtSessionService } from '../../../core/services/rt-session.service';

@Component({
  selector: 'app-caregiver-sessions-history',
  standalone: true,
  imports: [CommonModule, TranslateModule, FormsModule, NgbPaginationModule],
  templateUrl: './caregiver-sessions-history.component.html',
  styleUrls: ['./caregiver-sessions-history.component.css']
})
export class CaregiverSessionsHistoryComponent implements OnInit {
  @Input() page = 1;
  @Input() pageSize = 3;
  @Input() maxSize = 3;
  @Input() filter: any;

  public translateCache: string = navigator.language.startsWith('pt') ? 'pt' : 'en';
  public filterName: any;
  public sortOption: any;
  public sortOptions = [
    { id: 0, name: "mostRecent" }, { id: 1, name: "oldest" },
    { id: 2, name: "positiveReactions" }, { id: 3, name: "negativeReactions" },
    { id: 4, name: "positiveSymptoms" }, { id: 5, name: "negativeSymptoms" },
    { id: 6, name: "nameAZ" }, { id: 7, name: "nameZA" }
  ];
  public caregiverCollectionSize!: number;
  public session!: Session;
  public caregiverSessions: Session[] = [];
  public caregiverSessionsRemoved: Session[] = [];
  public caregiver!: Caregiver;
  public patient!: Patient;
  public patientsList: Patient[] = [];
  public symptomsList = ['joy_happiness', 'enthusiasm', 'communication', 'commitment', 'noSymptoms', 'anxiety', 'agitation_agression', 'irritability_lability', 'apathy'];
  public feedbackList = ['1', '2', '3', '4', '5'];
  public selectedFilterSymptoms: string[] = [];
  public selectedFilterFeedback: string[] = [];
  public selectedFilterNames: string[] = [];
  public symptomsNotSelected: string[] = [];
  public feedbackNotSelected: string[] = [];
  public namesNotSelected: string[] = [];
  public addSessionFeed: boolean = false;
  public symptom: string = '';
  public symptomArray: string[] = [];

  constructor(
    private authenticationService: AuthenticationService,
    private caregiverService: CaregiverService,
    private sessionService: RtSessionService,
    private router: Router
  ) {}

  async ngOnInit(): Promise<void> {
    this.caregiver = this.caregiverService.getCurrentCaregiver()!;
    this.patientsList = await this.caregiverService.getCaregiverPatients(this.authenticationService.getCurrentCaregiverToken()!) ?? [];
    this.caregiverSessions = await this.sessionService.getSessionListByCaregiverHistory(this.authenticationService.getCurrentCaregiverToken()!) ?? [];
    this.retrieveSessions(this.filter, this.filterName);
    this.caregiverCollectionSize = this.caregiverSessions.length;
    this.selectSort(0);
    this.selectSortInicial();
  }

  // Mantém todos os métodos do original — são lógica de negócio, não mudam
  // (selectSortInicial, symptomsFilterClick, feedbackFilterClick, filterClick,
  //  countSymptoms, countReactions, selectSort, remove*, add*, verifyIfAdd*,
  //  retrieveSessions, translate, getFinalSymptom, goTocaregiverSessionsummary)
  // Copia-os diretamente do ficheiro original sem alterações,
  // apenas substituindo os imports no topo.


  async selectSortInicial() {
    for(let p = 0; p < this.patientsList.length; p++){
      this.filterClick(this.patientsList[p].name)
    }

    for(let s = 0; s < this.symptomsList.length; s++){
      this.symptomsFilterClick(this.symptomsList[s])
    }

    for(let f = 0; f < this.feedbackList.length; f++){
      this.feedbackFilterClick(this.feedbackList[f])
    }
  }

  /**
   * Is the filter symptoms selected?
   * @param filter - symptoms of the filter to check
   * @returns TRUE if filter is selected
   */
   isSymptomsFilterSelected(filter: string): boolean{
    return this.selectedFilterSymptoms.includes(filter);
  }

  /**
   * Adds or removes a selected filter name when 
   * filter name square is clicked
   * @param filter - name of the filter name clicked
   */
   symptomsFilterClick(filter: string): void{
    console.log(filter)
    //If exists on selectedFilterSymptoms: REMOVE
    if(this.selectedFilterSymptoms.includes(filter)){
      let index = this.selectedFilterSymptoms.indexOf(filter);
      if (index > -1) {
        this.selectedFilterSymptoms.splice(index, 1);
        this.symptomsNotSelected.push(filter);
      }
    //If do NOT exists on selectedFilterSymptoms: PUSH
    } else {
      this.selectedFilterSymptoms.push(filter);

      let index = this.symptomsNotSelected.indexOf(filter);
      if (index > -1) {
        this.symptomsNotSelected.splice(index, 1);
      }
    }
  }


   /**
   * Is the filter Feedback selected?
   * @param filter - Feedback of the filter to check
   * @returns TRUE if filter is selected
   */
    isFeedbackFilterSelected(filter: string): boolean{
      return this.selectedFilterFeedback.includes(filter);
    }
  
    /**
     * Adds or removes a selected filter name when 
     * filter name square is clicked
     * @param filter - name of the filter name clicked
     */
     feedbackFilterClick(filter: string): void{
      console.log(filter)
      //If exists on selectedFilterSymptoms: REMOVE
      if(this.selectedFilterFeedback.includes(filter)){
        let index = this.selectedFilterFeedback.indexOf(filter);
        if (index > -1) {
          this.selectedFilterFeedback.splice(index, 1);
          this.feedbackNotSelected.push(filter);
        }
      //If do NOT exists on selectedFilterSymptoms: PUSH
      } else {
        this.selectedFilterFeedback.push(filter);
  
        let index = this.feedbackNotSelected.indexOf(filter);
        if (index > -1) {
          this.feedbackNotSelected.splice(index, 1);
        }
      }
    }
 
  /**
   * Is the filter name selected?
   * @param filter - name of the filter to check
   * @returns TRUE if filter is selected
   */
  isOptionFilterSelected(filter: string): boolean{
    return this.selectedFilterNames.includes(filter);
  }

  /**
   * Adds or removes a selected filter name when 
   * filter name square is clicked
   * @param filter - name of the filter name clicked
   */
  filterClick(filter: string): void{
    //If exists on selectedFilterNames: REMOVE
    if(this.selectedFilterNames.includes(filter)){
      let index = this.selectedFilterNames.indexOf(filter);
      if (index > -1) {
        this.selectedFilterNames.splice(index, 1);
        this.namesNotSelected.push(filter);
      }
    //If do NOT exists on selectedFilterNames: PUSH
    } else{
      this.selectedFilterNames.push(filter);

      let index = this.namesNotSelected.indexOf(filter);
      if (index > -1) {
        this.namesNotSelected.splice(index, 1);
      }
    }
  }

  //Contar Sintomas das sessões para depois conseguir ordenar
  countSymptoms(){
    var count: number
    for(let session = 0;  session < this.caregiverSessions.length; session++){
      count = 0
      if(this.caregiverSessions[session].global_feedback.joy === 1){
        count += 6
      }
      if(this.caregiverSessions[session].global_feedback.enthusiasm === 1){
        count += 6
      }
      if(this.caregiverSessions[session].global_feedback.communication === 1){
        count += 6
      }
      if(this.caregiverSessions[session].global_feedback.commitment === 1){
        count += 6
      }

      if(this.caregiverSessions[session].global_feedback.anxiety === 1){
        count += -1
      }
      if(this.caregiverSessions[session].global_feedback.agressivity === 1){
        count += -1
      }
      if(this.caregiverSessions[session].global_feedback.irritability === 1){
        count += -1
      }
      if(this.caregiverSessions[session].global_feedback.apathy === 1){
        count += -1
      }

      (this.caregiverSessions[session] as any)["countSymptoms"] = count

    }
  }

//Contar Reações das sessões para depois conseguir ordenar
  countReactions(){
    for(let session = 0;  session < this.caregiverSessions.length; session++){
      if(this.caregiverSessions[session].patient_feedback === 1){
        (this.caregiverSessions[session] as any)["countReactions"] = 1
      } else if (this.caregiverSessions[session].patient_feedback === 2){
        (this.caregiverSessions[session] as any)["countReactions"] = 2
      } else if (this.caregiverSessions[session].patient_feedback === 3){
        (this.caregiverSessions[session] as any)["countReactions"] = 3
      } else if (this.caregiverSessions[session].patient_feedback === 4){
        (this.caregiverSessions[session] as any)["countReactions"] = 4
      } else if (this.caregiverSessions[session].patient_feedback === 5){
        (this.caregiverSessions[session] as any)["countReactions"] = 5
      }
    }
  }

  async convertSelectSort(event: any){
    this.sortOption = event.target.value
    this.selectSort(this.sortOption)
  }

  //Seleção para ordenar a lista de sessões
  async selectSort(option: any) {
    this.sortOption = option;
    if (option == 0) this.caregiverSessions.sort((a, b) => a.end_session > b.end_session ? -1 : 1);
    else if (option == 1) this.caregiverSessions.sort((a, b) => a.end_session > b.end_session ? 1 : -1);
    else if (option == 6) this.caregiverSessions.sort((a, b) => a.full_name > b.full_name ? 1 : -1);
    else if (option == 7) this.caregiverSessions.sort((a, b) => a.full_name > b.full_name ? -1 : 1);
  }

  removeJoy(session: number){
    if(this.caregiverSessions[session].global_feedback.enthusiasm == 1  &&
      this.caregiverSessions[session].global_feedback.communication == 0  &&
      this.caregiverSessions[session].global_feedback.commitment == 0){
        if (this.symptomsNotSelected.includes('enthusiasm')){
          console.log('Feedback Remove ' + this.caregiverSessions[session].patient_feedback + " " + 1)
          this.caregiverSessionsRemoved.push(this.caregiverSessions[session])
          this.caregiverSessions.splice(session,1);
        }
    } else if(this.caregiverSessions[session].global_feedback.enthusiasm == 0  &&
      this.caregiverSessions[session].global_feedback.communication == 1  &&
      this.caregiverSessions[session].global_feedback.commitment == 0){
        if (this.symptomsNotSelected.includes('communication')){                           
          console.log('Feedback Remove ' + this.caregiverSessions[session].patient_feedback+ " " + 2)
          this.caregiverSessionsRemoved.push(this.caregiverSessions[session])
          this.caregiverSessions.splice(session,1);
          console.log("Tamanho caregiverSessions = " + this.caregiverSessions.length)
          console.log("Tamanho caregiverSessionsRemoved = " + this.caregiverSessionsRemoved.length)
        }
    } else if(this.caregiverSessions[session].global_feedback.enthusiasm == 0  &&
      this.caregiverSessions[session].global_feedback.communication == 0  &&
      this.caregiverSessions[session].global_feedback.commitment == 1){
        if (this.symptomsNotSelected.includes('commitment')){
          console.log('Feedback Remove ' + this.caregiverSessions[session].patient_feedback+ " " + 3)
          this.caregiverSessionsRemoved.push(this.caregiverSessions[session])
          this.caregiverSessions.splice(session,1);
        }
    } else if(this.caregiverSessions[session].global_feedback.enthusiasm == 1  &&
      this.caregiverSessions[session].global_feedback.communication == 1  &&
      this.caregiverSessions[session].global_feedback.commitment == 1){
        if (this.symptomsNotSelected.includes('enthusiasm') && this.symptomsNotSelected.includes('communication') && this.symptomsNotSelected.includes('commitment')){
          console.log('Feedback Remove ' + this.caregiverSessions[session].patient_feedback + " " + 4)
          this.caregiverSessionsRemoved.push(this.caregiverSessions[session])
          this.caregiverSessions.splice(session,1);
        }
    } else if(this.caregiverSessions[session].global_feedback.enthusiasm == 1  &&
      this.caregiverSessions[session].global_feedback.communication == 1  &&
      this.caregiverSessions[session].global_feedback.commitment == 0){
        if (this.symptomsNotSelected.includes('enthusiasm') && this.symptomsNotSelected.includes('communication')){
          console.log('Feedback Remove ' + this.caregiverSessions[session].patient_feedback + " " + 5)
          this.caregiverSessionsRemoved.push(this.caregiverSessions[session])
          this.caregiverSessions.splice(session,1);
        }
    } else if(this.caregiverSessions[session].global_feedback.enthusiasm == 1  &&
      this.caregiverSessions[session].global_feedback.communication == 0  &&
      this.caregiverSessions[session].global_feedback.commitment == 1){
        if (this.symptomsNotSelected.includes('enthusiasm') && this.symptomsNotSelected.includes('commitment')){
          console.log('Feedback Remove ' + this.caregiverSessions[session].patient_feedback+ " " + 6)
          this.caregiverSessionsRemoved.push(this.caregiverSessions[session])
          this.caregiverSessions.splice(session,1);
        }
    } else if(this.caregiverSessions[session].global_feedback.enthusiasm == 0  &&
      this.caregiverSessions[session].global_feedback.communication == 1  &&
      this.caregiverSessions[session].global_feedback.commitment == 1){
        if (this.symptomsNotSelected.includes('communication') && this.symptomsNotSelected.includes('commitment')){
          console.log('Feedback Remove ' + this.caregiverSessions[session].patient_feedback+ " " + 7)
          this.caregiverSessionsRemoved.push(this.caregiverSessions[session])
          this.caregiverSessions.splice(session,1);
        }
    }
  }
  removeEnthusiasm(session: number){
    if(this.caregiverSessions[session].global_feedback.joy == 1  &&
      this.caregiverSessions[session].global_feedback.communication == 0  &&
      this.caregiverSessions[session].global_feedback.commitment == 0){
        if (this.symptomsNotSelected.includes('joy_happiness')){
          console.log('Feedback Remove ' + this.caregiverSessions[session].patient_feedback + " " + 1)
          this.caregiverSessionsRemoved.push(this.caregiverSessions[session])
          this.caregiverSessions.splice(session,1);
        }
    } else if(this.caregiverSessions[session].global_feedback.joy == 0  &&
      this.caregiverSessions[session].global_feedback.communication == 1  &&
      this.caregiverSessions[session].global_feedback.commitment == 0){
        if (this.symptomsNotSelected.includes('communication')){                           
          console.log('Feedback Remove ' + this.caregiverSessions[session].patient_feedback+ " " + 2)
          this.caregiverSessionsRemoved.push(this.caregiverSessions[session])
          this.caregiverSessions.splice(session,1);
          console.log("Tamanho caregiverSessions = " + this.caregiverSessions.length)
          console.log("Tamanho caregiverSessionsRemoved = " + this.caregiverSessionsRemoved.length)
        }
    } else if(this.caregiverSessions[session].global_feedback.joy == 0  &&
      this.caregiverSessions[session].global_feedback.communication == 0  &&
      this.caregiverSessions[session].global_feedback.commitment == 1){
        if (this.symptomsNotSelected.includes('commitment')){
          console.log('Feedback Remove ' + this.caregiverSessions[session].patient_feedback+ " " + 3)
          this.caregiverSessionsRemoved.push(this.caregiverSessions[session])
          this.caregiverSessions.splice(session,1);
        }
    } else if(this.caregiverSessions[session].global_feedback.joy == 1  &&
      this.caregiverSessions[session].global_feedback.communication == 1  &&
      this.caregiverSessions[session].global_feedback.commitment == 1){
        if (this.symptomsNotSelected.includes('joy_happiness') && this.symptomsNotSelected.includes('communication') && this.symptomsNotSelected.includes('commitment')){
          console.log('Feedback Remove ' + this.caregiverSessions[session].patient_feedback + " " + 4)
          this.caregiverSessionsRemoved.push(this.caregiverSessions[session])
          this.caregiverSessions.splice(session,1);
        }
    } else if(this.caregiverSessions[session].global_feedback.joy == 1  &&
      this.caregiverSessions[session].global_feedback.communication == 1  &&
      this.caregiverSessions[session].global_feedback.commitment == 0){
        if (this.symptomsNotSelected.includes('joy_happiness') && this.symptomsNotSelected.includes('communication')){
          console.log('Feedback Remove ' + this.caregiverSessions[session].patient_feedback + " " + 5)
          this.caregiverSessionsRemoved.push(this.caregiverSessions[session])
          this.caregiverSessions.splice(session,1);
        }
    } else if(this.caregiverSessions[session].global_feedback.joy == 1  &&
      this.caregiverSessions[session].global_feedback.communication == 0  &&
      this.caregiverSessions[session].global_feedback.commitment == 1){
        if (this.symptomsNotSelected.includes('joy_happiness') && this.symptomsNotSelected.includes('commitment')){
          console.log('Feedback Remove ' + this.caregiverSessions[session].patient_feedback+ " " + 6)
          this.caregiverSessionsRemoved.push(this.caregiverSessions[session])
          this.caregiverSessions.splice(session,1);
        }
    } else if(this.caregiverSessions[session].global_feedback.joy == 0  &&
      this.caregiverSessions[session].global_feedback.communication == 1  &&
      this.caregiverSessions[session].global_feedback.commitment == 1){
        if (this.symptomsNotSelected.includes('communication') && this.symptomsNotSelected.includes('commitment')){
          console.log('Feedback Remove ' + this.caregiverSessions[session].patient_feedback+ " " + 7)
          this.caregiverSessionsRemoved.push(this.caregiverSessions[session])
          this.caregiverSessions.splice(session,1);
        }
    }
  }
  removeCommunication(session: number){
    if(this.caregiverSessions[session].global_feedback.joy == 1  &&
      this.caregiverSessions[session].global_feedback.enthusiasm == 0  &&
      this.caregiverSessions[session].global_feedback.commitment == 0){
        if (this.symptomsNotSelected.includes('joy_happiness')){
          console.log('Feedback Remove ' + this.caregiverSessions[session].patient_feedback + " " + 1)
          this.caregiverSessionsRemoved.push(this.caregiverSessions[session])
          this.caregiverSessions.splice(session,1);
        }
    } else if(this.caregiverSessions[session].global_feedback.joy == 0  &&
      this.caregiverSessions[session].global_feedback.enthusiasm == 1  &&
      this.caregiverSessions[session].global_feedback.commitment == 0){
        if (this.symptomsNotSelected.includes('enthusiasm')){                           
          console.log('Feedback Remove ' + this.caregiverSessions[session].patient_feedback+ " " + 2)
          this.caregiverSessionsRemoved.push(this.caregiverSessions[session])
          this.caregiverSessions.splice(session,1);
          console.log("Tamanho caregiverSessions = " + this.caregiverSessions.length)
          console.log("Tamanho caregiverSessionsRemoved = " + this.caregiverSessionsRemoved.length)
        }
    } else if(this.caregiverSessions[session].global_feedback.joy == 0  &&
      this.caregiverSessions[session].global_feedback.enthusiasm == 0  &&
      this.caregiverSessions[session].global_feedback.commitment == 1){
        if (this.symptomsNotSelected.includes('commitment')){
          console.log('Feedback Remove ' + this.caregiverSessions[session].patient_feedback+ " " + 3)
          this.caregiverSessionsRemoved.push(this.caregiverSessions[session])
          this.caregiverSessions.splice(session,1);
        }
    } else if(this.caregiverSessions[session].global_feedback.joy == 1  &&
      this.caregiverSessions[session].global_feedback.enthusiasm == 1  &&
      this.caregiverSessions[session].global_feedback.commitment == 1){
        if (this.symptomsNotSelected.includes('joy_happiness') && this.symptomsNotSelected.includes('enthusiasm') && this.symptomsNotSelected.includes('commitment')){
          console.log('Feedback Remove ' + this.caregiverSessions[session].patient_feedback + " " + 4)
          this.caregiverSessionsRemoved.push(this.caregiverSessions[session])
          this.caregiverSessions.splice(session,1);
        }
    } else if(this.caregiverSessions[session].global_feedback.joy == 1  &&
      this.caregiverSessions[session].global_feedback.enthusiasm == 1  &&
      this.caregiverSessions[session].global_feedback.commitment == 0){
        if (this.symptomsNotSelected.includes('joy_happiness') && this.symptomsNotSelected.includes('enthusiasm')){
          console.log('Feedback Remove ' + this.caregiverSessions[session].patient_feedback + " " + 5)
          this.caregiverSessionsRemoved.push(this.caregiverSessions[session])
          this.caregiverSessions.splice(session,1);
        }
    } else if(this.caregiverSessions[session].global_feedback.joy == 1  &&
      this.caregiverSessions[session].global_feedback.enthusiasm == 0  &&
      this.caregiverSessions[session].global_feedback.commitment == 1){
        if (this.symptomsNotSelected.includes('joy_happiness') && this.symptomsNotSelected.includes('commitment')){
          console.log('Feedback Remove ' + this.caregiverSessions[session].patient_feedback+ " " + 6)
          this.caregiverSessionsRemoved.push(this.caregiverSessions[session])
          this.caregiverSessions.splice(session,1);
        }
    } else if(this.caregiverSessions[session].global_feedback.joy == 0  &&
      this.caregiverSessions[session].global_feedback.enthusiasm == 1  &&
      this.caregiverSessions[session].global_feedback.commitment == 1){
        if (this.symptomsNotSelected.includes('enthusiasm') && this.symptomsNotSelected.includes('commitment')){
          console.log('Feedback Remove ' + this.caregiverSessions[session].patient_feedback+ " " + 7)
          this.caregiverSessionsRemoved.push(this.caregiverSessions[session])
          this.caregiverSessions.splice(session,1);
        }
    }
  }
  removeCommitment(session: number){
    if(this.caregiverSessions[session].global_feedback.joy == 1  &&
      this.caregiverSessions[session].global_feedback.enthusiasm == 0  &&
      this.caregiverSessions[session].global_feedback.communication == 0){
        if (this.symptomsNotSelected.includes('joy_happiness')){
          console.log('Feedback Remove ' + this.caregiverSessions[session].patient_feedback + " " + 1)
          this.caregiverSessionsRemoved.push(this.caregiverSessions[session])
          this.caregiverSessions.splice(session,1);
        }

    } else if(this.caregiverSessions[session].global_feedback.joy == 0  &&
      this.caregiverSessions[session].global_feedback.enthusiasm == 1  &&
      this.caregiverSessions[session].global_feedback.communication == 0){
        if (this.symptomsNotSelected.includes('enthusiasm')){                           
          console.log('Feedback Remove ' + this.caregiverSessions[session].patient_feedback+ " " + 2)
          this.caregiverSessionsRemoved.push(this.caregiverSessions[session])
          this.caregiverSessions.splice(session,1);
          console.log("Tamanho caregiverSessions = " + this.caregiverSessions.length)
          console.log("Tamanho caregiverSessionsRemoved = " + this.caregiverSessionsRemoved.length)
        }
    } else if(this.caregiverSessions[session].global_feedback.joy == 0  &&
      this.caregiverSessions[session].global_feedback.enthusiasm == 0  &&
      this.caregiverSessions[session].global_feedback.communication == 1){
        if (this.symptomsNotSelected.includes('communication')){
          console.log('Feedback Remove ' + this.caregiverSessions[session].patient_feedback+ " " + 3)
          this.caregiverSessionsRemoved.push(this.caregiverSessions[session])
          this.caregiverSessions.splice(session,1);
        }
    } else if(this.caregiverSessions[session].global_feedback.joy == 1  &&
      this.caregiverSessions[session].global_feedback.enthusiasm == 1  &&
      this.caregiverSessions[session].global_feedback.communication == 1){
        if (this.symptomsNotSelected.includes('joy_happiness') && this.symptomsNotSelected.includes('enthusiasm') && this.symptomsNotSelected.includes('communication')){
          console.log('Feedback Remove ' + this.caregiverSessions[session].patient_feedback + " " + 4)
          this.caregiverSessionsRemoved.push(this.caregiverSessions[session])
          this.caregiverSessions.splice(session,1);
        }
    } else if(this.caregiverSessions[session].global_feedback.joy == 1  &&
      this.caregiverSessions[session].global_feedback.enthusiasm == 1  &&
      this.caregiverSessions[session].global_feedback.communication == 0){
        if (this.symptomsNotSelected.includes('joy_happiness') && this.symptomsNotSelected.includes('enthusiasm')){
          console.log('Feedback Remove ' + this.caregiverSessions[session].patient_feedback + " " + 5)
          this.caregiverSessionsRemoved.push(this.caregiverSessions[session])
          this.caregiverSessions.splice(session,1);
        }
    } else if(this.caregiverSessions[session].global_feedback.joy == 1  &&
      this.caregiverSessions[session].global_feedback.enthusiasm == 0  &&
      this.caregiverSessions[session].global_feedback.communication == 1){
        if (this.symptomsNotSelected.includes('joy_happiness') && this.symptomsNotSelected.includes('communication')){
          console.log('Feedback Remove ' + this.caregiverSessions[session].patient_feedback+ " " + 6)
          this.caregiverSessionsRemoved.push(this.caregiverSessions[session])
          this.caregiverSessions.splice(session,1);
        }
    } else if(this.caregiverSessions[session].global_feedback.joy == 0  &&
      this.caregiverSessions[session].global_feedback.enthusiasm == 1  &&
      this.caregiverSessions[session].global_feedback.communication == 1){
        if (this.symptomsNotSelected.includes('enthusiasm') && this.symptomsNotSelected.includes('communication')){
          console.log('Feedback Remove ' + this.caregiverSessions[session].patient_feedback+ " " + 7)
          this.caregiverSessionsRemoved.push(this.caregiverSessions[session])
          this.caregiverSessions.splice(session,1);
        }
    }
  }
  removeAnxiety(session: number){
    if(this.caregiverSessions[session].global_feedback.agressivity == 1  &&
      this.caregiverSessions[session].global_feedback.irritability == 0  &&
      this.caregiverSessions[session].global_feedback.apathy == 0){
        if (this.symptomsNotSelected.includes('agitation_agression')){
          console.log('Feedback Remove ' + this.caregiverSessions[session].patient_feedback + " " + 1)
          this.caregiverSessionsRemoved.push(this.caregiverSessions[session])
          this.caregiverSessions.splice(session,1);
        }
    } else if(this.caregiverSessions[session].global_feedback.agressivity == 0  &&
      this.caregiverSessions[session].global_feedback.irritability == 1  &&
      this.caregiverSessions[session].global_feedback.apathy == 0){
        if (this.symptomsNotSelected.includes('irritability_lability')){                           
          console.log('Feedback Remove ' + this.caregiverSessions[session].patient_feedback+ " " + 2)
          this.caregiverSessionsRemoved.push(this.caregiverSessions[session])
          this.caregiverSessions.splice(session,1);
          console.log("Tamanho caregiverSessions = " + this.caregiverSessions.length)
          console.log("Tamanho caregiverSessionsRemoved = " + this.caregiverSessionsRemoved.length)
        }
    } else if(this.caregiverSessions[session].global_feedback.agressivity == 0  &&
      this.caregiverSessions[session].global_feedback.irritability == 0  &&
      this.caregiverSessions[session].global_feedback.apathy == 1){
        if (this.symptomsNotSelected.includes('apathy')){
          console.log('Feedback Remove ' + this.caregiverSessions[session].patient_feedback+ " " + 3)
          this.caregiverSessionsRemoved.push(this.caregiverSessions[session])
          this.caregiverSessions.splice(session,1);
        }
    } else if(this.caregiverSessions[session].global_feedback.agressivity == 1  &&
      this.caregiverSessions[session].global_feedback.irritability == 1  &&
      this.caregiverSessions[session].global_feedback.apathy == 1){
        if (this.symptomsNotSelected.includes('agitation_agression') && this.symptomsNotSelected.includes('irritability_lability') && this.symptomsNotSelected.includes('apathy')){
          console.log('Feedback Remove ' + this.caregiverSessions[session].patient_feedback + " " + 4)
          this.caregiverSessionsRemoved.push(this.caregiverSessions[session])
          this.caregiverSessions.splice(session,1);
        }
    } else if(this.caregiverSessions[session].global_feedback.agressivity == 1  &&
      this.caregiverSessions[session].global_feedback.irritability == 1  &&
      this.caregiverSessions[session].global_feedback.apathy == 0){
        if (this.symptomsNotSelected.includes('agitation_agression') && this.symptomsNotSelected.includes('irritability_lability')){
          console.log('Feedback Remove ' + this.caregiverSessions[session].patient_feedback + " " + 5)
          this.caregiverSessionsRemoved.push(this.caregiverSessions[session])
          this.caregiverSessions.splice(session,1);
        }
    } else if(this.caregiverSessions[session].global_feedback.agressivity == 1  &&
      this.caregiverSessions[session].global_feedback.irritability == 0  &&
      this.caregiverSessions[session].global_feedback.apathy == 1){
        if (this.symptomsNotSelected.includes('agitation_agression') && this.symptomsNotSelected.includes('apathy')){
          console.log('Feedback Remove ' + this.caregiverSessions[session].patient_feedback+ " " + 6)
          this.caregiverSessionsRemoved.push(this.caregiverSessions[session])
          this.caregiverSessions.splice(session,1);
        }
    } else if(this.caregiverSessions[session].global_feedback.agressivity == 0  &&
      this.caregiverSessions[session].global_feedback.irritability == 1  &&
      this.caregiverSessions[session].global_feedback.apathy == 1){
        if (this.symptomsNotSelected.includes('irritability_lability') && this.symptomsNotSelected.includes('apathy')){
          console.log('Feedback Remove ' + this.caregiverSessions[session].patient_feedback+ " " + 7)
          this.caregiverSessionsRemoved.push(this.caregiverSessions[session])
          this.caregiverSessions.splice(session,1);
        }
    }
  }
  removeAgitation(session: number){
    if(this.caregiverSessions[session].global_feedback.anxiety == 1  &&
      this.caregiverSessions[session].global_feedback.irritability == 0  &&
      this.caregiverSessions[session].global_feedback.apathy == 0){
        if (this.symptomsNotSelected.includes('anxiety')){
          console.log('Feedback Remove ' + this.caregiverSessions[session].patient_feedback + " " + 1)
          this.caregiverSessionsRemoved.push(this.caregiverSessions[session])
          this.caregiverSessions.splice(session,1);
        }
    } else if(this.caregiverSessions[session].global_feedback.anxiety == 0  &&
      this.caregiverSessions[session].global_feedback.irritability == 1  &&
      this.caregiverSessions[session].global_feedback.apathy == 0){
        if (this.symptomsNotSelected.includes('irritability_lability')){                           
          console.log('Feedback Remove ' + this.caregiverSessions[session].patient_feedback+ " " + 2)
          this.caregiverSessionsRemoved.push(this.caregiverSessions[session])
          this.caregiverSessions.splice(session,1);
          console.log("Tamanho caregiverSessions = " + this.caregiverSessions.length)
          console.log("Tamanho caregiverSessionsRemoved = " + this.caregiverSessionsRemoved.length)
        }
    } else if(this.caregiverSessions[session].global_feedback.anxiety == 0  &&
      this.caregiverSessions[session].global_feedback.irritability == 0  &&
      this.caregiverSessions[session].global_feedback.apathy == 1){
        if (this.symptomsNotSelected.includes('apathy')){
          console.log('Feedback Remove ' + this.caregiverSessions[session].patient_feedback+ " " + 3)
          this.caregiverSessionsRemoved.push(this.caregiverSessions[session])
          this.caregiverSessions.splice(session,1);
        }
    } else if(this.caregiverSessions[session].global_feedback.anxiety == 1  &&
      this.caregiverSessions[session].global_feedback.irritability == 1  &&
      this.caregiverSessions[session].global_feedback.apathy == 1){
        if (this.symptomsNotSelected.includes('anxiety') && this.symptomsNotSelected.includes('irritability_lability') && this.symptomsNotSelected.includes('apathy')){
          console.log('Feedback Remove ' + this.caregiverSessions[session].patient_feedback + " " + 4)
          this.caregiverSessionsRemoved.push(this.caregiverSessions[session])
          this.caregiverSessions.splice(session,1);
        }
    } else if(this.caregiverSessions[session].global_feedback.anxiety == 1  &&
      this.caregiverSessions[session].global_feedback.irritability == 1  &&
      this.caregiverSessions[session].global_feedback.apathy == 0){
        if (this.symptomsNotSelected.includes('anxiety') && this.symptomsNotSelected.includes('irritability_lability')){
          console.log('Feedback Remove ' + this.caregiverSessions[session].patient_feedback + " " + 5)
          this.caregiverSessionsRemoved.push(this.caregiverSessions[session])
          this.caregiverSessions.splice(session,1);
        }
    } else if(this.caregiverSessions[session].global_feedback.anxiety == 1  &&
      this.caregiverSessions[session].global_feedback.irritability == 0  &&
      this.caregiverSessions[session].global_feedback.apathy == 1){
        if (this.symptomsNotSelected.includes('anxiety') && this.symptomsNotSelected.includes('apathy')){
          console.log('Feedback Remove ' + this.caregiverSessions[session].patient_feedback+ " " + 6)
          this.caregiverSessionsRemoved.push(this.caregiverSessions[session])
          this.caregiverSessions.splice(session,1);
        }
    } else if(this.caregiverSessions[session].global_feedback.anxiety == 0  &&
      this.caregiverSessions[session].global_feedback.irritability == 1  &&
      this.caregiverSessions[session].global_feedback.apathy == 1){
        if (this.symptomsNotSelected.includes('irritability_lability') && this.symptomsNotSelected.includes('apathy')){
          console.log('Feedback Remove ' + this.caregiverSessions[session].patient_feedback+ " " + 7)
          this.caregiverSessionsRemoved.push(this.caregiverSessions[session])
          this.caregiverSessions.splice(session,1);
        }
    }
  }
  removeIrritability(session: number){
    if(this.caregiverSessions[session].global_feedback.agressivity == 1  &&
      this.caregiverSessions[session].global_feedback.anxiety == 0  &&
      this.caregiverSessions[session].global_feedback.apathy == 0){
        if (this.symptomsNotSelected.includes('agitation_agression')){
          console.log('Feedback Remove ' + this.caregiverSessions[session].patient_feedback + " " + 1)
          this.caregiverSessionsRemoved.push(this.caregiverSessions[session])
          this.caregiverSessions.splice(session,1);
        }
    } else if(this.caregiverSessions[session].global_feedback.agressivity == 0  &&
      this.caregiverSessions[session].global_feedback.anxiety == 1  &&
      this.caregiverSessions[session].global_feedback.apathy == 0){
        if (this.symptomsNotSelected.includes('anxiety')){                           
          console.log('Feedback Remove ' + this.caregiverSessions[session].patient_feedback+ " " + 2)
          this.caregiverSessionsRemoved.push(this.caregiverSessions[session])
          this.caregiverSessions.splice(session,1);
          console.log("Tamanho caregiverSessions = " + this.caregiverSessions.length)
          console.log("Tamanho caregiverSessionsRemoved = " + this.caregiverSessionsRemoved.length)
        }
    } else if(this.caregiverSessions[session].global_feedback.agressivity == 0  &&
      this.caregiverSessions[session].global_feedback.anxiety == 0  &&
      this.caregiverSessions[session].global_feedback.apathy == 1){
        if (this.symptomsNotSelected.includes('apathy')){
          console.log('Feedback Remove ' + this.caregiverSessions[session].patient_feedback+ " " + 3)
          this.caregiverSessionsRemoved.push(this.caregiverSessions[session])
          this.caregiverSessions.splice(session,1);
        }
    } else if(this.caregiverSessions[session].global_feedback.agressivity == 1  &&
      this.caregiverSessions[session].global_feedback.anxiety == 1  &&
      this.caregiverSessions[session].global_feedback.apathy == 1){
        if (this.symptomsNotSelected.includes('agitation_agression') && this.symptomsNotSelected.includes('anxiety') && this.symptomsNotSelected.includes('apathy')){
          console.log('Feedback Remove ' + this.caregiverSessions[session].patient_feedback + " " + 4)
          this.caregiverSessionsRemoved.push(this.caregiverSessions[session])
          this.caregiverSessions.splice(session,1);
        }
    } else if(this.caregiverSessions[session].global_feedback.agressivity == 1  &&
      this.caregiverSessions[session].global_feedback.anxiety == 1  &&
      this.caregiverSessions[session].global_feedback.apathy == 0){
        if (this.symptomsNotSelected.includes('agitation_agression') && this.symptomsNotSelected.includes('anxiety')){
          console.log('Feedback Remove ' + this.caregiverSessions[session].patient_feedback + " " + 5)
          this.caregiverSessionsRemoved.push(this.caregiverSessions[session])
          this.caregiverSessions.splice(session,1);
        }
    } else if(this.caregiverSessions[session].global_feedback.agressivity == 1  &&
      this.caregiverSessions[session].global_feedback.anxiety == 0  &&
      this.caregiverSessions[session].global_feedback.apathy == 1){
        if (this.symptomsNotSelected.includes('agitation_agression') && this.symptomsNotSelected.includes('apathy')){
          console.log('Feedback Remove ' + this.caregiverSessions[session].patient_feedback+ " " + 6)
          this.caregiverSessionsRemoved.push(this.caregiverSessions[session])
          this.caregiverSessions.splice(session,1);
        }
    } else if(this.caregiverSessions[session].global_feedback.agressivity == 0  &&
      this.caregiverSessions[session].global_feedback.anxiety == 1  &&
      this.caregiverSessions[session].global_feedback.apathy == 1){
        if (this.symptomsNotSelected.includes('anxiety') && this.symptomsNotSelected.includes('apathy')){
          console.log('Feedback Remove ' + this.caregiverSessions[session].patient_feedback+ " " + 7)
          this.caregiverSessionsRemoved.push(this.caregiverSessions[session])
          this.caregiverSessions.splice(session,1);
        }
    }
  }
  removeApathy(session: number){
    if(this.caregiverSessions[session].global_feedback.agressivity == 1  &&
      this.caregiverSessions[session].global_feedback.irritability == 0  &&
      this.caregiverSessions[session].global_feedback.anxiety == 0){
        if (this.symptomsNotSelected.includes('agitation_agression')){
          console.log('Feedback Remove ' + this.caregiverSessions[session].patient_feedback + " " + 1)
          this.caregiverSessionsRemoved.push(this.caregiverSessions[session])
          this.caregiverSessions.splice(session,1);
        }

    } else if(this.caregiverSessions[session].global_feedback.agressivity == 0  &&
      this.caregiverSessions[session].global_feedback.irritability == 1  &&
      this.caregiverSessions[session].global_feedback.anxiety == 0){
        if (this.symptomsNotSelected.includes('irritability_lability')){                           
          console.log('Feedback Remove ' + this.caregiverSessions[session].patient_feedback+ " " + 2)
          this.caregiverSessionsRemoved.push(this.caregiverSessions[session])
          this.caregiverSessions.splice(session,1);
          console.log("Tamanho caregiverSessions = " + this.caregiverSessions.length)
          console.log("Tamanho caregiverSessionsRemoved = " + this.caregiverSessionsRemoved.length)
        }
    } else if(this.caregiverSessions[session].global_feedback.agressivity == 0  &&
      this.caregiverSessions[session].global_feedback.irritability == 0  &&
      this.caregiverSessions[session].global_feedback.anxiety == 1){
        if (this.symptomsNotSelected.includes('anxiety')){
          console.log('Feedback Remove ' + this.caregiverSessions[session].patient_feedback+ " " + 3)
          this.caregiverSessionsRemoved.push(this.caregiverSessions[session])
          this.caregiverSessions.splice(session,1);
        }
    } else if(this.caregiverSessions[session].global_feedback.agressivity == 1  &&
      this.caregiverSessions[session].global_feedback.irritability == 1  &&
      this.caregiverSessions[session].global_feedback.anxiety == 1){
        if (this.symptomsNotSelected.includes('agitation_agression') && this.symptomsNotSelected.includes('irritability_lability') && this.symptomsNotSelected.includes('anxiety')){
          console.log('Feedback Remove ' + this.caregiverSessions[session].patient_feedback + " " + 4)
          this.caregiverSessionsRemoved.push(this.caregiverSessions[session])
          this.caregiverSessions.splice(session,1);
        }
    } else if(this.caregiverSessions[session].global_feedback.agressivity == 1  &&
      this.caregiverSessions[session].global_feedback.irritability == 1  &&
      this.caregiverSessions[session].global_feedback.anxiety == 0){
        if (this.symptomsNotSelected.includes('agitation_agression') && this.symptomsNotSelected.includes('irritability_lability')){
          console.log('Feedback Remove ' + this.caregiverSessions[session].patient_feedback + " " + 5)
          this.caregiverSessionsRemoved.push(this.caregiverSessions[session])
          this.caregiverSessions.splice(session,1);
        }
    } else if(this.caregiverSessions[session].global_feedback.agressivity == 1  &&
      this.caregiverSessions[session].global_feedback.irritability == 0  &&
      this.caregiverSessions[session].global_feedback.anxiety == 1){
        if (this.symptomsNotSelected.includes('agitation_agression') && this.symptomsNotSelected.includes('anxiety')){
          console.log('Feedback Remove ' + this.caregiverSessions[session].patient_feedback+ " " + 6)
          this.caregiverSessionsRemoved.push(this.caregiverSessions[session])
          this.caregiverSessions.splice(session,1);
        }
    } else if(this.caregiverSessions[session].global_feedback.agressivity == 0  &&
      this.caregiverSessions[session].global_feedback.irritability == 1  &&
      this.caregiverSessions[session].global_feedback.anxiety == 1){
        if (this.symptomsNotSelected.includes('irritability_lability') && this.symptomsNotSelected.includes('anxiety')){
          console.log('Feedback Remove ' + this.caregiverSessions[session].patient_feedback+ " " + 7)
          this.caregiverSessionsRemoved.push(this.caregiverSessions[session])
          this.caregiverSessions.splice(session,1);
        }
    }
  }


//ADD
  addSymptom(session: number, type: string){
    if (type === 'addByFeedback'){
      if (this.namesNotSelected.length > 0){
        for(let name = 0; name < this.namesNotSelected.length; name++){
          if(this.namesNotSelected[name] == this.caregiverSessionsRemoved[session].full_name){
            break
          }

          this.caregiverSessions.push(this.caregiverSessionsRemoved[session]);
          console.log('ADD SESSION 1 : ' + JSON.stringify(this.caregiverSessionsRemoved[session]))
          this.caregiverSessionsRemoved.splice(session,1);     
        }   
      } else {
        this.caregiverSessions.push(this.caregiverSessionsRemoved[session]);
        console.log('ADD SESSION 2 : ' + JSON.stringify(this.caregiverSessionsRemoved[session]))
        this.caregiverSessionsRemoved.splice(session,1);  
      } 
    } else if(type === 'addByName'){
      this.addSessionByFeedback(session)
    }
    
  }

  addSessionByFeedback(session:number){
    if (this.feedbackNotSelected.length > 0){
      console.log("Sessão = "+ JSON.stringify(this.caregiverSessionsRemoved[session]))
      console.log('patient_feedback = '+ this.caregiverSessionsRemoved[session].patient_feedback.toString())
      if(!(this.feedbackNotSelected.includes(this.caregiverSessionsRemoved[session].patient_feedback.toString()))){
        console.log("Adicionou if 2 = "+ JSON.stringify(this.caregiverSessionsRemoved[session]))
        this.caregiverSessions.push(this.caregiverSessionsRemoved[session]);
        this.caregiverSessionsRemoved.splice(session,1);   
        this.addSessionFeed = true     
      }
      
      /*let add:boolean
      for(let feed = 0; feed < this.feedbackNotSelected.length; feed++){
          console.log('feedbackNotSelected = ' + this.feedbackNotSelected[feed])
          console.log('patient_feedback = '+ this.caregiverSessionsRemoved[session].patient_feedback.toString())
        if(this.feedbackNotSelected[feed] == this.caregiverSessionsRemoved[session].patient_feedback.toString()){
          console.log("Entrou Aqui IF")
          add = false
        } else {
          console.log("Entrou Aqui ELSE")
          add = true
        }
      
       if(add){
          console.log("Adicionou if 2 = "+ JSON.stringify(this.caregiverSessionsRemoved[session]))
          this.caregiverSessions.push(this.caregiverSessionsRemoved[session]);
          this.caregiverSessionsRemoved.splice(session,1);  
          break
        } else {
          break
        } 
          
      }   */
       
    } else {
      console.log("Adicionou else 1= "+ JSON.stringify(this.caregiverSessionsRemoved[session]))
      this.caregiverSessions.push(this.caregiverSessionsRemoved[session]);
      this.caregiverSessionsRemoved.splice(session,1);  
      this.addSessionFeed = true
    }
  }

  addSessionByPatientName(session: number){
    if (this.namesNotSelected.length > 0){
      for(let name = 0; name < this.namesNotSelected.length; name++){
        if(this.namesNotSelected[name] == this.caregiverSessionsRemoved[session].full_name){
          console.log("Entrou aaqui s22")
          break
        } else {
          console.log("Entrou aaqui s23")
          this.addSessionByFeedback(session)
        }   
      }   
    } else {
      console.log("Entrou aaqui s24")
      this.addSessionByFeedback(session)
    } 
  }


  verifyIfAddJoy(session: number, type: string){
    console.log("Entou joy")
    if(this.caregiverSessionsRemoved[session].global_feedback.enthusiasm == 1  &&
      this.caregiverSessionsRemoved[session].global_feedback.communication == 0  &&
      this.caregiverSessionsRemoved[session].global_feedback.commitment == 0){
        if (!(this.symptomsNotSelected.includes('enthusiasm'))){
          this.addSymptom(session, type)
        }
    } else if(this.caregiverSessionsRemoved[session].global_feedback.enthusiasm == 0  &&
      this.caregiverSessionsRemoved[session].global_feedback.communication == 1  &&
      this.caregiverSessionsRemoved[session].global_feedback.commitment == 0){
        if (!(this.symptomsNotSelected.includes('communication'))){                           
          this.addSymptom(session, type)
        }
    } else if(this.caregiverSessionsRemoved[session].global_feedback.enthusiasm == 0  &&
      this.caregiverSessionsRemoved[session].global_feedback.communication == 0  &&
      this.caregiverSessionsRemoved[session].global_feedback.commitment == 1){
        if (!(this.symptomsNotSelected.includes('commitment'))){
          this.addSymptom(session, type)
        }
    } else if(this.caregiverSessionsRemoved[session].global_feedback.enthusiasm == 1  &&
      this.caregiverSessionsRemoved[session].global_feedback.communication == 1  &&
      this.caregiverSessionsRemoved[session].global_feedback.commitment == 1){
        if (!(this.symptomsNotSelected.includes('enthusiasm') && this.symptomsNotSelected.includes('communication') && this.symptomsNotSelected.includes('commitment'))){
          this.addSymptom(session, type)
        }
    } else if(this.caregiverSessionsRemoved[session].global_feedback.enthusiasm == 1  &&
      this.caregiverSessionsRemoved[session].global_feedback.communication == 1  &&
      this.caregiverSessionsRemoved[session].global_feedback.commitment == 0){
        if (!(this.symptomsNotSelected.includes('enthusiasm') && this.symptomsNotSelected.includes('communication'))){
          this.addSymptom(session, type)
        }
    } else if(this.caregiverSessionsRemoved[session].global_feedback.enthusiasm == 1  &&
      this.caregiverSessionsRemoved[session].global_feedback.communication == 0  &&
      this.caregiverSessionsRemoved[session].global_feedback.commitment == 1){
        if (!(this.symptomsNotSelected.includes('enthusiasm') && this.symptomsNotSelected.includes('commitment'))){
          this.addSymptom(session, type)
        }
    } else if(this.caregiverSessionsRemoved[session].global_feedback.enthusiasm == 0  &&
      this.caregiverSessionsRemoved[session].global_feedback.communication == 1  &&
      this.caregiverSessionsRemoved[session].global_feedback.commitment == 1){
        if (!(this.symptomsNotSelected.includes('communication') && this.symptomsNotSelected.includes('commitment'))){
          this.addSymptom(session, type)
        }
    } else {
      console.log("Entou else joy")
      //this.verifyIfAddNoSymptoms(session, type)
    }
  }
  verifyIfAddEnthusiasm(session: number, type: string){
    console.log("Entou enthusiasm")
    if(this.caregiverSessionsRemoved[session].global_feedback.joy == 1  &&
      this.caregiverSessionsRemoved[session].global_feedback.communication == 0  &&
      this.caregiverSessionsRemoved[session].global_feedback.commitment == 0){
        if (!(this.symptomsNotSelected.includes('joy_happiness'))){
          this.addSymptom(session, type)
        }
    } else if(this.caregiverSessionsRemoved[session].global_feedback.joy == 0  &&
      this.caregiverSessionsRemoved[session].global_feedback.communication == 1  &&
      this.caregiverSessionsRemoved[session].global_feedback.commitment == 0){
        if (!(this.symptomsNotSelected.includes('communication'))){                           
          this.addSymptom(session, type)
        }
    } else if(this.caregiverSessionsRemoved[session].global_feedback.joy == 0  &&
      this.caregiverSessionsRemoved[session].global_feedback.communication == 0  &&
      this.caregiverSessionsRemoved[session].global_feedback.commitment == 1){
        if (!(this.symptomsNotSelected.includes('commitment'))){
          this.addSymptom(session, type)
        }
    } else if(this.caregiverSessionsRemoved[session].global_feedback.joy == 1  &&
      this.caregiverSessionsRemoved[session].global_feedback.communication == 1  &&
      this.caregiverSessionsRemoved[session].global_feedback.commitment == 1){
        if (!(this.symptomsNotSelected.includes('joy_happiness') && this.symptomsNotSelected.includes('communication') && this.symptomsNotSelected.includes('commitment'))){
          this.addSymptom(session, type)
        }
    } else if(this.caregiverSessionsRemoved[session].global_feedback.joy == 1  &&
      this.caregiverSessionsRemoved[session].global_feedback.communication == 1  &&
      this.caregiverSessionsRemoved[session].global_feedback.commitment == 0){
        if (!(this.symptomsNotSelected.includes('joy_happiness') && this.symptomsNotSelected.includes('communication'))){
          this.addSymptom(session, type)
        }
    } else if(this.caregiverSessionsRemoved[session].global_feedback.joy == 1  &&
      this.caregiverSessionsRemoved[session].global_feedback.communication == 0  &&
      this.caregiverSessionsRemoved[session].global_feedback.commitment == 1){
        if (!(this.symptomsNotSelected.includes('joy_happiness') && this.symptomsNotSelected.includes('commitment'))){
          this.addSymptom(session, type)
        }
    } else if(this.caregiverSessionsRemoved[session].global_feedback.joy == 0  &&
      this.caregiverSessionsRemoved[session].global_feedback.communication == 1  &&
      this.caregiverSessionsRemoved[session].global_feedback.commitment == 1){
        if (!(this.symptomsNotSelected.includes('communication') && this.symptomsNotSelected.includes('commitment'))){
          this.addSymptom(session, type)
        }
    } else {
      console.log("Entou else enthusiasm")
      //this.verifyIfAddNoSymptoms(session, type)
    }
  }
  verifyIfAddCommunication(session: number, type: string){
    console.log("Sessão comm= "+ JSON.stringify(this.caregiverSessionsRemoved[session]))
    console.log('patient_feedback comm = '+ this.caregiverSessionsRemoved[session].patient_feedback.toString())
    if(this.caregiverSessionsRemoved[session].global_feedback.joy == 1  &&
      this.caregiverSessionsRemoved[session].global_feedback.enthusiasm == 0  &&
      this.caregiverSessionsRemoved[session].global_feedback.commitment == 0){
        if (!(this.symptomsNotSelected.includes('joy_happiness'))){
          this.addSymptom(session, type)
        }
    } else if(this.caregiverSessionsRemoved[session].global_feedback.joy == 0  &&
      this.caregiverSessionsRemoved[session].global_feedback.enthusiasm == 1  &&
      this.caregiverSessionsRemoved[session].global_feedback.commitment == 0){
        if (!(this.symptomsNotSelected.includes('enthusiasm'))){                           
          this.addSymptom(session, type)
        }
    } else if(this.caregiverSessionsRemoved[session].global_feedback.joy == 0  &&
      this.caregiverSessionsRemoved[session].global_feedback.enthusiasm == 0  &&
      this.caregiverSessionsRemoved[session].global_feedback.commitment == 1){
        if (!(this.symptomsNotSelected.includes('commitment'))){
          this.addSymptom(session, type)
        }
    } else if(this.caregiverSessionsRemoved[session].global_feedback.joy == 1  &&
      this.caregiverSessionsRemoved[session].global_feedback.enthusiasm == 1  &&
      this.caregiverSessionsRemoved[session].global_feedback.commitment == 1){
        if (!(this.symptomsNotSelected.includes('joy_happiness') && this.symptomsNotSelected.includes('enthusiasm') && this.symptomsNotSelected.includes('commitment'))){
          this.addSymptom(session, type)
        }
    } else if(this.caregiverSessionsRemoved[session].global_feedback.joy == 1  &&
      this.caregiverSessionsRemoved[session].global_feedback.enthusiasm == 1  &&
      this.caregiverSessionsRemoved[session].global_feedback.commitment == 0){
        if (!(this.symptomsNotSelected.includes('joy_happiness') && this.symptomsNotSelected.includes('enthusiasm'))){
          this.addSymptom(session, type)
        }
    } else if(this.caregiverSessionsRemoved[session].global_feedback.joy == 1  &&
      this.caregiverSessionsRemoved[session].global_feedback.enthusiasm == 0  &&
      this.caregiverSessionsRemoved[session].global_feedback.commitment == 1){
        if (!(this.symptomsNotSelected.includes('joy_happiness') && this.symptomsNotSelected.includes('commitment'))){
          this.addSymptom(session, type)
        }
    } else if(this.caregiverSessionsRemoved[session].global_feedback.joy == 0  &&
      this.caregiverSessionsRemoved[session].global_feedback.enthusiasm == 1  &&
      this.caregiverSessionsRemoved[session].global_feedback.commitment == 1){
        if (!(this.symptomsNotSelected.includes('enthusiasm') && this.symptomsNotSelected.includes('commitment'))){
          this.addSymptom(session, type)
        }
    } else {
      console.log("Entou else communication")
      //this.verifyIfAddNoSymptoms(session, type)
    }
  }
  verifyIfAddCommitment(session: number, type: string){
    console.log("Entou commitment")
    if(this.caregiverSessionsRemoved[session].global_feedback.joy == 1  &&
      this.caregiverSessionsRemoved[session].global_feedback.enthusiasm == 0  &&
      this.caregiverSessionsRemoved[session].global_feedback.communication == 0){
        if (!(this.symptomsNotSelected.includes('joy_happiness'))){
          this.addSymptom(session, type)
        }

    } else if(this.caregiverSessionsRemoved[session].global_feedback.joy == 0  &&
      this.caregiverSessionsRemoved[session].global_feedback.enthusiasm == 1  &&
      this.caregiverSessionsRemoved[session].global_feedback.communication == 0){
        if (!(this.symptomsNotSelected.includes('enthusiasm'))){                           
          this.addSymptom(session, type)          
        }
    } else if(this.caregiverSessionsRemoved[session].global_feedback.joy == 0  &&
      this.caregiverSessionsRemoved[session].global_feedback.enthusiasm == 0  &&
      this.caregiverSessionsRemoved[session].global_feedback.communication == 1){
        if (!(this.symptomsNotSelected.includes('communication'))){
          this.addSymptom(session, type)
        }
    } else if(this.caregiverSessionsRemoved[session].global_feedback.joy == 1  &&
      this.caregiverSessionsRemoved[session].global_feedback.enthusiasm == 1  &&
      this.caregiverSessionsRemoved[session].global_feedback.communication == 1){
        if (!(this.symptomsNotSelected.includes('joy_happiness') && this.symptomsNotSelected.includes('enthusiasm') && this.symptomsNotSelected.includes('communication'))){
          this.addSymptom(session, type)
        }
    } else if(this.caregiverSessionsRemoved[session].global_feedback.joy == 1  &&
      this.caregiverSessionsRemoved[session].global_feedback.enthusiasm == 1  &&
      this.caregiverSessionsRemoved[session].global_feedback.communication == 0){
        if (!(this.symptomsNotSelected.includes('joy_happiness') && this.symptomsNotSelected.includes('enthusiasm'))){
          this.addSymptom(session, type)
        }
    } else if(this.caregiverSessionsRemoved[session].global_feedback.joy == 1  &&
      this.caregiverSessionsRemoved[session].global_feedback.enthusiasm == 0  &&
      this.caregiverSessionsRemoved[session].global_feedback.communication == 1){
        if (!(this.symptomsNotSelected.includes('joy_happiness') && this.symptomsNotSelected.includes('communication'))){
          this.addSymptom(session, type)
        }
    } else if(this.caregiverSessionsRemoved[session].global_feedback.joy == 0  &&
      this.caregiverSessionsRemoved[session].global_feedback.enthusiasm == 1  &&
      this.caregiverSessionsRemoved[session].global_feedback.communication == 1){
        if (!(this.symptomsNotSelected.includes('enthusiasm') && this.symptomsNotSelected.includes('communication'))){
          this.addSymptom(session, type)
        }
    } else {
      console.log("Entou else commitment")
      //this.verifyIfAddNoSymptoms(session, type)
    }
  }
  verifyIfAddAnxiety(session: number, type: string){
    console.log("Entou anxiety")
    if(this.caregiverSessionsRemoved[session].global_feedback.agressivity == 1  &&
      this.caregiverSessionsRemoved[session].global_feedback.irritability == 0  &&
      this.caregiverSessionsRemoved[session].global_feedback.apathy == 0){
        if (!(this.symptomsNotSelected.includes('agitation_agression'))){
          this.addSymptom(session, type)
        }
    } else if(this.caregiverSessionsRemoved[session].global_feedback.agressivity == 0  &&
      this.caregiverSessionsRemoved[session].global_feedback.irritability == 1  &&
      this.caregiverSessionsRemoved[session].global_feedback.apathy == 0){
        if (!(this.symptomsNotSelected.includes('irritability_lability'))){                           
          this.addSymptom(session, type)
        }
    } else if(this.caregiverSessionsRemoved[session].global_feedback.agressivity == 0  &&
      this.caregiverSessionsRemoved[session].global_feedback.irritability == 0  &&
      this.caregiverSessionsRemoved[session].global_feedback.apathy == 1){
        if (!(this.symptomsNotSelected.includes('apathy'))){
          this.addSymptom(session, type)
        } 
    } else if(this.caregiverSessionsRemoved[session].global_feedback.agressivity == 1  &&
      this.caregiverSessionsRemoved[session].global_feedback.irritability == 1  &&
      this.caregiverSessionsRemoved[session].global_feedback.apathy == 1){
        if (!(this.symptomsNotSelected.includes('agitation_agression') && this.symptomsNotSelected.includes('irritability_lability') && this.symptomsNotSelected.includes('apathy'))){
          this.addSymptom(session, type)
        }
    } else if(this.caregiverSessionsRemoved[session].global_feedback.agressivity == 1  &&
      this.caregiverSessionsRemoved[session].global_feedback.irritability == 1  &&
      this.caregiverSessionsRemoved[session].global_feedback.apathy == 0){
        if (!(this.symptomsNotSelected.includes('agitation_agression') && this.symptomsNotSelected.includes('irritability_lability'))){
          this.addSymptom(session, type)
        }
    } else if(this.caregiverSessionsRemoved[session].global_feedback.agressivity == 1  &&
      this.caregiverSessionsRemoved[session].global_feedback.irritability == 0  &&
      this.caregiverSessionsRemoved[session].global_feedback.apathy == 1){
        if (!(this.symptomsNotSelected.includes('agitation_agression') && this.symptomsNotSelected.includes('apathy'))){
          this.addSymptom(session, type)
        }
    } else if(this.caregiverSessionsRemoved[session].global_feedback.agressivity == 0  &&
      this.caregiverSessionsRemoved[session].global_feedback.irritability == 1  &&
      this.caregiverSessionsRemoved[session].global_feedback.apathy == 1){
        if (!(this.symptomsNotSelected.includes('irritability_lability') && this.symptomsNotSelected.includes('apathy'))){
          this.addSymptom(session, type)
        }
    } else {
      console.log("Entou else anxiety")
      //this.verifyIfAddNoSymptoms(session, type)
    }
  }

  verifyIfAddAgitation(session: number, type: string){
    console.log("Entou agitation")
    if(this.caregiverSessionsRemoved[session].global_feedback.anxiety == 1  &&
      this.caregiverSessionsRemoved[session].global_feedback.irritability == 0  &&
      this.caregiverSessionsRemoved[session].global_feedback.apathy == 0){
        if (!(this.symptomsNotSelected.includes('anxiety'))){
          this.addSymptom(session, type)
        }
    } else if(this.caregiverSessionsRemoved[session].global_feedback.anxiety == 0  &&
      this.caregiverSessionsRemoved[session].global_feedback.irritability == 1  &&
      this.caregiverSessionsRemoved[session].global_feedback.apathy == 0){
        if (!(this.symptomsNotSelected.includes('irritability_lability'))){                           
          this.addSymptom(session, type)
        }
    } else if(this.caregiverSessionsRemoved[session].global_feedback.anxiety == 0  &&
      this.caregiverSessionsRemoved[session].global_feedback.irritability == 0  &&
      this.caregiverSessionsRemoved[session].global_feedback.apathy == 1){
        if (!(this.symptomsNotSelected.includes('apathy'))){
          this.addSymptom(session, type)
        }
    } else if(this.caregiverSessionsRemoved[session].global_feedback.anxiety == 1  &&
      this.caregiverSessionsRemoved[session].global_feedback.irritability == 1  &&
      this.caregiverSessionsRemoved[session].global_feedback.apathy == 1){
        if (!(this.symptomsNotSelected.includes('anxiety') && this.symptomsNotSelected.includes('irritability_lability') && this.symptomsNotSelected.includes('apathy'))){
          this.addSymptom(session, type)
        }
    } else if(this.caregiverSessionsRemoved[session].global_feedback.anxiety == 1  &&
      this.caregiverSessionsRemoved[session].global_feedback.irritability == 1  &&
      this.caregiverSessionsRemoved[session].global_feedback.apathy == 0){
        if (!(this.symptomsNotSelected.includes('anxiety') && this.symptomsNotSelected.includes('irritability_lability'))){
          this.addSymptom(session, type)
        }
    } else if(this.caregiverSessionsRemoved[session].global_feedback.anxiety == 1  &&
      this.caregiverSessionsRemoved[session].global_feedback.irritability == 0  &&
      this.caregiverSessionsRemoved[session].global_feedback.apathy == 1){
        if (!(this.symptomsNotSelected.includes('anxiety') && this.symptomsNotSelected.includes('apathy'))){
          this.addSymptom(session, type)
        }
    } else if(this.caregiverSessionsRemoved[session].global_feedback.anxiety == 0  &&
      this.caregiverSessionsRemoved[session].global_feedback.irritability == 1  &&
      this.caregiverSessionsRemoved[session].global_feedback.apathy == 1){
        if (!(this.symptomsNotSelected.includes('irritability_lability') && this.symptomsNotSelected.includes('apathy'))){
          this.addSymptom(session, type)
        }
    } else {
      console.log("Entou else agitation")
      //this.verifyIfAddNoSymptoms(session, type)
    }
  }
  verifyIfAddIrritability(session: number, type: string){
    console.log("Entou irritability")
    if(this.caregiverSessionsRemoved[session].global_feedback.agressivity == 1  &&
      this.caregiverSessionsRemoved[session].global_feedback.anxiety == 0  &&
      this.caregiverSessionsRemoved[session].global_feedback.apathy == 0){
        if (!(this.symptomsNotSelected.includes('agitation_agression'))){
          this.addSymptom(session, type)
        }
    } else if(this.caregiverSessionsRemoved[session].global_feedback.agressivity == 0  &&
      this.caregiverSessionsRemoved[session].global_feedback.anxiety == 1  &&
      this.caregiverSessionsRemoved[session].global_feedback.apathy == 0){
        if (!(this.symptomsNotSelected.includes('anxiety'))){                           
          this.addSymptom(session, type)
        }
    } else if(this.caregiverSessionsRemoved[session].global_feedback.agressivity == 0  &&
      this.caregiverSessionsRemoved[session].global_feedback.anxiety == 0  &&
      this.caregiverSessionsRemoved[session].global_feedback.apathy == 1){
        if (!(this.symptomsNotSelected.includes('apathy'))){
          this.addSymptom(session, type)
        }
    } else if(this.caregiverSessionsRemoved[session].global_feedback.agressivity == 1  &&
      this.caregiverSessionsRemoved[session].global_feedback.anxiety == 1  &&
      this.caregiverSessionsRemoved[session].global_feedback.apathy == 1){
        if (!(this.symptomsNotSelected.includes('agitation_agression') && this.symptomsNotSelected.includes('anxiety') && this.symptomsNotSelected.includes('apathy'))){
          this.addSymptom(session, type)
        }
    } else if(this.caregiverSessionsRemoved[session].global_feedback.agressivity == 1  &&
      this.caregiverSessionsRemoved[session].global_feedback.anxiety == 1  &&
      this.caregiverSessionsRemoved[session].global_feedback.apathy == 0){
        if (!(this.symptomsNotSelected.includes('agitation_agression') && this.symptomsNotSelected.includes('anxiety'))){
          this.addSymptom(session, type)
        }
    } else if(this.caregiverSessionsRemoved[session].global_feedback.agressivity == 1  &&
      this.caregiverSessionsRemoved[session].global_feedback.anxiety == 0  &&
      this.caregiverSessionsRemoved[session].global_feedback.apathy == 1){
        if (!(this.symptomsNotSelected.includes('agitation_agression') && this.symptomsNotSelected.includes('apathy'))){
          this.addSymptom(session, type)
        }
    } else if(this.caregiverSessionsRemoved[session].global_feedback.agressivity == 0  &&
      this.caregiverSessionsRemoved[session].global_feedback.anxiety == 1  &&
      this.caregiverSessionsRemoved[session].global_feedback.apathy == 1){
        if (!(this.symptomsNotSelected.includes('anxiety') && this.symptomsNotSelected.includes('apathy'))){
          this.addSymptom(session, type)
        }
    } else {
      console.log("Entou else irritability")
      //this.verifyIfAddNoSymptoms(session, type)
    }
  }
  verifyIfAddApathy(session: number, type: string){
    console.log("Entou apathy")
    if(this.caregiverSessionsRemoved[session].global_feedback.agressivity == 1  &&
      this.caregiverSessionsRemoved[session].global_feedback.irritability == 0  &&
      this.caregiverSessionsRemoved[session].global_feedback.anxiety == 0){
        if (!(this.symptomsNotSelected.includes('agitation_agression'))){
          this.addSymptom(session, type)
        }

    } else if(this.caregiverSessionsRemoved[session].global_feedback.agressivity == 0  &&
      this.caregiverSessionsRemoved[session].global_feedback.irritability == 1  &&
      this.caregiverSessionsRemoved[session].global_feedback.anxiety == 0){
        if (!(this.symptomsNotSelected.includes('irritability_lability'))){                           
          this.addSymptom(session, type)
        }
    } else if(this.caregiverSessionsRemoved[session].global_feedback.agressivity == 0  &&
      this.caregiverSessionsRemoved[session].global_feedback.irritability == 0  &&
      this.caregiverSessionsRemoved[session].global_feedback.anxiety == 1){
        if (!(this.symptomsNotSelected.includes('anxiety'))){
          this.addSymptom(session, type)
        }
    } else if(this.caregiverSessionsRemoved[session].global_feedback.agressivity == 1  &&
      this.caregiverSessionsRemoved[session].global_feedback.irritability == 1  &&
      this.caregiverSessionsRemoved[session].global_feedback.anxiety == 1){
        if (!(this.symptomsNotSelected.includes('agitation_agression') && this.symptomsNotSelected.includes('irritability_lability') && this.symptomsNotSelected.includes('anxiety'))){
          this.addSymptom(session, type)
        }
    } else if(this.caregiverSessionsRemoved[session].global_feedback.agressivity == 1  &&
      this.caregiverSessionsRemoved[session].global_feedback.irritability == 1  &&
      this.caregiverSessionsRemoved[session].global_feedback.anxiety == 0){
        if (!(this.symptomsNotSelected.includes('agitation_agression') && this.symptomsNotSelected.includes('irritability_lability'))){
          this.addSymptom(session, type)
        }
    } else if(this.caregiverSessionsRemoved[session].global_feedback.agressivity == 1  &&
      this.caregiverSessionsRemoved[session].global_feedback.irritability == 0  &&
      this.caregiverSessionsRemoved[session].global_feedback.anxiety == 1){
        if (!(this.symptomsNotSelected.includes('agitation_agression') && this.symptomsNotSelected.includes('anxiety'))){
          this.addSymptom(session, type)
        }
    } else if(this.caregiverSessionsRemoved[session].global_feedback.agressivity == 0  &&
      this.caregiverSessionsRemoved[session].global_feedback.irritability == 1  &&
      this.caregiverSessionsRemoved[session].global_feedback.anxiety == 1){
        if (!(this.symptomsNotSelected.includes('irritability_lability') && this.symptomsNotSelected.includes('anxiety'))){
          this.addSymptom(session, type)
        }
    } else {
      console.log("Entou else apathy")
      //this.verifyIfAddNoSymptoms(session, type)
    }
  }

  verifyIfAddNoSymptoms(session: number, type: string){
    console.log("verify noSymptoms")
    if((this.caregiverSessionsRemoved[session].global_feedback.joy == -1 && this.caregiverSessionsRemoved[session].global_feedback.enthusiasm == -1 && 
      this.caregiverSessionsRemoved[session].global_feedback.communication == -1 && this.caregiverSessionsRemoved[session].global_feedback.commitment == -1 &&
      this.caregiverSessionsRemoved[session].global_feedback.anxiety == -1 && this.caregiverSessionsRemoved[session].global_feedback.agressivity == -1 &&
      this.caregiverSessionsRemoved[session].global_feedback.irritability == -1 && this.caregiverSessionsRemoved[session].global_feedback.apathy == -1) ||
    (this.caregiverSessionsRemoved[session].global_feedback.joy == 0 && this.caregiverSessionsRemoved[session].global_feedback.enthusiasm == 0 && 
      this.caregiverSessionsRemoved[session].global_feedback.communication == 0 && this.caregiverSessionsRemoved[session].global_feedback.commitment == 0) ||
    (this.caregiverSessionsRemoved[session].global_feedback.anxiety == 0 && this.caregiverSessionsRemoved[session].global_feedback.agressivity == 0 &&
      this.caregiverSessionsRemoved[session].global_feedback.irritability == 0 && this.caregiverSessionsRemoved[session].global_feedback.apathy == 0)){
        if(this.selectedFilterSymptoms.includes('noSymptoms')){
          this.addSymptom(session, type)
        }
    } else {
      console.log("Entrou else verify noSymptoms")
      this.verifyIfAddJoy(session, type)
      if(!this.addSessionFeed){
         this.verifyIfAddEnthusiasm(session, type)
      }
      if(!this.addSessionFeed){
        this.verifyIfAddCommunication(session, type)
      }
      if(!this.addSessionFeed){
        this.verifyIfAddCommitment(session, type)
      }
      if(!this.addSessionFeed){
        this.verifyIfAddAnxiety(session, type)
      }
      if(!this.addSessionFeed){
        this.verifyIfAddAgitation(session, type)
      }
      if(!this.addSessionFeed){
        this.verifyIfAddIrritability(session, type)
      }
      if(!this.addSessionFeed){
        this.verifyIfAddApathy(session, type)
      }
    }
  }

  
  /**
   * Retrieve session list from the current patient
   */    
  async retrieveSessions(filter: boolean, filterName: any): Promise<void> {
    console.log("name = " +  filter)
    console.log("Fname = " +  filterName)

    console.log("selectedFilterSymptoms" + this.selectedFilterSymptoms)
    console.log("selectedFilterFeedback" + this.selectedFilterFeedback)
    console.log("selectedFilterNames" + this.selectedFilterNames)
    
    console.log("symptomsNotSelected" + this.symptomsNotSelected)
    console.log("feedbackNotSelected" + this.feedbackNotSelected)
    console.log("namesNotSelected" + this.namesNotSelected)

    if (filter){
      if (this.symptomsList.includes(filterName)) {
        //Add By Symptom
        console.log('Add Symptom')
        
        for (let session = this.caregiverSessionsRemoved.length-1; session >= 0; session--){
          if (filterName == 'joy_happiness'){
            if(this.caregiverSessionsRemoved[session].global_feedback.joy == 1){
              this.addSessionByPatientName(session)
            }
          } else if(filterName== 'enthusiasm'){
            if(this.caregiverSessionsRemoved[session].global_feedback.enthusiasm == 1){
              this.addSessionByPatientName(session)
            }
          } else if(filterName == 'communication'){
            if(this.caregiverSessionsRemoved[session].global_feedback.communication == 1){
              this.addSessionByPatientName(session)
            } 
          } else if(filterName == 'commitment'){
            if(this.caregiverSessionsRemoved[session].global_feedback.commitment == 1){
              this.addSessionByPatientName(session)
            }
          } else if(filterName == 'anxiety'){
            if(this.caregiverSessionsRemoved[session].global_feedback.anxiety == 1){
              this.addSessionByPatientName(session)
            }
          } else if(filterName== 'agitation_agression'){
            if(this.caregiverSessionsRemoved[session].global_feedback.agressivity == 1){    
              this.addSessionByPatientName(session)
            } 
          } else if(filterName == 'irritability_lability'){
            if(this.caregiverSessionsRemoved[session].global_feedback.irritability == 1){
              this.addSessionByPatientName(session)
            }
          } else if(filterName == 'apathy'){
            if(this.caregiverSessionsRemoved[session].global_feedback.apathy == 1){
              this.addSessionByPatientName(session)
            }
          } else if(filterName == 'noSymptoms'){
            if((this.caregiverSessionsRemoved[session].global_feedback.joy == -1 && this.caregiverSessionsRemoved[session].global_feedback.enthusiasm == -1 && 
              this.caregiverSessionsRemoved[session].global_feedback.communication == -1 && this.caregiverSessionsRemoved[session].global_feedback.commitment == -1 &&
              this.caregiverSessionsRemoved[session].global_feedback.anxiety == -1 && this.caregiverSessionsRemoved[session].global_feedback.agressivity == -1 &&
              this.caregiverSessionsRemoved[session].global_feedback.irritability == -1 && this.caregiverSessionsRemoved[session].global_feedback.apathy == -1) ||
            (this.caregiverSessionsRemoved[session].global_feedback.joy == 0 && this.caregiverSessionsRemoved[session].global_feedback.enthusiasm == 0 && 
              this.caregiverSessionsRemoved[session].global_feedback.communication == 0 && this.caregiverSessionsRemoved[session].global_feedback.commitment == 0) ||
            (this.caregiverSessionsRemoved[session].global_feedback.anxiety == 0 && this.caregiverSessionsRemoved[session].global_feedback.agressivity == 0 &&
              this.caregiverSessionsRemoved[session].global_feedback.irritability == 0 && this.caregiverSessionsRemoved[session].global_feedback.apathy == 0)){
                this.addSessionByPatientName(session)
            }
          }
        }
      } else if (filterName === 1 || filterName === 2 || filterName === 3 || filterName === 4 || filterName === 5){
        //Add By Feedback
        console.log('Add Feedback')
        for (let session = this.caregiverSessionsRemoved.length-1; session >= 0; session--){
          console.log('filterName: ' + filterName)
          console.log('Tamanho: ' + this.caregiverSessionsRemoved.length)

          if(this.caregiverSessionsRemoved[session].patient_feedback == filterName){
            console.log('global_feedback : ' + JSON.stringify(this.caregiverSessionsRemoved[session].global_feedback))
            console.log("feedback = " + this.caregiverSessionsRemoved[session].patient_feedback)
            if (this.symptomsNotSelected.length > 0) {
                for(let sym = 0; sym < this.symptomsNotSelected.length; sym++){
                  console.log("Aqui " + this.symptomsNotSelected[sym])
                  console.log("filter Name aqui = " + filterName)
                  if(filterName === 3 || filterName === 4 || filterName === 5){
                    console.log("Primeiro IF")
                    if(this.selectedFilterSymptoms.includes('noSymptoms')){
                      if((this.caregiverSessionsRemoved[session].global_feedback.joy == -1 && this.caregiverSessionsRemoved[session].global_feedback.enthusiasm == -1 && 
                        this.caregiverSessionsRemoved[session].global_feedback.communication == -1 && this.caregiverSessionsRemoved[session].global_feedback.commitment == -1 &&
                        this.caregiverSessionsRemoved[session].global_feedback.anxiety == -1 && this.caregiverSessionsRemoved[session].global_feedback.agressivity == -1 &&
                        this.caregiverSessionsRemoved[session].global_feedback.irritability == -1 && this.caregiverSessionsRemoved[session].global_feedback.apathy == -1) ||
                      (this.caregiverSessionsRemoved[session].global_feedback.joy == 0 && this.caregiverSessionsRemoved[session].global_feedback.enthusiasm == 0 && 
                        this.caregiverSessionsRemoved[session].global_feedback.communication == 0 && this.caregiverSessionsRemoved[session].global_feedback.commitment == 0) ||
                      (this.caregiverSessionsRemoved[session].global_feedback.anxiety == 0 && this.caregiverSessionsRemoved[session].global_feedback.agressivity == 0 &&
                        this.caregiverSessionsRemoved[session].global_feedback.irritability == 0 && this.caregiverSessionsRemoved[session].global_feedback.apathy == 0)){
                          this.addSymptom(session, 'addByFeedback')
                          break
                      }
                    }
                    if(this.symptomsNotSelected[sym] == 'joy_happiness'){
                      if(!(this.caregiverSessionsRemoved[session].global_feedback.joy == 1  && this.caregiverSessionsRemoved[session].global_feedback.enthusiasm == 0  &&
                        this.caregiverSessionsRemoved[session].global_feedback.communication == 0 && this.caregiverSessionsRemoved[session].global_feedback.commitment == 0)){
                          console.log("joy_happiness")
                          this.verifyIfAddJoy(session, 'addByFeedback')
                          break
                      }
                    } else if(this.symptomsNotSelected[sym] == 'enthusiasm'){
                      if(!(this.caregiverSessionsRemoved[session].global_feedback.joy == 0  && this.caregiverSessionsRemoved[session].global_feedback.enthusiasm == 1  &&
                        this.caregiverSessionsRemoved[session].global_feedback.communication == 0 && this.caregiverSessionsRemoved[session].global_feedback.commitment == 0)){
                          console.log("enthusiasm")
                          this.verifyIfAddEnthusiasm(session, 'addByFeedback')
                          break
                      }
                    } else if(this.symptomsNotSelected[sym] == 'communication'){
                      if(!(this.caregiverSessionsRemoved[session].global_feedback.joy == 0  && this.caregiverSessionsRemoved[session].global_feedback.enthusiasm == 0  &&
                        this.caregiverSessionsRemoved[session].global_feedback.communication == 1 && this.caregiverSessionsRemoved[session].global_feedback.commitment == 0)){
                          console.log("communication")
                          this.verifyIfAddCommunication(session, 'addByFeedback')
                          break
                      }
                    } else if(this.symptomsNotSelected[sym] == 'commitment'){
                      console.log('global_feedback : ' + JSON.stringify(this.caregiverSessionsRemoved[session].global_feedback))
                      if(!(this.caregiverSessionsRemoved[session].global_feedback.joy == 0  && this.caregiverSessionsRemoved[session].global_feedback.enthusiasm == 0  &&
                        this.caregiverSessionsRemoved[session].global_feedback.communication == 0 && this.caregiverSessionsRemoved[session].global_feedback.commitment == 1)){
                          console.log("commitment")
                          this.verifyIfAddCommitment(session, 'addByFeedback')
                          break
                      }
                    } else {
                      this.addSymptom(session, 'addByFeedback')
                      break
                    }
                  }

                  if(filterName === 1 || filterName === 2 || filterName === 3){
                    if(this.selectedFilterSymptoms.includes('noSymptoms')){
                      if((this.caregiverSessionsRemoved[session].global_feedback.joy == -1 && this.caregiverSessionsRemoved[session].global_feedback.enthusiasm == -1 && 
                        this.caregiverSessionsRemoved[session].global_feedback.communication == -1 && this.caregiverSessionsRemoved[session].global_feedback.commitment == -1 &&
                        this.caregiverSessionsRemoved[session].global_feedback.anxiety == -1 && this.caregiverSessionsRemoved[session].global_feedback.agressivity == -1 &&
                        this.caregiverSessionsRemoved[session].global_feedback.irritability == -1 && this.caregiverSessionsRemoved[session].global_feedback.apathy == -1) ||
                      (this.caregiverSessionsRemoved[session].global_feedback.joy == 0 && this.caregiverSessionsRemoved[session].global_feedback.enthusiasm == 0 && 
                        this.caregiverSessionsRemoved[session].global_feedback.communication == 0 && this.caregiverSessionsRemoved[session].global_feedback.commitment == 0) ||
                      (this.caregiverSessionsRemoved[session].global_feedback.anxiety == 0 && this.caregiverSessionsRemoved[session].global_feedback.agressivity == 0 &&
                        this.caregiverSessionsRemoved[session].global_feedback.irritability == 0 && this.caregiverSessionsRemoved[session].global_feedback.apathy == 0)){
                          this.addSymptom(session, 'addByFeedback')
                          break
                      }
                    }
                    console.log("Segundo IF")
                    if(this.symptomsNotSelected[sym] == 'anxiety'){
                      console.log('global_feedback : ' + JSON.stringify(this.caregiverSessionsRemoved[session].global_feedback))
                      console.log("Aqui Entrou = " + this.caregiverSessionsRemoved[session].global_feedback.anxiety)
                      if (!(this.caregiverSessionsRemoved[session].global_feedback.anxiety == 1 && this.caregiverSessionsRemoved[session].global_feedback.agressivity == 0 &&
                        this.caregiverSessionsRemoved[session].global_feedback.irritability == 0 && this.caregiverSessionsRemoved[session].global_feedback.apathy == 0)){     
                          console.log("anxiety")
                          this.verifyIfAddAnxiety(session, 'addByFeedback')
                          break
                      }
  
                    } else if(this.symptomsNotSelected[sym] == 'agitation_agression'){
                      if (!(this.caregiverSessionsRemoved[session].global_feedback.anxiety == 0 && this.caregiverSessionsRemoved[session].global_feedback.agressivity == 0 &&
                        this.caregiverSessionsRemoved[session].global_feedback.irritability == 0 && this.caregiverSessionsRemoved[session].global_feedback.apathy == 0)){     
                          console.log("agitation_agression")
                          this.verifyIfAddAgitation(session, 'addByFeedback')
                          break
                      }
                    } else if(this.symptomsNotSelected[sym] == 'irritability_lability'){
                      if (!(this.caregiverSessionsRemoved[session].global_feedback.anxiety == 0 && this.caregiverSessionsRemoved[session].global_feedback.agressivity == 0 &&
                        this.caregiverSessionsRemoved[session].global_feedback.irritability == 1 && this.caregiverSessionsRemoved[session].global_feedback.apathy == 0)){     
                          console.log("irritability_lability")
                          this.verifyIfAddIrritability(session, 'addByFeedback')
                          break
                      }
                    } else if(this.symptomsNotSelected[sym] == 'apathy'){
                      if (!(this.caregiverSessionsRemoved[session].global_feedback.anxiety == 0 && this.caregiverSessionsRemoved[session].global_feedback.agressivity == 0 &&
                        this.caregiverSessionsRemoved[session].global_feedback.irritability == 0 && this.caregiverSessionsRemoved[session].global_feedback.apathy == 1)){     
                          console.log("apathy")
                          this.verifyIfAddApathy(session, 'addByFeedback')
                          break
                      }
                    } else {
                      this.addSymptom(session, 'addByFeedback')
                      break
                    }
                  }
              }
              
            } else {
              if (this.namesNotSelected.length > 0){
                for(let name = 0; name < this.namesNotSelected.length; name++){
                  if(this.namesNotSelected[name] == this.caregiverSessionsRemoved[session].full_name){
                    break
                  }

                  this.caregiverSessions.push(this.caregiverSessionsRemoved[session]);
                  this.caregiverSessionsRemoved.splice(session,1);     
                }   
              } else {
                this.caregiverSessions.push(this.caregiverSessionsRemoved[session]);
                this.caregiverSessionsRemoved.splice(session,1);  
              }  
            }
          }
        }
        //this.selectSort(this.sortOption)
      } else {
        //Add By Name
        console.log('Add Name')
        for (let session = this.caregiverSessionsRemoved.length-1; session >= 0; session--){
          this.addSessionFeed = false     
          if(this.caregiverSessionsRemoved[session].full_name == filterName){
            console.log("Sessão Add Name = "+ JSON.stringify(this.caregiverSessionsRemoved[session]))
            if (this.symptomsNotSelected.length > 0) {
              for(let sym = 0; sym < this.symptomsNotSelected.length; sym++){
                console.log("Aqui " + this.symptomsNotSelected[sym])
                console.log("filter Name aqui = " + filterName)
                console.log("addSessionFeed" + this.addSessionFeed)
                if(this.symptomsNotSelected[sym] == 'commitment'){
                  console.log('global_feedback : ' + JSON.stringify(this.caregiverSessionsRemoved[session].global_feedback))
                  if(!(this.caregiverSessionsRemoved[session].global_feedback.joy == 0  && this.caregiverSessionsRemoved[session].global_feedback.enthusiasm == 0  &&
                    this.caregiverSessionsRemoved[session].global_feedback.communication == 0 && this.caregiverSessionsRemoved[session].global_feedback.commitment == 1)){
                      console.log("commitment")
                      this.verifyIfAddCommitment(session, 'addByName')
                      //break
                  //} else {
                    //this.verifyIfAddNoSymptoms(session, 'addByName')
                  }
                } else if(this.symptomsNotSelected[sym] == 'joy_happiness'){
                  if(!(this.caregiverSessionsRemoved[session].global_feedback.joy == 1  && this.caregiverSessionsRemoved[session].global_feedback.enthusiasm == 0  &&
                    this.caregiverSessionsRemoved[session].global_feedback.communication == 0 && this.caregiverSessionsRemoved[session].global_feedback.commitment == 0)){
                      console.log("joy_happiness")
                      this.verifyIfAddJoy(session, 'addByName')
                      //break
                  ///} else {
                    //this.verifyIfAddNoSymptoms(session, 'addByName')
                  }
                } else if(this.symptomsNotSelected[sym] == 'enthusiasm'){
                  if(!(this.caregiverSessionsRemoved[session].global_feedback.joy == 0  && this.caregiverSessionsRemoved[session].global_feedback.enthusiasm == 1  &&
                    this.caregiverSessionsRemoved[session].global_feedback.communication == 0 && this.caregiverSessionsRemoved[session].global_feedback.commitment == 0)){
                      console.log("enthusiasm")
                      this.verifyIfAddEnthusiasm(session, 'addByName')
                      //break
                  //} else {
                    //this.verifyIfAddNoSymptoms(session, 'addByName')
                  }
                } else if(this.symptomsNotSelected[sym] == 'communication'){
                  if(!(this.caregiverSessionsRemoved[session].global_feedback.joy == 0  && this.caregiverSessionsRemoved[session].global_feedback.enthusiasm == 0  &&
                    this.caregiverSessionsRemoved[session].global_feedback.communication == 1 && this.caregiverSessionsRemoved[session].global_feedback.commitment == 0)){
                      console.log("communication")
                      this.verifyIfAddCommunication(session, 'addByName')
                      //break
                  //} else {
                    //this.verifyIfAddNoSymptoms(session, 'addByName')
                  }
                } else if(this.symptomsNotSelected[sym] == 'anxiety'){
                    console.log('global_feedback : ' + JSON.stringify(this.caregiverSessionsRemoved[session].global_feedback))
                    console.log("Aqui Entrou = " + this.caregiverSessionsRemoved[session].global_feedback.anxiety)
                    if (!(this.caregiverSessionsRemoved[session].global_feedback.anxiety == 1 && this.caregiverSessionsRemoved[session].global_feedback.agressivity == 0 &&
                      this.caregiverSessionsRemoved[session].global_feedback.irritability == 0 && this.caregiverSessionsRemoved[session].global_feedback.apathy == 0)){     
                        console.log("anxiety")
                        this.verifyIfAddAnxiety(session, 'addByName')
                    }
                } else if(this.symptomsNotSelected[sym] == 'agitation_agression'){
                  if (!(this.caregiverSessionsRemoved[session].global_feedback.anxiety == 0 && this.caregiverSessionsRemoved[session].global_feedback.agressivity == 0 &&
                    this.caregiverSessionsRemoved[session].global_feedback.irritability == 0 && this.caregiverSessionsRemoved[session].global_feedback.apathy == 0)){     
                      console.log("agitation_agression")
                      this.verifyIfAddAgitation(session, 'addByName')
                      //break
                  //} else {
                    //this.verifyIfAddNoSymptoms(session, 'addByName')
                  }
                } else if(this.symptomsNotSelected[sym] == 'irritability_lability'){
                  if (!(this.caregiverSessionsRemoved[session].global_feedback.anxiety == 0 && this.caregiverSessionsRemoved[session].global_feedback.agressivity == 0 &&
                    this.caregiverSessionsRemoved[session].global_feedback.irritability == 1 && this.caregiverSessionsRemoved[session].global_feedback.apathy == 0)){     
                      console.log("irritability_lability")
                      this.verifyIfAddIrritability(session, 'addByName')
                  }
                } else if(this.symptomsNotSelected[sym] == 'apathy'){
                  if (!(this.caregiverSessionsRemoved[session].global_feedback.anxiety == 0 && this.caregiverSessionsRemoved[session].global_feedback.agressivity == 0 &&
                    this.caregiverSessionsRemoved[session].global_feedback.irritability == 0 && this.caregiverSessionsRemoved[session].global_feedback.apathy == 1)){     
                      console.log("apathy")
                      this.verifyIfAddApathy(session, 'addByName')
                      //break
                  //} else {
                    //this.verifyIfAddNoSymptoms(session, 'addByName')
                  }
                } else if(this.symptomsNotSelected[sym] == 'noSymptoms'){
                  if((this.caregiverSessionsRemoved[session].global_feedback.joy == -1 && this.caregiverSessionsRemoved[session].global_feedback.enthusiasm == -1 && 
                    this.caregiverSessionsRemoved[session].global_feedback.communication == -1 && this.caregiverSessionsRemoved[session].global_feedback.commitment == -1 &&
                    this.caregiverSessionsRemoved[session].global_feedback.anxiety == -1 && this.caregiverSessionsRemoved[session].global_feedback.agressivity == -1 &&
                    this.caregiverSessionsRemoved[session].global_feedback.irritability == -1 && this.caregiverSessionsRemoved[session].global_feedback.apathy == -1) ||
                  (this.caregiverSessionsRemoved[session].global_feedback.joy == 0 && this.caregiverSessionsRemoved[session].global_feedback.enthusiasm == 0 && 
                    this.caregiverSessionsRemoved[session].global_feedback.communication == 0 && this.caregiverSessionsRemoved[session].global_feedback.commitment == 0) ||
                  (this.caregiverSessionsRemoved[session].global_feedback.anxiety == 0 && this.caregiverSessionsRemoved[session].global_feedback.agressivity == 0 &&
                    this.caregiverSessionsRemoved[session].global_feedback.irritability == 0 && this.caregiverSessionsRemoved[session].global_feedback.apathy == 0)){
                      console.log("noSymptoms")
                      //this.verifyIfAddApathy(session, 'addByName')
                      break
                  } 
                  
                } 

                console.log("Fim verifyIfAddNoSymptoms")
                this.verifyIfAddNoSymptoms(session, 'addByName')
    
                if(this.addSessionFeed){
                  console.log("ENTROU TRUE")
                  break
                }                  
              }
            } else {
              this.addSessionByFeedback(session)
            }
          }
        }

      }
      this.selectSort(this.sortOption)
      this.caregiverCollectionSize = this.caregiverSessions.length;
    } else {
      //Remove
          if (this.symptomsList.includes(filterName)) {
            //Remove By Symptom
            console.log('Remove Symptom')
            if(filterName == 'joy_happiness'){
              for (let session = this.caregiverSessions.length-1; session >= 0; session--){
                if(this.caregiverSessions[session].global_feedback.joy == 1 &&
                  (this.caregiverSessions[session].global_feedback.enthusiasm == 0  &&
                    this.caregiverSessions[session].global_feedback.communication == 0  &&
                    this.caregiverSessions[session].global_feedback.commitment == 0)){
                  console.log('Feedback Remove ' + this.caregiverSessions[session].patient_feedback)
                  this.caregiverSessionsRemoved.push(this.caregiverSessions[session])
                  this.caregiverSessions.splice(session,1);
                } else {
                  this.removeJoy(session)
                }
              }
            }

            if(filterName == 'enthusiasm'){
              for (let session = this.caregiverSessions.length-1; session >= 0; session--){
                if(this.caregiverSessions[session].global_feedback.joy == 0 &&
                  (this.caregiverSessions[session].global_feedback.enthusiasm == 1  &&
                    this.caregiverSessions[session].global_feedback.communication == 0  &&
                    this.caregiverSessions[session].global_feedback.commitment == 0)){
                  console.log('Feedback Remove ' + this.caregiverSessions[session].patient_feedback)
                  this.caregiverSessionsRemoved.push(this.caregiverSessions[session])
                  this.caregiverSessions.splice(session,1);
                } else {
                  this.removeEnthusiasm(session)
                }
              }
            }

            if(filterName == 'communication'){
              
              for (let session = this.caregiverSessions.length-1; session >= 0; session--){
                if(this.caregiverSessions[session].global_feedback.joy == 0 &&
                  (this.caregiverSessions[session].global_feedback.enthusiasm == 0  &&
                    this.caregiverSessions[session].global_feedback.communication == 1  &&
                    this.caregiverSessions[session].global_feedback.commitment == 0)){
                  console.log('Feedback Remove ' + this.caregiverSessions[session].patient_feedback)
                  this.caregiverSessionsRemoved.push(this.caregiverSessions[session])
                  this.caregiverSessions.splice(session,1);
                } else {
                  this.removeCommunication(session)                        
                }
              }
            }

            if(filterName == 'commitment'){
              for (let session = this.caregiverSessions.length-1; session >= 0; session--){
                if(this.caregiverSessions[session].global_feedback.joy == 0 &&
                  (this.caregiverSessions[session].global_feedback.enthusiasm == 0  &&
                    this.caregiverSessions[session].global_feedback.communication == 0  &&
                    this.caregiverSessions[session].global_feedback.commitment == 1)){
                  console.log('Feedback Remove ' + this.caregiverSessions[session].patient_feedback)
                  this.caregiverSessionsRemoved.push(this.caregiverSessions[session])
                  this.caregiverSessions.splice(session,1);
                } else {
                  this.removeCommitment(session)                       
                }
              }
            }
            
            if(filterName == 'anxiety'){
              for (let session = this.caregiverSessions.length-1; session >= 0; session--){
                if(this.caregiverSessions[session].global_feedback.anxiety == 1 &&
                  (this.caregiverSessions[session].global_feedback.agressivity == 0  &&
                    this.caregiverSessions[session].global_feedback.irritability == 0  &&
                    this.caregiverSessions[session].global_feedback.apathy == 0)){
                  console.log('Feedback Remove ' + this.caregiverSessions[session].patient_feedback)
                  this.caregiverSessionsRemoved.push(this.caregiverSessions[session])
                  this.caregiverSessions.splice(session,1);
                } else {
                  this.removeAnxiety(session)
                }
              }
            }

            if(filterName == 'agitation_agression'){
              for (let session = this.caregiverSessions.length-1; session >= 0; session--){
                if(this.caregiverSessions[session].global_feedback.anxiety == 0 &&
                  (this.caregiverSessions[session].global_feedback.agressivity == 1  &&
                    this.caregiverSessions[session].global_feedback.irritability == 0  &&
                    this.caregiverSessions[session].global_feedback.apathy == 0)){
                  console.log('Feedback Remove ' + this.caregiverSessions[session].patient_feedback)
                  this.caregiverSessionsRemoved.push(this.caregiverSessions[session])
                  this.caregiverSessions.splice(session,1);
                } else {
                  this.removeAgitation(session)
                }
              }
            }

            if(filterName == 'irritability_lability'){
              for (let session = this.caregiverSessions.length-1; session >= 0; session--){
                if(this.caregiverSessions[session].global_feedback.anxiety == 0 &&
                  (this.caregiverSessions[session].global_feedback.agressivity == 0  &&
                    this.caregiverSessions[session].global_feedback.irritability == 1  &&
                    this.caregiverSessions[session].global_feedback.apathy == 0)){
                  console.log('Feedback Remove ' + this.caregiverSessions[session].patient_feedback)
                  this.caregiverSessionsRemoved.push(this.caregiverSessions[session])
                  this.caregiverSessions.splice(session,1);
                } else {
                  this.removeIrritability(session)
                }
              }
            }

            if(filterName == 'apathy'){
              for (let session = this.caregiverSessions.length-1; session >= 0; session--){
                if(this.caregiverSessions[session].global_feedback.anxiety == 0 &&
                  (this.caregiverSessions[session].global_feedback.agressivity == 0  &&
                    this.caregiverSessions[session].global_feedback.irritability == 0  &&
                    this.caregiverSessions[session].global_feedback.apathy == 1)){
                  console.log('Feedback Remove ' + this.caregiverSessions[session].patient_feedback)
                  this.caregiverSessionsRemoved.push(this.caregiverSessions[session])
                  this.caregiverSessions.splice(session,1);
                } else {
                  this.removeApathy(session)     
                }
              }
            }

            if(filterName == 'noSymptoms'){
              for (let session = this.caregiverSessions.length-1; session >= 0; session--){
                if((this.caregiverSessions[session].global_feedback.joy == -1 && this.caregiverSessions[session].global_feedback.enthusiasm == -1 && 
                    this.caregiverSessions[session].global_feedback.communication == -1 && this.caregiverSessions[session].global_feedback.commitment == -1 &&
                    this.caregiverSessions[session].global_feedback.anxiety == -1 && this.caregiverSessions[session].global_feedback.agressivity == -1 &&
                    this.caregiverSessions[session].global_feedback.irritability == -1 && this.caregiverSessions[session].global_feedback.apathy == -1) ||
                  (this.caregiverSessions[session].global_feedback.joy == 0 && this.caregiverSessions[session].global_feedback.enthusiasm == 0 && 
                    this.caregiverSessions[session].global_feedback.communication == 0 && this.caregiverSessions[session].global_feedback.commitment == 0) ||
                  (this.caregiverSessions[session].global_feedback.anxiety == 0 && this.caregiverSessions[session].global_feedback.agressivity == 0 &&
                    this.caregiverSessions[session].global_feedback.irritability == 0 && this.caregiverSessions[session].global_feedback.apathy == 0)){
                  console.log('Feedback Remove ' + this.caregiverSessions[session].patient_feedback)
                  this.caregiverSessionsRemoved.push(this.caregiverSessions[session])
                  this.caregiverSessions.splice(session,1);
                }
              }
            }
        
          } else if (filterName === 1 || filterName === 2 || filterName === 3 || filterName === 4 || filterName === 5){
            //Remove By Feedback
            console.log('Remove Feedback')
            for (let session = this.caregiverSessions.length-1; session >= 0; session--){
              if(this.caregiverSessions[session].patient_feedback == filterName){
                this.caregiverSessionsRemoved.push(this.caregiverSessions[session])
                this.caregiverSessions.splice(session,1);
              }
            }

          } else {
            //Remove By Name
            console.log('Remove Name')
            for (let session = this.caregiverSessions.length-1; session >= 0; session--){ 
              console.log('Patient name: ' + this.caregiverSessions[session].full_name)
              console.log('Patient filterName: ' + filterName)
              if(this.caregiverSessions[session].full_name == filterName){
                console.log('Name Remove ' + this.caregiverSessions[session].full_name)
                this.caregiverSessionsRemoved.push(this.caregiverSessions[session])
                this.caregiverSessions.splice(session,1);
              }
            }
          }
      console.log("Tamanho caregiverSessions = " + this.caregiverSessions.length)
      console.log("Tamanho caregiverSessionsRemoved = " + this.caregiverSessionsRemoved.length)

      this.selectSort(this.sortOption)
      this.caregiverCollectionSize = this.caregiverSessions.length;

    }
    console.log("Tamanho caregiverSessions Fora = " + this.caregiverSessions.length)
    console.log("Tamanho caregiverSessionsRemoved Fora = " + this.caregiverSessionsRemoved.length)
  }
 


  

  translate(): string[]{
    if(this.translateCache=='en'){
      return ['Joy or Happiness','Enthusiasm','Communication','Commitment','Anxiety', 'Agitation or Agressivity','Irritability or Lability','Apathy or Indifference','No Symptoms',' and ']
    } else {
      return ['Alegria','Entusiasmo','Comunicação','Empenho','Ansiedade', 'Agitação ou Agressividade','Irritabilidade ou Labilidade','Apatia ou Indiferencia','Nenhum Sintoma',' e ']
    }
  }

  getFinalSymptom(sFeedback: any): string{
    this.symptom = ''
    this.symptomArray = []
    
    if(sFeedback.joy === 1){
      this.symptomArray.push(this.translate()[0])
    }
    if(sFeedback.enthusiasm === 1){
      this.symptomArray.push(this.translate()[1])
    }
    if(sFeedback.communication === 1){
      this.symptomArray.push(this.translate()[2])
    }
    if(sFeedback.commitment === 1){
      this.symptomArray.push(this.translate()[3])
    }

    if(sFeedback.anxiety === 1){
      this.symptomArray.push(this.translate()[4])
    }
    if(sFeedback.agressivity === 1){
      this.symptomArray.push(this.translate()[5])
    }
    if(sFeedback.irritability === 1){
      this.symptomArray.push(this.translate()[6])
    }
    if(sFeedback.apathy === 1){
      this.symptomArray.push(this.translate()[7])
    }

    //Join Strings
    if(this.symptomArray.length > 1){
      this.symptom = this.symptomArray.slice(0, -1).join(', ') + this.translate()[9] + this.symptomArray.slice(-1); 
    } else if (this.symptomArray.length == 1){
      this.symptom = this.symptomArray[0]
    } else if(this.symptomArray.length == 0){
      this.symptom = this.translate()[8]
    }

    return this.symptom
  }


   /**
   * Navigates to the summary of the selected session
   */
    async goTocaregiverSessionsummary(session: Session){
      this.sessionService.resetCurrentSession();
      await this.sessionService.setCurrentSession(session);
      this.router.navigate(['caregiver/profile/history/summary']);
    }
  }