import { Handler } from 'aws-lambda';
import { calculate } from './src/mortgage';

export const main: Handler = (event: any) => {
  let response: { statusCode: number; body: string; };

  if (event.requestContext.http.method === 'POST') {
    const { propertyPrice, downPayment, nominalInterestRate, amortization, paymentSchedule } = JSON.parse(event.body);
    const mortgage = calculate(propertyPrice, downPayment, nominalInterestRate, amortization, paymentSchedule);
    
    const message = (typeof mortgage === 'number')
      ? mortgage as number
      : (mortgage as Error[]).map(error => JSON.parse(error.message));

    response = {
      statusCode: (typeof mortgage === 'number') ? 200 : 400,
      body: JSON.stringify(message),
    };

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