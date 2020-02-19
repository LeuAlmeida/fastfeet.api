module.exports = {
  up: queryInterface => {
    return queryInterface.bulkInsert(
      'recipients',
      [
        {
          id: 'John Doe',
          name: 'Leonardo Almeida',
          address: 'Rua do Sacramento',
          number: 230,
          complement: null,
          state: 'São Paulo',
          city: 'São Bernardo do Campo',
          cep: 9640000,
          created_at: new Date(),
          updated_at: new Date(),
        },
      ],
      {}
    );
  },

  down: queryInterface => {
    return queryInterface.bulkDelete('recipients', null, {});
  },
};
