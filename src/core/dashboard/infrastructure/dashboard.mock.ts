import * as mock from '@core/mock-data/infrastructure/mockRuntime';
import type { JsonObject } from '@core/mock-data/domain/types';
export const handleDashboard = (url: URL, method: string, _body: JsonObject) => {
  void _body;
  const { pathname } = url;
  if (pathname === '/api/admin/dashboard/v1/overview' && method === 'GET') {
    const revenue = mock.state.transactions.reduce((total, transaction) => total + mock.numberValue(transaction.amount), 0);
    const orderCount = mock.state.orders.length;
    const statuses = ['Menunggu Pembayaran', 'Menunggu Validasi', 'Diproses', 'Selesai', 'Dibatalkan'];
    const statusDistribution = statuses.map((status) => {
      const count = mock.state.orders.filter((order) => mock.orderAdminView(order).status === status).length;
      return { status, count, percent: orderCount ? Math.round((count / orderCount) * 100) : 0 };
    });
    const byGame = mock.state.games.map((game) => ({
      name: game.name,
      count: mock.state.orders.filter((order) => order.gameId === game.id).length,
      percent: orderCount ? Math.round((mock.state.orders.filter((order) => order.gameId === game.id).length / orderCount) * 100) : 0,
    }));
    return mock.success({
      overview: {
        metrics: {
          orderCount,
          orderChangePercent: 0,
          revenue,
          revenueChangePercent: 0,
          userCount: mock.state.users.length,
          serviceCount: mock.state.services.length,
        },
        series: Array.from({ length: 7 }, (_, index) => ({ label: `${index + 1}`, orders: index + 1, revenue: (index + 1) * 25000 })),
        statusDistribution,
        popularGames: byGame.filter((game) => game.count > 0).sort((a, b) => b.count - a.count),
        gameRevenue: byGame.map((game) => ({
          name: game.name,
          amount: game.count * 25000,
          percent: orderCount ? Math.round((game.count / orderCount) * 100) : 0,
        })),
        paymentMethods: ['QRIS', 'Transfer Bank BCA'].map((method) => ({
          method,
          count: mock.state.orders.filter(
            (order) => order.paymentMethod === method || (method.includes('BCA') && order.paymentMethod === 'BCA_TRANSFER')
          ).length,
          amount: 0,
        })),
        recentOrders: mock.state.orders.slice(0, 5).map((order) => ({
          id: order.orderNumber,
          date: order.createdAt,
          user: order.customerName,
          game: order.gameName,
          service: order.serviceName,
          total: order.totalAmount,
          status: mock.orderAdminView(order).status,
        })),
        recentActivity: mock.state.activityLogs.slice(0, 5).map((activity) => ({
          id: activity.id,
          title: activity.action,
          detail: activity.target,
          occurredAt: activity.occurredAt,
          category: activity.category,
        })),
      },
    });
  }

  return null;
};
