import { bootstrapApplication } from '@angular/platform-browser';
import { AppDemoOnlyComponent } from './app/app-demo-only.component';
import { provideRouter } from '@angular/router';
import { provideHttpClient } from '@angular/common/http';
import { routes } from './app/app-demo-only.routes';
import { I18nService } from './app/services/i18n.service';
import { ThemeService } from './app/services/theme.service';

bootstrapApplication(AppDemoOnlyComponent, {
  providers: [
    provideRouter(routes),
    provideHttpClient(),
    I18nService,
    ThemeService
  ]
}).catch(err => console.error(err));
