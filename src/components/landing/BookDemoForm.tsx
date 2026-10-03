"use client";

import { useState } from "react";
import Link from "next/link";
import toast from "react-hot-toast";

export default function BookDemoForm() {
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    businessName: "",
    monthlyRevenue: "Just starting out",
    challenges: "",
  });

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000/api/v1";
      const payload = {
        firstName: formData.firstName.trim(),
        lastName: formData.lastName.trim(),
        email: formData.email.trim(),
        topic: "Demo Request",
        message: `Business: ${formData.businessName || "Not specified"} | Monthly Revenue: ${formData.monthlyRevenue} | Goals & Challenges: ${formData.challenges || "None provided"}`,
      };

      const res = await fetch(`${apiUrl}/contact-inquiries/create-inquiry`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      const data = await res.json();

      if (!res.ok || !data.success) {
        throw new Error(data.message || "Failed to submit demo request");
      }

      toast.success(
        "Your demo request has been submitted! Our team will contact you shortly to schedule your personalized walkthrough.",
        { duration: 6000 }
      );

      // Reset form
      setFormData({
        firstName: "",
        lastName: "",
        email: "",
        businessName: "",
        monthlyRevenue: "Just starting out",
        challenges: "",
      });
    } catch (error: any) {
      toast.error(error.message || "Failed to submit demo request. Please try again later.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white p-8 md:p-10 rounded-2xl shadow-xl shadow-gray-200/50 border border-gray-100 max-w-2xl mx-auto text-left">
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-bold text-gray-700 mb-2">
              First Name *
            </label>
            <input
              type="text"
              name="firstName"
              value={formData.firstName}
              onChange={handleChange}
              className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[hsl(var(--accent-primary))] focus:bg-white transition-all text-gray-800"
              required
              placeholder="John"
            />
          </div>
          <div>
            <label className="block text-sm font-bold text-gray-700 mb-2">
              Last Name *
            </label>
            <input
              type="text"
              name="lastName"
              value={formData.lastName}
              onChange={handleChange}
              className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[hsl(var(--accent-primary))] focus:bg-white transition-all text-gray-800"
              required
              placeholder="Smith"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-bold text-gray-700 mb-2">
              Business Email *
            </label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[hsl(var(--accent-primary))] focus:bg-white transition-all text-gray-800"
              required
              placeholder="john@business.com"
            />
          </div>
          <div>
            <label className="block text-sm font-bold text-gray-700 mb-2">
              Business Name *
            </label>
            <input
              type="text"
              name="businessName"
              value={formData.businessName}
              onChange={handleChange}
              className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[hsl(var(--accent-primary))] focus:bg-white transition-all text-gray-800"
              required
              placeholder="Acme Store"
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-bold text-gray-700 mb-2">
            Current Monthly Revenue
          </label>
          <select
            name="monthlyRevenue"
            value={formData.monthlyRevenue}
            onChange={handleChange}
            className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[hsl(var(--accent-primary))] focus:bg-white transition-all text-gray-700"
          >
            <option>Just starting out</option>
            <option>BDT 50,000 - BDT 200,000</option>
            <option>BDT 200,000 - BDT 1,000,000</option>
            <option>BDT 1,000,000 - BDT 5,000,000</option>
            <option>BDT 5,000,000+</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-bold text-gray-700 mb-2">
            What are you looking to achieve?
          </label>
          <textarea
            rows={4}
            name="challenges"
            value={formData.challenges}
            onChange={handleChange}
            className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[hsl(var(--accent-primary))] focus:bg-white transition-all text-gray-800"
            placeholder="Tell us a bit about your current challenges or goals..."
          ></textarea>
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full py-4 bg-[hsl(var(--accent-primary))] hover:bg-[hsl(var(--accent-hover))] text-white font-bold rounded-lg shadow-lg shadow-[hsl(var(--accent-primary))]/30 transition-all transform hover:-translate-y-0.5 text-lg disabled:opacity-70 disabled:cursor-not-allowed"
        >
          {loading ? "Submitting Demo Request..." : "Schedule My Demo"}
        </button>

        <p className="text-center text-xs text-gray-500 mt-4">
          By submitting this form, you agree to our{" "}
          <Link
            href="/landing/privacy-policy"
            className="text-[hsl(var(--accent-primary))] hover:underline"
          >
            Privacy Policy
          </Link>
          .
        </p>
      </form>
    </div>
  );
}
