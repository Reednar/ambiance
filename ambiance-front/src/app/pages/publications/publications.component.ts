import { Component, ViewChild, OnInit } from '@angular/core';
import { Table } from 'primeng/table';

@Component({
  selector: 'app-publications',
  templateUrl: './publications.component.html',
  styleUrls: ['./publications.component.scss']
})
export class PublicationsComponent implements OnInit {
  @ViewChild('dt1', { static: false }) dt1: any;

  publications = [
    {
      image: '/assets/images/products/s4.jpg',
      prix: 2,
      autheurAvatar: '/assets/images/products/s1.jpg',
      categories: ['Social', 'Technology'],
      titre: 'As yen tumbles, gadget-loving Japan goes for iPhones',
      vus: 9125,
      ville: 3,
      codePostal: 78990,
      date: new Date('2025-12-01')
    },
    {
      image: '/assets/images/products/s5.jpg',
      prix: 2,
      autheurAvatar: '/assets/images/products/s5.jpg',
      categories: ['Social', 'Technology'],
      titre: 'As yen tumbles, gadget-loving Japan goes for iPhones',
      vus: 9125,
      ville: 3,
      codePostal: 78990,
      date: new Date('2025-12-01')
    },
    {
      image: '/assets/images/products/s7.jpg',
      prix: 2,
      autheurAvatar: '/assets/images/products/s2.jpg',
      categories: ['Social', 'Technology'],
      titre: 'As yen tumbles, gadget-loving Japan goes for iPhones',
      vus: 9125,
      ville: 3,
      codePostal: 78990,
      date: new Date('2025-12-01')
    },
    {
      image: '/assets/images/products/s4.jpg',
      prix: 2,
      autheurAvatar: '/assets/images/products/s3.jpg',
      categories: ['Technology'],
      titre: 'As yen tumbles, gadget-loving Japan goes for iPhones',
      vus: 9125,
      ville: 3,
      codePostal: 78977,
      date: new Date('2025-12-01')
    },
    {
      image: '/assets/images/products/s5.jpg',
      prix: 2,
      autheurAvatar: 'assets/avatar1.png',
      categories: ['Social'],
      titre: 'ntel loses bid to revive antitrust case against patent foe Fortress',
      vus: 9125,
      ville: 3,
      codePostal: 78990,
      date: new Date('2025-12-01')
    },
    {
      image: '/assets/images/products/s7.jpg',
      prix: 2,
      autheurAvatar: 'assets/avatar1.png',
      categories: ['Social', 'Technology'],
      titre: 'COVID outbreak deepens as more lockdowns loom in China',
      vus: 9125,
      ville: 3,
      codePostal: 78990,
      date: new Date('2025-12-01')
    },
    {
      image: '/assets/images/products/s5.jpg',
      prix: 2,
      autheurAvatar: 'assets/avatar1.png',
      categories: ['Social'],
      titre: 'ntel loses bid to revive antitrust case against patent foe Fortress',
      vus: 9125,
      ville: 3,
      codePostal: 78990,
      date: new Date('2025-12-01')
    },
    {
      image: '/assets/images/products/s7.jpg',
      prix: 2,
      autheurAvatar: 'assets/avatar1.png',
      categories: ['Social', 'Technology'],
      titre: 'COVID outbreak deepens as more lockdowns loom in China',
      vus: 9125,
      ville: 3,
      codePostal: 78990,
      date: new Date('2025-12-01')
    }
  ];

  searchQuery: string = '';
  selectedCategory: string | null = null;
  selectedCategories: string[] = [];
  filteredPublications = [...this.publications];

  categories = [
    { label: 'Social', value: 'Social' },
    { label: 'Technology', value: 'Technology' }
  ];

  ngOnInit() {
    this.filteredPublications = [...this.publications];
  }

  filterPublications() {
    this.filteredPublications = this.publications.filter(pub => {
      const matchesSearch = pub.titre.toLowerCase().includes(this.searchQuery.toLowerCase());
      const matchesCategory = !this.selectedCategory || pub.categories.includes(this.selectedCategory);
      const matchesMultiSelect = !this.selectedCategories.length || this.selectedCategories.some(cat => pub.categories.includes(cat));
      
      return matchesSearch && matchesCategory && matchesMultiSelect;
    });
  }

  onGlobalFilter(table: Table, event: Event){
    table.filterGlobal((event.target as HTMLInputElement).value, 'contains');
  }

}