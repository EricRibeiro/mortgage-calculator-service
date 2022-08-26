import { Handler } from 'aws-lambda';
import { calculate } from './src/mortgage';
import { validate } from './src/validator';
import { Parameters } from "./src/types";
export const main: Handler = (event: any) => {
  let response: { statusCode: number; body: any; };

  if (event.requestContext.http.method === 'POST') {
    const payload: Parameters = event.body ? JSON.parse(event.body) : {};
    const { propertyPrice, downPayment, nominalInterestRate, amortization, paymentSchedule } = payload;
    const errors = validate(propertyPrice, downPayment, nominalInterestRate, amortization, paymentSchedule);
    
    response = (errors.length > 0)
      ? { statusCode: 400, body: JSON.stringify(errors.map(error => JSON.parse(error.message))) }
      : { statusCode: 200, body: JSON.stringify(calculate(propertyPrice, downPayment, nominalInterestRate, amortization, paymentSchedule)) }
    
  } else if (event.requestContext.http.method === 'GET') {
    response = {
      statusCode: 200,
      body: JSON.stringify({ message: `Hello World!`, input: event }, null, 2),
    };

  } else {
    response = {
      statusCode: 405,
      body: JSON.stringify({ message: `Method not allowed`, input: event }, null, 2),
    };
  }

  return new Promise((resolve) => {
    resolve(response)
  })
}