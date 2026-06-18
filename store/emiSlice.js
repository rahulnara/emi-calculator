import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  loanAmount: 3500000,
  interestRate: 8.4,
  tenureYears: 20,
  tenureMonths: 0,
  processingFeeRate: 0.5,
  insuranceCost: 25000,
  startMonth: new Date().getMonth() + 1,
  startYear: new Date().getFullYear(),
  prepaymentAmount: 50000,
  prepaymentFrequency: "yearly",
  rateChangeAfterMonths: 60,
  revisedInterestRate: 9.1,
  compareInterestRate: 7.9,
  compareTenureYears: 15,
  monthlyIncome: 120000,
  existingEmi: 12000,
  eligibleEmiRatio: 45,
  scheduleFilter: "yearly"
};

const emiSlice = createSlice({
  name: "emi",
  initialState,
  reducers: {
    updateField(state, action) {
      const { field, value } = action.payload;
      state[field] = value;
    },
    resetCalculator() {
      return initialState;
    },
    applyPreset(state, action) {
      const presets = {
        home: { loanAmount: 5000000, interestRate: 8.55, tenureYears: 20, processingFeeRate: 0.5 },
        car: { loanAmount: 900000, interestRate: 9.75, tenureYears: 5, processingFeeRate: 1 },
        personal: { loanAmount: 400000, interestRate: 13.5, tenureYears: 4, processingFeeRate: 2 }
      };
      Object.assign(state, presets[action.payload] || {});
    }
  }
});

export const { updateField, resetCalculator, applyPreset } = emiSlice.actions;
export default emiSlice.reducer;
