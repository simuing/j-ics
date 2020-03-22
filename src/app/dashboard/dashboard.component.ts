import { Component, OnInit, ViewChild } from '@angular/core';
import {  } from './data';
import { AreaChartComponent } from '@swimlane/ngx-charts';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit {
  @ViewChild('areaChart', {static: true})
  chart: AreaChartComponent;
  
  constructor() {
  }


  ngOnInit() {
  }

}
