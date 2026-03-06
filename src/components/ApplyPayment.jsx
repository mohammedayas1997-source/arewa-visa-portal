import React from "react";
import { usePaystackPayment } from "react-paystack";

const ApplyPayment = ({ amount, email, onSuccessAction, isSubmitting }) => {
  // Ensure email is not empty and trim any hidden spaces
  const safeEmail =
    email && email.trim() !== "" ? email.trim() : "customer@arewavisa.com";

  const config = {
    reference: new Date().getTime().toString(),
    email: safeEmail,
    amount: amount * 100,
    publicKey: "pk_test_962a83d0a3b1d3c993e245757351a3834bfe91c0",
  };

  const initializePayment = usePaystackPayment(config);

  const handlePayment = () => {
    // Validation before opening Paystack
    if (!email || !email.includes("@")) {
      alert("Please provide a valid email address in the form before paying.");
      return;
    }

    initializePayment(
      (reference) => {
        // Success Logic
        onSuccessAction(reference);
      },
      () => {
        // Close/Cancel Logic
        alert(
          "Payment cancelled. Please complete payment to submit your application.",
        );
      },
    );
  };

  return (
    <button
      type="button"
      disabled={isSubmitting}
      className="btn btn-danger w-100 py-3 fw-bold rounded-pill shadow-lg text-uppercase"
      onClick={handlePayment}
    >
      {isSubmitting ? (
        <span>
          <i className="spinner-border spinner-border-sm me-2"></i>Processing...
        </span>
      ) : (
        `Pay ₦${amount.toLocaleString()} Now`
      )}
    </button>
  );
};

export default ApplyPayment;
