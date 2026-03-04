import React, { useState } from "react";
import { auth, db } from "./firebase";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { doc, setDoc } from "firebase/firestore";

const Register = () => {
  const [msg, setMsg] = useState("");

  const usersToCreate = [
    {
      email: "student@arewavacademy.edu.ng",
      role: "student",
      name: "AVA Student",
    },
    {
      email: "admin@arewavacademy.edu.ng",
      role: "admin",
      name: "System Admin",
    },
    {
      email: "rector@arewavacademy.edu.ng",
      role: "rector",
      name: "Academy Rector",
    },
    {
      email: "admin-content@arewavacademy.edu.ng",
      role: "instructor",
      name: "Content Manager",
    },
    {
      email: "admission@arewavacademy.edu.ng",
      role: "admission-officer",
      name: "Admission Officer",
    },
  ];

  const handleSetup = async () => {
    setMsg("Ana ƙirƙirar accounts... Duba Console.");
    for (const user of usersToCreate) {
      try {
        const userCredential = await createUserWithEmailAndPassword(
          auth,
          user.email,
          "Arewa@2026",
        );
        await setDoc(doc(db, "users", userCredential.user.uid), {
          uid: userCredential.user.uid,
          email: user.email,
          fullName: user.name,
          role: user.role,
          status: "active",
          createdAt: new Date(),
        });
        console.log(`Success: ${user.email}`);
      } catch (err) {
        console.error(`Error: ${user.email}`, err.message);
      }
    }
    setMsg("An gama! Duba Firebase Console don tabbatarwa.");
  };

  return (
    <div
      style={{
        padding: "100px",
        textAlign: "center",
        color: "white",
        background: "#020617",
        minHeight: "100vh",
      }}
    >
      <h2>AVA USER SETUP TERMINAL</h2>
      <p>{msg}</p>
      <button
        onClick={handleSetup}
        style={{
          padding: "15px 30px",
          background: "#2563eb",
          color: "white",
          border: "none",
          borderRadius: "10px",
          cursor: "pointer",
          fontWeight: "bold",
        }}
      >
        INITIALIZE ALL USERS
      </button>
    </div>
  );
};

export default Register;
