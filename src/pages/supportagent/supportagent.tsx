import { useState } from "react";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import home from "../../assets/home.svg";
import { Link } from "react-router-dom";
import syncronizingImg from "../../assets/synchronize.svg";

const initalAgentState: AgentState = {
  name: "",
  email: "",
  phone: "",
  description: "",
};

function SupportAgent() {
  const [agent, setAgent] = useState<AgentState>(initalAgentState);
  const [errors, setErrors] = useState<Errors>({});
  const [loading, setLoading] = useState<boolean>(false);

  const validateField = (name: any, value: any) => {
    switch (name) {
      case "name":
        return value ? "" : "Name is required";
      case "email":
        return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)
          ? ""
          : "Email is not valid";
      case "phone":
        return value.length > 9 ? "" : "Phone number is too short";
      case "description":
        return value ? "" : "Description is required";
      default:
        return "";
    }
  };

  const handleInputChange = (e: any) => {
    const { name, value } = e.target;
    const updatedAgent = { ...agent, [name]: value };
    const error = validateField(name, value);
    setAgent(updatedAgent);
    setErrors({ ...errors, [name]: error });
  };

  const validate = () => {
    let tempErrors: Errors = {};
    tempErrors.name = agent.name ? "" : "Name is required";
    tempErrors.email = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(agent.email)
      ? ""
      : "Email is not valid";
    tempErrors.phone =
      agent.phone.length > 9 ? "" : "Phone number is too short";
    tempErrors.description = agent.description ? "" : "Description is required";
    setErrors(tempErrors);
    return Object.values(tempErrors).every((x) => x === "");
  };

  const handleSubmit = async (e: any) => {
    e.preventDefault();
    if (validate()) {
      setLoading(true);
      try {
        const response = await fetch(
          "http://165.232.180.63:4000/api/support-agents",
          {
            method: "POST",
            body: JSON.stringify(agent),
            headers: {
              "Content-Type": "application/json",
            },
          }
        );
        if (response.status == 201) {
          toast.success("Agent created successfully");
          setAgent(initalAgentState);
          setLoading(false);
        } else if (response.status == 400) {
          const message = await response.json();
          toast.error(message.error);
          setLoading(false);
        }
        else {
          toast.error("Something went wrong");
          setLoading(false);
        }
      } catch (error) {
        toast.error("Something went wrong");
        setLoading(false);
      }
    }
  };

  return (
    <div className="flex flex-col h-screen justify-center items-center bg-black">
      <div className="text-white w-1/3 p-4 sm:p-8 rounded bg-gray-800 shadow-lg transform transition duration-500 hover:scale-105">
        <Link
          to="/"
          className="flex justify-center items-center mb-4 sm:mb-6 md:mb-8 hover:cursor-pointer"
        >
          <img src={home} alt="Home" className="h-8" />
        </Link>
        <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-4 sm:mb-6 md:mb-10 text-center">
          Create Agent
        </h2>
        <form
          onSubmit={handleSubmit}
          className="space-y-2 sm:space-y-3 md:space-y-4"
        >
          <div>
            <input
              type="text"
              name="name"
              placeholder="Name"
              value={agent.name}
              onChange={handleInputChange}
              className="w-full px-4 py-3 rounded text-black focus:ring-2 focus:ring-blue-500 transition duration-300"
            />
            <p
              className={`text-red-500 text-xs sm:text-sm italic ${
                errors.name ? "block" : "hidden"
              }`}
            >
              {errors.name || "Placeholder"}
            </p>
          </div>
          <div>
            <input
              type="email"
              name="email"
              placeholder="Email"
              value={agent.email}
              onChange={handleInputChange}
              className="w-full px-4 py-3 rounded text-black focus:ring-2 focus:ring-blue-500 transition duration-300"
            />
            <p
              className={`text-red-500 text-xs sm:text-sm italic ${
                errors.email ? "block" : "hidden"
              }`}
            >
              {errors.email || "Placeholder"}
            </p>
          </div>
          <div>
            <input
              type="tel"
              name="phone"
              placeholder="Phone"
              value={agent.phone}
              onChange={handleInputChange}
              className="w-full px-4 py-3 rounded text-black focus:ring-2 focus:ring-blue-500 transition duration-300"
            />
            <p
              className={`text-red-500 text-xs sm:text-sm italic ${
                errors.phone ? "block" : "hidden"
              }`}
            >
              {errors.phone || "Placeholder"}
            </p>
          </div>
          <div>
            <textarea
              name="description"
              placeholder="Description"
              value={agent.description}
              onChange={handleInputChange}
              className="w-full px-4 py-3 rounded text-black focus:ring-2 focus:ring-blue-500 transition duration-300"
            />
            <p
              className={`text-red-500 text-xs sm:text-sm italic ${
                errors.description ? "block" : "hidden"
              }`}
            >
              {errors.description || "Placeholder"}
            </p>
          </div>
          <button
            type="submit"
            className="flex justify-center w-full bg-orange-500 hover:bg-orange-600 text-white font-bold py-2 sm:py-3 px-4 rounded transition duration-300 ease-in-out transform hover:-translate-y-1"
            disabled={loading}
          >
            { loading ? <img src={syncronizingImg} alt="loading" className="animate-spin"/> : 'Create Agent' }
          </button>
        </form>
      </div>
      <ToastContainer />
    </div>
  );
}

export default SupportAgent;
