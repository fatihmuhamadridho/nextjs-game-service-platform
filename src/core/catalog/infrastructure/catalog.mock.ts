import * as mock from '@core/mock-data/infrastructure/mockRuntime';
import type { JsonObject, GameRecord, CategoryRecord, ServiceRecord } from '@core/mock-data/domain/types';
export const handleCatalog = (url: URL, method: string, body: JsonObject) => {
  const { pathname } = url;
  if (method === 'GET' && pathname === '/api/games/v1/popular') {
    return mock.success({ games: mock.state.games.filter((game) => game.active && game.popular).sort((a, b) => a.sortOrder - b.sortOrder) });
  }
  if (method === 'GET' && pathname === '/api/games/v1/list') {
    const result = mock.paginate(
      mock.filteredItems(
        mock.state.games.filter((game) => game.active),
        url
      ),
      url,
      20
    );
    return mock.success({
      games: result.items.map(mock.gameView),
      total: result.total,
      page: result.page,
      pageSize: result.pageSize,
      totalPages: result.totalPages,
    });
  }
  if (method === 'GET' && pathname === '/api/service-categories/v1/list') {
    return mock.success({ categories: mock.state.categories.filter((category) => category.active).map(mock.categoryView) });
  }
  const servicesMatch = pathname.match(/^\/api\/games\/v1\/([^/]+)\/services$/);
  if (method === 'GET' && servicesMatch) {
    const slug = decodeURIComponent(servicesMatch[1]);
    const game = mock.state.games.find((item) => item.slug === slug && item.active);
    if (!game) return mock.failure(404, 'GAME_NOT_FOUND', 'Game demo tidak ditemukan.');
    const services = mock.state.services
      .filter((service) => service.gameId === game.id && service.active)
      .map((service) => ({
        id: service.id,
        name: service.name,
        price: service.price,
        customPrice: service.price === null,
        estimate: service.estimate,
      }));
    return mock.success({ services });
  }

  const adminGamesMatch = pathname.match(/^\/api\/admin\/games\/v1\/(create|update|delete)(?:\/([^/]+))?$/);
  if (pathname === '/api/admin/games/v1/list' && method === 'GET') {
    return mock.success({ games: mock.state.games.map(mock.gameView) });
  }
  if (adminGamesMatch) {
    const [, action, encodedId] = adminGamesMatch;
    const id = encodedId ? decodeURIComponent(encodedId) : null;
    if (action === 'delete' && method === 'DELETE') {
      if (!id || !mock.deleteEntity(mock.state.games, id)) return mock.failure(404, 'GAME_NOT_FOUND', 'Game demo tidak ditemukan.');
      mock.state.services = mock.state.services.filter((service) => service.gameId !== id);
      mock.addActivity('Menghapus game', id, 'Produk');
      return mock.success({ deleted: true });
    }
    if (action === 'create' && method === 'POST') {
      const game = mock.mutateEntity<GameRecord>(mock.state.games, null, 'game', {
        name: mock.stringValue(body.name, 'Game demo'),
        slug: mock.stringValue(body.slug, `game-demo-${mock.state.nextId}`),
        serviceSummary: typeof body.serviceSummary === 'string' ? body.serviceSummary : null,
        artworkKey: typeof body.artworkKey === 'string' ? body.artworkKey : null,
        serviceCount: 0,
        active: mock.booleanValue(body.active, true),
        popular: mock.booleanValue(body.popular),
        sortOrder: mock.numberValue(body.sortOrder, mock.state.games.length + 1),
        rating: '5.0',
        reviews: 0,
        tags: [],
      });
      mock.addActivity('Menambahkan game', game.name, 'Produk');
      return mock.success({ game }, 'Game demo berhasil dibuat.');
    }
    if (action === 'update' && ['PUT', 'PATCH'].includes(method) && id) {
      const index = mock.state.games.findIndex((game) => game.id === id);
      if (index < 0) return mock.failure(404, 'GAME_NOT_FOUND', 'Game demo tidak ditemukan.');
      const game = mock.mutateEntity<GameRecord>(mock.state.games, id, 'game', body);
      mock.addActivity('Memperbarui game', game.name, 'Produk');
      return mock.success({ game }, 'Game demo berhasil diperbarui.');
    }
  }

  if (pathname === '/api/admin/services/v1/list' && method === 'GET') {
    return mock.success({
      services: mock.state.services.map(mock.serviceView),
      games: mock.state.games.map(({ id, name, slug }) => ({ id, name, slug })),
      categories: mock.state.categories.map(({ id, name, slug }) => ({ id, name, slug })),
    });
  }
  const adminServicesMatch = pathname.match(/^\/api\/admin\/services\/v1\/(create|update|delete)(?:\/([^/]+))?$/);
  if (adminServicesMatch) {
    const [, action, id] = adminServicesMatch;
    if (action === 'delete' && method === 'DELETE') {
      if (!id || !mock.deleteEntity(mock.state.services, id)) return mock.failure(404, 'SERVICE_NOT_FOUND', 'Layanan demo tidak ditemukan.');
      mock.addActivity('Menghapus layanan', id, 'Produk');
      return mock.success({ deleted: true });
    }
    if (action === 'create' && method === 'POST') {
      const service = mock.mutateEntity<ServiceRecord>(mock.state.services, null, 'service', {
        name: mock.stringValue(body.name, 'Layanan demo'),
        gameId: mock.stringValue(body.gameId, mock.state.games[0]?.id ?? ''),
        categoryId: mock.stringValue(body.categoryId, mock.state.categories[0]?.id ?? ''),
        price: body.price === null ? null : mock.numberValue(body.price),
        estimate: mock.stringValue(body.estimate, 'Estimasi demo'),
        active: mock.booleanValue(body.active, true),
      });
      mock.addActivity('Menambahkan layanan', service.name, 'Produk');
      return mock.success({ service: mock.serviceView(service) }, 'Layanan demo berhasil dibuat.');
    }
    if (action === 'update' && ['PUT', 'PATCH'].includes(method) && id) {
      const current = mock.state.services.find((service) => service.id === id);
      if (!current) return mock.failure(404, 'SERVICE_NOT_FOUND', 'Layanan demo tidak ditemukan.');
      const service = mock.mutateEntity<ServiceRecord>(mock.state.services, id, 'service', body);
      mock.addActivity('Memperbarui layanan', service.name, 'Produk');
      return mock.success({ service: mock.serviceView(service) }, 'Layanan demo berhasil diperbarui.');
    }
  }

  if (pathname === '/api/admin/service-categories/v1/list' && method === 'GET') {
    return mock.success({ categories: mock.state.categories.map(mock.categoryView) });
  }
  const adminCategoriesMatch = pathname.match(/^\/api\/admin\/service-categories\/v1\/(create|update|delete)(?:\/([^/]+))?$/);
  if (adminCategoriesMatch) {
    const [, action, id] = adminCategoriesMatch;
    if (action === 'delete' && method === 'DELETE') {
      if (!id || !mock.deleteEntity(mock.state.categories, id)) return mock.failure(404, 'CATEGORY_NOT_FOUND', 'Kategori demo tidak ditemukan.');
      mock.state.services = mock.state.services.filter((service) => service.categoryId !== id);
      mock.addActivity('Menghapus kategori layanan', id, 'Produk');
      return mock.success({ deleted: true });
    }
    if (action === 'create' && method === 'POST') {
      const category = mock.mutateEntity<CategoryRecord>(mock.state.categories, null, 'category', {
        name: mock.stringValue(body.name, 'Kategori demo'),
        slug: mock.stringValue(body.slug, `kategori-demo-${mock.state.nextId}`),
        description: mock.stringValue(body.description),
        serviceCount: 0,
        active: mock.booleanValue(body.active, true),
      });
      mock.addActivity('Menambahkan kategori layanan', category.name, 'Produk');
      return mock.success({ category: mock.categoryView(category) }, 'Kategori demo berhasil dibuat.');
    }
    if (action === 'update' && ['PUT', 'PATCH'].includes(method) && id) {
      const current = mock.state.categories.find((category) => category.id === id);
      if (!current) return mock.failure(404, 'CATEGORY_NOT_FOUND', 'Kategori demo tidak ditemukan.');
      const category = mock.mutateEntity<CategoryRecord>(mock.state.categories, id, 'category', body);
      mock.addActivity('Memperbarui kategori layanan', category.name, 'Produk');
      return mock.success({ category: mock.categoryView(category) }, 'Kategori demo berhasil diperbarui.');
    }
  }

  return null;
};
