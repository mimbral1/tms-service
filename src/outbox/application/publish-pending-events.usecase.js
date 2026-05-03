import { logger } from '../../config/logger.config.js';
import { outboxRepository } from '../../infrastructure/persistence/repositories/outbox.repository.js';
import { publishOutboxEvent } from './outbox-event.publisher.js';

function getEventId(event) {
  return event.Id ?? event.id;
}

export class PublishPendingEventsUseCase {
  async execute() {
    const events = await outboxRepository.getPending(50);

    for (const event of events) {
      const eventId = getEventId(event);

      try {
        await outboxRepository.markProcessing(eventId);
        await publishOutboxEvent(event);
        await outboxRepository.markPublished(eventId);
      } catch (error) {
        logger.error('Failed to publish outbox event', {
          error,
          eventId,
        });

        await outboxRepository.markFailed(eventId, error);
      }
    }
  }
}

export const publishPendingEventsUseCase = new PublishPendingEventsUseCase();
