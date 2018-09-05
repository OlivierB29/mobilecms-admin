import { Component, OnInit, Input } from '@angular/core';
import { MenuItem } from './menuitem';
import { Router } from '@angular/router';

@Component({
  
  selector: 'app-menubutton',
  templateUrl: 'menubutton.component.html',
  styleUrls: ['menubutton.component.css']
})
export class MenubuttonComponent implements OnInit {

  @Input() item: MenuItem  ;

  constructor(private router: Router) { }

  ngOnInit() {
  }

  open(): void {

    this.router.navigate([this.item.routerLink]);
  }

}
