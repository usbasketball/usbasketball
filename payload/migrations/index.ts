import * as migration_20261124_100813_initial from './20261124_100813_initial';

export const migrations = [
  {
    up: migration_20261124_100813_initial.up,
    down: migration_20261124_100813_initial.down,
    name: '20261124_100813_initial'
  },
];
