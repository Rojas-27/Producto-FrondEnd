import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { HeaderComponent } from './shared/components/header/header.component';
import { FooterComponent } from './shared/components/footer/footer.component';
import { MaterialModule } from '@app/material.modules';
import { SidebarModule } from './shared/components/sidebar/sidebar.module';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { UtilsService } from '@shared/services/util.service';
import { LoadingComponent } from './shared/components/loading/loading.component';
import { AdminInterceptor } from './shared/interceptors/admin-interceptor';



@NgModule({
  declarations: [
    AppComponent,
    HeaderComponent,
    FooterComponent,
    LoadingComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    MaterialModule,
    SidebarModule,
    HttpClientModule
  ],
  providers: [
    UtilsService,
    {provide: HTTP_INTERCEPTORS, useClass: AdminInterceptor, multi: true}
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
