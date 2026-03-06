import React from "react";
import { usePaystackPayment } from "react-paystack";

const ApplyPayment = ({ amount, email, onSuccessAction, isSubmitting }) => {
  const config = {
    reference: new Date().getTime().toString(),
    email: email,
    amount: amount * 100, // Paystack yana amfani da Kobo (5000 * 100)
    publicKey: "pk_test_962a83d0a3b1d3c993e245757351a3834bfe91c0",
  };

  const initializePayment = usePaystackPayment(config);

  const onSuccess = (reference) => {
    // Idan biya ya yi nasara, zai kira wannan function din daga CourseApplicationForm
    onSuccessAction(reference);
  };

  const onClose = () => {
    alert(
      "Payment cancelled. Please complete payment to submit your application.",
    );
  };

  return (
    <button
      type="button"
      disabled={isSubmitting}
      className="btn btn-danger w-100 py-3 fw-bold rounded-pill shadow-lg text-uppercase"
      onClick={() => initializePayment(onSuccess, onClose)}
    >
      {isSubmitting ? "Processing..." : `Pay ₦${amount.toLocaleString()} Now`}
    </button>
  );
};

export default ApplyPayment;
