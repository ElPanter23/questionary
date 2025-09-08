import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ApiService, Character, GameQuestion, CharacterStatus } from '../services/api.service';
import { I18nService } from '../services/i18n.service';

@Component({
  selector: 'app-game',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './game.component.html',
  styleUrls: ['./game.component.css']
})
export class GameComponent implements OnInit {
  public readonly i18nService = inject(I18nService);
  
  characters: Character[] = [];
  characterStatus: CharacterStatus[] = [];
  selectedCharacter: Character | null = null;
  selectedSeason: string = '';
  availableSeasons: number[] = [];
  currentQuestion: GameQuestion | null = null;
  currentAnswer: string = '';
  loading = false;
  error = '';
  successMessage = '';
  noQuestionsAvailable = false;

  constructor(private apiService: ApiService) {}

  ngOnInit() {
    this.loadCharacters();
    this.loadCharacterStatus();
    this.loadAvailableSeasons();
  }

  loadCharacters() {
    this.loading = true;
    this.apiService.getCharacters().subscribe({
      next: (characters) => {
        this.characters = characters;
        this.loading = false;
      },
      error: (err) => {
        this.error = this.i18nService.getTranslation('errorLoadingCharacters') + ' ' + err.message;
        this.loading = false;
      }
    });
  }

  loadCharacterStatus() {
    this.apiService.getCharacterStatus().subscribe({
      next: (status) => {
        this.characterStatus = status;
      },
      error: (err) => {
        console.error(this.i18nService.getTranslation('errorLoadingStats'), err);
      }
    });
  }

  selectCharacter(character: Character) {
    this.selectedCharacter = character;
    this.currentQuestion = null;
    this.currentAnswer = '';
    this.error = '';
    this.successMessage = '';
    this.noQuestionsAvailable = false;
    this.getNewQuestion();
  }

  getNewQuestion() {
    if (!this.selectedCharacter) return;

    this.loading = true;
    this.error = '';
    this.successMessage = '';
    this.currentAnswer = '';

    // Convert selectedSeason to number if it's not empty
    const season = this.selectedSeason && this.selectedSeason !== '' ? parseInt(this.selectedSeason) : undefined;

    this.apiService.getRandomQuestion(this.selectedCharacter.id, season).subscribe({
      next: (question) => {
        this.currentQuestion = question;
        this.noQuestionsAvailable = false;
        this.loading = false;
      },
      error: (err) => {
        if (err.status === 404) {
          this.noQuestionsAvailable = true;
          this.currentQuestion = null;
        } else {
          this.error = this.i18nService.getTranslation('errorLoadingQuestion') + ' ' + err.message;
        }
        this.loading = false;
      }
    });
  }

  markAsAnswered() {
    if (!this.currentQuestion || !this.selectedCharacter || !this.currentAnswer || this.currentAnswer.trim() === '') return;

    this.apiService.markQuestionAnswered(
      this.selectedCharacter.id,
      this.currentQuestion.question.id,
      this.currentAnswer.trim()
    ).subscribe({
      next: () => {
        this.successMessage = this.i18nService.getTranslation('answerSaved');
        this.currentQuestion = null;
        this.currentAnswer = '';
        this.loadCharacterStatus();
        setTimeout(() => {
          this.getNewQuestion();
        }, 1000);
      },
      error: (err) => {
        this.error = this.i18nService.getTranslation('errorSaving') + ' ' + err.message;
      }
    });
  }

  resetCharacter() {
    if (!this.selectedCharacter) return;

    this.apiService.resetCharacter(this.selectedCharacter.id).subscribe({
      next: () => {
        this.successMessage = this.i18nService.getTranslation('characterReset');
        this.currentQuestion = null;
        this.loadCharacterStatus();
        setTimeout(() => {
          this.getNewQuestion();
        }, 1000);
      },
      error: (err) => {
        this.error = this.i18nService.getTranslation('errorResetting') + ' ' + err.message;
      }
    });
  }

  resetCharacterById(characterId: number) {
    this.apiService.resetCharacter(characterId).subscribe({
      next: () => {
        this.successMessage = this.i18nService.getTranslation('characterReset');
        this.loadCharacterStatus();
        if (this.selectedCharacter?.id === characterId) {
          this.currentQuestion = null;
          this.getNewQuestion();
        }
      },
      error: (err) => {
        this.error = this.i18nService.getTranslation('errorResetting') + ' ' + err.message;
      }
    });
  }

  resetAllCharacters() {
    if (confirm(this.i18nService.getTranslation('confirmResetAll'))) {
      this.apiService.resetAllCharacters().subscribe({
        next: () => {
          this.successMessage = this.i18nService.getTranslation('allCharactersReset');
          this.currentQuestion = null;
          this.loadCharacterStatus();
        },
        error: (err) => {
          this.error = this.i18nService.getTranslation('errorResetting') + ' ' + err.message;
        }
      });
    }
  }

  getCharacterStatus(characterId: number): CharacterStatus | undefined {
    return this.characterStatus.find(s => s.id === characterId);
  }

  loadAvailableSeasons() {
    // For now, we'll use seasons 1-5 as available seasons
    // In a real implementation, this could be loaded from the API
    this.availableSeasons = [1, 2, 3, 4];
  }

  onSeasonChange() {
    // Reset current question when season changes
    this.currentQuestion = null;
    this.currentAnswer = '';
    this.error = '';
    this.successMessage = '';
    this.noQuestionsAvailable = false;
    
    // If a character is selected, get a new question for the selected season
    if (this.selectedCharacter) {
      this.getNewQuestion();
    }
  }
}
