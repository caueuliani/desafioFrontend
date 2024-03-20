import { Component, EventEmitter, Output, Input, NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';


@Component({
  selector: 'app-hero-filter',
  templateUrl: './hero-filter.component.html',
  styleUrls: ['./hero-filter.component.css']
})
export class HeroFilterComponent {
  searchTerm: string = '';

  @Output() filterChange: EventEmitter<string> = new EventEmitter<string>();

  constructor() { }

  applyFilter() {
    this.filterChange.emit(this.searchTerm);
  }
}