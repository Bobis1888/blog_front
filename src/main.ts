import { bootstrapApplication } from '@angular/platform-browser';
import { appConfig } from 'app/core/config/app.config';
import { MainComponent } from 'app/main.component';

bootstrapApplication(MainComponent, appConfig)
  .catch((err) => console.error(err));
