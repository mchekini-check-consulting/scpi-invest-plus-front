import { Component, EventEmitter, Output, OnInit } from "@angular/core";
import { CommonModule } from "@angular/common";
import { FormsModule } from "@angular/forms";
import { debounceTime, distinctUntilChanged, filter, Subject } from "rxjs";
import { ActivatedRoute } from "@angular/router"; 
import { InputTextModule } from "primeng/inputtext";
import { IconFieldModule } from "primeng/iconfield";
import { InputIconModule } from "primeng/inputicon";
import { InputGroupModule } from "primeng/inputgroup";
import { InputGroupAddonModule } from "primeng/inputgroupaddon";
import { ButtonModule } from "primeng/button";

@Component({
  selector: "app-search-bar",
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    InputTextModule,
    IconFieldModule,
    InputIconModule,
    InputGroupModule,
    InputGroupAddonModule,
    ButtonModule,
  ],
  templateUrl: "./search-bar.component.html",
  styleUrls: ["./search-bar.component.css"],
})
export class SearchBarComponent implements OnInit {
  @Output() searchTermChanged = new EventEmitter<string>();
  searchTerm: string = "";
  private searchSubject = new Subject<string>();

  constructor(private route: ActivatedRoute) {
    this.searchSubject
      .pipe(
        debounceTime(300),
        distinctUntilChanged(),
        filter((term: string) => term.length >= 3 || term.length === 0)
      )
      .subscribe((term) => this.searchTermChanged.emit(term));
  }

  ngOnInit(): void {
    this.route.queryParams.subscribe((params) => {
      if (params['name']) {
        this.searchTerm = params['name'];
        this.searchSubject.next(this.searchTerm);
      }
    });
  }

  onSearchChange(event: Event) {
    const inputElement = event.target as HTMLInputElement;
    this.searchTerm = inputElement.value.trim();
    this.searchSubject.next(this.searchTerm);
  }
}
