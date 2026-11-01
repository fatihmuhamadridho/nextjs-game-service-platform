import { Box } from 'rangkaui';
import type { CheckoutService } from '../interfaces/checkout.interface';
import { PanelHeading } from '../atoms/PanelHeading.atom';
import { ServiceOption } from '../molecules/ServiceOption.molecule';
import styles from './ServicePicker.module.css';
type Props = {
  services: CheckoutService[];
  selected: number;
  formatPrice: (value: number) => string;
  onSelect: (index: number) => void;
  loading?: boolean;
};
export const ServicePicker = ({ services, selected, formatPrice, onSelect, loading = false }: Props) => (
  <Box className={styles.panel} bordered rounded>
    <PanelHeading number="2" title="Pilih Layanan" description="Pilih layanan joki yang kamu butuhkan." />
    <div
      className={styles.list}
      role={loading ? undefined : 'radiogroup'}
      aria-label={loading ? undefined : 'Pilih layanan'}
      aria-busy={loading}
    >
      {loading
        ? Array.from({ length: 3 }, (_, index) => (
            <div className={styles.skeletonRow} key={index} aria-hidden="true">
              <span />
              <i />
              <b />
            </div>
          ))
        : services.map((service, index) => (
            <ServiceOption
              key={service.name}
              service={service}
              selected={selected === index}
              priceLabel={service.price ? formatPrice(service.price) : ''}
              onSelect={() => onSelect(index)}
            />
          ))}
    </div>
  </Box>
);
