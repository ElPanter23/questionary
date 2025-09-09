import { Component, OnInit, inject, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink, RouterLinkActive } from '@angular/router';
import { Subscription } from 'rxjs';
import { DemoService, DemoQuestion } from '../services/demo.service';
import { I18nService } from '../services/i18n.service';

@Component({
  selector: 'app-demo-questions',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink, RouterLinkActive],
  templateUrl: './demo-questions.component.html',
  styleUrls: ['./demo-questions.component.css']
})
export class DemoQuestionsComponent implements OnInit, OnDestroy {
  public readonly i18nService = inject(I18nService);
  public readonly demoService = inject(DemoService);
  
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private subscription = new Subscription();

  oQuestions: DemoQuestion[] = [];
  bIsLoading = false;
  sError = '';
  sSessionId: string = '';

  ngOnInit() {
    this.route.params.subscribe(params => {
      this.sSessionId = params['id'];
      if (this.sSessionId) {
        this.loadQuestions();
      } else {
        this.router.navigate(['/demo']);
      }
    });
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }

  loadQuestions() {
    this.bIsLoading = true;
    this.subscription.add(
      this.demoService.getDemoQuestions().subscribe({
        next: (oQuestions) => {
          this.oQuestions = oQuestions;
          this.bIsLoading = false;
        },
        error: (err) => {
          this.sError = this.i18nService.getTranslation('errorLoadingQuestions') + ' ' + err.message;
          this.bIsLoading = false;
        }
      })
    );
  }


  backToDemoLanding() {
    this.router.navigate(['/demo']);
  }
}
