export function calcEffectiveInterestRate(nominalInterestRate: number, compoundingFrequency: number): number {
  // Formula from: https://www.mikesukmanowsky.com/blog/a-guide-to-canadian-mortgage-calculations
  const base = 1 + ((nominalInterestRate / 100) / compoundingFrequency);
  const exponent = compoundingFrequency;
  const effectiveInterestRate = Math.pow(base, exponent) - 1;

  return effectiveInterestRate;
}

export function calcPeriodicInterestRate(effectiveInterestRate: number, paymentFrequency: number): number {
  // Formula from: https://www.mikesukmanowsky.com/blog/a-guide-to-canadian-mortgage-calculations
  const base = 1 + effectiveInterestRate;
  const exponent = paymentFrequency;
  const monthlyInterestRate = Math.pow(base, exponent) - 1;

  return monthlyInterestRate;
}

export function resolvePaymentRate(paymentSchedule: string) : number {
  switch (paymentSchedule.toLowerCase()) {
    case "monthly":
      return 1/12;
    case "bi-weekly":
      // In the bi-weekly schedule, 26 payments are made in a year
      // This is expressed in the formula as 365/26. However, this is a periodic fraction.
      // Some will approximate it to 14. And some will use the fraction as I'm using.
      // Meaning that the result can be different from other calculators.
      // The government's calculator yield a different result: https://itools-ioutils.fcac-acfc.gc.ca/MC-CH/MCCalc-CHCalc-eng.aspx
      // While "mortgagecalculator.org" yields the same: https://www.mortgagecalculator.org/calcs/canadian.php
      return (365/26)/365;
    case "accelerated-bi-weekly":
      return 1/12;
    default:
      throw new Error(JSON.stringify({
        message: "The payment schedule is invalid.",
        information: `The payment schedule must be one of the following: monthly, bi-weekly, accelerated-bi-weekly`,
        code: 400
      }));
  }
}