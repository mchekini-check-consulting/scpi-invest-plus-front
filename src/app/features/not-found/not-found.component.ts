import { Component } from "@angular/core";
import { ButtonDirective } from "primeng/button";
import { RouterLink } from "@angular/router";
import { Panel } from "primeng/panel";

@Component({
  selector: "app-not-found",
  imports: [ButtonDirective, RouterLink, Panel],
  templateUrl: "./not-found.component.html",
  styleUrl: "./not-found.component.css",
})
export class NotFoundComponent {}
