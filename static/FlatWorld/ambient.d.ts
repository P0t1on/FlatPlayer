declare function setEntity(
  entityName: string,
  x: number,
  y: number,
  z: number
): void;

declare const world: {
  width: number;
  height: number;
};

declare type EntityConfig = {
  NONE: 0b00;
  STATIC: 0b01;
  MOVEABLE: 0b10;
};

declare const entity: {
  name: string;
  sprite: string;
  module: boolean;
  config: number;
};
