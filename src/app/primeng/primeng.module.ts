import { NgModule } from '@angular/core';

import { ButtonModule } from 'primeng/button';
import { CardModule } from 'primeng/card';
import { CheckboxModule } from 'primeng/checkbox';
import { DividerModule } from 'primeng/divider';
import { ImageModule } from 'primeng/image';
import { InputTextModule } from 'primeng/inputtext';
import { MenubarModule } from 'primeng/menubar';
import { PanelMenuModule } from 'primeng/panelmenu';
import { SidebarModule } from 'primeng/sidebar';
import { TabViewModule } from 'primeng/tabview';


@NgModule({
  exports:[
    ButtonModule,
    CardModule,
    CheckboxModule,
    DividerModule,
    ImageModule,
    InputTextModule,
    MenubarModule,
    PanelMenuModule,
    SidebarModule,
    TabViewModule,
  ],

})
export class PrimengModule { }
