import { Component } from "@angular/core";
import { ButtonDirective } from "primeng/button";
import { Panel } from "primeng/panel";
import { RouterLink } from "@angular/router";

@Component({
  selector: "app-unauthorized",
  imports: [ButtonDirective, Panel, RouterLink],
  templateUrl: "./unauthorized.component.html",
  styleUrl: "./unauthorized.component.css",
})
export class UnauthorizedComponent {}
