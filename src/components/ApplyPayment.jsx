import React from "react";
import { usePaystackPayment } from "react-paystack";

const ApplyPayment = ({ amount, email, onSuccessAction, isSubmitting }) => {
  const config = {
    reference: "AVA-" + new Date().getTime().toString(),
    email: email || "customer@arewavisa.com",
    amount: amount * 100,
    publicKey: "pk_test_962a83d0a3b1d3c993e245757351a3834bfe91c0", // Kept as Test per your request
  };

  const initializePayment = usePaystackPayment(config);

  const onSuccess = (reference) => {
    // This MUST call the parent function to change the screen
    console.log("Payment Success Reference:", reference);
    onSuccessAction(reference);
  };

  const onClose = () => {
    console.log("Payment window closed");
  };

  return (
    <button
      type="button"
      disabled={isSubmitting}
      className="btn btn-danger w-100 py-3 fw-bold rounded-pill shadow-lg text-uppercase d-flex align-items-center justify-content-center gap-2"
      onClick={() => initializePayment(onSuccess, onClose)}
    >
      {isSubmitting ? (
        <span className="spinner-border spinner-border-sm" role="status"></span>
      ) : (
        "PAY ₦5,000 NOW"
      )}
    </button>
  );
};

export default ApplyPayment;