import { NgModule, APP_INITIALIZER } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppComponent } from './app.component';
import { AppRoutingModule } from './app-routing.module';
import { FormQLModule } from '@formql/core';
import { FormQLEditorModule } from '@formql/editor';
import { FormQLMaterialModule } from '@formql/material';

import { DummyService } from './app-service';

import { HttpClientModule } from '@angular/common/http';
import { AppFormQLComponent } from './app-formql.component';

import { AppFormQLEditorComponent } from './app-formql-editor.component';
import { TextMaskModule } from 'angular2-text-mask';
import { ReactiveFormsModule } from '@angular/forms';

import { ComponentResolverService } from '@formql/core';

@NgModule({
    declarations: [
        AppComponent,
        AppFormQLComponent,
        AppFormQLEditorComponent
    ],
    imports: [
        BrowserModule,
        AppRoutingModule,
        FormQLModule,
        FormQLEditorModule,
        FormQLMaterialModule,
        HttpClientModule,
        TextMaskModule,
        ReactiveFormsModule
    ],
    providers: [
        ComponentResolverService,
        { 
            provide : APP_INITIALIZER, 
            multi : true, 
            deps : [ComponentResolverService], 
            useFactory : InitModule
        },        
        DummyService, 
        { 
            provide: 'FormQLService', 
            useClass: DummyService 
        }
    ],
    bootstrap: [AppComponent]
})
export class AppModule { }

export function InitModule(componentResolverService: ComponentResolverService) {
    let x = () => {
        // Here you can register your custom component 
        // e.g. componentResolverService.addComponent(...);
    }
    return x;
}