import React, { useRef, useState } from "react";
import emailjs from "@emailjs/browser";
import "./Contact.css";
import { useTheme } from "../context/ThemeContext";

const Contact = ({userEmail}) => {
  const formRef = useRef();
  const [status, setStatus] = useState("");
  const { theme } = useTheme();

  const sendEmail = (e) => {
    e.preventDefault();

    emailjs
      .sendForm(
        "service_e726ut3",
        "template_bx4gur3",
        formRef.current,
        "-nFZeEfMTSxMH8KUl"
      )
      .then(
        (result) => {
          setStatus("Message sent successfully!");
          formRef.current.reset();
          console.log(result);
          
        },
        (error) => {
          setStatus("Failed to send message.");
          console.error(error);
        }
      );
  };
  return (
    <div className="container">
      <div className="contact-container">
        <form ref={formRef} onSubmit={sendEmail} className={`contact-form ${theme}`}>
          <h2>Contact Us</h2>
          <input type="text" name="user_name" placeholder="Your Name" required />
          <input type="email" name="user_email" value={userEmail} className={`${theme}`} disabled  placeholder="Your Email" required />
          <textarea name="message" placeholder="Your Message" required />
          <button type="submit">Send Message</button>
          {status && <p className="status">{status}</p>}
        </form>
      </div>
    </div>
  );
};

export default Contact;
