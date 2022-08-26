export function calcEffectiveRate(nominalInterestRate: number, compoundingFrequency: number): number {
  // Formula from: https://www.mikesukmanowsky.com/blog/a-guide-to-canadian-mortgage-calculations
  const base = 1 + ((nominalInterestRate / 100) / compoundingFrequency);
  const exponent = compoundingFrequency;
  const effectiveRate = Math.pow(base, exponent) - 1;
  return effectiveRate;
}

export function calcPeriodicRate(effectiveRate: number, numberPaymentsInYear: number): number {
  // Formula from: https://www.mikesukmanowsky.com/blog/a-guide-to-canadian-mortgage-calculations
  const base = 1 + effectiveRate;
  const exponent = 1 / numberPaymentsInYear;
  const periodicRate = Math.pow(base, exponent) - 1;
  return periodicRate;
}