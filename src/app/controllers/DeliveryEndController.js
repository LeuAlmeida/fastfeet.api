import * as Yup from 'yup';

import Delivery from '../models/Delivery';
import Deliveryman from '../models/Deliveryman';
import File from '../models/File';

class DeliveryEndController {
  async update(req, res) {
    const schema = Yup.object().shape({
      start_date: Yup.date(),
      end_date: Yup.date(),
    });

    if (!(await schema.isValid(req.body))) {
      return res.status(400).json({ error: 'Validation fails.' });
    }

    const { deliveryId, deliverymanId } = req.params;

    /**
     * Deliveryman verifier
     */

    const deliveryman = await Deliveryman.findByPk(deliverymanId);

    if (!deliveryman) {
      return res.status(400).json({ error: 'Deliveryman does not found. ' });
    }

    /**
     * Delivery verifier
     */

    const delivery = await Delivery.findByPk(deliveryId);

    if (!delivery) {
      return res.status(400).json({ error: 'Delivery does not found. ' });
    }

    /**
     * Signature verifier if deliveryman try to update with end date
     */

    const { signature_id } = req.body;

    try {
      const signature = await File.findByPk(signature_id);

      if (!signature) {
        return res
          .status(400)
          .json({ error: 'Signature image does not found.' });
      }

      const { product, recipient_id } = await delivery.update({
        end_date: new Date(),
        signature_id,
        status: 'DELIVERED',
      });

      return res.json({
        product,
        recipient_id,
        signature_id,
        end_date: new Date(),
      });
    } catch (err) {
      return res
        .status(401)
        .json({ error: 'Error trying to finish this delivery.' });
    }
  }
}

export default new DeliveryEndController();
