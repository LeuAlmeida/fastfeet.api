module.exports = {
  up: queryInterface => {
    return queryInterface.bulkInsert(
      'deliveries',
      [
        {
          id: 1,
          recipient_id: 1,
          deliveryman_id: 1,
          product: 'Um produto muito legal',
          canceled_at: null,
          start_date: null,
          created_at: new Date(),
          updated_at: new Date(),
        },
      ],
      {}
    );
  },

  down: queryInterface => {
    return queryInterface.bulkDelete('deliveries', null, {});
  },
};
