<p align="center">
<img alt="FastFeet" src="logo/fastfeet-api.png" />
</p>

<h1 align="center">Routes from FastFeet API</h1>

<p align="center">
  <img alt="GitHub language count" src="https://img.shields.io/github/languages/count/LeuAlmeida/fastfeet.api?color=%2304D361">

  <a href="https://leunardo.dev">
    <img alt="Made by Léu Almeida" src="https://img.shields.io/badge/made%20by-Léu%20Almeida-%2304D361">
  </a>

  <img alt="License" src="https://img.shields.io/badge/license-MIT-%2304D361">
  <a href="https://www.codacy.com/manual/LeuALmeida/fastfeet.api?utm_source=github.com&amp;utm_medium=referral&amp;utm_content=leua-meida/fastfeet.api&amp;utm_campaign=Badge_Grade"><img src="https://api.codacy.com/project/badge/Grade/147d0b2836734c79b7ee5ea035f065b4"/></a>
</p>

## No secure routes

**POST /login**

Body params *(Login session)*

```json
{
	"email": "admin@fastfeet.com",
	"password": "123456"
}
```

**GET /deliveryman/:id/deliveries**

Query params:

```json
end = true // will list all ended deliveries
// or empty to list all deliveries (ended or not)
```

**PUT /deliveryman/:id/deliveries**

Query params *(Finish delivery)*:

```json
deliveryId = 1
end_date = 2020-01-29T18:16:00.000Z
```

Multipart form *(Finish delivery)*:

```json
file = // upload file image
```

**PUT /deliveryman/:id/deliveries**

Body params *(Start delivery)*:

```json
{
	"start_date": "2020-01-31T18:00:00.000Z"
}
```

Query param *(Start delivery)*:

```json
deliveryId = 1
```

**POST /delivery/:id/problems**

Body params *(Register a problem)*

```json
{
	"description": "Destinatário ausente"
}
```

## Secure routes

// Upload file route
routes.post('/files', upload.single('file'), FileController.store);

// Admin user routes
routes.post('/users', UserController.store);
routes.get('/users', UserController.index);
routes.put('/users/:id', UserController.update);
routes.delete('/users/:id', UserController.delete);

// Recipients routes
routes.post('/recipients', RecipientController.store);
routes.get('/recipients', RecipientController.index);
routes.put('/recipients/:id', RecipientController.update);
routes.delete('/recipients/:id', RecipientController.delete);

// Deliveryman routes
routes.post('/deliveryman', DeliverymanController.store);
routes.get('/deliveryman', DeliverymanController.index);
routes.put('/deliveryman/:id', DeliverymanController.update);
routes.delete('/deliveryman/:id', DeliverymanController.delete);

// Delivery routes
routes.post('/delivery', DeliveryController.store);
routes.get('/delivery', DeliveryController.index);
routes.put('/delivery/:id', DeliveryController.update);
routes.delete('/delivery/:id', DeliveryController.delete);

// Delivery problems routes
routes.get('/delivery/problems', DeliveryProblemController.index);
routes.get('/delivery/:id/problems', DeliveryProblemController.index);
routes.put('/delivery/problems/:id', DeliveryProblemController.update);
routes.delete('/delivery/problems/:id', DeliveryProblemController.delete);

// Cancel delivery based in a problem
routes.post('/problems/:id/cancel-delivery', DeliveryStatusController.store);

export default routes;
