import type { MockStateSnapshot } from './mockState.interface';

export class MockStateModel implements MockStateSnapshot {
  games: MockStateSnapshot['games'];
  categories: MockStateSnapshot['categories'];
  services: MockStateSnapshot['services'];
  users: MockStateSnapshot['users'];
  admins: MockStateSnapshot['admins'];
  roles: MockStateSnapshot['roles'];
  orders: MockStateSnapshot['orders'];
  transactions: MockStateSnapshot['transactions'];
  activityLogs: MockStateSnapshot['activityLogs'];
  settings: MockStateSnapshot['settings'];
  session: MockStateSnapshot['session'];
  trackingTokens: MockStateSnapshot['trackingTokens'];
  idempotency: MockStateSnapshot['idempotency'];
  nextId: MockStateSnapshot['nextId'];

  constructor(state: MockStateSnapshot) {
    Object.assign(this, state);
    this.games = state.games;
    this.categories = state.categories;
    this.services = state.services;
    this.users = state.users;
    this.admins = state.admins;
    this.roles = state.roles;
    this.orders = state.orders;
    this.transactions = state.transactions;
    this.activityLogs = state.activityLogs;
    this.settings = state.settings;
    this.session = state.session;
    this.trackingTokens = state.trackingTokens;
    this.idempotency = state.idempotency;
    this.nextId = state.nextId;
  }
}
