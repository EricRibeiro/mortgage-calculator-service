import { calcMinimumDownPayment } from "./mortgage";

export function validate(
  propertyPrice: number,
  downPayment: number,
  nominalInterestRate: number,
  amortization: number,
  paymentSchedule: string
): Error[] {

  const errors: Error[] = [];

  const downPaymentErrors = validateDownPayment(downPayment, propertyPrice);
  const amortizationErrors = validateAmortization(amortization);
  const paymentScheduleErrors = validatePaymentSchedule(paymentSchedule);

  if (downPaymentErrors.length > 0) errors.push(...downPaymentErrors);
  if (amortizationErrors.length > 0) errors.push(...amortizationErrors);
  if (paymentScheduleErrors.length > 0) errors.push(...paymentScheduleErrors);

  if (!propertyPrice || !isNumberAndGreaterThanZero(propertyPrice)) {
    const propertyPriceError = new Error(JSON.stringify({
      message: "The propertyPrice is invalid.",
      information: `The propertyPrice must be a number greater than 0 but ${propertyPrice} was received instead.`,
      code: 400
    }));

    errors.push(propertyPriceError);
  }
  
  if (!nominalInterestRate || !isNumberAndGreaterThanZero(nominalInterestRate)) {
    const interestRateError = new Error(JSON.stringify({
      message: "The nominalInterestRate is invalid.",
      information: `The nominalInterestRate must be a number greater than 0 but ${nominalInterestRate} was received instead.`,
      code: 400
    }));

    errors.push(interestRateError);
  }
    
  return errors;
}

function isNumberAndGreaterThanZero(number: number): boolean {
  return !Number.isNaN(number) && number > 0;
}

function validateDownPayment(downPayment: number, propertyPrice: number): Error[] {
  const minimumDownPayment = calcMinimumDownPayment(propertyPrice);
  const isValid = downPayment && isNumberAndGreaterThanZero(downPayment);
  const errors: Error[] = [];

  if (!isValid) {
    const invalidNumberError = new Error(JSON.stringify({
      message: "The downPayment received is invalid.",
      information: `The downPayment must be a number greater than 0 but ${downPayment} was received instead.`,
      code: 400
    }));

    errors.push(invalidNumberError);
  }

  if (isValid && downPayment < minimumDownPayment) {
    const minimumDownPaymentError = new Error(JSON.stringify({
      message: "The downPayment received is below the minimum required.",
      information: `For the property price of ${propertyPrice}, the down payment must be equal or above ${minimumDownPayment}. The value received was ${downPayment}.`,
      code: 400
    }));

    errors.push(minimumDownPaymentError);
  }
  
  return errors;
}

function validateAmortization(amortization: number): Error[] {
  const amortizations = [5, 10, 15, 20, 25, 30];
  const isValid = amortization && isNumberAndGreaterThanZero(amortization);
  const errors: Error[] = [];

  if (!isValid) {
    const invalidNumberError = new Error(JSON.stringify({
      message: "The amortization received is invalid.",
      information: `The amortization must be a number greater than 0 but ${amortization} was received instead.`,
      code: 400
    }));

    errors.push(invalidNumberError);
  }

  if (isValid && !amortizations.includes(amortization)) {
    const invalidAmortizationError = new Error(JSON.stringify({
      message: "The amortization received is invalid.",
      information: `The amortization value must be one of the following: ${amortizations.join(", ")}`,
      code: 400
    }));

    errors.push(invalidAmortizationError);
  }
  
  return errors;
}

function validatePaymentSchedule(paymentSchedule: string): Error[] {
  const schedules = ['accelerated-bi-weekly', 'bi-weekly', 'monthly'];
  const isValid = paymentSchedule && typeof paymentSchedule === "string";
  const errors: Error[] = [];

  if (!isValid) {
    const invalidFormatError = new Error(JSON.stringify({
      message: "The payment schedule received is invalid.",
      information: `The payment schedule must be a non-null string but ${paymentSchedule} was received instead.`,
      code: 400
    }));

    errors.push(invalidFormatError);
  }

  if (isValid && !schedules.includes(paymentSchedule)) {
    const invalidAmortizationError = new Error(JSON.stringify({
      message: "The payment schedule received is invalid.",
      information: `The payment schedule value must be one of the following: ${schedules.join(", ")}`,
      code: 400
    }));

    errors.push(invalidAmortizationError);
  }
  
  return errors;
}
