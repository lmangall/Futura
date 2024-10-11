import { useState } from "react";
import { futura_backend } from "declarations/futura_backend";

function Greeting() {
  const [greeting, setGreeting] = useState("");
  const [name, setName] = useState("");

  const handleSubmit = (event) => {
    event.preventDefault();
    const name = event.target.elements.name.value;
    futura_backend.greet(name).then((greeting) => {
      setGreeting(greeting);
    });
    return false;
  };

  return (
    <div className="max-w-md mx-auto bg-white p-6 rounded-lg shadow-md">
      <form onSubmit={handleSubmit} className="space-y-4">
        <label htmlFor="name" className="block text-lg font-medium text-gray-700">
          Enter your name:
        </label>
        <input
          id="name"
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Type your name"
          className="block w-full p-3 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
        />
        <button
          type="submit"
          className="w-full px-4 py-2 bg-blue-500 text-white font-semibold rounded-md hover:bg-blue-600 transition-colors"
        >
          Click Me!
        </button>
      </form>
      {greeting && (
        <section id="greeting" className="mt-6 p-4 bg-gray-100 border border-gray-300 rounded-lg text-center">
          <p className="text-xl font-semibold text-gray-700">{greeting}</p>
        </section>
      )}
    </div>
  );
}

export default GreetingForm;
