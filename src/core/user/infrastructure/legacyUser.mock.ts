import * as mock from '@core/mock-data/infrastructure/mockRuntime';
export const handleLegacyUser = (url: URL, method: string) => {
  const userMatch = url.pathname.match(/^\/users\/([^/]+)$/);
  if (method === 'GET' && userMatch) {
    const id = Number(decodeURIComponent(userMatch[1]));
    if (!Number.isInteger(id) || id < 1) return mock.failure(404, 'USER_NOT_FOUND', 'Pengguna demo tidak ditemukan.');
    const user = {
      id,
      firstName: 'Demo',
      lastName: 'User',
      maidenName: '',
      age: 25,
      gender: 'female',
      email: 'demo.user@example.test',
      phone: '+6280000000000',
      username: 'demo.user',
      password: 'mock-only',
      birthDate: '2000-01-01',
      image: '/icon.svg',
      bloodGroup: 'O+',
      height: 165,
      weight: 55,
      eyeColor: 'Brown',
      hair: { color: 'Black', type: 'Straight' },
      ip: '127.0.0.1',
      address: {
        address: 'Alamat contoh',
        city: 'Jakarta',
        state: 'DKI Jakarta',
        stateCode: 'JK',
        postalCode: '00000',
        coordinates: { lat: -6.2, lng: 106.8 },
        country: 'Indonesia',
      },
      macAddress: '00:00:00:00:00:00',
      university: 'Universitas Demo',
      bank: { cardExpire: '01/30', cardNumber: '0000-0000-0000-0000', cardType: 'Demo', currency: 'IDR', iban: 'MOCK' },
      company: {
        department: 'Demo',
        name: 'JokiHub',
        title: 'Pengguna',
        address: {
          address: 'Alamat contoh',
          city: 'Jakarta',
          state: 'DKI Jakarta',
          stateCode: 'JK',
          postalCode: '00000',
          coordinates: { lat: -6.2, lng: 106.8 },
          country: 'Indonesia',
        },
      },
      ein: 'MOCK',
      ssn: 'MOCK',
      userAgent: 'JokiHub Mock API',
      crypto: { coin: 'DemoCoin', wallet: 'MOCK', network: 'Demo' },
      role: 'user',
    };
    return mock.jsonResponse(user);
  }
  return null;
};
