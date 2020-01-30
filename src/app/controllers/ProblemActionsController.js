// Crie uma rota para a distribuidora cancelar uma entrega baseado no ID do problema. Esse cancelamento pode acontecer devido a gravidade do problema da entrega, por exemplo, em caso de perda da encomenda.
// Exemplo de requisição: `POST https://fastfeet.com/problem/1/cancel-delivery`
// Quando uma encomenda for cancelada, o entregador deve receber um e-mail informando-o sobre o cancelamento.

// Crie uma rota para o entregador cadastrar problemas na entrega apenas informando seu ID de cadastro (ID do banco de dados);

class ProblemActionsController {
  async store(req, res) {
    return res.json({ cancel: true });
  }

  async update(req, res) {
    return res.json({ registerProblem: true });
  }
}

export default new ProblemActionsController();
