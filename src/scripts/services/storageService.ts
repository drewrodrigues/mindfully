interface IStorageRecord {
  id: string
}

export abstract class StorageService<I extends IStorageRecord> {
  // public get id = UUID();

  async all(): Promise<I[]> {
    // TODO:
    // * pluck from a key in the chrome storage
    return []
  }

  async save(record: I | I[]): Promise<I> {
    // TODO
    // * before saving, assign an ID if it doesn't already have one
    // ! throw if there's an ID given
    return {} as I
  }

  async update(record: I): Promise<void> {
    // TODO:
    // * ignore any id that's passed, just use it to grab the record in question
  }

  async delete(recordId: string): Promise<void> {
    // TODO
  }
}
