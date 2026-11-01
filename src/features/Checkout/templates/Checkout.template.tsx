import type { CheckoutGame, CheckoutService } from '../interfaces/checkout.interface';
import { CheckoutHeader } from '../organisms/CheckoutHeader.organism';
import { GamePicker } from '../organisms/GamePicker.organism';
import { ServicePicker } from '../organisms/ServicePicker.organism';
import { OrderDetailsForm } from '../organisms/OrderDetailsForm.organism';
import { OrderSummary } from '../organisms/OrderSummary.organism';
import { SecurityChecklist } from '../molecules/SecurityChecklist.molecule';
import { Footer } from '@common-ui/organisms/Footer/Footer';
import { StickyCheckout } from '../organisms/StickyCheckout.organism';
import styles from './Checkout.module.css';

type Props = {
  games: CheckoutGame[];
  services: CheckoutService[];
  selectedGame: string;
  selectedService: number;
  quantity: number;
  loading: boolean;
  submitting: boolean;
  apiMessage: string;
  catalogError: string;
  onRetryCatalog: () => void;
  paymentMethod: string;
  onPaymentMethod: (method: string) => void;
  errors: string[];
  total: number;
  formatPrice: (price: number) => string;
  onGameSelect: (game: string) => void;
  onServiceSelect: (index: number) => void;
  onQuantity: (quantity: number) => void;
  onContinue: () => void;
  onDetailsChange: () => void;
};

export const CheckoutTemplate = ({
  games,
  services,
  selectedGame,
  selectedService,
  quantity,
  loading,
  submitting,
  apiMessage,
  catalogError,
  onRetryCatalog,
  paymentMethod,
  onPaymentMethod,
  errors,
  total,
  formatPrice,
  onGameSelect,
  onServiceSelect,
  onQuantity,
  onContinue,
  onDetailsChange,
}: Props) => {
  const service = services[selectedService];
  return (
    <main className={styles.page}>
      <CheckoutHeader game={selectedGame || 'Game'} stage="selection" />
      <div className={styles.layout} aria-busy={loading}>
        {apiMessage && <p role="alert">{apiMessage}</p>}
        {loading && (
          <span className={styles.srOnly} role="status">
            Memuat katalog game dan layanan…
          </span>
        )}
        <div className={styles.formColumn} aria-busy={loading}>
          {catalogError && (
            <div className={styles.catalogError}>
              <p role="alert">{catalogError}</p>
              <button type="button" onClick={onRetryCatalog} disabled={loading}>
                {loading ? 'Memuat ulang…' : 'Coba lagi'}
              </button>
            </div>
          )}
          {!(catalogError && games.length === 0) && (
            <>
              <GamePicker
                games={games}
                selected={selectedGame}
                onSelect={onGameSelect}
                loading={loading && games.length === 0}
              />
              {!catalogError && (
                <ServicePicker
                  services={services}
                  selected={selectedService}
                  formatPrice={formatPrice}
                  onSelect={onServiceSelect}
                  loading={loading}
                />
              )}
            </>
          )}
          <OrderDetailsForm errors={errors} onChange={onDetailsChange} />
        </div>
        <aside className={styles.summaryColumn}>
          <OrderSummary
            game={selectedGame || 'Pilih game'}
            service={service}
            quantity={quantity}
            total={total}
            formatPrice={formatPrice}
            onQuantity={onQuantity}
            onContinue={onContinue}
            disabled={loading || submitting || !service || !selectedGame}
            submitting={submitting}
            paymentMethod={paymentMethod}
            onPaymentMethod={onPaymentMethod}
          />
          <SecurityChecklist />
        </aside>
      </div>
      <Footer />
      {service && (
        <StickyCheckout
          totalLabel={service.price ? formatPrice(total) : 'Tanya Admin'}
          onContinue={onContinue}
          disabled={loading || submitting || !selectedGame}
        />
      )}
    </main>
  );
};
