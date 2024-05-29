import {Component, OnInit} from '@angular/core';
import {TranslateService} from '@ngx-translate/core';
import {RootModule} from 'app/root.module';
import {HasErrors} from "app/core/abstract/has-errors";
import {FormControl, FormsModule, ReactiveFormsModule} from "@angular/forms";
import {DeviceDetectorService} from "ngx-device-detector";
import {ActivatedRoute} from "@angular/router";

@Component({
  selector: 'search',
  standalone: true,
  imports: [RootModule, FormsModule, ReactiveFormsModule],
  templateUrl: './search.component.html',
  styleUrl: './search.component.less',
})
export class SearchComponent extends HasErrors implements OnInit {

  constructor(translate: TranslateService,
              private aRouter: ActivatedRoute,
              private deviceService: DeviceDetectorService) {
    super(translate);
  }

  get isMobile(): boolean {
    return this.deviceService.isMobile();
  }

  ngOnInit(): void {
    this.formGroup.addControl('search', new FormControl('', []));
    let q = this.aRouter.snapshot.queryParamMap?.get("q");
    let tag = this.aRouter.snapshot.queryParamMap?.get("tag");

    if (tag) {
      q = "#" + q;
    }

    if (q) {
      this.formGroup.get("search")?.setValue(q);
      this.submit();
    }
  }


  public submit(): void {

  }
}
