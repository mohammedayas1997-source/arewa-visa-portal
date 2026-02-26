// src/pages/About.jsx
import React from 'react';

export default function About() {
  return (
    <div className="container my-5 pt-5" style={{ minHeight: '80vh' }}>
      <h1 className="text-center mb-4">ABOUT US</h1>

      {/* Who We Are */}
      <section className="mb-5">
        <h3>Who We Are</h3>
        <p>
          Arewa Visa Academy is a forward‑thinking recruitment and training institution dedicated to connecting talent with global opportunities. 
          We operate at the intersection of international recruitment, professional skills development, and digital automation, providing a transparent 
          and structured pathway for individuals seeking career growth beyond borders.
        </p>
      </section>

      {/* Our Mission */}
      <section className="mb-5">
        <h3>Our Mission</h3>
        <p>
          To empower individuals with the right skills, guidance, and access needed to compete confidently in the global job market through ethical 
          recruitment practices, quality training, and secure digital systems.
        </p>
      </section>

      {/* Our Vision */}
      <section className="mb-5">
        <h3>Our Vision</h3>
        <p>
          To become a trusted African‑based global platform for recruitment and vocational education, recognized for integrity, innovation, and measurable success stories.
        </p>
      </section>

      {/* What We Do */}
      <section className="mb-5">
        <h3>What We Do</h3>
        <ul>
          <li>Facilitate international job recruitment through verified partner networks</li>
          <li>Deliver practical online and physical training programs via a hybrid Learning Management System (LMS)</li>
          <li>Automate application processing, payments, and communication for efficiency and transparency</li>
        </ul>
      </section>

      {/* Our Approach */}
      <section className="mb-5">
        <h3>Our Approach</h3>
        <p>
          We believe opportunity should be clear, structured, and accessible. Our platform is designed to guide users step‑by‑step — 
          from application and training to communication and progress tracking — while maintaining the highest standards of data protection and professionalism.
        </p>
      </section>

      {/* Trust & Transparency */}
      <section className="mb-5">
        <h3>Trust & Transparency</h3>
        <p>
          Arewa Visa Academy does not promise guaranteed visas or employment. Instead, we focus on preparation, compliance, and proper representation, 
          ensuring every applicant is processed fairly and informed at every stage.
        </p>
      </section>

      {/* Why Choose Us */}
      <section className="mb-5">
        <h3>Why Choose Us</h3>
        <ul>
          <li>Secure, technology‑driven platform</li>
          <li>Professional recruitment and training framework</li>
          <li>Clear communication and documented processes</li>
          <li>Commitment to ethical and lawful operations</li>
        </ul>
        <p>
          At Arewa Visa Academy, we are not just building a portal — we are building pathways to opportunity.
        </p>
      </section>
    </div>
  );
}
