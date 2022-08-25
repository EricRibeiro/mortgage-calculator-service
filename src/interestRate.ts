export function calcEffectiveRate(nominalInterestRate: number, compoundingFrequency: number): number {
  // Formula from: https://www.mikesukmanowsky.com/blog/a-guide-to-canadian-mortgage-calculations
  const base = 1 + ((nominalInterestRate / 100) / compoundingFrequency);
  const exponent = compoundingFrequency;
  const effectiveInterestRate = Math.pow(base, exponent) - 1;
  return effectiveInterestRate;
}

export function calcMonthlyRate(effectiveInterestRate: number): number {
  // Formula from: https://www.mikesukmanowsky.com/blog/a-guide-to-canadian-mortgage-calculations
  const base = 1 + effectiveInterestRate;
  const exponent = 1/12;
  const monthlyInterestRate = Math.pow(base, exponent) - 1;
  return monthlyInterestRate;
}