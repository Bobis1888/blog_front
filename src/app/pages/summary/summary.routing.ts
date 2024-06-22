import {SummaryComponent} from "./summary.component";
import {Routes} from "@angular/router";
import {LineType, lineTypes} from "app/core/service/line/line.service";
import {LineComponent} from "app/pages/widgets/line/line.component";

export const summaryRouting: Routes = [
  {
    path: '',
    component: SummaryComponent,
    data: {animation: 'SummaryComponent'},
    children: [
      {
        path: '',
        component: LineComponent,
        data: {type: LineType.top}
      },
      ...lineTypes().map(it => {
        return {
          path: it,
          component: LineComponent,
          data: {type: it},
        };
      })
    ]
  },
];
