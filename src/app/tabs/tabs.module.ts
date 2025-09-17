import { IonicModule } from '@ionic/angular';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { TabsPageRoutingModule } from './tabs-routing.module';
import { Storage } from '@ionic/storage-angular';
import { TabsPage } from './tabs.page';
import { HTTP_INTERCEPTORS } from '@angular/common/http';
import { authInterceptor } from 'src/core/interceptors/auth-interceptor';

@NgModule({
  imports: [
    IonicModule,
    CommonModule,
    FormsModule,
    TabsPageRoutingModule
  ],
  declarations: [TabsPage],
  providers:[
          {
      provide: HTTP_INTERCEPTORS,
         useFactory: (storage: Storage) => authInterceptor(storage),
      multi: true,
      deps: [Storage]
    }
  ]
})
export class TabsPageModule {}
