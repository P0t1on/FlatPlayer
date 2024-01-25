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
  toBinary: (vector: Vector2) => {

  }
} as const;


const test: Vector2 = {x: 1, y: 2}
