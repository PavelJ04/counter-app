import { Component, inject, signal } from '@angular/core';
import { IonContent, IonHeader, IonTitle, IonToast, IonToolbar } from '@ionic/angular';
import { CounterComponent } from '../components/counter/counter.component';
import { SavedCounter } from '../models/saved-counter';
import { CounterService } from '../services/counter.service';

@Component({
  selector: 'app-tab1',
  templateUrl: 'tab1.page.html',
  styleUrls: ['tab1.page.scss'],
  imports: [CounterComponent, IonContent, IonHeader, IonTitle, IonToast, IonToolbar],
})
export class Tab1Page {
  private readonly counterService = inject(CounterService);

  // Text toastu; null znamená, že toast není zobrazený.
  readonly toastMessage = signal<string | null>(null);

  async onSaved(counter: SavedCounter): Promise<void> {
    await this.counterService.add(counter);
    // Toast zobrazíme až po úspěšném dokončení uložení.
    this.toastMessage.set(`Počítadlo „${counter.name}“ bylo uloženo.`);
  }
}
