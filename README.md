# Canadian Mortgage Calculator

Have you ever wanted a lightweight service to calculate fixed-rate mortgages in Canada but couldn't
find a decent one? Well, me neither but still, where is the learning in using stuff that
already exists 🤷.

In this project, I'm making the calculator available via a simple HTTP API with Node.js and Typescript running on AWS Lambda and API Gateway using the Serverless Framework v3. All these goods add up to a lightweight, maintainable and easily deployable solution. 

I'm using CircleCI for all CI/CD-related matters. They have orbs for Serverless and AWS, which significantly reduces my set-up overhead. I also happen to like their tool, but of course, I'm a little biased.

## Is math related to science?

I don't know, but I had to use a lot of it. I found out throughout this exercise that banks are not fond of transparency. The interest rate they give us is called a `nominal interest rate`, and it's nominal because it doesn't incorporate compounding. Which, in Canada, happens twice a year. The result is that the `monthly rate` is always a bit higher.

Since calculating the interest rate is a hurdle, I broke down the code into [interest rate](src/interestRate.ts) and [mortgage](src/mortgage.ts)-specific files. They contain all functions necessary to perform their respective responsibilities. I linked the sources of all formulas throughout the source code.

I'm writing tests and validating my outputs with the following calculators:

 - https://itools-ioutils.fcac-acfc.gc.ca/MC-CH/MCCalc-CHCalc-eng.aspx
 - https://www.mortgagecalculator.org/calcs/canadian.php

## Running the service

You can run this project in three different ways. Spinning up a local server, invoking the function with mock data or deploying to AWS. However you choose, first, you must install the project's dependencies:

```
yarn install
```

### Run locally

To start a local server, run the following command:

```
yarn start
```

After a few seconds, you will see the endpoints listed with the following message below them:

> Server ready: http://localhost:3000 🚀

You are now ready to calculate mortgages to your heart's content.

### Run with mock data

Serverless provides a neat functionality that allows us to invoke the function using mock data. As long as the mock is valid, the function will run exactly how it would in AWS. I am shipping the project with two examples: [error_event.json](mocks/error_event.json) and [success_event.json](mocks/success_event.json).

The `error_event` will simulate a request with invalid parameters. In contrast, `success_event` will simulate the opposite. You can easily modify the parameters by editing the `body` property inside the JSON.

#### Success event
To invoke the event with valid parameters, run:

```
yarn invoke:success
```

For the default parameters inside the JSON, you will get back:

```json
{
    "statusCode": 200,
    "body": "2104.08"
}
```

#### Error event

On the other hand, to invoke with invalid parameters, run:

```
yarn invoke:error
```

You will see:

```json
{
  "statusCode": 400,
  "body": [
    {
      "message": "The amortization is invalid.",
      "information": "The amortization must be a number greater than 0 but \"undefined\" was received instead.",
      "code": 400
    },
    {
      "message": "The payment schedule is invalid.",
      "information": "The payment schedule must be a non-null string but \"undefined\" was received instead.",
      "code": 400
    },
    {
      "message": "The nominalInterestRate is invalid.",
      "information": "The nominalInterestRate must be a number greater than 0 but \"undefined\" was received instead.",
      "code": 400
    }
  ]
}
```

This is the quickest way to test changes as it doesn't require a full-fledged server to run.

### Run on AWS

Before deploying to AWS you must make sure you have valid `config` and `credentials` files in `~/.aws`. Head to AWS CLI's [documentation](https://docs.aws.amazon.com/cli/latest/userguide/cli-configure-files.html) for more information. Since Serverless relies on CloudFormation, S3, CloudWatch and several other resources to deploy the service, you also need your credential to have proper IAM permissions. You can read more about it [here](https://www.serverless.com/framework/docs/providers/aws/guide/iam).

With everything set up, run the following command to deploy the service to AWS:

```
yarn deploy
```

After a few seconds, you will see a message similar to:

```
endpoints:
  GET - https://kna1be06m5.execute-api.us-west-1.amazonaws.com/mortgage
  POST - https://kna1be06m5.execute-api.us-west-1.amazonaws.com/mortgage
functions:
  handler: mortgage-calculator-dev-handler (49 kB)
```

And now you can calculate fixed-rate mortgages from anywhere 🚀

## Usage

The service supports `POST` and `GET` on the `/mortgage` endpoint. The latter exists for health checking purposes and holds no functional value. The former requires a valid request body to return your mortgage's payment based on the payment schedule. The following parameters constitute a valid payload:

#### propertyPrice

The value of the property you bought or are looking to buy.

- Required: `true`
- Type: `number`
- Example: `600000`

#### downPayment

The up-front partial payment for the purchase of the property. Notice, however, that the down payment should obey [Canada's law](https://www.canada.ca/en/financial-consumer-agency/services/mortgages/down-payment.html). Otherwise, the request will fail.

- Required: `true`
- Type: `number`
- Example: `200000`

#### nominalInterestRate

The interest rate "as stated" without adjustment for the full effect of compounding. In most cases, this will be the value given out by your lender.

- Required: `true`
- Type: `number`
- Example: `3.85`

#### amortization

The total length of time you plan to pay off your mortgage. Valid parameters are all the multiples of 5 between `5` and `30`. Both included.

- Required: `true`
- Type: `number`
- Example: `25`

#### paymentSchedule

The dates at which payments are made. Valid parameters are `monthly`, `bi-weekly` and `accelerated-bi-weekly`.

- Required: `true`
- Type: `string`
- Example: `"accelerated-bi-weekly"`

### Examples:

You will find below examples of requests with valid parameters. Remember to change the URL to match your local server port or Lambda's URL when you run them.

Using `cURL`:

```sh
  curl \
    -d '{"propertyPrice": 600000, "downPayment": 200000, "nominalInterestRate": 4, "amortization": 25, "paymentSchedule": "monthly"}' \
    -H "Content-Type: application/json" \
    -X POST \
    http://localhost:3000/mortgage

```

Using `fetch`:

```javascript
fetch('http://localhost:3000/mortgage', {
  method: 'POST',
  body: JSON.stringify({
    propertyPrice: 600000,
    downPayment: 200000,
    nominalInterestRate: 4,
    amortization: 25,
    paymentSchedule: "monthly" 
  }),
  headers: {
    'Content-type': 'application/json; charset=UTF-8'
  }
})
.then(res => res.json())
.then(console.log)
```

If you have any questions or suggestions, please open an [issue](https://github.com/EricRibeiro/mortgage-calculator-service/issues) or [pull request](https://github.com/EricRibeiro/mortgage-calculator-service/pulls) ❤️
