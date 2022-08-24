import { calcEffectiveInterestRate, calcPeriodicInterestRate, resolvePaymentRate } from "./interestRate";

describe("Tests if the effective interest rate is calculated correctly", () => {
  it("should calculate the effective rate based on the nominal rate and compounding frequency", () => {
    const nominalInterestRate = 2.34;
    const compoundingFrequency = 2;
    const effectiveRate = calcEffectiveInterestRate(nominalInterestRate, compoundingFrequency);

    expect(effectiveRate).toBe(0.023536890000000144);
  });
});

describe("Tests if the periodic interest rate is calculated correctly", () => {
  it("should calculate the monthly rate based on effective rate", () => {
    const nominalInterestRate = 2.34;
    const compoundingFrequency = 2;
    const paymentSchedule = 'monthly';

    const paymentRate = resolvePaymentRate(paymentSchedule);
    const effectiveRate = calcEffectiveInterestRate(nominalInterestRate, compoundingFrequency);
    const periodicRate = calcPeriodicInterestRate(effectiveRate, paymentRate);

    expect(periodicRate).toBe(0.0019405611613942941);
  });
});

describe("Tests if the payment rate is resolved correctly", () => {
  it("should calculate the payment rate based on monthly payment schedule", () => {
    const paymentSchedule = 'monthly';
    const paymentRate = resolvePaymentRate(paymentSchedule);

    expect(paymentRate).toBe(0.08333333333333333);
  });

  it("should calculate the payment rate based on bi-weekly payment schedule", () => {
    const paymentSchedule = 'bi-weekly';
    const paymentRate = resolvePaymentRate(paymentSchedule);

    expect(paymentRate).toBe(0.038461538461538464);
  });

  it("should calculate the payment rate based on accelerated bi-weekly payment schedule", () => {
    const paymentSchedule = 'accelerated-bi-weekly';
    const paymentRate = resolvePaymentRate(paymentSchedule);

    expect(paymentRate).toBe(0.08333333333333333);
  });
});