import React from "react";
import { usePaystackPayment } from "react-paystack";

const ApplyPayment = ({ amount, email, onSuccessAction, isSubmitting }) => {
  const safeEmail =
    email && email.trim() !== "" ? email.trim() : "customer@arewavisa.com";

  const config = {
    reference: "AVA-" + new Date().getTime().toString(),
    email: safeEmail,
    amount: amount * 100,
    publicKey: "pk_test_962a83d0a3b1d3c993e245757351a3834bfe91c0",
  };

  const initializePayment = usePaystackPayment(config);

  const onSuccess = (reference) => {
    // CRITICAL: Log this to see what Paystack actually returns
    console.log("Paystack Reference Received:", reference);

    // Ensure we pass the reference back to the parent to trigger handleSubmitApplication
    if (reference) {
      onSuccessAction(reference);
    }
  };

  const onClose = () => {
    console.log("Payment window closed");
  };

  const handlePayment = () => {
    if (!email || !email.includes("@")) {
      alert("Please provide a valid email address in the form before paying.");
      return;
    }

    // Trigger Paystack
    initializePayment(onSuccess, onClose);
  };

  return (
    <button
      type="button"
      disabled={isSubmitting}
      className="btn btn-danger w-100 py-3 fw-bold rounded-pill shadow-lg text-uppercase d-flex align-items-center justify-content-center gap-2"
      onClick={handlePayment}
    >
      {isSubmitting ? (
        <>
          <span
            className="spinner-border spinner-border-sm"
            role="status"
            aria-hidden="true"
          ></span>
          <span>Finalizing Submission...</span>
        </>
      ) : (
        <>
          <i className="bi bi-credit-card"></i>
          <span>Pay ₦{amount.toLocaleString()} Now</span>
        </>
      )}
    </button>
  );
};

export default ApplyPayment;
