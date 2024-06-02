import { Injectable } from '@angular/core';

type StorageType = 'session' | 'local';

@Injectable({
  providedIn: 'root',
})
export class StorageService {
  private storage: Storage;

  constructor() {
    this.storage = sessionStorage; // Default to sessionStorage
  }

  setStorageType(type: StorageType): void {
    this.storage = type === 'local' ? localStorage : sessionStorage;
  }

  setItem(key: string, value: any): void {
    try {
      const serializedValue = JSON.stringify({ data: value });
      this.storage.setItem(key, serializedValue);
    } catch (e) {
      console.error('Error saving to storage', e);
    }
  }

  getItem<T>(key: string): T | null {
    try {
      const item = this.storage.getItem(key);
      return item ? JSON.parse(item).data : null;
    } catch (e) {
      console.error('Error retrieving from storage', e);
      return null;
    }
  }

  removeItem(key: string): void {
    try {
      this.storage.removeItem(key);
    } catch (e) {
      console.error('Error removing from storage', e);
    }
  }

  clear(): void {
    try {
      this.storage.clear();
    } catch (e) {
      console.error('Error clearing storage', e);
    }
  }

  setItemWithExpiry(key: string, value: any, expiryInMinutes: number): void {
    try {
      const now = new Date();
      const expiryTime = now.getTime() + expiryInMinutes * 60 * 1000;
      const serializedValue = JSON.stringify({ data: value, expiry: expiryTime });
      this.storage.setItem(key, serializedValue);
    } catch (e) {
      console.error('Error saving to storage', e);
    }
  }

  getItemWithExpiry<T>(key: string): T | null {
    try {
      const item = this.storage.getItem(key);
      if (!item) return null;

      const parsedItem = JSON.parse(item);
      const now = new Date();

      if (now.getTime() > parsedItem.expiry) {
        this.storage.removeItem(key);
        return null;
      }

      return parsedItem.data;
    } catch (e) {
      console.error('Error retrieving from storage', e);
      return null;
    }
  }
}