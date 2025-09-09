import { Component, OnInit, inject, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink, RouterLinkActive } from '@angular/router';
import { Subscription } from 'rxjs';
import { DemoService, DemoCharacter, DemoCharacterStatus } from '../services/demo.service';
import { I18nService } from '../services/i18n.service';

@Component({
  selector: 'app-demo-characters',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink, RouterLinkActive],
  templateUrl: './demo-characters.component.html',
  styleUrls: ['./demo-characters.component.css']
})
export class DemoCharactersComponent implements OnInit, OnDestroy {
  public readonly i18nService = inject(I18nService);
  public readonly demoService = inject(DemoService);
  
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private subscription = new Subscription();

  oCharacters: DemoCharacter[] = [];
  oCharacterStatus: DemoCharacterStatus[] = [];
  bIsLoading = false;
  sError = '';
  sSuccessMessage = '';
  sSessionId: string = '';
  
  // New character form
  newCharacter: Partial<DemoCharacter> = {};
  
  // Character details modal
  selectedCharacter: DemoCharacter | null = null;
  characterStats: any = null;
  characterAnswers: any[] = [];

  ngOnInit() {
    this.route.params.subscribe(params => {
      this.sSessionId = params['id'];
      if (this.sSessionId) {
        this.loadCharacters();
        this.loadCharacterStatus();
      } else {
        this.router.navigate(['/demo']);
      }
    });
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }

  loadCharacters() {
    this.bIsLoading = true;
    this.subscription.add(
      this.demoService.getDemoCharacters().subscribe({
        next: (oCharacters) => {
          this.oCharacters = oCharacters;
          this.bIsLoading = false;
        },
        error: (err) => {
          this.sError = this.i18nService.getTranslation('errorLoadingCharacters') + ' ' + err.message;
          this.bIsLoading = false;
        }
      })
    );
  }

  loadCharacterStatus() {
    this.subscription.add(
      this.demoService.getDemoCharacterStatus().subscribe({
        next: (oStatus) => {
          this.oCharacterStatus = oStatus;
        },
        error: (err) => {
          console.error(this.i18nService.getTranslation('errorLoadingStats'), err);
        }
      })
    );
  }

  getCharacterStatus(iCharacterId: number): DemoCharacterStatus | undefined {
    return this.oCharacterStatus.find(s => s.id === iCharacterId);
  }

  resetCharacter(iCharacterId: number) {
    this.subscription.add(
      this.demoService.resetDemoCharacter(iCharacterId).subscribe({
        next: () => {
          this.sSuccessMessage = this.i18nService.getTranslation('characterReset');
          this.loadCharacterStatus();
        },
        error: (err) => {
          this.sError = this.i18nService.getTranslation('errorResetting') + ' ' + err.message;
        }
      })
    );
  }

  resetAllCharacters() {
    if (confirm(this.i18nService.getTranslation('confirmResetAll'))) {
      this.subscription.add(
        this.demoService.resetAllDemoCharacters().subscribe({
          next: () => {
            this.sSuccessMessage = this.i18nService.getTranslation('allCharactersReset');
            this.loadCharacterStatus();
          },
          error: (err) => {
            this.sError = this.i18nService.getTranslation('errorResetting') + ' ' + err.message;
          }
        })
      );
    }
  }

  addCharacter() {
    if (!this.newCharacter.name) return;

    this.bIsLoading = true;
    this.subscription.add(
      this.demoService.addDemoCharacter(this.newCharacter as DemoCharacter).subscribe({
        next: (character: DemoCharacter) => {
          this.oCharacters.push(character);
          this.newCharacter = {};
          this.sSuccessMessage = this.i18nService.getTranslation('characterAdded');
          this.bIsLoading = false;
        },
        error: (err: any) => {
          this.sError = this.i18nService.getTranslation('errorAddingCharacter') + ' ' + err.message;
          this.bIsLoading = false;
        }
      })
    );
  }

  viewCharacterDetails(character: DemoCharacter) {
    this.selectedCharacter = character;
    this.loadCharacterStats(character.id);
    this.loadCharacterAnswers(character.id);
  }

  closeCharacterDetails() {
    this.selectedCharacter = null;
    this.characterStats = null;
    this.characterAnswers = [];
  }

  loadCharacterStats(characterId: number) {
    this.subscription.add(
      this.demoService.getDemoCharacterStats(characterId).subscribe({
        next: (stats: any) => {
          this.characterStats = stats;
        },
        error: (err: any) => {
          console.error('Error loading character stats:', err);
        }
      })
    );
  }

  loadCharacterAnswers(characterId: number) {
    this.subscription.add(
      this.demoService.getDemoCharacterAnswers(characterId).subscribe({
        next: (answers: any) => {
          this.characterAnswers = answers;
        },
        error: (err: any) => {
          console.error('Error loading character answers:', err);
        }
      })
    );
  }

  resetCharacterProgress(characterId: number) {
    this.subscription.add(
      this.demoService.resetDemoCharacter(characterId).subscribe({
        next: () => {
          this.sSuccessMessage = this.i18nService.getTranslation('characterReset');
          this.loadCharacterStatus();
          if (this.selectedCharacter && this.selectedCharacter.id === characterId) {
            this.loadCharacterStats(characterId);
            this.loadCharacterAnswers(characterId);
          }
        },
        error: (err) => {
          this.sError = this.i18nService.getTranslation('errorResetting') + ' ' + err.message;
        }
      })
    );
  }

  startGameWithCharacter(character: DemoCharacter) {
    this.router.navigate(['/demo', this.sSessionId], { 
      queryParams: { characterId: character.id } 
    });
  }

  getProgressPercentage(): number {
    if (!this.characterStats || this.characterStats.total_questions === 0) return 0;
    return Math.round((this.characterStats.answered_count / this.characterStats.total_questions) * 100);
  }

  formatDate(dateString: string): string {
    return new Date(dateString).toLocaleDateString();
  }

  backToDemoLanding() {
    this.router.navigate(['/demo']);
  }
}
