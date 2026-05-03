import { Router } from 'express';
import { validate } from '../../../../shared/middleware/validate.middleware.js';
import { getSettings, updateSettings } from './settings.controller.js';
import { getSettingsSchema, updateSettingsSchema } from './settings.schema.js';

export function SettingsRoutes() {
  const router = Router();

  router.get('/:entity', validate(getSettingsSchema), getSettings);
  router.put('/:entity', validate(updateSettingsSchema), updateSettings);

  return router;
}
