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
// import { Footer } from "./components/Footer";
// import MemoryForm from "./components/MemoryForm";
// import ImageUploadForm from "./components/ImageUploadForm";
// import { Button } from "./components/ui/button";
// import UploadModal from "@/components/modals/UploadModal";

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
              {/* <Footer /> */}
              {/* <img
                src="/logo2.svg"
                alt="DFINITY logo"
                className="max-w-[50vw] max-h-[25vw] block m-auto"
              />
              <br />
              <div>
                <Button>
                  <Link to="/dashboard">Go to Dashboard</Link>
                </Button>
              </div>
              <MemoryForm />
              <Button onClick={handleOpenModal}>Upload</Button>
              <UploadModal isOpen={isModalOpen} onClose={handleCloseModal} />
              <ImageUploadForm />
              <Button>
                <Link to="/authentication">Log in</Link>
              </Button> */}
            </main>
          }
        />
      </Routes>
    </Router>
  );
}

export default App;
