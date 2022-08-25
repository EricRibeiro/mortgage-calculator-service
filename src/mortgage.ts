import { calcEffectiveRate, calcMonthlyRate } from "./interestRate";
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
  const principal = propertyPrice - downPayment;

  const effectiveRate = calcEffectiveRate(interestRate, compoundingFrequency);
  const monthlyRate = calcMonthlyRate(effectiveRate);
  const monthlyPayment = calcMonthlyPayment(monthlyRate, principal, amortization)
  const paymentPerSchedule = calcPaymentPerSchedule(paymentSchedule, monthlyPayment);
  
  const paymentPerScheduleFormatted = Number.parseFloat(paymentPerSchedule.toFixed(2));
  return paymentPerScheduleFormatted;
}

function calcMonthlyPayment(monthlyRate: number, principalLoanAmount: number, amortization: number): number {
    // Formula from: https://www.bankrate.com/mortgages/mortgage-calculator/#how-mortgage-calculator-help
    const amortizationInMonths = amortization * 12;
    const numerator = monthlyRate * principalLoanAmount
    const denominator = 1 - Math.pow(1 + monthlyRate, -amortizationInMonths);
    const monthlyPayment = numerator / denominator;
    return monthlyPayment;
}

function calcPaymentPerSchedule(paymentSchedule: string, monthlyPayment: number): number {
  // Annualize the payments and divide it by the number of payments per year
  if (paymentSchedule === "bi-weekly") return (monthlyPayment * 12) / 26;
  if (paymentSchedule === "monthly") return monthlyPayment;
  if (paymentSchedule === "accelerated-bi-weekly") return monthlyPayment / 2;
  throw new Error("Invalid payment schedule");
} 

export function calcMinimumDownPayment(propertyPrice: number): number {
  // Data from: https://www.canada.ca/en/financial-consumer-agency/services/mortgages/down-payment.html
  // 5% of the purchase price
  if (propertyPrice <= 500000) 
    return propertyPrice * 0.05;

  // 5% of the first $500,000 of the purchase price
  // 10% for the portion of the purchase price above $500,000
  else if (propertyPrice > 500000 && propertyPrice <= 999999) 
    return  25000 + ((propertyPrice - 500000) * 0.1);

  // 20% of the purchase price
  else 
    return  propertyPrice * 0.2;
}