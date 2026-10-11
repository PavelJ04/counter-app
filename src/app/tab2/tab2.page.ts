import { Component, computed, inject, OnInit, signal } from '@angular/core';
import { DatePipe } from '@angular/common';
import { FormsModule } from '@angular/forms';
import {
  IonAlert,
  IonButton,
  IonContent,
  IonHeader,
  IonItem,
  IonLabel,
  IonList,
  IonNote,
  IonSearchbar,
  IonSelect,
  IonSelectOption,
  IonSpinner,
  IonTitle,
  IonToast,
  IonToolbar,
} from '@ionic/angular';
import { SavedCounter } from '../models/saved-counter';
import { CounterService } from '../services/counter.service';

export type SortOption = 'newest' | 'oldest' | 'name' | 'value-desc' | 'value-asc';

// Tvar tlačítka pro ion-alert; vlastní typ, aby test mohl tlačítko najít a „stisknout“.
export interface ConfirmAlertButton {
  text: string;
  role: 'cancel' | 'destructive';
  handler?: () => void;
}

@Component({
  selector: 'app-tab2',
  templateUrl: 'tab2.page.html',
  styleUrls: ['tab2.page.scss'],
  imports: [
    DatePipe,
    FormsModule,
    IonAlert,
    IonButton,
    IonContent,
    IonHeader,
    IonItem,
    IonLabel,
    IonList,
    IonNote,
    IonSearchbar,
    IonSelect,
    IonSelectOption,
    IonSpinner,
    IonTitle,
    IonToast,
    IonToolbar,
  ],
})
export class Tab2Page implements OnInit {
  readonly counterService = inject(CounterService);

  // Stav ovládacích prvků patří stránce, ne službě – nejde o uložená data.
  readonly searchTerm = signal('');
  readonly sortOption = signal<SortOption>('newest');

  // computed() se přepočítá automaticky při každé změně uložených počítadel.
  readonly totalValue = computed(() =>
    this.counterService.counters().reduce((sum, counter) => sum + counter.value, 0),
  );

  // Záznamy, které se skutečně zobrazí: nejprve vyfiltrované, potom seřazené.
  readonly visibleCounters = computed(() => {
    const term = this.searchTerm().trim().toLocaleLowerCase('cs');
    const filtered = this.counterService
      .counters()
      .filter((counter) => counter.name.toLocaleLowerCase('cs').includes(term));

    // sort() mění pole na místě, proto řadíme kopii a nesaháme na stav služby.
    return [...filtered].sort(this.comparator(this.sortOption()));
  });

  // Potvrzovací dialog a toast jsou jen UI stránky; služba o nich nic neví.
  readonly isClearAlertOpen = signal(false);
  readonly toastMessage = signal<string | null>(null);

  readonly clearAlertButtons: ConfirmAlertButton[] = [
    {
      text: 'Zrušit',
      role: 'cancel',
    },
    {
      text: 'Vymazat',
      role: 'destructive',
      handler: () => {
        void this.clear();
      },
    },
  ];

  async ngOnInit(): Promise<void> {
    await this.counterService.initialize();
  }

  async remove(id: string): Promise<void> {
    await this.counterService.remove(id);
    this.toastMessage.set('Záznam byl odstraněn.');
  }

  // Tlačítko „Vymazat vše“ historii nemaže hned, nejprve otevře ion-alert.
  confirmClear(): void {
    this.isClearAlertOpen.set(true);
  }

  // Volá se až po potvrzení v dialogu.
  async clear(): Promise<void> {
    await this.counterService.clear();
    this.toastMessage.set('Historie byla vymazána.');
  }

  private comparator(option: SortOption): (a: SavedCounter, b: SavedCounter) => number {
    switch (option) {
      case 'oldest':
        return (a, b) => a.createdAt.localeCompare(b.createdAt);
      case 'name':
        return (a, b) => a.name.localeCompare(b.name, 'cs');
      case 'value-desc':
        return (a, b) => b.value - a.value;
      case 'value-asc':
        return (a, b) => a.value - b.value;
      case 'newest':
      default:
        // ISO 8601 řetězce lze řadit jako text; novější čas je „větší“.
        return (a, b) => b.createdAt.localeCompare(a.createdAt);
    }
  }
}
