import * as mock from '@core/mock-data/infrastructure/mockRuntime';
import type { JsonObject } from '@core/mock-data/domain/types';
const normalizePhone = (value: string) => {
  const digits = value.replace(/\D/g, '');
  return digits.startsWith('0') ? `62${digits.slice(1)}` : digits;
};

export const handleOrders = (url: URL, method: string, body: JsonObject, headers: Headers) => {
  const { pathname } = url;
  if (pathname === '/api/orders/v1/checkout' && method === 'POST') {
    const requestKey = headers.get('Idempotency-Key');
    if (requestKey && mock.state.idempotency.has(requestKey)) {
      const replay = mock.state.idempotency.get(requestKey);
      return mock.success({ ...replay, idempotentReplay: true }, 'Pesanan demo berhasil dibuat kembali.');
    }
    const token = `mock-track-${Math.random().toString(36).slice(2, 12)}`;
    const order = mock.createOrder(body, token);
    if (!order) return mock.failure(422, 'INVALID_ORDER', 'Game atau layanan demo tidak ditemukan.');
    const service = mock.state.services.find((item) => item.id === order.serviceId);
    const result = {
      order: {
        id: order.id,
        orderNumber: order.orderNumber,
        orderStatus: order.orderStatus,
        paymentStatus: order.paymentStatus,
        totalAmount: order.totalAmount,
        currency: 'IDR',
        expiresAt: new Date(Date.now() + 24 * 60 * 60_000).toISOString(),
        game: { name: order.gameName },
        service: { id: order.serviceId, name: order.serviceName },
        quantity: order.quantity,
      },
      payment: {
        id: order.paymentId,
        method: order.paymentMethod,
        status: order.paymentStatus,
        amount: order.totalAmount,
        instructions: {
          qrImageUrl: order.paymentMethod === 'QRIS' ? '/icon.svg' : null,
          bankName: order.paymentMethod === 'QRIS' ? null : 'Bank BCA',
          accountNumber: order.paymentMethod === 'QRIS' ? null : '1234567890',
          accountHolder: order.paymentMethod === 'QRIS' ? null : 'JokiHub Demo',
          reference: `MOCK-${order.paymentId}`,
        },
      },
      trackingToken: token,
      trackingTokenExpiresAt: new Date(Date.now() + 24 * 60 * 60_000).toISOString(),
      nextAction: service?.price === null ? 'CONTACT_FOR_QUOTE' : 'PAYMENT',
      idempotentReplay: false,
    };
    if (requestKey) mock.state.idempotency.set(requestKey, result);
    mock.addActivity('Membuat pesanan demo', order.orderNumber, 'Pesanan');
    return mock.success(result, 'Pesanan demo berhasil dibuat.');
  }

  if (pathname === '/api/orders/v1/tracking/lookup' && method === 'POST') {
    const orderNumber = mock.stringValue(body.orderNumber).trim().toUpperCase();
    const whatsapp = mock.stringValue(body.whatsapp);
    const order = mock.state.orders.find(
      (item) => item.orderNumber.toUpperCase() === orderNumber && normalizePhone(item.customerWhatsapp) === normalizePhone(whatsapp)
    );
    if (!order) return mock.failure(404, 'ORDER_NOT_FOUND', 'Pesanan demo tidak ditemukan atau nomor WhatsApp tidak sesuai.');
    const trackingToken = mock.state.trackingTokens.get(order.orderNumber) ?? `mock-track-${order.id}`;
    mock.state.trackingTokens.set(order.orderNumber, trackingToken);
    return mock.success({ trackingToken, expiresAt: new Date(Date.now() + 24 * 60 * 60_000).toISOString() });
  }

  const paymentOrder = mock.findOrderByPath(pathname, '/payment');
  if (paymentOrder) {
    const authorization = headers.get('Authorization')?.replace(/^Bearer\s+/i, '') ?? '';
    if (mock.state.trackingTokens.get(paymentOrder.orderNumber) !== authorization) {
      return mock.failure(401, 'INVALID_TRACKING_TOKEN', 'Sesi pelacakan demo tidak valid.');
    }
    if (method === 'GET') {
      if (['PENDING_REVIEW', 'PAID'].includes(paymentOrder.paymentStatus)) {
        return mock.failure(409, 'PAYMENT_ALREADY_REPORTED', 'Pembayaran demo sudah dilaporkan.');
      }
      return mock.success({
        order: {
          orderNumber: paymentOrder.orderNumber,
          paymentStatus: paymentOrder.paymentStatus,
          totalAmount: paymentOrder.totalAmount,
          expiresAt: new Date(Date.now() + 24 * 60 * 60_000).toISOString(),
          game: paymentOrder.gameName,
          service: paymentOrder.serviceName,
          quantity: paymentOrder.quantity,
        },
        payment: {
          id: paymentOrder.paymentId,
          method: paymentOrder.paymentMethod,
          amount: paymentOrder.totalAmount,
          instructions: {
            qrImageUrl: paymentOrder.paymentMethod === 'QRIS' ? '/icon.svg' : null,
            bankName: paymentOrder.paymentMethod === 'QRIS' ? null : 'Bank BCA',
            accountNumber: paymentOrder.paymentMethod === 'QRIS' ? null : '1234567890',
            accountHolder: paymentOrder.paymentMethod === 'QRIS' ? null : 'JokiHub Demo',
            reference: `MOCK-${paymentOrder.paymentId}`,
          },
        },
      });
    }
    if (method === 'POST') {
      paymentOrder.paymentStatus = 'PENDING_REVIEW';
      paymentOrder.orderStatus = 'PENDING_REVIEW';
      mock.addActivity('Melaporkan pembayaran demo', paymentOrder.orderNumber, 'Pesanan');
      return mock.success({ paymentStatus: paymentOrder.paymentStatus }, 'Pembayaran demo dikirim untuk pemeriksaan.');
    }
  }

  const statusOrder = mock.findOrderByPath(pathname, '/status');
  if (statusOrder && method === 'GET') {
    const authorization = headers.get('Authorization')?.replace(/^Bearer\s+/i, '') ?? '';
    if (mock.state.trackingTokens.get(statusOrder.orderNumber) !== authorization) {
      return mock.failure(401, 'INVALID_TRACKING_TOKEN', 'Sesi pelacakan demo tidak valid.');
    }
    if (url.searchParams.get('view') === 'result' && !['PENDING_REVIEW', 'PAID'].includes(statusOrder.paymentStatus)) {
      return mock.failure(409, 'PAYMENT_NOT_REPORTED', 'Pembayaran demo belum dilaporkan.');
    }
    return mock.success(mock.trackingView(statusOrder));
  }

  if (pathname === '/api/admin/orders/v1/list' && method === 'GET') {
    return mock.success(
      mock.pagedPayload(
        mock.state.orders.map((order) => mock.orderAdminView(order)),
        url,
        'orders'
      )
    );
  }
  const orderDetail = pathname.match(/^\/api\/admin\/orders\/v1\/detail\/([^/]+)$/);
  if (orderDetail && method === 'GET') {
    const key = decodeURIComponent(orderDetail[1]);
    const order = mock.state.orders.find((item) => item.internalId === key || item.orderNumber === key);
    if (!order) return mock.failure(404, 'ORDER_NOT_FOUND', 'Pesanan demo tidak ditemukan.');
    return mock.success({
      order: {
        ...mock.orderAdminView(order),
        items: [
          {
            gameAccount: order.gameAccount,
            gameServer: order.gameServer,
            customerNotes: order.customerNotes,
            quantity: order.quantity,
            serviceName: order.serviceName,
          },
        ],
        payment: { id: order.paymentId, method: order.paymentMethod, status: order.paymentStatus, amount: order.totalAmount },
      },
    });
  }
  if (pathname === '/api/admin/orders/v1/payment-review' && method === 'POST') {
    const order = mock.state.orders.find((item) => item.id === mock.stringValue(body.orderId) || item.internalId === mock.stringValue(body.orderId));
    if (!order || order.paymentId !== mock.stringValue(body.paymentId))
      return mock.failure(404, 'PAYMENT_NOT_FOUND', 'Pembayaran demo tidak ditemukan.');
    if (body.decision === 'APPROVE') {
      order.paymentStatus = 'PAID';
      order.orderStatus = 'IN_PROGRESS';
    } else {
      order.paymentStatus = 'FAILED';
      order.orderStatus = 'AWAITING_PAYMENT';
    }
    mock.addActivity('Memeriksa pembayaran demo', order.orderNumber, 'Pesanan');
    return mock.success({ paymentStatus: order.paymentStatus, orderStatus: order.orderStatus }, 'Pemeriksaan pembayaran demo berhasil.');
  }
  const completeOrder = pathname.match(/^\/api\/admin\/orders\/v1\/complete\/([^/]+)$/);
  if (completeOrder && method === 'POST') {
    const key = decodeURIComponent(completeOrder[1]);
    const order = mock.state.orders.find((item) => item.id === key || item.internalId === key || item.orderNumber === key);
    if (!order) return mock.failure(404, 'ORDER_NOT_FOUND', 'Pesanan demo tidak ditemukan.');
    order.orderStatus = 'COMPLETED';
    mock.addActivity('Menyelesaikan pesanan demo', order.orderNumber, 'Pesanan');
    return mock.success({ orderStatus: order.orderStatus }, 'Pesanan demo ditandai selesai.');
  }

  return null;
};
