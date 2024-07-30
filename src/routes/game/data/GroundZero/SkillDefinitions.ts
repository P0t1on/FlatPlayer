import { createSkill } from '$lib/game/Skills';

const hit_down = createSkill('attack', {
  name: '내려치기',
  description: '들고있는 것을 휘둘러 적에게 피해를 입힌다.',
  power: 1,
  cost: 0,
});

const run_run_run = createSkill('defense', {
  name: '도망치기',
  description: '도망친다.',
  power: 1,
  cost: 0,
  evade: true,
});

const pray = createSkill('etc', {
  name: '기도',
  description: '기도하기',
  cost: 11,
});

const chase = createSkill('etc', {
  name: '추격',
  description: '망령이 당신을 추격하고 있다.',
});

const strage_fear = createSkill('buff', {});

const skills = {
  hit_down,
  run_run_run,
  pray,
};

export default skills;
