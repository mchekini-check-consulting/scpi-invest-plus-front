import {inject, Injectable} from '@angular/core';
import {SimulationService} from '@/core/service/simulation.service';
import {Actions, createEffect, ofType} from '@ngrx/effects';
import {SimulationActions} from '@/shared/store/simulation/action';
import {catchError, map, of, switchMap} from 'rxjs';
import {ErrorModel} from '@/core/model/error.model';
import {Router} from '@angular/router';
import {MessageService} from 'primeng/api';


@Injectable()
export class SimulationEffects {
  private actions$ = inject(Actions);
  private simulationService = inject(SimulationService);
  private router = inject(Router);
  private messageService = inject(MessageService);

  loadSimulations$ = createEffect(() =>
    this.actions$.pipe(
      ofType(SimulationActions.loadSimulations),
      switchMap(() =>
        this.simulationService.getSimulations().pipe(
          map(simulations => SimulationActions.loadSimulationsSuccess({simulations})),
          catchError(() => of(SimulationActions.loadSimulationsFailure()))
        )
      )
    )
  );

  loadSimulationById$ = createEffect(() =>
    this.actions$.pipe(
      ofType(SimulationActions.loadSimulationByID),
      switchMap(({id}) =>
        this.simulationService.getSimulationById(id).pipe(
          map(simulation => SimulationActions.loadSimulationByIDSuccess({simulation})),
          catchError((error: ErrorModel) => of(SimulationActions.loadSimulationByIDFailure({error})))
        )
      )
    )
  );

  createSimulation$ = createEffect(() =>
    this.actions$.pipe(
      ofType(SimulationActions.createSimulation),
      switchMap(({simulationName}) =>
        this.simulationService.createSimulation(simulationName).pipe(
          map(simulation => SimulationActions.createSimulationSuccess({simulation})),
          catchError((error: ErrorModel) => of(SimulationActions.createSimulationFailure({error})))
        )
      )
    )
  );

  addScpiToSimulation$ = createEffect(() =>
    this.actions$.pipe(
      ofType(SimulationActions.addSCPIToSimulation),
      switchMap(({scpiSimulation}) =>
        this.simulationService.addScpiToSimulation(scpiSimulation).pipe(
          map((response) => {
            this.messageService.add({
              severity: 'success',
              summary: 'Succès',
              detail: `La SCPI avec l'ID "${scpiSimulation.scpiId}" a été ajoutée avec succès.`,
              life: 100000
            });

            const currentUrl = this.router.url;
            const targetUrl = `/simulations/details/${scpiSimulation.simulationId}`;
            if (currentUrl !== targetUrl) {
              this.router.navigate([targetUrl]);
            }
            return SimulationActions.loadSimulationByID({id: scpiSimulation.simulationId});
          }),
          catchError((error: ErrorModel) => {
            this.messageService.add({
              severity: 'error',
              summary: 'Erreur',
              detail: `Échec de l'ajout de la SCPI avec l'ID "${scpiSimulation.scpiId}". Veuillez réessayer.`,
            });

            return of(SimulationActions.addSCPIToSimulationFailure({error}));
          })
        )
      )
    )
  );
}
