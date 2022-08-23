import { Handler } from 'aws-lambda';

export const calculate: any = () => {
  return 1;
}

export const main: Handler = (event: any) => {
  const response = {
    statusCode: 200,
    body: JSON.stringify(
      {
        message: `Hello World! Your result is ${calculate()}`,
        input: event,
      },
      null,
      2
    ),
  };

  return new Promise((resolve) => {
    resolve(response)
  })
}