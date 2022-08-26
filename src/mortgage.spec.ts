import { calculate, calcMinimumDownPayment } from "./mortgage";
import { Parameters } from "./types";

// The following calculators are used for validation: 
// https://itools-ioutils.fcac-acfc.gc.ca/MC-CH/MCCalc-CHCalc-eng.aspx
// https://www.mortgagecalculator.org/calcs/canadian.php
// Values won't match exactly because of rounding errors

const defaultValues: Parameters = {
  propertyPrice: 600000,
  downPayment: 200000,
  nominalInterestRate: 4,
  amortization: 25,
  paymentSchedule: "monthly" 
}

describe("Tests if the minimum down payment is calculated correctly", () => {
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
    const { propertyPrice, downPayment, nominalInterestRate, amortization, paymentSchedule} = defaultValues;
    const payment = calculate(propertyPrice, downPayment, nominalInterestRate, amortization, paymentSchedule);
    expect(payment).toBe(2104.08);
  });

  it("should calculate payments over a bi-weekly schedule", () => {
    const { propertyPrice, downPayment, nominalInterestRate, amortization } = defaultValues;
    const paymentSchedule = 'bi-weekly';

    const payment = calculate(propertyPrice, downPayment, nominalInterestRate, amortization, paymentSchedule);
    expect(payment).toBe(970.25);
  });

  it("should calculate payments over an accelerated bi-weekly schedule", () => {
    const { propertyPrice, downPayment, nominalInterestRate, amortization } = defaultValues;
    const paymentSchedule = 'accelerated-bi-weekly';

    const payment = calculate(propertyPrice, downPayment, nominalInterestRate, amortization, paymentSchedule);
    expect(payment).toBe(1051.17);
  });
});