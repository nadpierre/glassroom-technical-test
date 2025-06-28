import { Component } from '@angular/core';
import { CampaignTable } from './campaign-table/campaign-table';
import { HttpClientModule } from '@angular/common/http';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CampaignTable, HttpClientModule],
  styleUrl: './app.css',
  template: `<app-campaign-table></app-campaign-table>`
})

export class App {
  protected title = 'frontend-glassroom';
}
