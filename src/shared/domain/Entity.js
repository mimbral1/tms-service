export class Entity {
  constructor(id) {
    if (!id) {
      throw new Error('Entity id is required');
    }

    this.id = id;
  }

  equals(entity) {
    if (!entity) return false;
    return this.id === entity.id;
  }
}
