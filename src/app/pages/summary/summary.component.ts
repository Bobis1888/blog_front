import {Component, OnInit} from '@angular/core';
import {Router} from '@angular/router';
import {RootModule} from 'app/root.module';
import {UnSubscriber} from 'app/core/abstract/un-subscriber';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {DeviceDetectorService} from 'ngx-device-detector';
import {Article} from "app/core/service/article/article.service";
import {MatBadge} from "@angular/material/badge";


@Component({
  selector: 'summary',
  standalone: true,
  imports: [RootModule, FormsModule, ReactiveFormsModule],
  templateUrl: './summary.component.html',
  styleUrl: './summary.component.less',
})
export class SummaryComponent extends UnSubscriber implements OnInit {
  constructor(
    private router: Router,
    private deviceService: DeviceDetectorService,
  ) {
    super();
  }

  public topics: Array<string> = ["#lifeStyle", "#engineering", "#holidays", "#money", "#workLifeBalance"];

  public items: Array<Article> = [
    new Article(
      "123",
      'Example title',
      'Example pre view text',
      'assets/favicon.ico',
      '@authorUserName',
    ),
    new Article(
      "123",
      'Example title',
      'Example pre view text',
      'assets/favicon.ico',
      '@authorUserName',
    ),
    new Article(
      "123",
      'Example title',
      'Example pre view text',
      'assets/favicon.ico',
      '@authorUserName',
    ),
    new Article(
      "123",
      'Example title',
      'Example pre view text',
      'assets/favicon.ico',
      '@authorUserName',
    ),
    new Article(
      "123",
      'Example title',
      'Example pre view text',
      'assets/favicon.ico',
      '@authorUserName',
    ),
    new Article(
      "123",
      'Example title',
      'Example pre view text',
      'assets/favicon.ico',
      '@authorUserName',
    ),
    new Article(
      "123",
      'Example title',
      'Example pre view text',
      'assets/favicon.ico',
      '@authorUserName',
    ),
    new Article(
      "123",
      'Example title',
      'Example pre view text',
      'assets/favicon.ico',
      '@authorUserName',
    ),
    new Article(
      "123",
      'Example title',
      'Example pre view text',
      'assets/favicon.ico',
      '@authorUserName',
    ),
    new Article(
      "123",
      'Example title',
      'Example pre view text',
      'assets/favicon.ico',
      '@authorUserName',
    ),
  ];

  get isMobile(): boolean {
    return this.deviceService.isMobile();
  }

  ngOnInit(): void {
  }

  public goToTopic(topic: string): void {

    if (!topic) {
      return;
    }

    topic = topic.replace('#', '');

    this.router.navigate(['/search'], {queryParams: {q: topic, tag: true}});
  }

  public goToUser(userName: string): void {
    this.router.navigate(['/profile'], {queryParams: {userName: userName}});
  }
}
