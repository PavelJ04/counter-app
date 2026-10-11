import { signal } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { SavedCounter } from '../models/saved-counter';
import { CounterService } from '../services/counter.service';
import { Tab2Page } from './tab2.page';

describe('Tab2Page', () => {
  let component: Tab2Page;
  let fixture: ComponentFixture<Tab2Page>;

  // Stránka čte signály služby, proto náhrada služby obsahuje vlastní signály.
  const countersState = signal<SavedCounter[]>([]);
  const counterServiceMock = {
    counters: countersState.asReadonly(),
    initialized: signal(true).asReadonly(),
    initialize: vi.fn(),
    remove: vi.fn(),
    clear: vi.fn(),
  };

  const apple: SavedCounter = {
    id: 'apple',
    name: 'Jablka',
    value: 5,
    createdAt: '2026-09-17T08:00:00.000Z',
  };
  const visitors: SavedCounter = {
    id: 'visitors',
    name: 'Návštěvníci',
    value: 12,
    createdAt: '2026-09-17T10:00:00.000Z',
  };
  const cars: SavedCounter = {
    id: 'cars',
    name: 'Auta',
    value: 0,
    createdAt: '2026-09-17T09:00:00.000Z',
  };

  beforeEach(() => {
    vi.clearAllMocks();
    countersState.set([]);
    counterServiceMock.initialize.mockResolvedValue(undefined);
    counterServiceMock.remove.mockResolvedValue(undefined);
    counterServiceMock.clear.mockResolvedValue(undefined);

    TestBed.configureTestingModule({
      providers: [{ provide: CounterService, useValue: counterServiceMock }],
    });

    fixture = TestBed.createComponent(Tab2Page);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create and initialize the service', () => {
    expect(component).toBeTruthy();
    expect(counterServiceMock.initialize).toHaveBeenCalledTimes(1);
  });

  it('should remove one record through the service and show a toast', async () => {
    await component.remove('apple');

    expect(counterServiceMock.remove).toHaveBeenCalledWith('apple');
    expect(component.toastMessage()).toBe('Záznam byl odstraněn.');
  });

  it('should only open the alert when "clear all" is clicked', () => {
    component.confirmClear();

    expect(component.isClearAlertOpen()).toBe(true);
    expect(counterServiceMock.clear).not.toHaveBeenCalled();
  });

  it('should clear the history after confirmation in the alert', async () => {
    const confirmButton = component.clearAlertButtons.find(
      (button) => button.role === 'destructive',
    );

    confirmButton?.handler?.();

    // handler spouští asynchronní clear(); počkáme, až se toast nastaví.
    await vi.waitFor(() => {
      expect(component.toastMessage()).toBe('Historie byla vymazána.');
    });
    expect(counterServiceMock.clear).toHaveBeenCalledTimes(1);
  });

  it('should not clear the history when the alert is cancelled', () => {
    const cancelButton = component.clearAlertButtons.find((button) => button.role === 'cancel');

    // Tlačítko Zrušit existuje a nemá žádnou akci – jen zavře dialog.
    expect(cancelButton).toBeDefined();
    expect(cancelButton?.handler).toBeUndefined();
    expect(counterServiceMock.clear).not.toHaveBeenCalled();
  });

  it('should sum values and react to data changes', () => {
    countersState.set([apple, visitors, cars]);
    expect(component.totalValue()).toBe(17);

    countersState.set([apple]);
    expect(component.totalValue()).toBe(5);
  });

  it('should search by name without case sensitivity', () => {
    countersState.set([apple, visitors, cars]);

    component.searchTerm.set('NÁVŠ');

    expect(component.visibleCounters()).toEqual([visitors]);
  });

  it('should sort by the selected option', () => {
    countersState.set([apple, visitors, cars]);

    component.sortOption.set('newest');
    expect(component.visibleCounters()).toEqual([visitors, cars, apple]);

    component.sortOption.set('oldest');
    expect(component.visibleCounters()).toEqual([apple, cars, visitors]);

    component.sortOption.set('name');
    expect(component.visibleCounters()).toEqual([cars, apple, visitors]);

    component.sortOption.set('value-desc');
    expect(component.visibleCounters()).toEqual([visitors, apple, cars]);

    component.sortOption.set('value-asc');
    expect(component.visibleCounters()).toEqual([cars, apple, visitors]);
  });

  it('should not change the order stored in the service', () => {
    countersState.set([apple, visitors, cars]);

    component.sortOption.set('name');
    component.visibleCounters();

    expect(counterServiceMock.counters()).toEqual([apple, visitors, cars]);
  });
});
