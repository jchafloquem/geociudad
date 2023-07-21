import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { UgerdesRoutingModule } from './ugerdes-routing.module';
import { MapComponent } from './pages/map/map.component';
import { LayoutPageComponent } from './pages/layout-page/layout-page.component';
import { DashboardComponent } from './pages/dashboard/dashboard.component';
import { GalleryComponent } from './pages/gallery/gallery.component';
import { SharedModule } from '../shared/shared.module';
import { MaterialModule } from '../material/material.module';
import { PrimengModule } from '../primeng/primeng.module';


@NgModule({
  declarations: [
    MapComponent,
    LayoutPageComponent,
    DashboardComponent,
    GalleryComponent
  ],
  imports: [
    CommonModule,
    UgerdesRoutingModule,
    SharedModule,
    MaterialModule,
    PrimengModule
  ]
})
export class UgerdesModule { }
