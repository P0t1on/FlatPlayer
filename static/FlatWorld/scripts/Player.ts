// @ts-nocheck

type Vector3 = {
  x: number;
  y: number;
  z: number;
};

type EventData = {
  move: (position: Vector3, canMove: boolean, cancelMove: () => void) => void;
};

declare const events: {
  on: <K extends keyof EventData>(key: K, handler: EventData[K]) => void;
};

declare const getEntity: (position: Vector3) =>
  | {
      name: string;
      sprite: string | ImageBitmap;
      module: any;
      option: number;
    }
  | undefined;

type registerData = {
  skill: {
    name: string;
    runner: () => void;
  };
};

declare const register: <K extends keyof registerData>(
  type: K,
  target: registerData[K]
) => void;

events.on('move', (position, canMove, cancelMove) => {
  console.log(getEntity(position));
});

register('skill', {
  name: 'test',
  runner: () => {
    console.log('test');
  },
});
