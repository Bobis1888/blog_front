import { bootstrapApplication } from '@angular/platform-browser';
import { MainComponent } from 'app/pages/main/main.component';
import { config } from 'app/config/app.config.server';

const bootstrap = () => bootstrapApplication(MainComponent, config);

export default bootstrap;
