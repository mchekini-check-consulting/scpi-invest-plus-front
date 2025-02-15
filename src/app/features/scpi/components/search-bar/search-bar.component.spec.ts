import { ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';
import { SearchBarComponent } from './search-bar.component';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { ScpiService } from '../../../../core/services/scpi.service';
import { FormsModule } from '@angular/forms';
import { InputTextModule } from 'primeng/inputtext';
import { of } from 'rxjs';
import { ScpiModel } from '../../../../core/models/scpi.model';

describe('SearchBarComponent', () => {
  let component: SearchBarComponent;
  let fixture: ComponentFixture<SearchBarComponent>;
  let scpiService: jasmine.SpyObj<ScpiService>;
  let httpMock: HttpTestingController;

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
    const scpiServiceSpy = jasmine.createSpyObj('ScpiService', ['updateScpis', 'get']);

    await TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, FormsModule, SearchBarComponent, InputTextModule],
      providers: [{ provide: ScpiService, useValue: scpiServiceSpy }]
    }).compileComponents();

    fixture = TestBed.createComponent(SearchBarComponent);
    component = fixture.componentInstance;
    scpiService = TestBed.inject(ScpiService) as jasmine.SpyObj<ScpiService>;
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('devrait être créé', () => {
    expect(component).toBeTruthy();
  });

  it('devrait appeler fetchResults() quand onSearchChange() est déclenché', fakeAsync(() => {
    spyOn(component, 'fetchResults');
    component.searchTerm = 'SCPI';
    component.onSearchChange();
    tick(500);
    expect(component.fetchResults).toHaveBeenCalledWith('SCPI');
  }));

  it('devrait récupérer les résultats de recherche via fetchResults()', () => {
    component.searchTerm = 'SCPI Test';
    component.onSearchChange();
    const req = httpMock.expectOne(`https://localhost:8081/api/v1/scpi/search/?query=SCPI Test`);
    expect(req.request.method).toBe('GET');
    req.flush(mockResults);
    expect(component.searchResults.length).toBe(1);
    expect(component.searchResults[0].name).toBe('SCPI Test');
  });
  


  it('devrait appeler handleEmptySearch() quand la recherche est vide', () => {
    spyOn(component, 'handleEmptySearch');
    component.fetchResults('');
    expect(component.handleEmptySearch).toHaveBeenCalled();
  });

  it('devrait récupérer les SCPI via handleEmptySearch()', () => {
    scpiService.get.and.returnValue(of(mockResults));
    component.handleEmptySearch();
    expect(scpiService.get).toHaveBeenCalled();
  });
});
