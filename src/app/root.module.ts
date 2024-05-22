
import {CommonModule as AbstractCommonModule} from "@angular/common";
import {NgModule} from "@angular/core";
import {MaterialModule} from "app/material/material.module";
import {RouterLink, RouterOutlet} from "@angular/router";

@NgModule({
  declarations: [],
  imports: [
    AbstractCommonModule,
    MaterialModule,
    RouterLink,
  ],
  exports: [
    AbstractCommonModule,
    MaterialModule,
    RouterLink
  ]
})
export class CommonModule {}
