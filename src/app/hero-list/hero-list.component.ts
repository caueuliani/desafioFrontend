import { Component, OnInit, NgModule } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { FormsModule } from '@angular/forms';
import { HeroFilterComponent } from '../hero-filter/hero-filter.component';

@Component({
  selector: 'app-hero-list',
  templateUrl: './hero-list.component.html',
  styleUrls: ['./hero-list.component.css']
})
export class HeroListComponent implements OnInit {
  heroes: any[] = [];
  filteredHeroes: any[] = [];
  searchTerm: string = '';
  orderBy: string = 'name'; // Default order by name
  pagination: any = null; // Define pagination property

  constructor(private http: HttpClient) { }

  ngOnInit(): void {
    this.fetchHeroes();
  }

  fetchHeroes(offset: number = 0, limit: number = 20): void {
    const url = `http://gateway.marvel.com/v1/public/characters?ts=1710519436332&apikey=2b56b53f8cb43f4273f11193b256c64a&hash=fad7d8b6f0f42fb8eaa29053363c85df&offset=${offset}&limit=${limit}`;

    this.http.get<any>(url).subscribe(
      response => {
        if (response && response.data && response.data.results) {
          this.heroes = response.data.results.map((hero: any) => {
            return {
              id: hero.id,
              name: hero.name,
              description: hero.description,
              modified: hero.modified,
              thumbnail: `${hero.thumbnail.path}.${hero.thumbnail.extension}`,
              series: hero.series.items.slice(0, 10),
              comics: hero.comics.items.slice(0, 10), 
              events: hero.events.items,
            };
          });
          this.filteredHeroes = this.heroes;
          const total = response.data.total;
          if (this.heroes.length < total) {
            const totalPages = Math.ceil(total / limit);
            this.pagination = { offset, limit, total, totalPages };
          } else {
            this.pagination = null;
          }
        } else {
          console.error('Error: Invalid response from Marvel API');
        }
      },
      error => {
        console.error('Error fetching data from Marvel API:', error);
      }
      
    );
  }

  fetchPreviousPage(): void {
    const prevOffset = this.pagination.offset - this.pagination.limit;
    this.fetchHeroes(prevOffset >= 0 ? prevOffset : 0, this.pagination.limit);
  }

  fetchNextPage(): void {
    const nextOffset = this.pagination.offset + this.pagination.limit;
    this.fetchHeroes(nextOffset, this.pagination.limit);
  }

  applyFilter(searchTerm: string) {
    console.log(this.searchTerm);
    this.filteredHeroes = this.heroes.filter(hero =>
      hero.name.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }

  orderByChanged(orderBy: string) {
    switch(orderBy) {
      case 'name':
        this.filteredHeroes.sort((a, b) => a.name.localeCompare(b.name));
        break;
      case 'year':
        console.log(this.filteredHeroes);
        this.filteredHeroes.sort((a, b) => {
          const yearA = this.extractYear(a);
          const yearB = this.extractYear(b);
          return yearA - yearB;
        });
        break;
      default:
    }
  }
  
  private extractYear(hero: any): number {
    const releaseYear = new Date(hero.modified);
    if (!isNaN(releaseYear.getTime())) 
    {
      console.log(releaseYear.getFullYear());
      return new Date(releaseYear).getFullYear();
    } 
    else 
    {
      return 0; 
      
    }
  }
}
