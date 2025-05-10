const AWS = require('aws-sdk');
const dynamoDB = new AWS.DynamoDB.DocumentClient();
const tableName = 'OrdersTable';

// Crear pedido
module.exports.createItem = async (event) => {
  const data = JSON.parse(event.body);
  const params = {
    TableName: tableName,
    Item: {
      id: data.id,
      customer_name: data.customer_name,
      product_id: data.product_id,
      quantity: data.quantity,
      total_price: data.total_price,
      status: data.status,
      order_date: data.order_date,
    },
  };
  await dynamoDB.put(params).promise();
  return {
    statusCode: 200,
    body: JSON.stringify({ message: 'Pedido creado exitosamente' }),
  };
};

// Obtener todos los pedidos
module.exports.getItems = async () => {
  const params = { TableName: tableName };
  const result = await dynamoDB.scan(params).promise();
  return {
    statusCode: 200,
    body: JSON.stringify(result.Items),
  };
};

// Obtener un pedido por ID
module.exports.getItem = async (event) => {
  const id = event.pathParameters.id;
  const params = { TableName: tableName, Key: { id } };
  const result = await dynamoDB.get(params).promise();
  return {
    statusCode: 200,
    body: JSON.stringify(result.Item),
  };
};

// Actualizar un pedido
module.exports.updateItem = async (event) => {
  const id = event.pathParameters.id;
  const data = JSON.parse(event.body);

  const params = {
    TableName: tableName,
    Key: { id },
    UpdateExpression: `set customer_name = :customer_name, product_id = :product_id, quantity = :quantity, total_price = :total_price, #st = :status, order_date = :order_date`,
    ExpressionAttributeNames: { "#st": "status" },
    ExpressionAttributeValues: {
      ":customer_name": data.customer_name,
      ":product_id": data.product_id,
      ":quantity": data.quantity,
      ":total_price": data.total_price,
      ":status": data.status,
      ":order_date": data.order_date,
    },
    ReturnValues: "UPDATED_NEW",
  };

  await dynamoDB.update(params).promise();
  return {
    statusCode: 200,
    body: JSON.stringify({ message: "Pedido actualizado exitosamente" }),
  };
};

// Eliminar un pedido
module.exports.deleteItem = async (event) => {
  const id = event.pathParameters.id;
  const params = { TableName: tableName, Key: { id } };
  await dynamoDB.delete(params).promise();
  return {
    statusCode: 200,
    body: JSON.stringify({ message: "Pedido eliminado exitosamente" }),
  };
};
