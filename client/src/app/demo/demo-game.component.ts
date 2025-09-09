import { Component, OnInit, inject, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink, RouterLinkActive } from '@angular/router';
import { Subscription } from 'rxjs';
import { DemoService, DemoCharacter, DemoGameQuestion, DemoCharacterStatus } from '../services/demo.service';
import { I18nService } from '../services/i18n.service';

@Component({
  selector: 'app-demo-game',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink, RouterLinkActive],
  templateUrl: './demo-game.component.html',
  styleUrls: ['./demo-game.component.css']
})
export class DemoGameComponent implements OnInit, OnDestroy {
  public readonly i18nService = inject(I18nService);
  public readonly demoService = inject(DemoService);
  
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private subscription = new Subscription();

  oCharacters: DemoCharacter[] = [];
  oCharacterStatus: DemoCharacterStatus[] = [];
  oSelectedCharacter: DemoCharacter | null = null;
  sSelectedSeason: string = '';
  aAvailableSeasons: number[] = [];
  oCurrentQuestion: DemoGameQuestion | null = null;
  sCurrentAnswer: string = '';
  bIsLoading = false;
  sError = '';
  sSuccessMessage = '';
  bNoQuestionsAvailable = false;
  sSessionId: string = '';

  ngOnInit() {
    this.route.params.subscribe(params => {
      this.sSessionId = params['id'];
      if (this.sSessionId) {
        this.initializeDemoSession();
      } else {
        this.router.navigate(['/demo']);
      }
    });
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }

  initializeDemoSession() {
    // Validate session and load data
    this.subscription.add(
      this.demoService.validateDemoSession(this.sSessionId).subscribe({
        next: (bIsValid) => {
          if (bIsValid) {
            this.loadCharacters();
            this.loadCharacterStatus();
            this.loadAvailableSeasons();
          } else {
            this.router.navigate(['/demo']);
          }
        },
        error: () => {
          this.router.navigate(['/demo']);
        }
      })
    );
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

  selectCharacter(oCharacter: DemoCharacter) {
    this.oSelectedCharacter = oCharacter;
    this.oCurrentQuestion = null;
    this.sCurrentAnswer = '';
    this.sError = '';
    this.sSuccessMessage = '';
    this.bNoQuestionsAvailable = false;
    this.getNewQuestion();
  }

  getNewQuestion() {
    if (!this.oSelectedCharacter) return;

    this.bIsLoading = true;
    this.sError = '';
    this.sSuccessMessage = '';
    this.sCurrentAnswer = '';

    const iSeason = this.sSelectedSeason && this.sSelectedSeason !== '' ? parseInt(this.sSelectedSeason) : undefined;

    this.subscription.add(
      this.demoService.getRandomDemoQuestion(this.oSelectedCharacter.id, iSeason).subscribe({
        next: (oQuestion) => {
          this.oCurrentQuestion = oQuestion;
          this.bNoQuestionsAvailable = false;
          this.bIsLoading = false;
        },
        error: (err) => {
          if (err.status === 404) {
            this.bNoQuestionsAvailable = true;
            this.oCurrentQuestion = null;
          } else {
            this.sError = this.i18nService.getTranslation('errorLoadingQuestion') + ' ' + err.message;
          }
          this.bIsLoading = false;
        }
      })
    );
  }

  markAsAnswered() {
    if (!this.oCurrentQuestion || !this.oSelectedCharacter || !this.sCurrentAnswer || this.sCurrentAnswer.trim() === '') return;

    this.subscription.add(
      this.demoService.markDemoQuestionAnswered(
        this.oSelectedCharacter.id,
        this.oCurrentQuestion.question.id,
        this.sCurrentAnswer.trim()
      ).subscribe({
        next: () => {
          this.sSuccessMessage = this.i18nService.getTranslation('answerSaved');
          this.oCurrentQuestion = null;
          this.sCurrentAnswer = '';
          this.loadCharacterStatus();
          setTimeout(() => {
            this.getNewQuestion();
          }, 1000);
        },
        error: (err) => {
          this.sError = this.i18nService.getTranslation('errorSaving') + ' ' + err.message;
        }
      })
    );
  }

  resetCharacter() {
    if (!this.oSelectedCharacter) return;

    this.subscription.add(
      this.demoService.resetDemoCharacter(this.oSelectedCharacter.id).subscribe({
        next: () => {
          this.sSuccessMessage = this.i18nService.getTranslation('characterReset');
          this.oCurrentQuestion = null;
          this.loadCharacterStatus();
          setTimeout(() => {
            this.getNewQuestion();
          }, 1000);
        },
        error: (err) => {
          this.sError = this.i18nService.getTranslation('errorResetting') + ' ' + err.message;
        }
      })
    );
  }

  resetCharacterById(iCharacterId: number) {
    this.subscription.add(
      this.demoService.resetDemoCharacter(iCharacterId).subscribe({
        next: () => {
          this.sSuccessMessage = this.i18nService.getTranslation('characterReset');
          this.loadCharacterStatus();
          if (this.oSelectedCharacter?.id === iCharacterId) {
            this.oCurrentQuestion = null;
            this.getNewQuestion();
          }
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
            this.oCurrentQuestion = null;
            this.loadCharacterStatus();
          },
          error: (err) => {
            this.sError = this.i18nService.getTranslation('errorResetting') + ' ' + err.message;
          }
        })
      );
    }
  }

  getCharacterStatus(iCharacterId: number): DemoCharacterStatus | undefined {
    return this.oCharacterStatus.find(s => s.id === iCharacterId);
  }

  loadAvailableSeasons() {
    this.aAvailableSeasons = [1, 2, 3, 4];
  }

  onSeasonChange() {
    this.oCurrentQuestion = null;
    this.sCurrentAnswer = '';
    this.sError = '';
    this.sSuccessMessage = '';
    this.bNoQuestionsAvailable = false;
    
    if (this.oSelectedCharacter) {
      this.getNewQuestion();
    }
  }

  backToDemoLanding() {
    this.router.navigate(['/demo']);
  }
}
