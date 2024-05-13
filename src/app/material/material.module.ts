import { NgModule } from '@angular/core';

import {MatButtonModule} from '@angular/material/button';
import {MatIconModule} from '@angular/material/icon';
import {MatFormFieldModule} from '@angular/material/form-field';
import {MatSelectModule} from '@angular/material/select';
import {MatInputModule} from '@angular/material/input';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import {MatSnackBarModule} from '@angular/material/snack-bar';
import {MatTableModule} from '@angular/material/table';
import {MatCardModule} from '@angular/material/card';
import {MatPaginatorModule} from '@angular/material/paginator';
import {MatTooltipModule} from '@angular/material/tooltip';
import {MatDialogModule} from '@angular/material/dialog';
import {MatCheckboxModule} from '@angular/material/checkbox';
import {MatRadioModule, MAT_RADIO_DEFAULT_OPTIONS} from '@angular/material/radio';
import {MatGridListModule} from '@angular/material/grid-list';
import {MatDatepickerModule} from '@angular/material/datepicker';
import {MatNativeDateModule} from '@angular/material/core';
import { DatePipe } from '@angular/common';
import { MAT_DATE_LOCALE } from '@angular/material/core';
import {CdkAccordionModule} from '@angular/cdk/accordion';
import { MatTabsModule } from '@angular/material/tabs';
import {MatListModule} from '@angular/material/list';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import {MatStepperModule} from '@angular/material/stepper';
import { MatToolbarModule } from '@angular/material/toolbar';




@NgModule({
  imports: [
    MatButtonModule,
    MatFormFieldModule,
    MatSelectModule,
    MatIconModule,
    MatInputModule,
    FormsModule,
    ReactiveFormsModule,
    MatSnackBarModule,
    MatTableModule,
    MatCardModule,
    MatPaginatorModule,
    MatTooltipModule,
    MatDialogModule,
    MatCheckboxModule,
    MatRadioModule,
    MatGridListModule,
    MatDatepickerModule,
    MatNativeDateModule,
    CdkAccordionModule,
    MatTabsModule,
    MatListModule,
    MatAutocompleteModule,
    MatStepperModule,
    MatToolbarModule
    

  ],

  exports: [
    MatButtonModule,
    MatFormFieldModule,
    MatSelectModule,
    MatIconModule,
    MatInputModule,
    ReactiveFormsModule,
    MatSnackBarModule,
    MatTableModule,
    MatCardModule,
    MatPaginatorModule,
    MatTooltipModule,
    MatDialogModule,
    MatCheckboxModule,
    MatRadioModule,
    MatGridListModule,
    FormsModule,
    MatDatepickerModule,
    MatNativeDateModule,
    CdkAccordionModule,
    MatTabsModule,
    MatListModule,
    MatAutocompleteModule,
    MatStepperModule,
    MatToolbarModule
 

    

  ],
  providers: [
    DatePipe,
    {
    provide: MAT_RADIO_DEFAULT_OPTIONS,
    useValue: { color: 'primary',},
    },
    { provide: MAT_DATE_LOCALE, useValue: 'es-ES' }
  ] 
})
export class MaterialModule { }
