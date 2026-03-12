import React, { useEffect } from "react";
import { usePaystackPayment } from "react-paystack";

const ApplyPayment = ({ amount, email, onSuccessAction, isSubmitting }) => {
  const config = {
    reference: "AVA-" + new Date().getTime().toString(),
    email: email || "customer@arewavisa.com",
    amount: amount * 100,
    publicKey: "pk_live_501518dc4688ce1fc18be571fb9b81ab785af677", // Test Key
  };

  const initializePayment = usePaystackPayment(config);

  const handleButtonClick = () => {
    // Check if initializePayment is a function before calling
    if (typeof initializePayment === "function") {
      initializePayment(onSuccessAction, () => console.log("Closed"));
    } else {
      alert("Payment system is still warming up. Please wait 2 seconds and try again.");
    }
  };

  return (
    <button
      type="button"
      disabled={isSubmitting}
      className="btn btn-danger w-100 py-3 fw-bold rounded-pill shadow-lg text-uppercase"
      onClick={handleButtonClick}
    >
      {isSubmitting ? (
        <div className="d-flex align-items-center justify-content-center gap-2">
          <span className="spinner-border spinner-border-sm" role="status"></span>
          <span>Processing...</span>
        </div>
      ) : (
        `PAY ₦${amount.toLocaleString()} NOW`
      )}
    </button>
  );
};

export default ApplyPayment;