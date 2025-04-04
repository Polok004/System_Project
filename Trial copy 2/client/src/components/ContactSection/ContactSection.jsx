import React, { useState, useRef } from 'react';
import emailjs from '@emailjs/browser';
import { toast } from 'react-hot-toast';
import './ContactSection.scss';

const ContactSection = () => {
  const form = useRef();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const sendEmail = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const result = await emailjs.sendForm(
        'polok_004',
        'template_xzwjtsb',
        form.current,
        'r2Afcu1SVjgIBOCat'
      );

      if (result.text === 'OK') {
        toast.success('Message sent successfully!');
        form.current.reset();
      }
    } catch (error) {
      toast.error('Failed to send message. Please try again.');
      console.error('EmailJS Error:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section className="contact-section">
      <div className="contact-container">
        <div className="contact-info">
          <h2>Get in Touch</h2>
          <p className="subtitle">Let's discuss your real estate needs</p>
          
          <div className="info-cards">
            <div className="info-card">
              <div className="icon">📍</div>
              <h3>Our Location</h3>
              <p>123 Real Estate Ave, City, Country</p>
            </div>
            
            <div className="info-card">
              <div className="icon">📞</div>
              <h3>Phone Number</h3>
              <p>+1 (234) 567-8900</p>
            </div>
            
            <div className="info-card">
              <div className="icon">✉️</div>
              <h3>Email Address</h3>
              <p>contact@realestate.com</p>
            </div>
          </div>
        </div>

        <div className="contact-form-container">
          <form ref={form} onSubmit={sendEmail} className="contact-form">
            <div className="form-header">
              <h3>Send us a Message</h3>
              <p>Fill out the form below and we'll get back to you soon</p>
            </div>

            <div className="input-group">
              <input
                type="text"
                name="user_name"
                placeholder="Your Name"
                required
              />
              <span className="focus-border"></span>
            </div>

            <div className="input-group">
              <input
                type="email"
                name="user_email"
                placeholder="Your Email"
                required
              />
              <span className="focus-border"></span>
            </div>

            <div className="input-group">
              <input
                type="text"
                name="subject"
                placeholder="Subject"
                required
              />
              <span className="focus-border"></span>
            </div>

            <div className="input-group">
              <textarea
                name="message"
                placeholder="Your Message"
                required
              ></textarea>
              <span className="focus-border"></span>
            </div>

            <button 
              type="submit" 
              className={`submit-btn ${isSubmitting ? 'submitting' : ''}`}
              disabled={isSubmitting}
            >
              {isSubmitting ? 'Sending...' : 'Send Message'}
            </button>
          </form>
        </div>
      </div>
    </section>
  );
};

export default ContactSection; 