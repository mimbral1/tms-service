export class RoutePlanningConfirmationService {
  constructor(routeRepository) {
    this.routeRepository = routeRepository;
  }

  async createRoutesFromPlanning({ routePlanning, plannedRoutes, createRouteUseCase }) {
    const created = [];
    const failed = [];

    for (const plannedRoute of plannedRoutes) {
      try {
        const route = await createRouteUseCase.execute({
          displayId: null,
          routePlanningId: routePlanning.id,
          vehicleTypeId: plannedRoute.vehicleTypeId,
          driverId: plannedRoute.driverId,
          scheduleStart: routePlanning.scheduleFrom,
          scheduleEnd: routePlanning.scheduleTo,
          autoSchedule: true,
          stops: plannedRoute.stops,
        });

        created.push({
          plannedRouteId: plannedRoute.id,
          routeId: route.id,
        });
      } catch (error) {
        failed.push({
          plannedRouteId: plannedRoute.id,
          errorMessage: error.message,
        });
      }
    }

    return {
      created,
      failed,
    };
  }
}
