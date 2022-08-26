import { calcEffectiveRate, calcPeriodicRate } from "./interestRate";

export function calculate(
  propertyPrice: number,
  downPayment: number,
  interestRate: number,
  amortization: number,
  paymentSchedule: string
): number | Error[] {  
  const compoundingFrequency = 2;
  const principal = propertyPrice - downPayment;
  const numberPaymentsInYear = resolveNumberPaymentsInYear(paymentSchedule);
  const totalNumberPayments = amortization * numberPaymentsInYear;

  const effectiveRate = calcEffectiveRate(interestRate, compoundingFrequency);
  const periodicRate = calcPeriodicRate(effectiveRate, numberPaymentsInYear);
  const paymentPerSchedule = calcPeriodicPayment(periodicRate, principal, totalNumberPayments)
  
  const paymentPerScheduleFormatted = Number.parseFloat(paymentPerSchedule.toFixed(2));
  return paymentPerScheduleFormatted;
}

function calcPeriodicPayment(periodicRate: number, principal: number, numberPayments: number): number {
  // Formula from: https://www.bankrate.com/mortgages/mortgage-calculator/#how-mortgage-calculator-help
  const numerator = periodicRate * Math.pow(1 + periodicRate, numberPayments);
  const denominator = Math.pow(1 + periodicRate, numberPayments) - 1;
  const periodicPayments = principal * (numerator / denominator);
  return periodicPayments;
}

function resolveNumberPaymentsInYear(paymentSchedule: string): number {
  if (paymentSchedule === "bi-weekly") return 26;
  if (paymentSchedule === "monthly") return 12;
  if (paymentSchedule === "accelerated-bi-weekly") return 24;
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
    return 25000 + ((propertyPrice - 500000) * 0.1);

  // 20% of the purchase price
  else 
    return propertyPrice * 0.2;
}
