import { 
  calcEffectiveInterestRate,
  calcPeriodicInterestRate, 
  resolvePaymentRate
} from "./interestRate";
import { validate } from "./validator";

export function calculate(
  propertyPrice: number,
  downPayment: number,
  interestRate: number,
  amortization: number,
  paymentSchedule: string
): number | Error[] {
  
  const errors = validate(propertyPrice, downPayment, interestRate, amortization, paymentSchedule);
  if (errors.length > 0) return errors;
  
  const compoundingFrequency = 2;
  const principalLoanAmount = propertyPrice - downPayment;
  const numberOfPayments = paymentSchedule === "bi-weekly" ? amortization * 26 : amortization * 12;

  const paymentRate = resolvePaymentRate(paymentSchedule);
  const effectiveInterestRate = calcEffectiveInterestRate(interestRate, compoundingFrequency);
  const periodicInterestRate = calcPeriodicInterestRate(effectiveInterestRate, paymentRate);

  const paymentPerSchedule = paymentSchedule === "accelerated-bi-weekly" 
    ? calcPaymentPerSchedule(periodicInterestRate, numberOfPayments, principalLoanAmount) / 2
    : calcPaymentPerSchedule(periodicInterestRate, numberOfPayments, principalLoanAmount)
  
  const paymentPerScheduleFormatted = Number.parseFloat(paymentPerSchedule.toFixed(2));
  return paymentPerScheduleFormatted;
}

export function calcPaymentPerSchedule(periodicInterestRate: number, numberOfPayments: number, principalLoanAmount: number): number {
    // Formula from: https://www.bankrate.com/mortgages/mortgage-calculator/#how-mortgage-calculator-help
    const numerator = periodicInterestRate * Math.pow(1 + periodicInterestRate, numberOfPayments);
    const denominator = Math.pow(1 + periodicInterestRate, numberOfPayments) - 1;
    const paymentPerSchedule = (principalLoanAmount * numerator) / denominator;

    return paymentPerSchedule;
}

export function calcMinimumDownPayment(propertyPrice: number): number {
  // Data from: https://www.canada.ca/en/financial-consumer-agency/services/mortgages/down-payment.html
  let minimumDownPayment = 0;

  // 5% of the purchase price
  if (propertyPrice <= 500000) 
    minimumDownPayment = propertyPrice * 0.05;

  // 5% of the first $500,000 of the purchase price
  // 10% for the portion of the purchase price above $500,000
  else if (propertyPrice > 500000 && propertyPrice <= 999999) 
    minimumDownPayment = 25000 + ((propertyPrice - 500000) * 0.1);

  // 20% of the purchase price
  else 
    minimumDownPayment = propertyPrice * 0.2;
  
  return minimumDownPayment;
}