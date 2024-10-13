import { useState, useEffect } from "react";
import { futura_backend } from "declarations/futura_backend";
import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
import Dashboard from "./components/Dashboard";
import Authentication from "./components/Authentication";
import { Hero } from "@/components/Hero";
import { Pricing } from "@/components/Pricing";
import { Testimonials } from "@/components/Testimonials";
import { Team } from "./components/Team";
import { Features } from "./components/Features";
import { Logos } from "./components/Logos";
import GreetComponent from "./components/GreetComponent";

function App() {
  const [greeting, setGreeting] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleOpenModal = () => setIsModalOpen(true);
  const handleCloseModal = () => setIsModalOpen(false);

  function handleSubmit(event) {
    event.preventDefault();
    const name = event.target.elements.name.value;
    futura_backend.greet(name).then((greeting) => {
      setGreeting(greeting);
    });
    return false;
  }

  return (
    <Router>
      <Routes>
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/authentication" element={<Authentication />} />
        <Route
          path="/"
          element={
            <main className="flex flex-col items-center p-6">
              <Hero />
              <Features />
              <Pricing />
              <Testimonials />
              <Team />
              <Logos />
              <GreetComponent />
            </main>
          }
        />
      </Routes>
    </Router>
  );
}

export default App;
