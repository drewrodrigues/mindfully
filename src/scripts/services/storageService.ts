interface IStorageRecord {
  id: string
}

export abstract class StorageService<I extends IStorageRecord> {
  // public get id = UUID();

  constructor() {
    //
  }

  all(): I[] {
    // TODO:
    // * pluck from a key in the chrome storage
    return []
  }

  save(record: I | I[]) {
    // TODO
    // * before saving, assign an ID if it doesn't already have one
    // ! throw if there's an ID given
  }

  update(record: I) {
    // TODO:
    // * ignore any id that's passed, just use it to grab the record in question
  }

  delete(recordId: string) {
    // TODO
  }
}
