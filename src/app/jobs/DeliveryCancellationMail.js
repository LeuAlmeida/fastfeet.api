import { format, parseISO } from 'date-fns';
import pt from 'date-fns/locale/pt';
import { resolve } from 'path';
import Mail from '../../lib/Mail';

const folder = resolve(__dirname, '..', 'views', 'emails', 'images');

class DeliveryCancellationMail {
  get key() {
    return 'DeliveryCancellationMail';
  }

  async handle({ data }) {
    const { deliveryman, product, delivery, problem, canceled_at } = data;

    await Mail.sendMail({
      to: `${`Leonardo Almeida`} <${`leo@webid.net.br`}>`,
      subject: `A entrega do produto ${product} foi cancelada.`,
      template: 'cancellation',
      context: {
        deliveryman: deliveryman.name,
        product,
        problem,
        actualDate: format(parseISO(new Date()), "dd' de 'MMMM' de 'yyyy", {
          locale: pt,
        }),
        canceled_at: format(parseISO(canceled_at), "dd' de 'MMMM' de 'yyyy", {
          locale: pt,
        }),
        end_date: format(
          parseISO(delivery.end_date),
          "dd' de 'MMMM' de 'yyyy",
          {
            locale: pt,
          }
        ),
      },
      attachments: [
        {
          filename: 'logo.png',
          path: `${folder}/logo.png`,
          cid: 'logo',
        },
        {
          filename: 'element1.png',
          path: `${folder}/element1.png`,
          cid: 'element1',
        },
        {
          filename: 'footer_image.png',
          path: `${folder}/footer_image.png`,
          cid: 'footer_image',
        },
      ],
    });
  }
}

export default new DeliveryCancellationMail();
