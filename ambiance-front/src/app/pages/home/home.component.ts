import { Component } from '@angular/core';

interface productCards {
    id: number;
    imgSrc: string;
    title: string;
    price: string;
    rprice: string;
}

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent { 

    productcards: productCards[] = [
        {
            id: 1,
            imgSrc: '../assets/images/products/s4.jpg',
            title: 'Boat Headphone',
            price: '285',
            rprice: '375',
        },
        {
            id: 2,
            imgSrc: '../assets/images/products/s5.jpg',
            title: 'MacBook Air Pro',
            price: '285',
            rprice: '375',
        },
        {
            id: 3,
            imgSrc: '../assets/images/products/s7.jpg',
            title: 'Red Valvet Dress',
            price: '285',
            rprice: '375',
        },
        {
            id: 4,
            imgSrc: '../assets/images/products/s11.jpg',
            title: 'Cute Soft Teddybear',
            price: '285',
            rprice: '375',
        },
    ];


    articles = [
      {
        image: '/assets/images/products/s4.jpg',
        readTime: 2,
        authorAvatar: 'assets/avatar1.png',
        category: ['Social', 'Technology'],
        title: 'As yen tumbles, gadget-loving Japan goes for iPhones',
        views: 9125,
        comments: 3,
        date: new Date('2025-12-01')
      },
      {
        image: '/assets/images/products/s5.jpg',
        readTime: 22,
        authorAvatar: '/assets/images/products/s5.jpg',
        category: ['Gadget', 'Business'],
        title: 'Intel loses bid to revive antitrust case against patent foe Fortress',
        views: 9125,
        comments: 3,
        date: new Date('2025-12-02')
      },
      {
        image: '/assets/images/products/s7.jpg',
        readTime: 2,
        authorAvatar: '/assets/images/products/s7.jpg',
        category: ['Health', 'World', 'World', 'World', 'World'],
        title: 'COVID outbreak deepens as more lockdowns loom in China',
        views: 9125,
        comments: 12,
        date: new Date('2025-12-03')
      },
      {
        image: '/assets/images/products/s4.jpg',
        readTime: 2,
        authorAvatar: 'assets/avatar1.png',
        category: ['Social', 'Technology'],
        title: 'As yen tumbles, gadget-loving Japan goes for iPhones',
        views: 9125,
        comments: 3,
        date: new Date('2025-12-01')
      },
      {
        image: '/assets/images/products/s5.jpg',
        readTime: 22,
        authorAvatar: '/assets/images/products/s5.jpg',
        category: ['Gadget', 'Business'],
        title: 'Intel loses bid to revive antitrust case against patent foe Fortress',
        views: 9125,
        comments: 3,
        date: new Date('2025-12-02')
      },
      {
        image: '/assets/images/products/s7.jpg',
        readTime: 2,
        authorAvatar: '/assets/images/products/s7.jpg',
        category: ['Health', 'World', 'World', 'World', 'World'],
        title: 'COVID outbreak deepens as more lockdowns loom in China',
        views: 9125,
        comments: 12,
        date: new Date('2025-12-03')
      },
      {
        image: '/assets/images/products/s7.jpg',
        readTime: 2,
        authorAvatar: '/assets/images/products/s7.jpg',
        category: ['Health', 'World', 'World', 'World', 'World'],
        title: 'COVID outbreak deepens as more lockdowns loom in China',
        views: 9125,
        comments: 12,
        date: new Date('2025-12-03')
      },
      {
        image: '/assets/images/products/s7.jpg',
        readTime: 2,
        authorAvatar: '/assets/images/products/s7.jpg',
        category: ['Health', 'World', 'World', 'World', 'World'],
        title: 'COVID outbreak deepens as more lockdowns loom in China',
        views: 9125,
        comments: 12,
        date: new Date('2025-12-03')
      }
    ];

}