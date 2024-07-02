import {NgModule} from '@angular/core';
import {MatButtonModule} from "@angular/material/button";
import {MatTableModule} from "@angular/material/table";
import {MatFabButton} from "@angular/material/button";
import {MatIcon, MatIconModule} from "@angular/material/icon";
import {MatDrawer, MatDrawerContainer, MatSidenavModule} from "@angular/material/sidenav";
import {MatBottomSheetModule} from "@angular/material/bottom-sheet";
import {MatListModule} from "@angular/material/list";
import {MatLine, MatRipple} from "@angular/material/core";
import {MatCardModule} from "@angular/material/card";
import {
  MatStep,
  MatStepLabel,
  MatStepper,
  MatStepperModule,
  MatStepperNext,
  MatStepperPrevious
} from "@angular/material/stepper";
import {MatFormField, MatFormFieldModule, MatHint, MatLabel} from "@angular/material/form-field";
import {MatInput, MatInputModule} from "@angular/material/input";
import {MatProgressSpinner} from "@angular/material/progress-spinner";
import {MatSlideToggleModule} from "@angular/material/slide-toggle";
import {MatSnackBarModule} from "@angular/material/snack-bar";
import {MatProgressBar} from "@angular/material/progress-bar";
import {MatGridListModule} from '@angular/material/grid-list';
import {MatChipsModule} from '@angular/material/chips';
import {MatBadge} from "@angular/material/badge";
import {MatMenuModule} from "@angular/material/menu";
import {MatAutocompleteModule} from "@angular/material/autocomplete";
import {MatTooltip} from "@angular/material/tooltip";
import {MatRadioButton, MatRadioGroup} from "@angular/material/radio";
import {MatDialogActions, MatDialogContent} from "@angular/material/dialog";

@NgModule({
  declarations: [],
  imports: [
    MatFabButton,
    MatDrawerContainer,
    MatDrawer,
    MatLine,
    MatFormField,
    MatInput,
    MatStepper,
    MatStep,
    MatStepLabel,
    MatFormField,
    MatStepperPrevious,
    MatStepperNext,
    MatInput,
    MatLabel,
    MatHint,
    MatIcon,
    MatProgressSpinner,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatIconModule,
    MatProgressBar,
    MatBadge,
    MatRipple,
    MatAutocompleteModule,
    MatTooltip,
    MatRadioGroup,
    MatRadioButton,
    MatDialogContent,
    MatDialogActions
  ],
  exports: [
    MatSidenavModule,
    MatButtonModule,
    MatTableModule,
    MatFabButton,
    MatIconModule,
    MatButtonModule,
    MatBottomSheetModule,
    MatListModule,
    MatLine,
    MatCardModule,
    MatStepperModule,
    MatStepper,
    MatStep,
    MatStepLabel,
    MatFormField,
    MatStepperPrevious,
    MatStepperNext,
    MatInput,
    MatLabel,
    MatHint,
    MatIcon,
    MatIconModule,
    MatProgressSpinner,
    MatSlideToggleModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatSnackBarModule,
    MatProgressBar,
    MatGridListModule,
    MatChipsModule,
    MatBadge,
    MatRipple,
    MatMenuModule,
    MatAutocompleteModule,
    MatTooltip,
    MatRadioGroup,
    MatRadioButton,
    MatDialogContent,
    MatDialogActions
  ]
})
export class MaterialModule {
}
