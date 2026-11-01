export const sessionTypeStorageKey = 'bongastore-session-type';
export const legacySessionTypeStorageKey = 'jokihub-session-type';
export const sessionEstablishedEvent = 'bongastore:session-established';
export const sessionEndedEvent = 'bongastore:session-ended';
export const getRefreshLockKeys = (accountType: string): [string, string] => [
  `bongastore-refresh-lock-${accountType.toLowerCase()}`,
  `jokihub-refresh-lock-${accountType.toLowerCase()}`,
];

const csrfTokenStorageKey = 'bongastore-admin-csrf-token';
const legacyCsrfTokenStorageKey = 'jokihub-admin-csrf-token';
const trackingStoragePrefix = 'bongastore-tracking:';
const legacyTrackingStoragePrefix = 'jokihub-tracking:';

const getAndMigrate = (storage: Storage, key: string, legacyKey: string): string | null => {
  const currentValue = storage.getItem(key);
  const legacyValue = storage.getItem(legacyKey);
  if (currentValue) {
    if (legacyValue) storage.removeItem(legacyKey);
    return currentValue;
  }
  if (!legacyValue) return null;
  storage.setItem(key, legacyValue);
  storage.removeItem(legacyKey);
  return legacyValue;
};

const getFromBothStorages = (key: string, legacyKey: string): string | null => {
  const sessionValue = getAndMigrate(window.sessionStorage, key, legacyKey);
  const localValue = getAndMigrate(window.localStorage, key, legacyKey);
  const value = sessionValue ?? localValue;
  if (value) {
    window.sessionStorage.setItem(key, value);
    window.localStorage.setItem(key, value);
    window.sessionStorage.removeItem(legacyKey);
    window.localStorage.removeItem(legacyKey);
  }
  return value;
};

export const getSessionType = (): string | null => {
  if (typeof window === 'undefined') return null;
  return getFromBothStorages(sessionTypeStorageKey, legacySessionTypeStorageKey);
};

export const setSessionType = (accountType: string): void => {
  window.sessionStorage.setItem(sessionTypeStorageKey, accountType);
  window.localStorage.setItem(sessionTypeStorageKey, accountType);
  window.sessionStorage.removeItem(legacySessionTypeStorageKey);
  window.localStorage.removeItem(legacySessionTypeStorageKey);
};

export const clearSessionType = (): void => {
  window.sessionStorage.removeItem(sessionTypeStorageKey);
  window.localStorage.removeItem(sessionTypeStorageKey);
  window.sessionStorage.removeItem(legacySessionTypeStorageKey);
  window.localStorage.removeItem(legacySessionTypeStorageKey);
};

export const getAdminCsrfToken = (): string | null => {
  if (typeof window === 'undefined') return null;
  return getFromBothStorages(csrfTokenStorageKey, legacyCsrfTokenStorageKey);
};

export const setAdminCsrfToken = (token: string): void => {
  window.sessionStorage.setItem(csrfTokenStorageKey, token);
  window.localStorage.setItem(csrfTokenStorageKey, token);
  window.sessionStorage.removeItem(legacyCsrfTokenStorageKey);
  window.localStorage.removeItem(legacyCsrfTokenStorageKey);
};

export const clearAdminCsrfToken = (): void => {
  window.sessionStorage.removeItem(csrfTokenStorageKey);
  window.localStorage.removeItem(csrfTokenStorageKey);
  window.sessionStorage.removeItem(legacyCsrfTokenStorageKey);
  window.localStorage.removeItem(legacyCsrfTokenStorageKey);
};

export const getOrderTrackingToken = (orderNumber: string): string | null => {
  if (typeof window === 'undefined') return null;
  return getAndMigrate(
    window.sessionStorage,
    `${trackingStoragePrefix}${orderNumber}`,
    `${legacyTrackingStoragePrefix}${orderNumber}`
  );
};

export const setOrderTrackingToken = (orderNumber: string, token: string): void => {
  window.sessionStorage.setItem(`${trackingStoragePrefix}${orderNumber}`, token);
  window.sessionStorage.removeItem(`${legacyTrackingStoragePrefix}${orderNumber}`);
};

export const clearOrderTrackingToken = (orderNumber: string): void => {
  window.sessionStorage.removeItem(`${trackingStoragePrefix}${orderNumber}`);
  window.sessionStorage.removeItem(`${legacyTrackingStoragePrefix}${orderNumber}`);
};
