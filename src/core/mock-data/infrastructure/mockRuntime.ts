import type { JsonObject, GameRecord, CategoryRecord, ServiceRecord, OrderRecord } from '@core/mock-data/domain/types';
import { state } from '@core/mock-data/infrastructure/mockState';
import { now } from '@core/mock-data/infrastructure/time';
export { state };
export { now };
export const jsonResponse = (payload: unknown, status = 200, headers?: HeadersInit) =>
  new Response(JSON.stringify(payload), {
    status,
    headers: { 'Content-Type': 'application/json', ...Object.fromEntries(new Headers(headers).entries()) },
  });

export const success = (data: unknown, message = 'Permintaan berhasil.') => jsonResponse({ status: { code: 'SUCCESS', message }, data });

export const failure = (httpStatus: number, code: string, message: string, headers?: HeadersInit) =>
  jsonResponse({ status: { code, message }, data: null }, httpStatus, headers);

export const record = (value: unknown): JsonObject =>
  typeof value === 'object' && value !== null && !Array.isArray(value) ? (value as JsonObject) : {};

export const stringValue = (value: unknown, fallback = '') => (typeof value === 'string' ? value : fallback);
export const numberValue = (value: unknown, fallback = 0) => (typeof value === 'number' && Number.isFinite(value) ? value : fallback);
export const booleanValue = (value: unknown, fallback = false) => (typeof value === 'boolean' ? value : fallback);
export const parseBody = (body: BodyInit | null | undefined): JsonObject => {
  if (typeof body !== 'string') return {};
  try {
    return record(JSON.parse(body) as unknown);
  } catch {
    return {};
  }
};

export const nextId = (prefix: string) => `${prefix}-${state.nextId++}`;
export const permissionCatalog = [
  { id: 'perm-dashboard', code: 'DASHBOARD_VIEW', name: 'Dashboard', key: 'dashboard' },
  { id: 'perm-orders', code: 'ORDERS_MANAGE', name: 'Pesanan', key: 'orders' },
  { id: 'perm-catalog', code: 'CATALOG_MANAGE', name: 'Katalog', key: 'catalog' },
  { id: 'perm-users', code: 'USERS_MANAGE', name: 'Pengguna', key: 'users' },
  { id: 'perm-content', code: 'CONTENT_MANAGE', name: 'Konten', key: 'content' },
  { id: 'perm-finance', code: 'FINANCE_VIEW', name: 'Keuangan', key: 'finance' },
  { id: 'perm-settings', code: 'SETTINGS_MANAGE', name: 'Pengaturan', key: 'settings' },
];

export const matchesSearch = (item: JsonObject, search: string) =>
  !search || Object.values(item).some((value) => typeof value === 'string' && value.toLowerCase().includes(search));

export const paginate = <T extends JsonObject>(items: T[], url: URL, defaultPageSize = 20) => {
  const requestedPage = url.searchParams.get('page');
  const page = Math.max(1, requestedPage === null ? 1 : numberValue(Number(requestedPage), 1));
  const requestedPageSize = url.searchParams.get('pageSize') ?? url.searchParams.get('limit');
  const requestedSkip = url.searchParams.get('skip');
  const pageSize = Math.min(100, Math.max(1, requestedPageSize === null ? defaultPageSize : numberValue(Number(requestedPageSize), defaultPageSize)));
  const skip = Math.max(0, requestedSkip === null ? (page - 1) * pageSize : numberValue(Number(requestedSkip), (page - 1) * pageSize));
  const pageItems = items.slice(skip, skip + pageSize);
  return { items: pageItems, total: items.length, page, pageSize, totalPages: Math.ceil(items.length / pageSize) };
};

export const addActivity = (action: string, target: string, category: string) => {
  state.activityLogs.unshift({
    id: nextId('ACT'),
    adminName: 'Demo Admin',
    adminEmail: 'admin@example.test',
    action,
    target,
    category,
    occurredAt: now(),
    ipAddress: '127.0.0.1',
    result: 'Berhasil',
  });
};

export const gameView = (game: GameRecord) => ({
  ...game,
  serviceCount: state.services.filter((service) => service.gameId === game.id).length,
});

export const categoryView = (category: CategoryRecord) => ({
  ...category,
  serviceCount: state.services.filter((service) => service.categoryId === category.id).length,
});

export const serviceView = (service: ServiceRecord) => ({
  ...service,
  game: state.games.find((game) => game.id === service.gameId)?.name ?? 'Game demo',
  category: state.categories.find((category) => category.id === service.categoryId)?.name ?? 'Kategori demo',
});

export const orderAdminView = (order: OrderRecord) => ({
  id: order.orderNumber,
  internalId: order.internalId,
  customerName: order.customerName,
  whatsapp: order.customerWhatsapp,
  game: order.gameName,
  service: order.serviceName,
  gameAccount: order.gameAccount,
  server: order.gameServer ?? '',
  amount: order.totalAmount,
  status:
    order.orderStatus === 'COMPLETED'
      ? 'Selesai'
      : order.orderStatus === 'IN_PROGRESS'
        ? 'Diproses'
        : order.orderStatus === 'PENDING_REVIEW'
          ? 'Menunggu Validasi'
          : order.orderStatus === 'CANCELLED'
            ? 'Dibatalkan'
            : 'Menunggu Pembayaran',
  rawStatus: order.orderStatus,
  paymentMethod: order.paymentMethod === 'BCA_TRANSFER' ? 'Transfer Bank BCA' : order.paymentMethod,
  paymentStatus:
    order.paymentStatus === 'PAID'
      ? 'Dibayar'
      : order.paymentStatus === 'PENDING_REVIEW'
        ? 'Menunggu Validasi'
        : order.paymentStatus === 'FAILED'
          ? 'Gagal'
          : 'Belum Dibayar',
  paymentId: order.paymentId,
  createdAt: order.createdAt,
  proofs: [],
});

export const trackingView = (order: OrderRecord) => {
  const statusLabel =
    order.orderStatus === 'COMPLETED'
      ? 'Pesanan selesai'
      : order.orderStatus === 'IN_PROGRESS'
        ? 'Pesanan diproses'
        : order.orderStatus === 'PENDING_REVIEW'
          ? 'Menunggu validasi pembayaran'
          : 'Menunggu pembayaran';
  const paymentStatusLabel =
    order.paymentStatus === 'PAID'
      ? 'Pembayaran diterima'
      : order.paymentStatus === 'PENDING_REVIEW'
        ? 'Pembayaran sedang diperiksa'
        : 'Menunggu pembayaran';
  const timeline = [
    { status: 'CREATED', label: 'Pesanan dibuat', description: 'Pesanan mock berhasil dibuat.', occurredAt: order.createdAt },
    ...(order.paymentStatus === 'PENDING_REVIEW' || order.paymentStatus === 'PAID'
      ? [{ status: 'PAYMENT_REVIEW', label: paymentStatusLabel, description: 'Status pembayaran demo.', occurredAt: order.createdAt }]
      : []),
    ...(order.orderStatus === 'IN_PROGRESS' || order.orderStatus === 'COMPLETED'
      ? [{ status: 'IN_PROGRESS', label: 'Pesanan diproses', description: 'Pesanan mock sedang dikerjakan.', occurredAt: order.createdAt }]
      : []),
    ...(order.orderStatus === 'COMPLETED'
      ? [{ status: 'COMPLETED', label: 'Pesanan selesai', description: 'Pesanan mock telah selesai.', occurredAt: now() }]
      : []),
  ];
  return {
    order: {
      orderNumber: order.orderNumber,
      status: order.orderStatus,
      statusLabel,
      gameName: order.gameName,
      serviceName: order.serviceName,
      customerWhatsappMasked: `${order.customerWhatsapp.slice(0, 5)}••••${order.customerWhatsapp.slice(-2)}`,
      paymentStatusLabel,
      paymentStatus: order.paymentStatus,
    },
    timeline,
  };
};

export const findOrderByPath = (path: string, suffix: string) => {
  const prefix = '/api/orders/v1/tracking/';
  if (!path.startsWith(prefix) || !path.endsWith(suffix)) return undefined;
  const orderNumber = decodeURIComponent(path.slice(prefix.length, -suffix.length));
  return state.orders.find((order) => order.orderNumber.toUpperCase() === orderNumber.toUpperCase());
};

export const mutateEntity = <T extends JsonObject>(items: T[], id: string | null, prefix: string, body: JsonObject): T => {
  const entityId = id ?? nextId(prefix);
  const current = items.find((item) => String(item.id) === entityId);
  const updated = { ...current, ...body, id: entityId, updatedAt: now() } as unknown as T;
  if (current) items[items.indexOf(current)] = updated;
  else items.unshift(updated);
  return updated;
};

export const deleteEntity = (items: JsonObject[], id: string) => {
  const index = items.findIndex((item) => String(item.id) === id);
  if (index < 0) return false;
  items.splice(index, 1);
  return true;
};

export const filteredItems = <T extends JsonObject>(items: T[], url: URL) => {
  const search = (url.searchParams.get('search') ?? url.searchParams.get('q') ?? '').trim().toLowerCase();
  const status = url.searchParams.get('status');
  const category = url.searchParams.get('category');
  const method = url.searchParams.get('method');
  const normalize = (value: string) =>
    value
      .trim()
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '');
  return items.filter((item) => {
    if (!matchesSearch(item, search)) return false;
    if (status && status !== 'Semua Status' && status !== 'Semua' && normalize(String(item.status ?? '')) !== normalize(status)) return false;
    if (category && category !== 'Semua Kategori' && normalize(String(item.category ?? '')) !== normalize(category)) return false;
    if (method && method !== 'Semua Metode' && normalize(String(item.method ?? '')) !== normalize(method)) return false;
    return true;
  });
};

export const pagedPayload = <T extends JsonObject>(items: T[], url: URL, key: string) => {
  const result = paginate(filteredItems(items, url), url);
  return { [key]: result.items, total: result.total, page: result.page, pageSize: result.pageSize, totalPages: result.totalPages };
};

export const profileForSession = (accountType: 'ADMIN' | 'CUSTOMER', identifier: string) => {
  if (accountType === 'ADMIN') {
    const admin = state.admins.find((item) => item.username === identifier || item.email === identifier) ?? state.admins[0];
    return { accountType, name: admin.name, username: admin.username, role: admin.role, roleLabel: admin.role, canAccessDashboard: true };
  }
  const user = state.users.find((item) => item.username === identifier || item.email === identifier) ?? state.users[0];
  return { accountType, name: user.name, username: user.username, role: 'Member', roleLabel: user.tier, canAccessDashboard: false };
};

export const createOrder = (body: JsonObject, trackingToken: string): OrderRecord | null => {
  const game = state.games.find((item) => item.slug === stringValue(body.gameSlug));
  const service = state.services.find((item) => item.id === stringValue(body.serviceId) && item.active);
  const customer = record(body.customer);
  const item = record(body.item);
  const quantity = Math.max(1, numberValue(body.quantity, 1));
  if (!game || !service || !service.active) return null;

  const date = new Date();
  const day = `${date.getFullYear()}${String(date.getMonth() + 1).padStart(2, '0')}${String(date.getDate()).padStart(2, '0')}`;
  const random = Math.random().toString(16).slice(2, 8).toUpperCase().padEnd(6, '0');
  const orderNumber = `JH-${day}-${random}`;
  const order: OrderRecord = {
    id: nextId('order'),
    internalId: nextId('order-ref'),
    orderNumber,
    orderStatus: 'AWAITING_PAYMENT',
    paymentStatus: 'PENDING',
    totalAmount: (service.price ?? 0) * quantity,
    gameId: game.id,
    gameName: game.name,
    gameSlug: game.slug,
    serviceId: service.id,
    serviceName: service.name,
    quantity,
    paymentId: nextId('pay'),
    paymentMethod: stringValue(body.paymentMethod, 'QRIS'),
    customerName: stringValue(customer.name, 'Pelanggan demo'),
    customerWhatsapp: stringValue(customer.whatsapp, '+6280000000000'),
    gameAccount: stringValue(item.gameAccount, 'akun-demo'),
    gameServer: typeof item.gameServer === 'string' ? item.gameServer : null,
    customerNotes: typeof item.customerNotes === 'string' ? item.customerNotes : null,
    createdAt: now(),
  };
  state.orders.unshift(order);
  state.trackingTokens.set(orderNumber, trackingToken);
  return order;
};

export const filterPagedList = <T extends JsonObject>(items: T[], url: URL, key: string) => {
  const result = paginate(filteredItems(items, url), url, 100);
  return { [key]: result.items, total: result.total, page: result.page, pageSize: result.pageSize, totalPages: result.totalPages };
};
