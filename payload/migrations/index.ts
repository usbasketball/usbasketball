import * as migration_20261124_100813_initial from './20261124_100813_initial';
import * as migration_20261124_111322_media_objectkey from './20261124_111322_media_objectkey';
import * as migration_20261124_115500_recruitment_notice from './20261124_115500_recruitment_notice';

export const migrations = [
  {
    up: migration_20261124_100813_initial.up,
    down: migration_20261124_100813_initial.down,
    name: '20261124_100813_initial',
  },
  {
    up: migration_20261124_111322_media_objectkey.up,
    down: migration_20261124_111322_media_objectkey.down,
    name: '20261124_111322_media_objectkey',
  },
  {
    up: migration_20261124_115500_recruitment_notice.up,
    down: migration_20261124_115500_recruitment_notice.down,
    name: '20261124_115500_recruitment_notice'
  },
];
