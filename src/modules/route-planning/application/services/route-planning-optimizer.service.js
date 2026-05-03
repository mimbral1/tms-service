export class RoutePlanningOptimizerService {
  generateInitialPlan(routePlanning) {
    const routes = [];

    for (const condition of routePlanning.planningConditions) {
      for (const vehicleType of condition.vehicleConfigurations.types) {
        const quantity = vehicleType.quantity || 1;

        for (let index = 0; index < quantity; index += 1) {
          routes.push({
            vehicleTypeId: vehicleType.id,
            driverId: null,
            duration: {
              expected: 60,
            },
            stops: [
              {
                kind: 'warehouse',
                warehouseId: condition.warehouseId,
                address: 'Bodega Mimbral',
                latitude: null,
                longitude: null,
                actions: [
                  {
                    type: 'pickup',
                    shippingId: null,
                  },
                ],
              },
            ],
          });
        }
      }
    }

    return {
      routes,
      totals: {
        warehouseCount: new Set(
          routePlanning.planningConditions.map((item) => item.warehouseId),
        ).size,
        vehicleTypeCount: new Set(
          routePlanning.planningConditions.flatMap((item) =>
            item.vehicleConfigurations.types.map((type) => type.id),
          ),
        ).size,
        routeCount: routes.length,
        shippingCount: 0,
        assignedShippingCount: 0,
        unassignedShippingCount: 0,
      },
    };
  }
}

export const routePlanningOptimizerService = new RoutePlanningOptimizerService();
