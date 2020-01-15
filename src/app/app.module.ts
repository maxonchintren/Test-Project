import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { HttpClientModule } from '@angular/common/http';

import { AppComponent } from './app.component';
import { ProjectsService } from './projects/projects.service';
import { ResultsComponent } from './results/results.component';

@NgModule({
  declarations: [
    AppComponent,
    ResultsComponent,
  ],
  imports: [
    BrowserModule,
    HttpClientModule
  ],
  providers: [ ProjectsService ],
  bootstrap: [AppComponent]
})
export class AppModule { }
