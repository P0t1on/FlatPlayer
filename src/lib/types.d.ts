export type Vector3 = {
  x: number;
  y: number;
  z: number;
};

export type Vector2 = {
  x: number;
  y: number;
};

export type Entity = {
  name: string;
  static: boolean;
  sprite: string | ImageBitmap;
  module: any;
  config: {
    moveable: boolean;
  };
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
  buildScripts: buildScriptType[];
  startPoint: Vector3;
};
