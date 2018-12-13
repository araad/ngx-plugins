import { Component } from '@angular/core';

@Component({
  selector: 'ngx-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  myData: Date = new Date();
  intervalHandle: any;

  ngOnInit(): void {
    this.intervalHandle = setInterval(() => {
      this.myData = new Date();
    }, 1000);
  }

  ngOnDestroy(): void {
    clearInterval(this.intervalHandle);
  }
}
