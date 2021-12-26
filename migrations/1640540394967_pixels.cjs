/* eslint-disable camelcase */

exports.shorthands = undefined;

exports.up = pgm => {
  pgm.createTable(
    'pixels', {
      id: {
        type: 'varchar(32)',
        primaryKey: true
      },
      name: {
        type: 'varchar(120)'
      },
      email: {
        type: 'varchar(120)'
      },
      created: {
        type: 'timestamp',
        default: pgm.func('now()'),
      },
      data: {
        type: 'varchar(1000)'
      },
      watched: {
        type: 'timestamp'
      },
    }
  )
};

exports.down = pgm => {
  pgm.dropTable('pixels')
};