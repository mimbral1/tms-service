export class ValueObject {
  equals(valueObject) {
    if (!valueObject) return false;

    return JSON.stringify(this) === JSON.stringify(valueObject);
  }
}
