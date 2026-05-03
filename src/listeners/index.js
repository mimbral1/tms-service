import { logger } from '../config/logger.config.js';
import {
  DELIVERY_SHIPPING_CANCELLED,
  DELIVERY_SHIPPING_CREATED,
  DELIVERY_SHIPPING_READY_FOR_PICKUP,
  PACKING_PACKAGE_CREATED,
  PACKING_PACKAGE_UPDATED,
  USER_DRIVER_UPDATED,
} from '../infrastructure/kafka/kafka.topics.js';
import {
  connectKafkaConsumer,
  runKafkaConsumer,
  subscribeToTopic,
} from '../infrastructure/kafka/kafka.consumer.js';
import { handleShippingCancelled } from './delivery/shipping-cancelled.listener.js';
import { handleShippingCreated } from './delivery/shipping-created.listener.js';
import { handleShippingReadyForPickup } from './delivery/shipping-ready-for-pickup.listener.js';
import { handleDriverUpdated } from './driver/driver-updated.listener.js';
import { handlePackageCreated } from './packing/package-created.listener.js';
import { handlePackageUpdated } from './packing/package-updated.listener.js';

export async function startKafkaListeners() {
  await connectKafkaConsumer();

  logger.info('Starting Kafka listeners...');

  await subscribeToTopic(DELIVERY_SHIPPING_CREATED, handleShippingCreated);
  await subscribeToTopic(
    DELIVERY_SHIPPING_READY_FOR_PICKUP,
    handleShippingReadyForPickup,
  );
  await subscribeToTopic(DELIVERY_SHIPPING_CANCELLED, handleShippingCancelled);
  await subscribeToTopic(PACKING_PACKAGE_CREATED, handlePackageCreated);
  await subscribeToTopic(PACKING_PACKAGE_UPDATED, handlePackageUpdated);
  await subscribeToTopic(USER_DRIVER_UPDATED, handleDriverUpdated);
  await runKafkaConsumer();

  logger.info('Kafka listeners started');
}

export const listeners = {
  startKafkaListeners,
};
