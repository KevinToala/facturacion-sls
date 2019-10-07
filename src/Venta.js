'use strict';

const AWS = require('aws-sdk');
const uuidv4 = require('uuid/v4');

const dynamoDBClient = new AWS.DynamoDB();
const snsClient = new AWS.SNS();

module.exports.crear = async event => {
  const body = JSON.parse(event.body);

  const venta = {
    id: uuidv4(),
    cliente: body.cliente,
    total: Number(body.total)
  };

  await guardarVenta(venta);
  await publicarVenta(venta);

  return {
    statusCode: 200,
    body: JSON.stringify(venta),
  };
};

async function guardarVenta(venta) {
  const dynamoDBParams = {
    TableName: process.env.dynamoDBPrefix + 'ventas',
    Item: {
      'id': {S: venta.id},
      'cliente': {S: venta.cliente},
      'total': {N: venta.total + ''}
    }
  };

  await dynamoDBClient.putItem(dynamoDBParams).promise();
}

async function publicarVenta(venta) {
  const snsParams = {
    TopicArn: process.env.snsARN,
    Message: JSON.stringify(venta)
  };

  await snsClient.publish(snsParams).promise();
}
