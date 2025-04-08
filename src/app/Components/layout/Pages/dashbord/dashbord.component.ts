import { Component, OnInit } from '@angular/core';

import { Chart, registerables } from 'node_modules/chart.js';
import { DashboardService } from 'src/app/Services/dashboard.service';
Chart.register(...registerables);

@Component({
  selector: 'app-dashbord',
  templateUrl: './dashbord.component.html',
  styleUrls: ['./dashbord.component.css']
})
export class DashbordComponent implements OnInit {
  revenuesTotal: string = "0";
  salesTotal: string = "0";
  productTotal: string = "0";

  constructor(
    private _dashboardServicio: DashboardService,
  ) {


  }

  ngOnInit(): void {

    this._dashboardServicio.resume().subscribe({
      next: (data) => {
        if (data.status) {

          this.revenuesTotal = data.value.revenuesTotal;
          this.salesTotal = data.value.salesTotal;
          this.productTotal = data.value.productTotal;

          const arrayData: any[] = data.value.weekSaleDTOs;
          const labelTemp = arrayData.map((value) => value.date);
          const dataTemp = arrayData.map((value) => value.total);
          this.showGraph(labelTemp, dataTemp)

        }
      },
      error: (e) => { },
      complete: () => { }
    })

  }

  showGraph(labelsGrafic:any[],dataGrafic:any[]) {
    const myChart = new Chart('myChart', {
      type: 'bar',
      data: {
        labels: labelsGrafic,
        datasets: [{
          label: '# of Sales',
          data: dataGrafic,
          backgroundColor: [
            'rgba(54, 162, 235, 0.2)'
          ],
          borderColor: [
            'rgba(54, 162, 235, 1)'
          ],
          borderWidth: 1
        }]
      },
      options: {
        maintainAspectRatio: false,
        responsive: true,
        scales: {
          y: {
            beginAtZero: true
          }
        }
      }
    });
  }
}
