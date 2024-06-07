import { DecimalPipe } from '@angular/common';
import { Component, Input } from '@angular/core';
import { RouterLink } from '@angular/router';
import { ConditionsAndZip } from 'app/conditions-and-zip.type';
import { TabItemComponent } from 'app/tabs/tab-item.component';

@Component({
  selector: 'app-current-condition',
  standalone: true,
  imports: [TabItemComponent, DecimalPipe, RouterLink],
  template: `
  <div class="well flex" style="margin-bottom: 0;">
    <div>
        <h3>{{location.data.name}} ({{location.zip}})</h3>
        <h4>Current conditions: {{location.data.weather[0].main}}</h4>
        <h4>Temperatures today:</h4>
        <p>
          Current {{location.data.main.temp | number:'.0-0'}}
          - Max {{location.data.main.temp_max | number:'.0-0'}}
          - Min {{location.data.main.temp_min | number:'.0-0'}}
        </p>
        <p>
          <a [routerLink]="['/forecast', location.zip]" >Show 5-day forecast for {{location.data.name}}</a>
        </p>
    </div>
    <div>
      <img [src]="iconSrc">
    </div>
  </div>
  `,
})
export class CurrentConditionComponent {
  @Input() location!: ConditionsAndZip;
  @Input() iconSrc!: string;
}
