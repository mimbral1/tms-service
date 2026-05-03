export class LifoValidator {
  static validate({ expectedShippingOrder = [], scannedPackages = [] }) {
    const actualOrder = [];

    for (const item of scannedPackages) {
      if (!item.shippingId) continue;

      if (!actualOrder.includes(item.shippingId)) {
        actualOrder.push(item.shippingId);
      }
    }

    const expectedOrder = [...expectedShippingOrder].reverse();

    const compliant =
      expectedOrder.length === actualOrder.length &&
      expectedOrder.every((shippingId, index) => shippingId === actualOrder[index]);

    return {
      compliant,
      expectedOrder,
      actualOrder,
    };
  }
}
