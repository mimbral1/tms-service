export const KafkaTopics = {
  TMS_ROUTE_CREATED: 'tms.route.created',
  TMS_ROUTE_SCHEDULED: 'tms.route.scheduled',
  TMS_ROUTE_STARTED: 'tms.route.started',
  TMS_ROUTE_FINISHED: 'tms.route.finished',
  TMS_ROUTE_CANCELLED: 'tms.route.cancelled',
  TMS_ROUTE_DRIVER_ASSIGNED: 'tms.route.driver_assigned',

  TMS_ROUTE_DISPATCH_READY: 'tms.route_dispatch.ready',
  TMS_ROUTE_DISPATCH_STARTED: 'tms.route_dispatch.started',
  TMS_ROUTE_DISPATCH_FINISHED: 'tms.route_dispatch.finished',

  TMS_ROUTE_PLANNING_CREATED: 'tms.route_planning.created',
  TMS_ROUTE_PLANNING_PROCESSED: 'tms.route_planning.processed',
  TMS_ROUTE_PLANNING_CONFIRMED: 'tms.route_planning.confirmed',
  TMS_ROUTE_PLANNING_ROUTES_CREATED: 'tms.route_planning.routes_created',

  TMS_DRIVER_PLANNING_CREATED: 'tms.driver_planning.created',
  TMS_DRIVER_PLANNING_UPDATED: 'tms.driver_planning.updated',
  TMS_DRIVER_OCCUPIED: 'tms.driver.occupied',
  TMS_DRIVER_RELEASED: 'tms.driver.released',

  TMS_VEHICLE_LOCATION_UPDATED: 'tms.vehicle.location_updated',

  DELIVERY_SHIPPING_CREATED: 'delivery.shipping.created',
  DELIVERY_SHIPPING_READY_FOR_PICKUP: 'delivery.shipping.ready_for_pickup',
  DELIVERY_SHIPPING_CANCELLED: 'delivery.shipping.cancelled',

  PACKING_PACKAGE_CREATED: 'packing.package.created',
  PACKING_PACKAGE_UPDATED: 'packing.package.updated',

  USER_DRIVER_UPDATED: 'user.driver.updated',

  ROUTE_EVENTS: 'tms.route.events',
  DISPATCH_EVENTS: 'tms.dispatch.events',
  VEHICLE_EVENTS: 'tms.vehicle.events',
};

export const {
  TMS_ROUTE_CREATED,
  TMS_ROUTE_SCHEDULED,
  TMS_ROUTE_STARTED,
  TMS_ROUTE_FINISHED,
  TMS_ROUTE_CANCELLED,
  TMS_ROUTE_DRIVER_ASSIGNED,
  TMS_ROUTE_DISPATCH_READY,
  TMS_ROUTE_DISPATCH_STARTED,
  TMS_ROUTE_DISPATCH_FINISHED,
  TMS_ROUTE_PLANNING_CREATED,
  TMS_ROUTE_PLANNING_PROCESSED,
  TMS_ROUTE_PLANNING_CONFIRMED,
  TMS_ROUTE_PLANNING_ROUTES_CREATED,
  TMS_DRIVER_PLANNING_CREATED,
  TMS_DRIVER_PLANNING_UPDATED,
  TMS_DRIVER_OCCUPIED,
  TMS_DRIVER_RELEASED,
  TMS_VEHICLE_LOCATION_UPDATED,
  DELIVERY_SHIPPING_CREATED,
  DELIVERY_SHIPPING_READY_FOR_PICKUP,
  DELIVERY_SHIPPING_CANCELLED,
  PACKING_PACKAGE_CREATED,
  PACKING_PACKAGE_UPDATED,
  USER_DRIVER_UPDATED,
} = KafkaTopics;
