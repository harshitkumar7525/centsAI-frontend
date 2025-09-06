import axios from "axios";
import { useState } from "react";
import { useForm } from "react-hook-form";
export default function PromptInput() {
  const { register, handleSubmit, reset } = useForm();
  const [isLoading, setIsLoading] = useState(false);
  const onSubmit = async (data) => {
    setIsLoading(true);
    try {
      const response = await axios.post("http://localhost:3000/putdata", data);
      if (response.status !== 200) {
        console.error("Error submitting prompt:", response.statusText);
        return;
      }
      console.log("Prompt submitted:", data.prompt);
      console.dir(response.data);
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
      className="flex items-center w-full max-w-2xl p-2 bg-gray-800 rounded-full shadow-lg"
    >
      {/* Input */}
      <input
        type="text"
        placeholder="Type your prompt here..."
        {...register("prompt", { required: true })}
        className={`flex-1 bg-transparent text-gray-200 placeholder-gray-400 focus:outline-none px-4 ${
          isLoading ? "cursor-not-allowed text-gray-500" : null
        }`}
        disabled={isLoading}
      />

      {/* Send Button */}
      <button
        type="submit"
        className="text-gray-400 hover:text-gray-200 pr-3"
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
