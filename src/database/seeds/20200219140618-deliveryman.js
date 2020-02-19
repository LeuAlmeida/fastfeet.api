module.exports = {
  up: queryInterface => {
    return queryInterface.bulkInsert(
      'deliverymans',
      [
        {
          id: 1,
          name: 'Entregador Bacana Demais',
          avatar_id: 1,
          email: 'eu@leunardo.dev',
          created_at: new Date(),
          updated_at: new Date(),
        },
      ],
      {}
    );
  },

  down: queryInterface => {
    return queryInterface.bulkDelete('deliverymans', null, {});
  },
};
