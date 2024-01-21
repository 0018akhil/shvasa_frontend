import { Link } from "react-router-dom";
import "./App.css";
import companyLogo from "./assets/hero.svg";
import { useEffect, useState } from "react";
import "react-toastify/dist/ReactToastify.css";

function App() {
  const [agents, setAgents] = useState<any[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(
          "http://165.232.180.63:4000/api/support-agents",
          {
            method: "GET",
            headers: { "Content-Type": "application/json" },
          }
        );
        const apiResponse = await response.json();
        setAgents(apiResponse.data);
      } catch (error) {
        console.log(error);
      }
    };

    fetchData();
  }, []);

  return (
    <div className="h-screen flex flex-col justify-center items-center bg-black text-white font-sans">
      <img
        src={companyLogo}
        alt="Company Logo"
        className="h-12 sm:h-16 md:h-18 lg:h-32 mb-4 sm:mb-8 animate-fadeIn"
      />
      <div className="w-2/4 sm:w-1/4 max-w-xs md:max-w-md lg:max-w-lg border-t border-gray-300 animate-ping"></div>
      <div className="space-x-2 sm:space-x-4 mt-4 sm:mt-8 animate-opacity">
        <Link to="/supportagent">
          <button className="bg-orange-500 hover:bg-orange-600 text-white font-bold text-sm py-2 px-4 rounded transition duration-300 ease-in-out transform hover:-translate-y-1 hover:scale-110">
            Create Agent
          </button>
        </Link>
        <Link to="/supportticket">
          <button className="bg-orange-500 hover:bg-orange-600 text-white font-bold text-sm py-2 px-4 rounded transition duration-300 ease-in-out transform hover:-translate-y-1 hover:scale-110">
            Create Ticket
          </button>
        </Link>
        <Link to="/tickets">
          <button className="bg-gray-500 hover:bg-gray-600 text-white font-bold text-sm py-2 px-4 rounded transition duration-300 ease-in-out transform hover:-translate-y-1 hover:scale-110">
            View Tickets
          </button>
        </Link>
      </div>
      <div className="flex flex-col w-2/3 md:max-w-2xl md:max-h-1/3 lg:max-w-4xl px-4 md:px-10 bg-gray-800 rounded-lg shadow-xl p-6 mt-6 overflow-auto">
        <div className="overflow-x-auto">
          <table className="min-w-full text-white">
            <thead>
              <tr>
                <th className="px-4 py-2 text-left">Name</th>
                <th className="px-4 py-2 text-left">Email</th>
                <th className="px-4 py-2 text-left">Phone</th>
                <th className="px-4 py-2 text-left">Created</th>
              </tr>
            </thead>
            <tbody>
              {agents.length === 0 ? (
                <tr>
                  <td className="px-4 py-2 text-left">No Agents</td>
                </tr>
              ) : (
                agents.length > 0 &&
                agents.map((agent, index) => (
                  <tr key={index}>
                    <td className="px-4 py-2 text-left">{agent.name}</td>
                    <td className="px-4 py-2 text-left">{agent.email}</td>
                    <td className="px-4 py-2 text-left">{agent.phone}</td>
                    <td className="px-4 py-2 text-left">{new Date(agent.createdAt).toLocaleString()}</td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

export default App;
