import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { Navbar } from '../../shared/navbar/navbar';
@Component({
  selector: 'app-admin-layout',
  imports: [RouterOutlet, Navbar],
  templateUrl: './admin-layout.html',
  styleUrl: './admin-layout.scss'
})
export class AdminLayout {

}
