'use strict';

const AWS = require('aws-sdk');
const uuidv4 = require('uuid/v4');

const dynamoDBClient = new AWS.DynamoDB();

module.exports.crear = async event => {
  const body = JSON.parse(event.body);

  const params = {
    TableName: process.env.dynamoDBPrefix + 'ventas',
    Item: {
      'id': {S: uuidv4()},
      'cliente': {S: body.cliente},
      'total': {N: body.total + ''}
    }
  };

  const request = await dynamoDBClient.putItem(params).promise();
  console.log(request);
  return {
    statusCode: 200,
    body: JSON.stringify(params.Item),
  };
};
