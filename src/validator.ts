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

  if (!propertyPrice || !isNumberAndGreaterThanZero(propertyPrice))
    errors.push(getNumericalError("propertyPrice", propertyPrice));
  
  if (!nominalInterestRate || !isNumberAndGreaterThanZero(nominalInterestRate))
    errors.push(getNumericalError("nominalInterestRate", nominalInterestRate));
    
  return errors;
}

function validateDownPayment(downPayment: number, propertyPrice: number): Error[] {
  const minimumDownPayment = calcMinimumDownPayment(propertyPrice);
  const isValid = downPayment && isNumberAndGreaterThanZero(downPayment);
  const errors: Error[] = [];

  if (!isValid) errors.push(getNumericalError("downPayment", downPayment));

  if (isValid && downPayment < minimumDownPayment) {
    const minimumDownPaymentError = getError(
      "The downPayment is below the minimum required.",
      `With a property price of "${propertyPrice}", the down payment must be at least ${minimumDownPayment}. "${downPayment}" was received instead.`
    )

    errors.push(minimumDownPaymentError);
  }
  
  return errors;
}

function validateAmortization(amortization: number): Error[] {
  const amortizations = [5, 10, 15, 20, 25, 30];
  const isValid = amortization && isNumberAndGreaterThanZero(amortization);
  const errors: Error[] = [];

  if (!isValid) errors.push(getNumericalError("amortization", amortization));

  if (isValid && !amortizations.includes(amortization)) {
    const invalidAmortizationError = getError(
      "The amortization is invalid.",
      `The amortization must be one of the following: ${amortizations.join(", ")} but "${amortization}" was received instead.`
    )

    errors.push(invalidAmortizationError);
  }
  
  return errors;
}

function validatePaymentSchedule(paymentSchedule: string): Error[] {
  const schedules = ['accelerated-bi-weekly', 'bi-weekly', 'monthly'];
  const isValid = paymentSchedule && typeof paymentSchedule === "string";
  const errors: Error[] = [];

  if (!isValid) {
    const invalidFormatError = getError(
      "The paymentSchedule is invalid.",
      `The paymentSchedule must be a non-null string but "${paymentSchedule}" was received instead.`
    )

    errors.push(invalidFormatError);
  }

  if (isValid && !schedules.includes(paymentSchedule)) {
    const invalidAmortizationError = getError(
      "The paymentSchedule is invalid.", 
      `The paymentSchedule must be one of the following: ${schedules.join(", ")}. "${paymentSchedule}" was received instead.`
    );

    errors.push(invalidAmortizationError);
  }
  
  return errors;
}

function getNumericalError(propName: string, value: number): Error {
  const message = `The ${propName} is invalid.`;
  const information = `The ${propName} must be a number greater than 0 but "${value}" was received instead.`;
  return getError(message, information)
}

function getError(message: string, information: string): Error {
  return new Error(JSON.stringify({
    message,
    information
  }));
}

function isNumberAndGreaterThanZero(number: number): boolean {
  return !Number.isNaN(number) && number > 0;
}