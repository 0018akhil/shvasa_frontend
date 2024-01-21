import { useState } from "react";
import { Link } from "react-router-dom";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import home from "../../assets/home.svg";
import syncronizingImg from "../../assets/synchronize.svg";

const initialTicketState: Ticket = {
  topic: "",
  description: "",
  severity: "",
  type: "",
};

const ticketTypes: string[] = ["Technical", "Billing", "Support", "Other"];
const severityLevels: string[] = ["Low", "Medium", "High", "Critical"];

function SupportTicket() {
  const [ticket, setTicket] = useState<Ticket>(initialTicketState);
  const [errors, setErrors] = useState<TicketErrors>({});
  const [loading, setLoading] = useState<boolean>(false);

  const validateField = (name: string, value: any) => {
    switch (name) {
      case "topic":
        return value ? "" : "Topic is required";
      case "description":
        return value ? "" : "Description is required";
      case "severity":
        return severityLevels.includes(value) ? "" : "Invalid severity";
      case "type":
        return ticketTypes.includes(value) ? "" : "Invalid type";
      default:
        return "";
    }
  };

  const handleInputChange = (e: any) => {
    const { name, value } = e.target;
    const updatedTicket = { ...ticket, [name]: value };
    const error = validateField(name, value);
    setTicket(updatedTicket);
    setErrors({ ...errors, [name]: error });
  };

  const validate = () => {
    let tempErrors: TicketErrors = {};
    console.log("Tickets");
    tempErrors.topic = ticket.topic ? "" : "Topic is required";
    tempErrors.description = ticket.description
      ? ""
      : "Description is required";
    tempErrors.severity = severityLevels.includes(ticket.severity)
      ? ""
      : "Invalid severity";
    tempErrors.type = ticketTypes.includes(ticket.type) ? "" : "Invalid type";
    setErrors(tempErrors);
    return Object.values(tempErrors).every((x) => x === "");
  };

  const handleSubmit = async (e: any) => {
    e.preventDefault();
    if (validate()) {
      setLoading(true);

      try {
        const response = await fetch(
          "https://165.232.180.63/api/support-tickets",
          {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(ticket),
          }
        );
        if (response.status == 201) {
          setTicket(initialTicketState);
          toast.success("Ticket created successfully");
          setLoading(false);
        } else if (response.status == 400) {
          const message = await response.json();
          toast.error(message.error);
          setLoading(false);
        } else {
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
    <div className="flex h-screen justify-center items-center bg-black">
      <div className="text-white w-1/3 p-4 sm:p-8 rounded bg-gray-800 shadow-lg transform transition duration-500 hover:scale-105">
        <Link
          to="/"
          className="flex justify-center items-center mb-4 sm:mb-6 md:mb-8 hover:cursor-pointer"
        >
          <img src={home} alt="Home" className="h-8" />
        </Link>
        <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-4 sm:mb-6 md:mb-10 text-center">
          Create Ticket
        </h2>
        <form
          onSubmit={handleSubmit}
          className="space-y-2 sm:space-y-3 md:space-y-4"
        >
          {/* Topic */}
          <div>
            <input
              type="text"
              name="topic"
              placeholder="Topic"
              value={ticket.topic}
              onChange={handleInputChange}
              className="w-full px-4 py-3 rounded text-black focus:ring-2 focus:ring-blue-500 transition duration-300"
            />
            <p
              className={`text-red-500 text-xs italic ${
                errors.topic ? "block" : "hidden"
              }`}
            >
              {errors.topic}
            </p>
          </div>
          {/* Description */}
          <div>
            <textarea
              name="description"
              placeholder="Description"
              value={ticket.description}
              onChange={handleInputChange}
              className="w-full px-4 py-3 rounded text-black focus:ring-2 focus:ring-blue-500 transition duration-300"
            />
            <p
              className={`text-red-500 text-xs italic ${
                errors.description ? "block" : "hidden"
              }`}
            >
              {errors.description}
            </p>
          </div>
          {/* Severity */}
          <div>
            <select
              name="severity"
              value={ticket.severity}
              onChange={handleInputChange}
              className="w-full px-4 py-3 rounded text-black focus:ring-2 focus:ring-blue-500 transition duration-300"
            >
              <option value="">Select Severity</option>
              {severityLevels.map((level, index) => (
                <option key={index} value={level}>
                  {level}
                </option>
              ))}
            </select>
            <p
              className={`text-red-500 text-xs italic ${
                errors.severity ? "block" : "hidden"
              }`}
            >
              {errors.severity}
            </p>
          </div>
          {/* Type */}
          <div>
            <select
              name="type"
              value={ticket.type}
              onChange={handleInputChange}
              className="w-full px-4 py-3 rounded text-black focus:ring-2 focus:ring-blue-500 transition duration-300"
            >
              <option value="">Select Type</option>
              {ticketTypes.map((type, index) => (
                <option key={index} value={type}>
                  {type}
                </option>
              ))}
            </select>
            <p
              className={`text-red-500 text-xs italic ${
                errors.type ? "block" : "hidden"
              }`}
            >
              {errors.type}
            </p>
          </div>
          {/* Submit Button */}
          <button
            type="submit"
            className="w-full bg-orange-500 hover:bg-orange-600 text-white font-bold py-2 sm:py-3 px-4 rounded transition duration-300 ease-in-out transform hover:-translate-y-1"
            disabled={loading}
          >
            {loading ? (
              <img
                src={syncronizingImg}
                alt="loading"
                className="animate-spin"
              />
            ) : (
              "Create Ticket"
            )}
          </button>
        </form>
      </div>
      <ToastContainer />
    </div>
  );
}

export default SupportTicket;
