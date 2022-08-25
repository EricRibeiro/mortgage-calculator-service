import { TestParameters } from "./types";
import { validate } from "./validator";

const defaultValues: TestParameters = {
  propertyPrice: 600000,
  downPayment: 200000,
  nominalInterestRate: 4,
  amortization: 25,
  paymentSchedule: "monthly" 
}

describe("Tests if an error is returned when the parameter is null, undefined, NaN and below or equal zero", () => {
  const parameters = [ "propertyPrice", "downPayment", "nominalInterestRate", "amortization" ];

  const testData = parameters.reduce((acc, curr) => { 
    return acc.concat([
      {parameter: `${curr}`, value: 0, expected: `The ${curr} must be a number greater than 0 but "0" was received instead.`},
      {parameter: `${curr}`, value: -1, expected: `The ${curr} must be a number greater than 0 but "-1" was received instead.`},
      {parameter: `${curr}`, value: null, expected: `The ${curr} must be a number greater than 0 but "null" was received instead.`},
      {parameter: `${curr}`, value: undefined, expected: `The ${curr} must be a number greater than 0 but "undefined" was received instead.`},
      {parameter: `${curr}`, value: "potato", expected: `The ${curr} must be a number greater than 0 but "potato" was received instead.`},
    ]);
  }, new Array<any>());

  test.each(testData)('should return error if $parameter is set to $value', ({parameter, value, expected}) => {
    const testParameters = Object.entries(defaultValues).reduce((acc, [key, val]) => {
      acc[key] = (key === parameter) ? value : val;
      return acc;
    }, {} as TestParameters);

    const { propertyPrice, downPayment, nominalInterestRate, amortization, paymentSchedule} = testParameters;

    const errors = validate(propertyPrice, downPayment, nominalInterestRate, amortization, paymentSchedule);
    expect(errors.length).toBe(1);

    const errorInfo = JSON.parse(errors[0].message).information;
    expect(errorInfo).toBe(expected);
  });
});

describe("Tests if the down payment parameter is validated correctly", () => {
  it("should return error if down payment is below the minimum", () => {
    const { propertyPrice, nominalInterestRate, amortization, paymentSchedule} = defaultValues;
    const downPayment = 500;

    const errors = validate(propertyPrice, downPayment as any, nominalInterestRate, amortization, paymentSchedule);
    expect(errors.length).toBe(1);

    const errorInfo = JSON.parse(errors[0].message).information;
    expect(errorInfo).toBe(`With a property price of "${propertyPrice}", the down payment must be at least 35000. "${downPayment}" was received instead.`);
  });
});
