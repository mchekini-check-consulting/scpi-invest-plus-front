import { ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';
import { SearchBarComponent } from './search-bar.component';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ScpiService } from '../../../../core/service/scpi.service';
import { FormsModule } from '@angular/forms';
import { InputTextModule } from 'primeng/inputtext';
import { of } from 'rxjs';
import { ScpiModel } from '../../../../core/model/scpi.model';
import { DebugElement } from '@angular/core';
import { By } from '@angular/platform-browser';

describe('SearchBarComponent', () => {
  let component: SearchBarComponent;
  let fixture: ComponentFixture<SearchBarComponent>;
  let scpiService: jasmine.SpyObj<ScpiService>;

  const mockResults: ScpiModel[] = [
    { 
      id: 1, 
      name: 'SCPI Test', 
      minimumSubscription: 1000, 
      location: { 
        countryPercentage: 50, 
        id: { country: 'France', scpiId: 1 } 
      }, 
      sector: { 
        sectorPercentage: 30, 
        id: { name: 'Immobilier', scpiId: 1 } 
      }, 
      statYear: { 
        distributionRate: 4.5 
      } 
    }
  ];

  beforeEach(async () => {
    const scpiServiceSpy = jasmine.createSpyObj('ScpiService', ['search']);

    await TestBed.configureTestingModule({
      imports: [SearchBarComponent, HttpClientTestingModule, FormsModule, InputTextModule], // Ajout de SearchBarComponent ici
      providers: [{ provide: ScpiService, useValue: scpiServiceSpy }]
    }).compileComponents();

    fixture = TestBed.createComponent(SearchBarComponent);
    component = fixture.componentInstance;
    scpiService = TestBed.inject(ScpiService) as jasmine.SpyObj<ScpiService>;
  });

  it('devrait être créé', () => {
    expect(component).toBeTruthy();
  });

  it('devrait appeler scpiService.search() quand onSearchChange() est déclenché', fakeAsync(() => {
    scpiService.search.and.returnValue(of(mockResults));

    spyOn(component.searchResultsChanged, 'emit'); // Espionner l'événement

    component.searchTerm = 'SCPI';
    component.onSearchChange();
    tick(500); // Simule le délai du debounceTime

    expect(scpiService.search).toHaveBeenCalledWith('SCPI');
    expect(component.searchResultsChanged.emit).toHaveBeenCalledWith(mockResults);
  }));

  it('devrait afficher le message "Aucun résultat trouvé" si la recherche ne retourne rien', fakeAsync(() => {
    scpiService.search.and.returnValue(of([])); // Aucun résultat

    component.searchTerm = 'Inexistant';
    component.onSearchChange();
    tick(500); // Simule le délai

    fixture.detectChanges();
    
    const inputElement: DebugElement = fixture.debugElement.query(By.css('input'));
    expect(inputElement.nativeElement.placeholder).toContain('Aucun résultat trouvé');
  }));

});
