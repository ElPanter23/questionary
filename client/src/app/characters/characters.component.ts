import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ApiService, Character, CharacterAnswers, QuestionAnswer } from '../services/api.service';
import { I18nService } from '../services/i18n.service';

@Component({
  selector: 'app-characters',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './characters.component.html',
  styleUrls: ['./characters.component.css']
})
export class CharactersComponent implements OnInit {
  public readonly i18nService = inject(I18nService);
  
  characters: Character[] = [];
  newCharacter: Partial<Character> = {};
  editingCharacter: Character | null = null;
  selectedCharacter: Character | null = null;
  characterStats: any = null;
  characterAnswers: QuestionAnswer[] = [];
  loading = false;
  error = '';
  successMessage = '';

  constructor(private apiService: ApiService) {}

  ngOnInit() {
    this.loadCharacters();
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

  addCharacter() {
    if (!this.newCharacter.name) return;

    this.loading = true;
    this.error = '';
    this.successMessage = '';

    this.apiService.addCharacter(this.newCharacter).subscribe({
      next: (character) => {
        this.characters.unshift(character);
        this.newCharacter = {};
        this.successMessage = this.i18nService.getTranslation('characterAdded');
        this.loading = false;
      },
      error: (err) => {
        this.error = this.i18nService.getTranslation('errorAdding') + ' ' + err.message;
        this.loading = false;
      }
    });
  }

  editCharacter(character: Character) {
    this.editingCharacter = { ...character };
    this.error = '';
    this.successMessage = '';
    this.closeCharacterDetails()
  }

  updateCharacter() {
    if (!this.editingCharacter) return;

    this.loading = true;
    this.error = '';
    this.successMessage = '';

    this.apiService.updateCharacter(this.editingCharacter.id, this.editingCharacter).subscribe({
      next: (updatedCharacter) => {
        const index = this.characters.findIndex(c => c.id === updatedCharacter.id);
        if (index !== -1) {
          this.characters[index] = updatedCharacter;
        }
        this.editingCharacter = null;
        this.successMessage = this.i18nService.getTranslation('characterUpdated');
        this.loading = false;
      },
      error: (err) => {
        this.error = this.i18nService.getTranslation('errorUpdating') + ' ' + err.message;
        this.loading = false;
      }
    });
  }

  cancelEdit() {
    this.editingCharacter = null;
    this.error = '';
    this.successMessage = '';
  }

  deleteCharacter(characterId: number) {
    if (!confirm(this.i18nService.getTranslation('confirmDeleteCharacter'))) return;

    this.loading = true;
    this.error = '';
    this.successMessage = '';

    this.apiService.deleteCharacter(characterId).subscribe({
      next: () => {
        this.characters = this.characters.filter(c => c.id !== characterId);
        this.successMessage = this.i18nService.getTranslation('characterDeleted');
        this.loading = false;
      },
      error: (err) => {
        this.error = this.i18nService.getTranslation('errorDeleting') + ' ' + err.message;
        this.loading = false;
      }
    });
  }

  viewCharacterDetails(character: Character) {
    console.log('Opening character details for:', character);
    this.selectedCharacter = character;
    this.loadCharacterStats(character.id);
    this.loadCharacterAnswers(character.id);
    this.error = '';
    this.successMessage = '';
  }

  closeCharacterDetails() {
    this.selectedCharacter = null;
    this.characterStats = null;
    this.characterAnswers = [];
    this.error = '';
    this.successMessage = '';
  }

  loadCharacterStats(characterId: number) {
    this.apiService.getCharacterStatus().subscribe({
      next: (statusList) => {
        const characterStatus = statusList.find(s => s.id === characterId);
        this.characterStats = characterStatus || { answered_count: 0, total_questions: 0 };
      },
      error: (err) => {
        console.error(this.i18nService.getTranslation('errorLoadingStats'), err);
        this.characterStats = { answered_count: 0, total_questions: 0 };
      }
    });
  }

  loadCharacterAnswers(characterId: number) {
    this.apiService.getCharacterAnswers(characterId).subscribe({
      next: (data) => {
        this.characterAnswers = data.answers;
      },
      error: (err) => {
        console.error(this.i18nService.getTranslation('errorLoadingAnswers'), err);
        this.characterAnswers = [];
      }
    });
  }

  getProgressPercentage(): number {
    if (!this.characterStats || this.characterStats.total_questions === 0) {
      return 0;
    }
    return Math.round((this.characterStats.answered_count / this.characterStats.total_questions) * 100);
  }

  formatDate(dateString: string): string {
    const date = new Date(dateString);
    return date.toLocaleDateString('de-DE', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit'
    });
  }

  startGameWithCharacter(character: Character) {
    // Navigate to game component with character
    // This would typically use Angular Router
    console.log('Starting game with character:', character);
    // For now, just show a message
    this.successMessage = `${this.i18nService.getTranslation('startGame')} ${character.name}!`;
  }

  resetCharacterProgress(characterId: number) {
    if (!confirm(this.i18nService.getTranslation('confirmResetProgress'))) return;

    this.loading = true;
    this.error = '';
    this.successMessage = '';

    this.apiService.resetCharacter(characterId).subscribe({
      next: () => {
        this.successMessage = this.i18nService.getTranslation('progressReset');
        this.loadCharacterStats(characterId);
        this.loading = false;
      },
      error: (err) => {
        this.error = this.i18nService.getTranslation('errorResetting') + ' ' + err.message;
        this.loading = false;
      }
    });
  }

  getCharacterStatus(characterId: number): any {
    // This would need to be implemented to get character status
    // For now, return null to avoid errors
    return null;
  }

  resetAllCharacters() {
    if (confirm(this.i18nService.getTranslation('confirmResetAll'))) {
      this.apiService.resetAllCharacters().subscribe({
        next: () => {
          this.successMessage = this.i18nService.getTranslation('allCharactersReset');
          this.loadCharacters();
        },
        error: (err) => {
          this.error = this.i18nService.getTranslation('errorResetting') + ' ' + err.message;
        }
      });
    }
  }
}
