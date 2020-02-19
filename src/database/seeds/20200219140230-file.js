module.exports = {
  up: queryInterface => {
    return queryInterface.bulkInsert(
      'files',
      [
        {
          id: 1,
          name: 'profile.jpeg',
          path: '6cd077a78f748f49a5e91c71f526dc24.jpeg',
          created_at: new Date(),
          updated_at: new Date(),
        },
        // {
        //   id: 2,
        //   name: 'signature.png',
        //   path: '5aff4473187184f82bccb87ef39d48eb.png',
        //   created_at: new Date(),
        //   updated_at: new Date(),
        // },
      ],
      {}
    );
  },

  down: queryInterface => {
    return queryInterface.bulkDelete('files', null, {});
  },
};
