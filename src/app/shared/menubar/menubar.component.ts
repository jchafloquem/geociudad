import { Component, OnInit } from '@angular/core';
import { MenuItem } from 'primeng/api';

@Component({
  selector: 'app-menubar',
  templateUrl: './menubar.component.html',
  styleUrls: ['./menubar.component.css']
})
export class MenubarComponent implements OnInit {
  sidebarVisible: boolean = false;
  menuBarItems: MenuItem[] | undefined;
  ngOnInit() {
    this.menuBarItems = [
      {
        label: 'GeoVisor',
        icon: 'pi pi-fw pi-map',
        routerLink: 'map'
      },
      {
        label: 'Dashboard',
        icon: 'pi pi-fw pi-chart-bar',
        routerLink: 'dashboard'
      },
      {
        label: 'Galeria',
        icon: 'pi pi-fw pi-camera',
        items: [
          {
              label: 'Capacitaciones',
              icon: 'pi pi-fw pi-align-left',
              routerLink: 'gallery'
          },
          {
              label: 'Atenciones de emergencia',
              icon: 'pi pi-fw pi-align-right'
          },
      ]
      },
      {
        label: 'Estudios',
        icon: 'pi pi-fw pi-book',
        routerLink: ''
      },
      {
        label: 'Usuarios',
        icon: 'pi pi-fw pi-users',
        routerLink: ''
      },
      {
        label: 'Exit',
        icon: 'pi pi-fw pi-power-off',
        routerLink: '/auth/login'
      }
    ];
  }

}
