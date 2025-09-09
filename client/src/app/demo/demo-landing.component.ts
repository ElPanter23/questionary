import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { I18nService } from '../services/i18n.service';
import { DemoService } from '../services/demo.service';

@Component({
  selector: 'app-demo-landing',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './demo-landing.component.html',
  styleUrls: ['./demo-landing.component.css']
})
export class DemoLandingComponent {
  public readonly i18nService = inject(I18nService);
  public readonly demoService = inject(DemoService);
  
  private router = inject(Router);
  
  sDemoId: string = '';
  bIsLoading = false;
  sError = '';

  startDemo() {
    this.bIsLoading = true;
    this.sError = '';
    
    this.demoService.startDemo().subscribe({
      next: (sSessionId) => {
        this.sDemoId = sSessionId;
        this.bIsLoading = false;
        // Navigate to demo game with session ID
        this.router.navigate(['/demo', sSessionId]);
      },
      error: (err) => {
        this.sError = this.i18nService.getTranslation('errorStartingDemo') + ' ' + err.message;
        this.bIsLoading = false;
      }
    });
  }

  joinDemo() {
    if (!this.sDemoId || this.sDemoId.trim() === '') {
      this.sError = this.i18nService.getTranslation('pleaseEnterDemoId');
      return;
    }

    this.bIsLoading = true;
    this.sError = '';
    
    this.demoService.validateDemoSession(this.sDemoId.trim()).subscribe({
      next: (bIsValid) => {
        if (bIsValid) {
          this.router.navigate(['/demo', this.sDemoId.trim()]);
        } else {
          this.sError = this.i18nService.getTranslation('invalidDemoId');
        }
        this.bIsLoading = false;
      },
      error: (err) => {
        this.sError = this.i18nService.getTranslation('errorValidatingDemo') + ' ' + err.message;
        this.bIsLoading = false;
      }
    });
  }
}
