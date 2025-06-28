import { Component, OnInit } from '@angular/core';
import { ApiService } from '../services/api';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-campaign-table',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: `./campaign-table.html`,
  styleUrl: './campaign-table.css'
})

export class CampaignTable implements OnInit {
  stats: any[] = []
  pagedStats: any[] = []
  filteredStats: any[] = [];
  
  currentPage = 1;
  itemsPerPage = 20;

  // Filters
  campaignFilter = '';
  startDate: string = '';
  endDate: string = '';
  funnelFilter: string[] = [];
  formatFilter: string[] = [];
  sizeFilter: string[] = [];

  // Unique filter values
  allFunnels: string[] = [];
  allFormats: string[] = [];
  allSizes: string[] = [];
  
  constructor(private api: ApiService) {}
  
  ngOnInit(): void {
    this.api.getStats().subscribe((data) => {
      this.stats = data;
      this.setPagedData();

      // Extract unique values for dropdowns
      this.allFunnels = [...new Set(data.map(row => row.funnel))];
      this.allFormats = [...new Set(data.map(row => row.format))];
      this.allSizes = [...new Set(data.map(row => row.size))];

      this.applyFilters();
    });
  }

  setPagedData(): void {
    const start = (this.currentPage - 1) * this.itemsPerPage;
    const end = start + this.itemsPerPage;
    this.pagedStats = this.filteredStats.slice(start, end);
  }

  changePage(page: number): void {
    if (page >= 1 && page <= this.totalPages()) {
        this.currentPage = page;
        this.setPagedData();
    }
  }

  totalPages(): number {
    return Math.ceil(this.filteredStats.length / this.itemsPerPage);
  }

  pagesArray(): number[] {
    const total = this.totalPages();
    const visible = 5;
    const pages: number[] = [];

    let start = Math.max(1, this.currentPage - Math.floor(visible / 2));
    let end = start + visible - 1;

    if (end > total) {
      end = total;
      start = Math.max(1, end - visible + 1);
    }

    for (let i = start; i <= end; i++) {
      pages.push(i);
    }

    return pages;
  }

  applyFilters(): void {
    let filtered = [...this.stats];

    if (this.campaignFilter.trim()) {
      filtered = filtered.filter(row =>
        row.campaign_name.toLowerCase().includes(this.campaignFilter.toLowerCase())
      );
    }

    if (this.funnelFilter.length) {
      filtered = filtered.filter(row => this.funnelFilter.includes(row.funnel));
    }

    if (this.formatFilter.length) {
      filtered = filtered.filter(row => this.formatFilter.includes(row.format));
    }

    if (this.sizeFilter.length) {
      filtered = filtered.filter(row => this.sizeFilter.includes(row.size));
    }

    // Date range
    if (this.startDate) {
      filtered = filtered.filter(row => row.date >= this.startDate);
    }
    if (this.endDate) {
      filtered = filtered.filter(row => row.date <= this.endDate);
    }

    this.filteredStats = filtered;
    this.currentPage = 1;
    this.setPagedData();
  }

  resetFilters(): void {
    this.startDate = '';
    this.endDate = '';
    this.campaignFilter = '';
    this.funnelFilter = [];
    this.formatFilter = [];
    this.sizeFilter = [];
    this.applyFilters();
  }

}
