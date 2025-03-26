import { Component } from '@angular/core';
import { Table } from 'primeng/table';
@Component({
  selector: 'app-publications-created',
  templateUrl: './publications-created.component.html',
  styleUrls: ['./publications-created.component.scss']
})
export class PublicationsCreatedComponent {

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
      autheurAvatar: 'assets/avatar1.png',
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
      autheurAvatar: 'assets/avatar1.png',
      categories: ['Social', 'Technology'],
      titre: 'As yen tumbles, gadget-loving Japan goes for iPhones',
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