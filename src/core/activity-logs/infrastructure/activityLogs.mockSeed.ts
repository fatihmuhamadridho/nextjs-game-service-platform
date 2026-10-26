import type { JsonObject } from '@core/mock-data/domain/types';
import { ago } from '@core/mock-data/infrastructure/time';

export const activityLogs: JsonObject[] = [
  {
    id: 'ACT-001',
    adminName: 'Demo Admin',
    adminEmail: 'admin@example.test',
    action: 'Menyelesaikan pesanan',
    target: 'JH-20261025-A1B2C3',
    category: 'Pesanan',
    occurredAt: ago(12),
    ipAddress: '127.0.0.1',
    result: 'Berhasil',
  },
  {
    id: 'ACT-002',
    adminName: 'Demo Operator',
    adminEmail: 'operator@example.test',
    action: 'Memperbarui layanan',
    target: 'Rank Boost Valorant',
    category: 'Produk',
    occurredAt: ago(65),
    ipAddress: '127.0.0.1',
    result: 'Berhasil',
  },
  {
    id: 'ACT-003',
    adminName: 'Demo Admin',
    adminEmail: 'admin@example.test',
    action: 'Memperbarui pengaturan',
    target: 'Informasi situs',
    category: 'Pengaturan',
    occurredAt: ago(180),
    ipAddress: '127.0.0.1',
    result: 'Berhasil',
  },
];
