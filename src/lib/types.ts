export type Vector3 = {
  x: number;
  y: number;
  z: number;
};

export type Vector2 = {
  x: number;
  y: number;
};

export const Vector2 = {
  up: { x: 0, y: 1 } as const,
  down: { x: 0, y: -1 } as const,
  left: { x: -1, y: 0 } as const,
  right: { x: 1, y: 0 } as const,
} as const;

export const EntityConfig = {
  NONE: 0b00,
  STATIC: 0b01,
  MOVEABLE: 0b10,
} as const;

export type Entity = {
  name: string;
  sprite: string | ImageBitmap;
  module: any;
  config: number;
};

// build shape

type BuildShape = {
  rect: {
    shape: "rect";
    position: Vector3;
    size: Vector2;
  };
  line: {
    shape: "line";
    layer: number;
    startPosition: Vector2;
    endPosition: Vector2;
  };
};

// build method

type BuildMethod = {
  fill: {
    method: "fill";
    entity: string;
  };
};

export type buildScriptType = BuildMethod["fill"] &
  (BuildShape["line"] | BuildShape["rect"]);

export type StatusFormat = {
  name: string;
  color: string;
  max?: number;
  start?: number;
  config?: {
    deathOnZero?: boolean;
    visible?: boolean;
  };
}

export const StatusConfig = {
  NONE: 0b000,
  DEATHONZERO: 0b001,
  VISIBLE: 0b010
} as const;

export type MapFormat = {
  name: string;
  /* URL domain */ domain: string;
  layer: number;
  width: number;
  height: number;
  baseTile: string;
  sprites: {
    name: string;
    /* URL */ src: string;
  }[];
  entityDef: {
    name: string;
    sprite: string;
    /* URL */ module: string;
    config?: {
      moveable?: boolean;
    };
  }[];
  status: StatusFormat[];
  /* URL */ eventSystem: string;
  buildScripts: buildScriptType[];
  startPoint: Vector3;
};
