// THIS IS AN AUTOGENERATED FILE. DO NOT EDIT THIS FILE DIRECTLY.

import {
  TypedMap,
  Entity,
  Value,
  ValueKind,
  store,
  Bytes,
  BigInt,
  BigDecimal
} from "@graphprotocol/graph-ts";

export class Field extends Entity {
  constructor(id: string) {
    super();
    this.set("id", Value.fromString(id));
  }

  save(): void {
    let id = this.get("id");
    assert(id != null, "Cannot save Field entity without an ID");
    if (id) {
      assert(
        id.kind == ValueKind.STRING,
        "Cannot save Field entity with non-string ID. " +
          'Considering using .toHex() to convert the "id" to a string.'
      );
      store.set("Field", id.toString(), this);
    }
  }

  static load(id: string): Field | null {
    return changetype<Field | null>(store.get("Field", id));
  }

  get id(): string {
    let value = this.get("id");
    return value!.toString();
  }

  set id(value: string) {
    this.set("id", Value.fromString(value));
  }

  get name(): string | null {
    let value = this.get("name");
    if (!value || value.kind == ValueKind.NULL) {
      return null;
    } else {
      return value.toString();
    }
  }

  set name(value: string | null) {
    if (!value) {
      this.unset("name");
    } else {
      this.set("name", Value.fromString(<string>value));
    }
  }

  get fieldType(): string | null {
    let value = this.get("fieldType");
    if (!value || value.kind == ValueKind.NULL) {
      return null;
    } else {
      return value.toString();
    }
  }

  set fieldType(value: string | null) {
    if (!value) {
      this.unset("fieldType");
    } else {
      this.set("fieldType", Value.fromString(<string>value));
    }
  }
}

export class ContentType extends Entity {
  constructor(id: string) {
    super();
    this.set("id", Value.fromString(id));
  }

  save(): void {
    let id = this.get("id");
    assert(id != null, "Cannot save ContentType entity without an ID");
    if (id) {
      assert(
        id.kind == ValueKind.STRING,
        "Cannot save ContentType entity with non-string ID. " +
          'Considering using .toHex() to convert the "id" to a string.'
      );
      store.set("ContentType", id.toString(), this);
    }
  }

  static load(id: string): ContentType | null {
    return changetype<ContentType | null>(store.get("ContentType", id));
  }

  get id(): string {
    let value = this.get("id");
    return value!.toString();
  }

  set id(value: string) {
    this.set("id", Value.fromString(value));
  }

  get fields(): Array<string> | null {
    let value = this.get("fields");
    if (!value || value.kind == ValueKind.NULL) {
      return null;
    } else {
      return value.toStringArray();
    }
  }

  set fields(value: Array<string> | null) {
    if (!value) {
      this.unset("fields");
    } else {
      this.set("fields", Value.fromStringArray(<Array<string>>value));
    }
  }

  get name(): string | null {
    let value = this.get("name");
    if (!value || value.kind == ValueKind.NULL) {
      return null;
    } else {
      return value.toString();
    }
  }

  set name(value: string | null) {
    if (!value) {
      this.unset("name");
    } else {
      this.set("name", Value.fromString(<string>value));
    }
  }

  get isSingleton(): boolean {
    let value = this.get("isSingleton");
    return value!.toBoolean();
  }

  set isSingleton(value: boolean) {
    this.set("isSingleton", Value.fromBoolean(value));
  }
}

export class Content extends Entity {
  constructor(id: string) {
    super();
    this.set("id", Value.fromString(id));
  }

  save(): void {
    let id = this.get("id");
    assert(id != null, "Cannot save Content entity without an ID");
    if (id) {
      assert(
        id.kind == ValueKind.STRING,
        "Cannot save Content entity with non-string ID. " +
          'Considering using .toHex() to convert the "id" to a string.'
      );
      store.set("Content", id.toString(), this);
    }
  }

  static load(id: string): Content | null {
    return changetype<Content | null>(store.get("Content", id));
  }

  get id(): string {
    let value = this.get("id");
    return value!.toString();
  }

  set id(value: string) {
    this.set("id", Value.fromString(value));
  }

  get contentType(): string | null {
    let value = this.get("contentType");
    if (!value || value.kind == ValueKind.NULL) {
      return null;
    } else {
      return value.toString();
    }
  }

  set contentType(value: string | null) {
    if (!value) {
      this.unset("contentType");
    } else {
      this.set("contentType", Value.fromString(<string>value));
    }
  }

  get values(): Array<string> | null {
    let value = this.get("values");
    if (!value || value.kind == ValueKind.NULL) {
      return null;
    } else {
      return value.toStringArray();
    }
  }

  set values(value: Array<string> | null) {
    if (!value) {
      this.unset("values");
    } else {
      this.set("values", Value.fromStringArray(<Array<string>>value));
    }
  }
}
