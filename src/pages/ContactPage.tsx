/* eslint-disable no-undef */
import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { MapPin, Phone, Mail, Clock, Send } from "lucide-react";

const ContactPage = () => {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
  });

  const [submitStatus, setSubmitStatus] = useState<
    "idle" | "success" | "error"
  >("idle");
  const [clickedCard, setClickedCard] = useState<number | null>(null);
  const [copiedEmail, setCopiedEmail] = useState(false);
  const [copiedPhone, setCopiedPhone] = useState(false);
  const [openFaqIndex, setOpenFaqIndex] = useState<number | null>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Simulate form submission
    setSubmitStatus("success");
    setTimeout(() => {
      setFormData({ name: "", email: "", subject: "", message: "" });
      setSubmitStatus("idle");
    }, 3000);
  };

  const handleCardClick = (index: number) => {
    setClickedCard(index);
    setTimeout(() => setClickedCard(null), 600);
  };

  const handleEmailClick = () => {
    navigator.clipboard.writeText("hello@solestreet.ro");
    setCopiedEmail(true);
    setTimeout(() => setCopiedEmail(false), 2000);
  };

  const handlePhoneClick = () => {
    navigator.clipboard.writeText("+40 264 123 456");
    setCopiedPhone(true);
    setTimeout(() => setCopiedPhone(false), 2000);
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const contactInfo = [
    {
      icon: MapPin,
      title: "Visit Us",
      content: "Strada Memorandumului 28",
      subcontent: "Cluj-Napoca 400114, Romania",
    },
    {
      icon: Phone,
      title: "Call Us",
      content: "+40 264 123 456",
      subcontent: "Mon-Fri, 9:00 AM - 6:00 PM EET",
    },
    {
      icon: Mail,
      title: "Email Us",
      content: "hello@solestreet.ro",
      subcontent: "We reply within 24 hours",
    },
    {
      icon: Clock,
      title: "Store Hours",
      content: "Monday - Saturday: 10:00 - 20:00",
      subcontent: "Sunday: 10:00 - 18:00",
    },
  ];

  return (
    <div className="min-h-screen" data-testid="contact-page">
      {/* Hero Section */}
      <section
        className="relative h-[400px] flex items-center justify-center overflow-hidden bg-gradient-to-br from-gray-900 to-gray-700"
        data-testid="contact-hero"
      >
        <div
          className="absolute inset-0 opacity-20"
          style={{
            backgroundImage:
              "url(https://images.unsplash.com/photo-1596524430615-b46475ddff6e?w=1600)",
            backgroundSize: "cover",
            backgroundPosition: "center",
          }}
          data-testid="contact-hero-background"
        />
        <div
          className="relative z-10 text-center px-4 max-w-4xl mx-auto"
          data-testid="contact-hero-content"
        >
          <motion.h1
            className="text-5xl md:text-7xl font-display font-bold text-white mb-6"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            data-testid="contact-title"
          >
            Get in Touch
          </motion.h1>
          <motion.p
            className="text-xl md:text-2xl text-gray-200"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            data-testid="contact-subtitle"
          >
            We'd love to hear from you. Visit our store in Cluj-Napoca or reach
            out online.
          </motion.p>
        </div>
      </section>

      {/* Contact Info Cards */}
      <section
        className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-16 relative z-20"
        data-testid="contact-info-section"
      >
        <div
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6"
          data-testid="contact-info-grid"
        >
          {contactInfo.map((info, index) => (
            <motion.div
              key={info.title}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="bg-white p-6 rounded-xl shadow-lg hover:shadow-xl transition-all cursor-pointer relative overflow-hidden"
              onClick={() => {
                handleCardClick(index);
                if (index === 1) handlePhoneClick();
                if (index === 2) handleEmailClick();
              }}
              data-testid={`contact-info-card-${index}`}
            >
              {clickedCard === index && (
                <motion.div
                  className="absolute inset-0 bg-gradient-to-r from-transparent via-white to-transparent"
                  initial={{ x: "-100%" }}
                  animate={{ x: "100%" }}
                  transition={{ duration: 0.6 }}
                  style={{ opacity: 0.5 }}
                />
              )}
              <div
                className="w-12 h-12 rounded-full flex items-center justify-center mb-4 transition-transform"
                style={{
                  backgroundColor: "var(--color-accent)",
                  color: "white",
                  transform:
                    clickedCard === index ? "rotate(360deg)" : "rotate(0deg)",
                  transition: "transform 0.6s ease-in-out",
                }}
                data-testid={`contact-info-icon-${index}`}
              >
                <info.icon className="w-6 h-6" />
              </div>
              <h3
                className="font-display font-bold text-lg mb-2"
                data-testid={`contact-info-title-${index}`}
              >
                {info.title}
              </h3>
              <p
                className="text-gray-700 font-medium"
                data-testid={`contact-info-content-${index}`}
              >
                {info.content}
              </p>
              <p
                className="text-gray-500 text-sm mt-1"
                data-testid={`contact-info-subcontent-${index}`}
              >
                {info.subcontent}
              </p>
              {index === 1 && copiedPhone && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="absolute top-2 right-2 bg-green-500 text-white text-xs px-2 py-1 rounded"
                  data-testid="phone-copied-tooltip"
                >
                  Copied! 📋
                </motion.div>
              )}
              {index === 2 && copiedEmail && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="absolute top-2 right-2 bg-green-500 text-white text-xs px-2 py-1 rounded"
                  data-testid="email-copied-tooltip"
                >
                  Copied! 📋
                </motion.div>
              )}
            </motion.div>
          ))}
        </div>
      </section>

      {/* Form and Map Section */}
      <section
        className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20"
        data-testid="contact-form-section"
      >
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Contact Form */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            data-testid="contact-form-container"
          >
            <h2
              className="text-4xl font-display font-bold mb-6"
              style={{ color: "var(--color-primary)" }}
              data-testid="contact-form-title"
            >
              Send Us a Message
            </h2>
            <p
              className="text-gray-600 mb-8"
              data-testid="contact-form-description"
            >
              Have a question about our products or services? Fill out the form
              below and we'll get back to you as soon as possible.
            </p>

            <form
              onSubmit={handleSubmit}
              className="space-y-6"
              data-testid="contact-form"
            >
              <div data-testid="contact-form-field-name">
                <label
                  htmlFor="name"
                  className="block text-sm font-medium text-gray-700 mb-2"
                  data-testid="contact-form-label-name"
                >
                  Your Name *
                </label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-offset-2 focus:outline-none transition-all"
                  placeholder="John Doe"
                  data-testid="contact-form-input-name"
                />
              </div>

              <div data-testid="contact-form-field-email">
                <label
                  htmlFor="email"
                  className="block text-sm font-medium text-gray-700 mb-2"
                  data-testid="contact-form-label-email"
                >
                  Email Address *
                </label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-offset-2 focus:outline-none transition-all"
                  placeholder="john@example.com"
                  data-testid="contact-form-input-email"
                />
              </div>

              <div data-testid="contact-form-field-subject">
                <label
                  htmlFor="subject"
                  className="block text-sm font-medium text-gray-700 mb-2"
                  data-testid="contact-form-label-subject"
                >
                  Subject *
                </label>
                <input
                  type="text"
                  id="subject"
                  name="subject"
                  value={formData.subject}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-offset-2 focus:outline-none transition-all"
                  placeholder="Product inquiry"
                  data-testid="contact-form-input-subject"
                />
              </div>

              <div data-testid="contact-form-field-message">
                <label
                  htmlFor="message"
                  className="block text-sm font-medium text-gray-700 mb-2"
                  data-testid="contact-form-label-message"
                >
                  Message *
                </label>
                <textarea
                  id="message"
                  name="message"
                  value={formData.message}
                  onChange={handleChange}
                  required
                  rows={6}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-offset-2 focus:outline-none transition-all resize-none"
                  placeholder="Tell us how we can help you..."
                  data-testid="contact-form-textarea-message"
                />
              </div>

              <motion.button
                type="submit"
                className="w-full px-8 py-4 text-lg font-semibold rounded-lg transition-all duration-300 flex items-center justify-center gap-2"
                style={{
                  backgroundColor: "var(--color-accent)",
                  color: "white",
                }}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                data-testid="contact-form-submit"
              >
                <motion.div
                  animate={submitStatus === "success" ? { rotate: 360 } : {}}
                  transition={{ duration: 0.5 }}
                >
                  <Send className="w-5 h-5" />
                </motion.div>
                Send Message
              </motion.button>

              {submitStatus === "success" && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="p-4 bg-green-50 border border-green-200 rounded-lg text-green-800"
                  data-testid="contact-form-success"
                >
                  Thank you for your message! We'll get back to you within 24
                  hours.
                </motion.div>
              )}
            </form>
          </motion.div>

          {/* Map and Additional Info */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="space-y-8"
            data-testid="contact-map-container"
          >
            <div data-testid="contact-map-wrapper">
              <h3
                className="text-2xl font-display font-bold mb-4"
                style={{ color: "var(--color-primary)" }}
                data-testid="contact-map-title"
              >
                Find Our Store
              </h3>
              <div
                className="w-full h-[400px] rounded-xl overflow-hidden shadow-lg"
                data-testid="contact-map"
              >
                <iframe
                  title="Apex Shoes Cluj-Napoca Location"
                  src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d2732.3456789!2d23.5880!3d46.7712!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x47490e1257b01c27%3A0xb64f3e837b660c73!2sCluj-Napoca%2C%20Romania!5e0!3m2!1sen!2sus!4v1703423400000"
                  width="100%"
                  height="100%"
                  allowFullScreen
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                  style={{ border: 0 }}
                  data-testid="contact-map-iframe"
                />
              </div>
            </div>

            <div
              className="bg-gray-50 p-8 rounded-xl"
              data-testid="contact-additional-info"
            >
              <h3
                className="text-2xl font-display font-bold mb-4"
                style={{ color: "var(--color-primary)" }}
                data-testid="contact-additional-info-title"
              >
                Why Visit Our Store?
              </h3>
              <ul
                className="space-y-3 text-gray-700"
                data-testid="contact-benefits-list"
              >
                {[
                  "Try on shoes and get personalized fitting assistance",
                  "Expert advice from our knowledgeable staff",
                  "Exclusive in-store promotions and events",
                  "Free coffee and comfortable seating area",
                ].map((benefit, index) => (
                  <motion.li
                    key={index}
                    className="flex items-start gap-3"
                    initial={{ opacity: 0, x: -20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.4, delay: index * 0.1 }}
                    viewport={{ once: true }}
                    whileHover={{ x: 5 }}
                    data-testid={`contact-benefit-${index}`}
                  >
                    <motion.span
                      className="w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5"
                      style={{
                        backgroundColor: "var(--color-accent)",
                        color: "white",
                        fontSize: "12px",
                      }}
                      whileHover={{ scale: 1.2, rotate: 360 }}
                      transition={{ duration: 0.3 }}
                    >
                      ✓
                    </motion.span>
                    <span>{benefit}</span>
                  </motion.li>
                ))}
              </ul>
            </div>
          </motion.div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="bg-gray-50 py-20" data-testid="contact-faq-section">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2
            className="text-4xl font-display font-bold text-center mb-12"
            style={{ color: "var(--color-primary)" }}
            data-testid="contact-faq-title"
          >
            Frequently Asked Questions
          </h2>
          <div className="space-y-6" data-testid="contact-faq-list">
            {[
              {
                question: "Do you offer international shipping?",
                answer:
                  "Yes! We ship to most countries in Europe. Shipping costs and delivery times vary by location. Contact us for specific details about your country.",
              },
              {
                question: "What is your return policy?",
                answer:
                  "We offer a 30-day return policy for unworn items in original packaging. Visit our store or contact us to initiate a return.",
              },
              {
                question:
                  "Can I reserve items online and pick them up in-store?",
                answer:
                  "Absolutely! Contact us via email or phone with the product details, and we'll reserve it for you for up to 48 hours.",
              },
            ].map((faq, index) => {
              const isOpen = openFaqIndex === index;

              return (
                <motion.div
                  key={index}
                  className="bg-white p-6 rounded-xl shadow-sm hover:shadow-md transition-shadow cursor-pointer"
                  onClick={() => setOpenFaqIndex(isOpen ? null : index)}
                  whileHover={{ scale: 1.02 }}
                  data-testid={`contact-faq-item-${index}`}
                >
                  <div className="flex items-center justify-between">
                    <h3
                      className="font-display font-bold text-lg"
                      data-testid={`contact-faq-question-${index}`}
                    >
                      {faq.question}
                    </h3>
                    <motion.div
                      animate={{ rotate: isOpen ? 180 : 0 }}
                      transition={{ duration: 0.3 }}
                      className="text-2xl"
                      style={{ color: "var(--color-accent)" }}
                    >
                      ▼
                    </motion.div>
                  </div>
                  <motion.div
                    initial={false}
                    animate={{
                      height: isOpen ? "auto" : 0,
                      opacity: isOpen ? 1 : 0,
                      marginTop: isOpen ? 8 : 0,
                    }}
                    transition={{ duration: 0.3 }}
                    style={{ overflow: "hidden" }}
                  >
                    <p
                      className="text-gray-600"
                      data-testid={`contact-faq-answer-${index}`}
                    >
                      {faq.answer}
                    </p>
                  </motion.div>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>
    </div>
  );
};

export default ContactPage;
