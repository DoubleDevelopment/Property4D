import { Component, computed, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

type CalculatorMode = 'affordability' | 'refinance' | 'fha';

@Component({
  selector: 'app-calculator',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './calculator.component.html',
  styleUrl: './calculator.component.scss'
})
export class CalculatorComponent {
  mode = signal<CalculatorMode>('affordability');

  annualIncome = 120000;
  monthlyDebts = 600;
  downPayment = 80000;
  interestRate = 6.5;
  termYears = 30;
  annualPropertyTax = 6000;
  annualInsurance = 1800;
  monthlyHoa = 0;
  dtiMax = 0.36;

  currentBalance = 450000;
  currentRate = 7.25;
  remainingYears = 27;
  newRate = 6.25;
  newYears = 30;
  closingCosts = 9000;

  fhaHomePrice = 450000;
  fhaDownPaymentPercent = 3.5;
  fhaInterestRate = 6.5;
  fhaTermYears = 30;
  fhaAnnualMipRate = 0.55;
  fhaUpfrontMipRate = 1.75;
  fhaAnnualPropertyTax = 5400;
  fhaAnnualInsurance = 1800;
  fhaMonthlyHoa = 0;

  affordability = computed(() => {
    const incomeMonthly = this.safe(this.annualIncome) / 12;
    const debtsMonthly = this.safe(this.monthlyDebts);
    const maxPaymentAll = Math.max(0, incomeMonthly * this.safe(this.dtiMax) - debtsMonthly);

    const taxMonthly = this.safe(this.annualPropertyTax) / 12;
    const insMonthly = this.safe(this.annualInsurance) / 12;
    const hoa = this.safe(this.monthlyHoa);

    const maxPI = Math.max(0, maxPaymentAll - taxMonthly - insMonthly - hoa);
    const n = Math.max(1, Math.round(this.safe(this.termYears) * 12));
    const r = this.safe(this.interestRate) / 100 / 12;

    const factor = this.paymentFactor(r, n);
    const maxLoan = factor > 0 ? maxPI / factor : 0;

    const down = this.safe(this.downPayment);
    const maxPrice = Math.max(0, maxLoan + down);

    return {
      maxPaymentAll,
      maxPI,
      maxLoan,
      maxPrice,
      breakdown: {
        taxMonthly,
        insMonthly,
        hoa
      }
    };
  });

  refinance = computed(() => {
    const balance = this.safe(this.currentBalance);
    const currentN = Math.max(1, Math.round(this.safe(this.remainingYears) * 12));
    const currentR = this.safe(this.currentRate) / 100 / 12;
    const currentPayment = this.monthlyPayment(balance, currentR, currentN);

    const newN = Math.max(1, Math.round(this.safe(this.newYears) * 12));
    const newR = this.safe(this.newRate) / 100 / 12;
    const newPayment = this.monthlyPayment(balance, newR, newN);

    const savings = currentPayment - newPayment;
    const costs = this.safe(this.closingCosts);
    const breakevenMonths = savings > 0 ? costs / savings : Number.POSITIVE_INFINITY;

    return {
      currentPayment,
      newPayment,
      savings,
      breakevenMonths
    };
  });

  fha = computed(() => {
    const price = this.safe(this.fhaHomePrice);
    const dpPct = this.safe(this.fhaDownPaymentPercent) / 100;
    const downPayment = Math.max(0, price * dpPct);
    const baseLoan = Math.max(0, price - downPayment);

    const upfrontMip = baseLoan * (this.safe(this.fhaUpfrontMipRate) / 100);
    const totalLoan = baseLoan + upfrontMip;

    const n = Math.max(1, Math.round(this.safe(this.fhaTermYears) * 12));
    const r = this.safe(this.fhaInterestRate) / 100 / 12;
    const pi = this.monthlyPayment(totalLoan, r, n);

    const monthlyMip = baseLoan * (this.safe(this.fhaAnnualMipRate) / 100) / 12;
    const taxMonthly = this.safe(this.fhaAnnualPropertyTax) / 12;
    const insMonthly = this.safe(this.fhaAnnualInsurance) / 12;
    const hoa = this.safe(this.fhaMonthlyHoa);

    const totalMonthly = pi + monthlyMip + taxMonthly + insMonthly + hoa;

    return {
      downPayment,
      baseLoan,
      upfrontMip,
      totalLoan,
      pi,
      monthlyMip,
      taxMonthly,
      insMonthly,
      hoa,
      totalMonthly
    };
  });

  setMode(mode: CalculatorMode): void {
    this.mode.set(mode);
  }

  private safe(value: unknown): number {
    const n = typeof value === 'number' ? value : Number(value);
    return Number.isFinite(n) ? n : 0;
  }

  private paymentFactor(monthlyRate: number, months: number): number {
    if (months <= 0) return 0;
    if (monthlyRate <= 0) return 1 / months;
    const pow = Math.pow(1 + monthlyRate, months);
    return (monthlyRate * pow) / (pow - 1);
  }

  private monthlyPayment(principal: number, monthlyRate: number, months: number): number {
    if (principal <= 0 || months <= 0) return 0;
    const factor = this.paymentFactor(monthlyRate, months);
    return principal * factor;
  }
}
