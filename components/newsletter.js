"use client";
import { useState } from "react";

export default function Newsletter() {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    // Newsletter subscription logic goes here.
    // For now, we'll just show a success message.
    setMessage(`Thank you for subscribing, ${email}!`);
    setEmail("");
  };

  return (
    <div className="py-8 text-center">
      <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100">
        Sign Up For Newsletter
      </h2>
      <p className="mt-2 text-gray-600 dark:text-gray-400">
        We&apos;ll send you regular dispatches from Diabol AI — with exclusive content and productivity best practice.
      </p>
      <form onSubmit={handleSubmit} className="mt-4 flex max-w-md mx-auto">
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Enter your email"
          required
          className="w-full px-4 py-2 border border-gray-300 rounded-l-md focus:outline-none focus:ring-2 focus:ring-brand-500 dark:bg-gray-800 dark:border-gray-700"
        />
        <button
          type="submit"
          className="px-4 py-2 bg-brand-600 text-white font-medium rounded-r-md hover:bg-brand-700 focus:outline-none focus:ring-2 focus:ring-brand-500">
          Sign Up
        </button>
      </form>
      {message && <p className="mt-4 text-green-500">{message}</p>}
    </div>
  );
}
