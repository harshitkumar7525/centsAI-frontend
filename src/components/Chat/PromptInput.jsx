import { useContext, useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { UserContext } from "../../context/userContext";

export default function PromptInput() {
  const { register, handleSubmit, reset } = useForm();
  const [isLoading, setIsLoading] = useState(false);
  const { api, setChats, chats } = useContext(UserContext);

  useEffect(() => {
    console.log("Chats updated:", chats);
  }, [chats]);

  function generateMessage(responseArray) {
    responseArray.forEach((res) => {
      const message = {
        role: "assistant",
        content: res?.amount
          ? `Added ₹${res.amount} to ${res.category} on ${new Date(res.transactionDate).toLocaleDateString()}.`
          : "I'm sorry, I couldn't generate a response.",
        date: new Date().toISOString(),
      };
      setChats((prevChats) => [...prevChats, message]);
    });
  }

  const onSubmit = async (data) => {
    const trimmedPrompt = data.prompt.trim();
    if (!trimmedPrompt) return;

    setIsLoading(true);
    try {
      // Add user message immediately
      const userMessage = {
        role: "user",
        content: trimmedPrompt,
        date: new Date().toISOString(),
      };
      setChats((prevChats) => [...prevChats, userMessage]);

      const response = await api.post("/api/putdata", { prompt: trimmedPrompt });
      if (response.status === 200) {
        generateMessage(response.data);
      } else {
        console.error("Error submitting prompt:", response.statusText);
      }
      reset();
    } catch (error) {
      console.error("An error occurred during the request:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="flex items-center w-full max-w-2xl p-2 bg-gray-800 rounded-full shadow-lg z-10"
    >
      {/* Input */}
      <input
        type="text"
        placeholder="Type your prompt here..."
        {...register("prompt", { required: true })}
        className={`flex-1 bg-transparent text-gray-200 placeholder-gray-400 focus:outline-none px-4 ${
          isLoading ? "cursor-not-allowed text-gray-500" : ""
        }`}
        disabled={isLoading}
      />

      {/* Send Button */}
      <button
        type="submit"
        className={`pr-3 ${isLoading ? "text-gray-600" : "text-gray-400 hover:text-gray-200"}`}
        disabled={isLoading}
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="w-5 h-5"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          strokeWidth="2"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M5 12l14-7-7 14-2-5-5-2z"
          />
        </svg>
      </button>
    </form>
  );
}
