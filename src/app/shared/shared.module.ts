import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PrimengModule } from '../primeng/primeng.module';
import { MaterialModule } from '../material/material.module';

import { MenubarComponent } from './menubar/menubar.component';
import { SidebarComponent } from './sidebar/sidebar.component';
import { Error404Component } from './pages/error404/error404.component';



@NgModule({
  declarations: [
    MenubarComponent,
    SidebarComponent,
    Error404Component
  ],
  imports: [
    CommonModule,
    PrimengModule,
    MaterialModule,
  ],
  exports:[
    MenubarComponent,
    SidebarComponent,
    Error404Component,
  ]
})
export class SharedModule { }
