import { Component } from '@angular/core';

@Component({
  selector: 'app-setting',
  templateUrl: 'setting.page.html',
  styleUrls: ['setting.page.scss'],
  standalone: false,
})
export class SettingPage {
  readonly title : string ="Ajustes";
  constructor() {}

}
