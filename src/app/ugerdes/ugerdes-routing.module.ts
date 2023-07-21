import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LayoutPageComponent } from './pages/layout-page/layout-page.component';
import { MapComponent } from './pages/map/map.component';
import { DashboardComponent } from './pages/dashboard/dashboard.component';
import { GalleryComponent } from './pages/gallery/gallery.component';


const routes: Routes = [
  { path: '',
    component: LayoutPageComponent,
    children:[
      { path: 'map', component: MapComponent },
      { path: 'dashboard', component: DashboardComponent },
      { path: 'gallery', component: GalleryComponent },
      { path: '**', redirectTo: 'map' },
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class UgerdesRoutingModule { }
