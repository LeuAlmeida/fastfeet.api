import { format, parseISO } from 'date-fns';
import pt from 'date-fns/locale/pt';
import { resolve } from 'path';
import Mail from '../../lib/Mail';

const folder = resolve(__dirname, '..', 'views', 'emails', 'images');

class DeliveryConfirmationMail {
  get key() {
    return 'DeliveryConfirmationMail';
  }

  async handle({ data }) {
    const { deliveryman, product, delivery } = data;

    await Mail.sendMail({
      to: `${deliveryman.name} <${deliveryman.email}>`,
      subject: `O produto ${product} já está disponível para retirada.`,
      template: 'confirmation',
      context: {
        deliveryman: deliveryman.name,
        product,
        started: format(
          parseISO(delivery.createdAt),
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

export default new DeliveryConfirmationMail();
