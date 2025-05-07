import { Component } from '@angular/core';
import { Table } from 'primeng/table';
@Component({
  selector: 'app-publications-created',
  templateUrl: './publications-created.component.html',
  styleUrls: ['./publications-created.component.scss']
})
export class PublicationsCreatedComponent {
// ✅ Catégories fictives pour les tests


// ✅ Catégories sélectionnées
selectedCategories: any[] = [];
selectedCategoriesLabel: string = '';

// ✅ Recherche
searchQuery: string = '';

// ✅ Date sélectionnée
selectedDate: string = '';

  
categories = [
  { name: 'Catégorie 1', selected: false },
  { name: 'Catégorie 2', selected: false },
  { name: 'Catégorie 3', selected: false },
  // Ajouter d'autres catégories ici
];

dropdownOpen = false; // L'état de la liste déroulante

// Fonction pour basculer l'affichage de la liste déroulante
toggleDropdown() {
  this.dropdownOpen = !this.dropdownOpen;
}
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

    selectedCategory: string | null = null;
    filteredPublications = [...this.publications];
  

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

    categoriesOptions = [
      { name: 'Sport', selected: false },
      { name: 'Musique', selected: false },
      { name: 'Cuisine', selected: false },
      // Ajoute tes vraies catégories ici
    ];

    updateSelectedCategories() {
      const selected = this.categoriesOptions
        .filter(c => c.selected)
        .map(c => c.name);
    
      this.selectedCategories = selected;
    
      if (selected.length === 0) {
        this.selectedCategoriesLabel = '';
      } else if (selected.length === 1) {
        this.selectedCategoriesLabel = selected[0];
      } else if (selected.length <= 4){
        this.selectedCategoriesLabel = selected.join(', ');
      }
      else{
        this.selectedCategoriesLabel = `${selected.length} catégories sélectionnées`;
      }
    }
}