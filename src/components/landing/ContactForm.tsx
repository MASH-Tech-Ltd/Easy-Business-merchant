"use client";

import { useState, useEffect, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import toast from "react-hot-toast";

const isValidBDPhone = (phone: string): boolean => {
  if (!phone || !phone.trim()) return false;
  const cleanPhone = phone.replace(/[\s\-\(\)]/g, "");
  return /^(?:\+?88|88)?01[3-9]\d{8}$/.test(cleanPhone);
};

function ContactFormContent() {
  const searchParams = useSearchParams();
  const rawTopic = searchParams.get("topic");

  // Determine initial topic selection based on URL parameter
  const getInitialTopic = (param: string | null) => {
    if (!param) return "General Inquiry";
    const lower = param.toLowerCase();
    if (lower.includes("consult") || lower.includes("পরামর্শ")) {
      return "Business Consultation (ব্যবসার পরামর্শ)";
    }
    return param;
  };

  const [loading, setLoading] = useState(false);
  const [phoneError, setPhoneError] = useState("");
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    phone: "",
    email: "",
    topic: getInitialTopic(rawTopic),
    message: "",
  });

  useEffect(() => {
    if (rawTopic) {
      setFormData((prev) => ({ ...prev, topic: getInitialTopic(rawTopic) }));
    }
  }, [rawTopic]);

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    >,
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validate BD Phone Number
    if (!formData.phone.trim()) {
      setPhoneError("Mobile number is required");
      return;
    }

    if (!isValidBDPhone(formData.phone)) {
      setPhoneError("Please enter a valid Bangladeshi mobile number (e.g.: 017XXXXXXXX)");
      return;
    }

    setPhoneError("");
    setLoading(true);

    try {
      const res = await fetch(`/api/contact-inquiries/create-inquiry`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      const data = await res.json();

      if (!res.ok || !data.success) {
        throw new Error(data.message || "Failed to submit inquiry");
      }

      toast.success(
        "Your message has been sent successfully. We will get back to you soon!",
      );

      // Reset form
      setFormData({
        firstName: "",
        lastName: "",
        phone: "",
        email: "",
        topic: "General Inquiry",
        message: "",
      });
    } catch (error: any) {
      toast.error(
        error.message || "Something went wrong. Please try again later.",
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white p-8 rounded-2xl shadow-xl shadow-gray-200/50 border border-gray-100">
      <form onSubmit={handleSubmit} className="space-y-5">
        <div className="grid grid-cols-2 gap-5">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              First Name <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              name="firstName"
              value={formData.firstName}
              onChange={handleChange}
              required
              className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[hsl(var(--accent-primary))] focus:bg-white transition-all"
              placeholder="Jane"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Last Name <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              name="lastName"
              value={formData.lastName}
              onChange={handleChange}
              required
              className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[hsl(var(--accent-primary))] focus:bg-white transition-all"
              placeholder="Doe"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Mobile Number / ফোন নম্বর <span className="text-red-500">*</span>
            </label>
            <input
              type="tel"
              name="phone"
              value={formData.phone}
              onChange={(e) => {
                handleChange(e);
                setPhoneError("");
              }}
              required
              className={`w-full px-4 py-3 bg-gray-50 border rounded-lg focus:outline-none focus:ring-2 focus:ring-[hsl(var(--accent-primary))] focus:bg-white transition-all ${
                phoneError ? "border-red-500 bg-red-50/50 text-red-900" : "border-gray-200"
              }`}
              placeholder="01712345678"
            />
            {phoneError && (
              <p className="text-xs text-red-600 font-medium mt-1">{phoneError}</p>
            )}
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Email Address <span className="text-gray-400 text-xs font-normal">(Optional)</span>
            </label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[hsl(var(--accent-primary))] focus:bg-white transition-all"
              placeholder="jane@yourstore.com (optional)"
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Topic <span className="text-red-500">*</span>
          </label>
          <select
            name="topic"
            value={formData.topic}
            onChange={handleChange}
            className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[hsl(var(--accent-primary))] focus:bg-white transition-all text-gray-700 font-medium"
          >
            <option value="General Inquiry">General Inquiry</option>
            <option value="Business Consultation (ব্যবসার পরামর্শ)">
              Business Consultation (ব্যবসার পরামর্শ)
            </option>
            <option value="Sales & Subscriptions">Sales & Subscriptions</option>
            <option value="Technical Support">Technical Support</option>
            <option value="API Integration">API Integration</option>
            <option value="Partnerships">Partnerships</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Message <span className="text-red-500">*</span>
          </label>
          <textarea
            rows={5}
            name="message"
            value={formData.message}
            onChange={handleChange}
            required
            className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[hsl(var(--accent-primary))] focus:bg-white transition-all"
            placeholder="How can we help you grow your business?"
          ></textarea>
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full py-4 bg-[hsl(var(--accent-primary))] hover:bg-[hsl(var(--accent-hover))] text-white font-bold rounded-lg shadow-lg shadow-[hsl(var(--accent-primary))]/30 transition-all transform hover:-translate-y-0.5 disabled:opacity-70 disabled:cursor-not-allowed"
        >
          {loading ? "Sending..." : "Send Message"}
        </button>
      </form>
    </div>
  );
}

export default function ContactForm() {
  return (
    <Suspense fallback={<div className="p-8 bg-white rounded-2xl animate-pulse">Loading form...</div>}>
      <ContactFormContent />
    </Suspense>
  );
}
