export type JsonObject = Record<string, unknown>;

export type GameRecord = JsonObject & {
  id: string;
  name: string;
  slug: string;
  serviceSummary: string | null;
  artworkKey: string | null;
  serviceCount: number;
  active: boolean;
  popular: boolean;
  sortOrder: number;
  updatedAt: string;
  rating: string;
  reviews: number;
  tags: string[];
};

export type CategoryRecord = JsonObject & {
  id: string;
  name: string;
  slug: string;
  description: string;
  serviceCount: number;
  active: boolean;
  updatedAt: string;
};

export type ServiceRecord = JsonObject & {
  id: string;
  name: string;
  gameId: string;
  categoryId: string;
  price: number | null;
  estimate: string;
  active: boolean;
  updatedAt: string;
};

export type UserRecord = JsonObject & {
  id: string;
  name: string;
  username: string;
  email: string;
  whatsapp: string;
  tier: string;
  status: 'ACTIVE' | 'BLOCKED';
  orderCount: number;
  totalSpend: number;
  joinedAt: string;
};

export type AdminRecord = JsonObject & {
  id: string;
  username: string;
  name: string;
  email: string;
  role: string;
  roleIds: string[];
  status: 'ACTIVE' | 'INACTIVE';
  lastActive: string;
};

export type OrderRecord = JsonObject & {
  id: string;
  internalId: string;
  orderNumber: string;
  orderStatus: string;
  paymentStatus: string;
  totalAmount: number;
  gameId: string;
  gameName: string;
  gameSlug: string;
  serviceId: string;
  serviceName: string;
  quantity: number;
  paymentId: string;
  paymentMethod: string;
  customerName: string;
  customerWhatsapp: string;
  gameAccount: string;
  gameServer: string | null;
  customerNotes: string | null;
  createdAt: string;
};

export type MockState = {
  games: GameRecord[];
  categories: CategoryRecord[];
  services: ServiceRecord[];
  users: UserRecord[];
  admins: AdminRecord[];
  roles: JsonObject[];
  orders: OrderRecord[];
  transactions: JsonObject[];
  activityLogs: JsonObject[];
  settings: JsonObject;
  session: { accountType: 'ADMIN' | 'CUSTOMER'; identifier: string } | null;
  trackingTokens: Map<string, string>;
  idempotency: Map<string, JsonObject>;
  nextId: number;
};
