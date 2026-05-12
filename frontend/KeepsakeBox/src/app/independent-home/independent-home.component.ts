/**
 * IndependentHomeComponent — parent layout for the independent-user route tree.
 *
 * STUB: full layout (nav, header, profile widget, games entry, etc.) is being
 * implemented by a colleague. This file exists so the /independent route
 * resolves and downstream work (route guards, role redirects, child routes)
 * can land in parallel. Don't merge UI here that conflicts with the colleague's
 * branch — coordinate first.
 *
 * Pattern note: mirrors CaregiverHomeComponent's responsibilities:
 *   - reads the currently-logged-in entity from the appropriate service
 *   - hosts a <router-outlet> for child routes (games, profile, etc.)
 *   - exposes a hideNavBar()-style helper when overlay/sub-pages are open
 */

import { Component, DestroyRef, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink, RouterOutlet } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { IndependentUserService } from '../core/services/independent-user.service';
import { IndependentUser } from '../core/models/independent-user.model';

@Component({
  selector: 'app-independent-home',
  standalone: true,
  imports: [CommonModule, TranslateModule, RouterLink, RouterOutlet],
  templateUrl: './independent-home.component.html',
  styleUrls: ['./independent-home.component.css']
})
export class IndependentHomeComponent implements OnInit {
  public user: IndependentUser | null = null;

  private destroyRef = inject(DestroyRef);
  private independentUserService = inject(IndependentUserService);

  ngOnInit(): void {
    this.independentUserService.getCurrentIndependentUser$()
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe(user => {
        this.user = user;
      });
  }
}
