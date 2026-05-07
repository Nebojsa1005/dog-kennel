import { Component, inject } from '@angular/core';
import { AsyncPipe } from '@angular/common';
import { combineLatest, map } from 'rxjs';
import { MatCardModule } from '@angular/material/card';
import { DogService } from '../../../core/services/dog.service';
import { PuppyService } from '../../../core/services/puppy.service';
import { LitterService } from '../../../core/services/litter.service';

@Component({
  selector: 'app-admin-dashboard',
  standalone: true,
  imports: [AsyncPipe, MatCardModule],
  templateUrl: './admin-dashboard.component.html',
  styleUrl: './admin-dashboard.component.scss',
})
export class AdminDashboard {
  private dogService = inject(DogService);
  private puppyService = inject(PuppyService);
  private litterService = inject(LitterService);

  stats$ = combineLatest([
    this.dogService.getAllDogs(),
    this.puppyService.getAllPuppies(),
    this.puppyService.getAvailablePuppies(),
    this.litterService.getAllLitters(),
  ]).pipe(
    map(([dogs, allPuppies, availablePuppies, litters]) => ({
      totalDogs: dogs.length,
      totalPuppies: allPuppies.length,
      availablePuppies: availablePuppies.length,
      totalLitters: litters.length,
    }))
  );
}
