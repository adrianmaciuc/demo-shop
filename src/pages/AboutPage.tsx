import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Award, Heart, Leaf, TrendingUp } from "lucide-react";

const AboutPage = () => {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const [hoveredValue, setHoveredValue] = useState<number | null>(null);
  const [expandedMilestone, setExpandedMilestone] = useState<number | null>(
    null,
  );

  const values = [
    {
      icon: Heart,
      title: "Passion for Style",
      description:
        "We believe footwear is more than function—it's self-expression. Every pair tells a story.",
    },
    {
      icon: Award,
      title: "Quality Craftsmanship",
      description:
        "Hand-selected materials and meticulous attention to detail in every stitch and sole.",
    },
    {
      icon: Leaf,
      title: "Sustainable Future",
      description:
        "Committed to eco-friendly practices and reducing our environmental footprint.",
    },
    {
      icon: TrendingUp,
      title: "Innovation First",
      description:
        "Constantly evolving with the latest technology and design trends in footwear.",
    },
  ];

  const milestones = [
    {
      year: "2018",
      event:
        "Founded in Cluj-Napoca, Romania with a vision to revolutionize shoe retail",
    },
    {
      year: "2019",
      event:
        "Launched our first sustainable shoe line made from recycled materials",
    },
    { year: "2021", event: "Opened flagship stores in NYC, LA, and Chicago" },
    { year: "2023", event: "Reached 1 million satisfied customers worldwide" },
    {
      year: "2024",
      event: "Introduced AI-powered fit technology for perfect sizing",
    },
  ];

  return (
    <div className="min-h-screen" data-testid="about-page">
      {/* Hero Section */}
      <section
        className="relative h-[500px] flex items-center justify-center overflow-hidden bg-gradient-to-br from-gray-900 to-gray-700"
        data-testid="about-hero"
      >
        <div
          className="absolute inset-0 opacity-30"
          style={{
            backgroundImage:
              "url(https://images.unsplash.com/photo-1556906781-9a412961c28c?w=1600)",
            backgroundSize: "cover",
            backgroundPosition: "center",
          }}
          data-testid="about-hero-background"
        />
        <div
          className="relative z-10 text-center px-4 max-w-4xl mx-auto"
          data-testid="about-hero-content"
        >
          <motion.h1
            className="text-5xl md:text-7xl font-display font-bold text-white mb-6"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            data-testid="about-title"
          >
            Where Style Meets Soul
          </motion.h1>
          <motion.p
            className="text-xl md:text-2xl text-gray-200"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            data-testid="about-subtitle"
          >
            Crafting premium footwear experiences since 2018
          </motion.p>
        </div>
      </section>

      {/* Story Section */}
      <section
        className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20"
        data-testid="about-story-section"
      >
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            data-testid="about-story-content"
          >
            <h2
              className="text-4xl font-display font-bold mb-6"
              style={{ color: "var(--color-primary)" }}
              data-testid="about-story-title"
            >
              Our Story
            </h2>
            <div
              className="space-y-4 text-gray-700 leading-relaxed"
              data-testid="about-story-text"
            >
              <p>
                Apex Shoes was born from a simple belief: everyone deserves
                footwear that makes them feel confident, comfortable, and
                authentic. What started as a small workshop in Cluj-Napoca has
                grown into a global movement celebrating individuality through
                exceptional shoes.
              </p>
              <p>
                Our founder, Adrian Maciuc, grew frustrated with the disconnect
                between style and comfort in the shoe industry. With a
                background in sustainable design and a passion for
                craftsmanship, he set out to create something different—a brand
                that refuses to compromise.
              </p>
              <p>
                Today, we partner with artisans worldwide, combining traditional
                techniques with cutting-edge technology. Every pair is a
                testament to our commitment: premium materials, ethical
                production, and designs that stand the test of time.
              </p>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="relative h-[400px] rounded-2xl overflow-hidden shadow-2xl"
            data-testid="about-story-image"
          >
            <img
              src="https://images.unsplash.com/photo-1543163521-1bf539c55dd2?w=800"
              alt="Apex Shoes workshop"
              className="w-full h-full object-cover"
            />
          </motion.div>
        </div>
      </section>

      {/* Values Section */}
      <section className="bg-gray-50 py-20" data-testid="about-values-section">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16" data-testid="about-values-header">
            <h2
              className="text-4xl font-display font-bold mb-4"
              style={{ color: "var(--color-primary)" }}
              data-testid="about-values-title"
            >
              Our Values
            </h2>
            <p
              className="text-xl text-gray-600"
              data-testid="about-values-subtitle"
            >
              The principles that guide everything we do
            </p>
          </div>

          <div
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8"
            data-testid="about-values-grid"
          >
            {values.map((value, index) => (
              <motion.div
                key={value.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                viewport={{ once: true }}
                className="bg-white p-8 rounded-xl shadow-sm hover:shadow-lg transition-all cursor-pointer"
                onMouseEnter={() => setHoveredValue(index)}
                onMouseLeave={() => setHoveredValue(null)}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <motion.div
                  className="w-14 h-14 rounded-full flex items-center justify-center mb-6"
                  style={{
                    backgroundColor: "var(--color-accent)",
                    color: "white",
                  }}
                  animate={
                    hoveredValue === index ? { rotate: 360, scale: 1.1 } : {}
                  }
                  transition={{ duration: 0.6 }}
                >
                  <value.icon className="w-7 h-7" />
                </motion.div>
                <h3 className="text-xl font-display font-bold mb-3">
                  {value.title}
                </h3>
                <p className="text-gray-600">{value.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Timeline Section */}
      <section
        className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-20"
        data-testid="about-timeline-section"
      >
        <div className="text-center mb-16" data-testid="about-timeline-header">
          <h2
            className="text-4xl font-display font-bold mb-4"
            style={{ color: "var(--color-primary)" }}
            data-testid="about-timeline-title"
          >
            Our Journey
          </h2>
          <p
            className="text-xl text-gray-600"
            data-testid="about-timeline-subtitle"
          >
            Milestones that shaped who we are today
          </p>
        </div>

        <div className="relative" data-testid="about-timeline-content">
          {/* Timeline line */}
          <div
            className="absolute left-8 top-0 bottom-0 w-0.5 hidden md:block"
            style={{ backgroundColor: "var(--color-accent)" }}
            data-testid="about-timeline-line"
          />

          <div className="space-y-12" data-testid="about-timeline-items">
            {milestones.map((milestone, index) => {
              const isExpanded = expandedMilestone === index;
              return (
                <motion.div
                  key={milestone.year}
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  viewport={{ once: true }}
                  className="relative flex items-start gap-8 cursor-pointer"
                  onClick={() =>
                    setExpandedMilestone(isExpanded ? null : index)
                  }
                  data-testid={`about-timeline-item-${index}`}
                >
                  {/* Year badge */}
                  <motion.div
                    className="flex-shrink-0 w-16 h-16 rounded-full flex items-center justify-center font-bold text-white text-lg shadow-lg"
                    style={{ backgroundColor: "var(--color-accent)" }}
                    animate={isExpanded ? { scale: 1.2 } : { scale: 1 }}
                    transition={{ duration: 0.3 }}
                    whileHover={{ scale: 1.15 }}
                    data-testid={`about-timeline-year-${index}`}
                  >
                    {milestone.year}
                  </motion.div>

                  {/* Content */}
                  <motion.div
                    className="flex-1 bg-white p-6 rounded-xl shadow-sm hover:shadow-md transition-all"
                    animate={isExpanded ? { backgroundColor: "#f3f4f6" } : {}}
                    transition={{ duration: 0.3 }}
                    data-testid={`about-timeline-content-${index}`}
                  >
                    <div className="flex items-center justify-between">
                      <p
                        className="text-gray-700 text-lg font-medium"
                        data-testid={`about-timeline-event-${index}`}
                      >
                        {milestone.event}
                      </p>
                      <motion.div
                        animate={{ rotate: isExpanded ? 180 : 0 }}
                        transition={{ duration: 0.3 }}
                        className="text-xl"
                        style={{ color: "var(--color-accent)" }}
                      >
                        ▼
                      </motion.div>
                    </div>
                  </motion.div>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section
        className="bg-gray-900 text-white py-20"
        data-testid="about-stats-section"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div
            className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center"
            data-testid="about-stats-grid"
          >
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              viewport={{ once: true }}
              className="cursor-pointer"
              whileHover={{ scale: 1.1 }}
              data-testid="about-stat-0"
            >
              <motion.div
                className="text-5xl font-bold mb-2"
                style={{ color: "var(--color-accent)" }}
                whileHover={{ scale: 1.2 }}
                data-testid="about-stat-value-0"
              >
                1M+
              </motion.div>
              <div
                className="text-gray-400 text-sm uppercase tracking-wider"
                data-testid="about-stat-label-0"
              >
                Happy Customers
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
              viewport={{ once: true }}
              className="cursor-pointer"
              whileHover={{ scale: 1.1 }}
              data-testid="about-stat-1"
            >
              <motion.div
                className="text-5xl font-bold mb-2"
                style={{ color: "var(--color-accent)" }}
                whileHover={{ scale: 1.2 }}
                data-testid="about-stat-value-1"
              >
                50+
              </motion.div>
              <div
                className="text-gray-400 text-sm uppercase tracking-wider"
                data-testid="about-stat-label-1"
              >
                Premium Brands
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              viewport={{ once: true }}
              className="cursor-pointer"
              whileHover={{ scale: 1.1 }}
              data-testid="about-stat-2"
            >
              <motion.div
                className="text-5xl font-bold mb-2"
                style={{ color: "var(--color-accent)" }}
                whileHover={{ scale: 1.2 }}
                data-testid="about-stat-value-2"
              >
                25
              </motion.div>
              <div
                className="text-gray-400 text-sm uppercase tracking-wider"
                data-testid="about-stat-label-2"
              >
                Store Locations
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.3 }}
              viewport={{ once: true }}
              className="cursor-pointer"
              whileHover={{ scale: 1.1 }}
              data-testid="about-stat-3"
            >
              <motion.div
                className="text-5xl font-bold mb-2"
                style={{ color: "var(--color-accent)" }}
                whileHover={{ scale: 1.2 }}
                data-testid="about-stat-value-3"
              >
                98%
              </motion.div>
              <div
                className="text-gray-400 text-sm uppercase tracking-wider"
                data-testid="about-stat-label-3"
              >
                Satisfaction Rate
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section
        className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-20 text-center"
        data-testid="about-cta-section"
      >
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          data-testid="about-cta-content"
        >
          <h2
            className="text-4xl font-display font-bold mb-6"
            style={{ color: "var(--color-primary)" }}
            data-testid="about-cta-title"
          >
            Join Our Journey
          </h2>
          <p
            className="text-xl text-gray-600 mb-8"
            data-testid="about-cta-description"
          >
            Experience the Apex Shoes difference. Discover footwear that moves
            with you, reflects your style, and supports a sustainable future.
          </p>
          <motion.a
            href="/"
            className="inline-block px-8 py-4 text-lg font-semibold rounded-full"
            style={{
              backgroundColor: "var(--color-accent)",
              color: "white",
            }}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            data-testid="about-cta-button"
          >
            Explore Our Collection
          </motion.a>
        </motion.div>
      </section>
    </div>
  );
};

export default AboutPage;
