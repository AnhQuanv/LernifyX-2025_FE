import { Payment } from "@/types/payment/payment";
import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { createPayment, findByPayment } from "../../thunk/paymentThunk";

interface PaymentState {
  payment: Payment | null;
  status: "idle" | "loading" | "succeeded" | "failed";
  error: string | null;
}

const initialState: PaymentState = {
  payment: null,
  status: "idle",
  error: null,
};

const paymentSlice = createSlice({
  name: "payment",
  initialState,
  reducers: {
    resetPayment(state) {
      state.payment = null;
      state.status = "idle";
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder.addCase(findByPayment.pending, (state) => {
      state.status = "loading";
      state.error = null;
    });
    builder.addCase(
      findByPayment.fulfilled,
      (state, action: PayloadAction<Payment>) => {
        state.status = "succeeded";
        state.payment = action.payload;
      }
    );
    builder.addCase(findByPayment.rejected, (state, action) => {
      state.status = "failed";
      state.error = action.payload as string;
    });

    builder
      .addCase(createPayment.pending, (state) => {
        state.status = "loading";
      })
      .addCase(createPayment.fulfilled, (state) => {
        state.status = "succeeded";
      })
      .addCase(createPayment.rejected, (state, action) => {
        state.status = "failed";
        state.error =
          typeof action.payload === "string"
            ? action.payload
            : JSON.stringify(action.payload);
      });
  },
});

export const { resetPayment } = paymentSlice.actions;
export default paymentSlice.reducer;
