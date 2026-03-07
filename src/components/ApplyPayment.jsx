import React from "react";
import { usePaystackPayment } from "react-paystack";

const ApplyPayment = ({ amount, email, onSuccessAction, isSubmitting }) => {
  // Tabbatar da email yana da kyau kuma babu spaces
  const safeEmail =
    email && email.trim() !== "" ? email.trim() : "customer@arewavisa.com";

  const config = {
    reference: "AVA-" + new Date().getTime().toString(), // Na kara AVA- a prefix din reference
    email: safeEmail,
    amount: amount * 100, // Paystack tana karbar kobo ne, shi yasa muke sauya shi
    publicKey: "pk_test_962a83d0a3b1d3c993e245757351a3834bfe91c0",
  };

  const initializePayment = usePaystackPayment(config);

  const handlePayment = () => {
    // Tabbatar da an cika email kafin a fara biya
    if (!email || !email.includes("@")) {
      alert("Please provide a valid email address in the form before paying.");
      return;
    }

    // Kiran Paystack Popup
    initializePayment(
      (reference) => {
        // Idan biya ya yi nasara (SUCCESS)
        if (reference.status === "success" || reference.reference) {
          onSuccessAction(reference);
        }
      },
      () => {
        // Idan an fita daga shafin biya ba tare da an kammala ba
        console.log("Payment window closed by user");
      },
    );
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
          <span>Pay ₦${amount.toLocaleString()} Now</span>
        </>
      )}
    </button>
  );
};

export default ApplyPayment;
