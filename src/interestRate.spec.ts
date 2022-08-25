import { calcEffectiveRate, calcMonthlyRate } from "./interestRate";

describe("Tests if the effective interest rate is calculated correctly", () => {
  it("should calculate the effective rate based on the nominal rate and compounding frequency", () => {
    const nominalInterestRate = 2.34;
    const compoundingFrequency = 2;
    const effectiveRate = calcEffectiveRate(nominalInterestRate, compoundingFrequency);

    expect(effectiveRate).toBe(0.023536890000000144);
  });
});

describe("Tests if the periodic interest rate is calculated correctly", () => {
  it("should calculate the monthly rate based on effective rate", () => {
    const nominalInterestRate = 2.34;
    const compoundingFrequency = 2;

    const effectiveRate = calcEffectiveRate(nominalInterestRate, compoundingFrequency);
    const periodicRate = calcMonthlyRate(effectiveRate);

    expect(periodicRate).toBe(0.0019405611613942941);
  });
});