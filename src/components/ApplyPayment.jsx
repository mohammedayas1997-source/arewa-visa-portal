import React from "react";
import { usePaystackPayment } from "react-paystack";
import { db, auth } from "../firebase"; // Tabbatar hanyar nan (path) daidai take
import { doc, updateDoc, serverTimestamp } from "firebase/firestore";

const ApplyPayment = ({ amount, email, applicationId, onSuccessAction }) => {
  const config = {
    reference: new Date().getTime().toString(),
    email: email,
    amount: amount * 100, // Paystack uses Kobo (Naira * 100)
    publicKey: "pk_test_962a83d0a3b1d3c993e245757351a3834bfe91c0",
  };

  const initializePayment = usePaystackPayment(config);

  const onSuccess = async (reference) => {
    try {
      const appRef = doc(db, "applications", applicationId);
      await updateDoc(appRef, {
        paymentStatus: "Paid",
        paymentReference: reference.reference,
        paidAt: serverTimestamp(),
        status: "Awaiting Rector Approval",
      });

      alert(
        "Payment Successful! Your application has been forwarded for approval.",
      );
      if (onSuccessAction) onSuccessAction(); // Wannan zai nuna Success Screen
    } catch (error) {
      console.error("Error updating payment:", error);
      alert(
        "Payment recorded but system update failed. Please contact support.",
      );
    }
  };

  const onClose = () => {
    alert(
      "Transaction cancelled. Please complete payment to finalize your application.",
    );
  };

  return (
    <div className="w-100">
      <button
        onClick={() => initializePayment(onSuccess, onClose)}
        className="btn btn-success btn-lg w-100 py-3 rounded-pill fw-bold shadow-lg text-uppercase"
      >
        Pay Application Fee (₦{amount.toLocaleString()})
      </button>
    </div>
  );
};

export default ApplyPayment;
