import { Component, OnInit, OnDestroy, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SessionBroadcastService, PwdScreenMessage } from '../../../core/services/session-broadcast.service';

@Component({
  selector: 'app-pwd-session-view',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './pwd-session-view.component.html',
  styleUrls: ['./pwd-session-view.component.css']
})
export class PwdSessionViewComponent implements OnInit, OnDestroy {

  public currentImageURL: string | null = null;
  public sessionEnded: boolean = false;

  private unsubscribe!: () => void;

  constructor(
    private broadcast: SessionBroadcastService,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.unsubscribe = this.broadcast.onMessage((msg: PwdScreenMessage) => {
      if (msg.type === 'IMAGE_UPDATE') {
        this.currentImageURL = msg.imageURL ?? null;
        this.sessionEnded = false;
      } else if (msg.type === 'SESSION_END') {
        this.sessionEnded = true;
        this.currentImageURL = null;
      }
      this.cdr.detectChanges();
    });
  }

  ngOnDestroy(): void {
    if (this.unsubscribe) {
      this.unsubscribe();
    }
  }
}
