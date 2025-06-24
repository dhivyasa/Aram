import React from "react";

const About = () => {
  return (
    <div style={{ padding: "2rem", maxWidth: "600px", margin: "0 auto" }}>
      <h1>About Us</h1>
      <p>
        Welcome to our website! We are passionate about delivering quality
        content and exceptional experiences to our users.
      </p>
      <p>
        Our mission is to help you achieve your goals by providing reliable
        solutions and up-to-date information.
      </p>
      <h2>Our Team</h2>
      <ul>
        <li>Jane Doe - Founder & CEO</li>
        <li>John Smith - Lead Developer</li>
        <li>Emily Johnson - Content Manager</li>
      </ul>
      <h2>Contact</h2>
      <p>
        You can reach us at{" "}
        <a href="mailto:info@example.com">info@example.com</a>.
      </p>
    </div>
  );
};

export default About;
