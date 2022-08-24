import { 
  calculate, 
  calcMinimumDownPayment, 
} from "./mortgage";

// The following calculators are used for validation: 
// https://itools-ioutils.fcac-acfc.gc.ca/MC-CH/MCCalc-CHCalc-eng.aspx
// https://www.mortgagecalculator.org/calcs/canadian.php

describe("Tests if the minimum down payment is calculated correctly", () => {
  it("should throw error if down payment is below minimum required", () => {
    const propertyPrice = 600000;
    const downPayment = 10000;
    const nominalInterestRate = 4;
    const amortization = 25;
    const paymentSchedule = 'monthly';
    
    const calcWithInvalidMinimumDownPayment = () => {
      calculate(propertyPrice, downPayment, nominalInterestRate, amortization, paymentSchedule);
    }

    const expectedError = new Error(JSON.stringify({
      message: "The down payment received is below the minimum required.",
      information: "For the property price of $600000, the down payment must be equal or above $35000",
      code: 400
    }));

    expect(calcWithInvalidMinimumDownPayment).toThrowError(expectedError);
  });

  it("should calculate the minimum down payment for property price equal or below $500,000", () => {
    const propertyPrice = 400000;
    const minimumDownPayment = calcMinimumDownPayment(propertyPrice);

    expect(minimumDownPayment).toBe(20000);
  });

  it("should calculate the minimum down payment for property price between $500,001 and $999,999", () => {
    const propertyPrice = 600000;
    const minimumDownPayment = calcMinimumDownPayment(propertyPrice);
    
    expect(minimumDownPayment).toBe(35000);
  });

  it("should calculate the minimum down payment for property price equal or above $1,000,000", () => {
    const propertyPrice = 1200000;
    const minimumDownPayment = calcMinimumDownPayment(propertyPrice);
    
    expect(minimumDownPayment).toBe(240000);
  });
});

describe("Tests if the payment per payment schedule is calculated correctly", () => {
  it("should calculate payments over a monthly schedule", () => {
    const propertyPrice = 600000;
    const downPayment = 200000;
    const nominalInterestRate = 4;
    const amortization = 25;
    const paymentSchedule = 'monthly';

    const payment = calculate(propertyPrice, downPayment, nominalInterestRate, amortization, paymentSchedule);

    expect(payment).toBe(2104.08);
  });

  it("should calculate payments over a bi-weekly schedule", () => {
    const propertyPrice = 600000;
    const downPayment = 200000;
    const nominalInterestRate = 4;
    const amortization = 25;
    const paymentSchedule = 'bi-weekly';

    const payment = calculate(propertyPrice, downPayment, nominalInterestRate, amortization, paymentSchedule);

    expect(payment).toBe(970.25);
  });

  it("should calculate payments over an accelerated bi-weekly schedule", () => {
    const propertyPrice = 600000;
    const downPayment = 200000;
    const nominalInterestRate = 4;
    const amortization = 25;
    const paymentSchedule = 'accelerated-bi-weekly';

    const payment = calculate(propertyPrice, downPayment, nominalInterestRate, amortization, paymentSchedule);

    expect(payment).toBe(1052.04);
  });
});