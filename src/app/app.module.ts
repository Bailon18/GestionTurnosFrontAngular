
import { LOCALE_ID, NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { HTTP_INTERCEPTORS, HttpClientModule } from '@angular/common/http';
import { FormsModule } from '@angular/forms';
import { ComponentesModule } from './componentes/componentes.module';
import { InterceptorService } from './shared/interceptores/interceptor.service';
import { registerLocaleData } from '@angular/common';
import localeEs from '@angular/common/locales/es';
import { WebSocketService } from './componentes/dashboard/webSocketService';
import { ModalCreacionModulosComponent } from './componentes/dashboard/modulos/modal-creacion-modulos/modal-creacion-modulos.component';

registerLocaleData(localeEs);


@NgModule({
  declarations: [
    AppComponent,
    ModalCreacionModulosComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    ComponentesModule,
    BrowserAnimationsModule,
    BrowserModule, 
    AppRoutingModule,
    BrowserAnimationsModule,
    HttpClientModule,
    FormsModule,

    
  ],

  bootstrap: [AppComponent],
  providers: [
    { provide: LOCALE_ID, useValue: 'es' },
    { provide: HTTP_INTERCEPTORS, useClass: InterceptorService, multi: true },
    WebSocketService
  ],
})
export class AppModule { }
