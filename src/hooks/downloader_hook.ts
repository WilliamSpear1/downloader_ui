import server from "@/api/axiosInstance";
import type { Schema } from "@/schemas/formSchema";
import axios from "axios";
import { useEffect, useState } from "react";
import type { UseFormReturn } from "react-hook-form";

/**
 * Manages download submission, loading state, and temporary success feedback.
 * @param form The form controller to reset after a successful submission.
 * @returns Submission state and the form submit handler.
 */
const useDownloaderForm = (form: UseFormReturn<Schema>) => {
  const [showSuccess, setShowSuccess] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  /**
   * Posts validated form data and updates the form and request states.
   * @param data Validated download form values.
   */
  const handleOnSubmit = async (data: Schema) => {
    setIsLoading(true);

    try {
      await server.post("/download", data);
      console.log(data);
      console.log(isLoading);
      form.reset();
      setShowSuccess(true);
    } catch (error: unknown) {
      if (axios.isAxiosError(error)) {
        // If Flask returns a 4xx or 5xx code, it jumps here
        console.error("Server returned error code:", error.status);
        console.error("Error message:", error.response);
      } else {
        console.error("Network or Setup Error:", error);
      }
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    setTimeout(() => {
      setIsLoading(false);
    }, 3000);
  }, []);

  useEffect(() => {
    if (!showSuccess) return;

    const timer = setTimeout(() => setShowSuccess(false), 5000);
    return () => clearTimeout(timer);
  }, [showSuccess]);

  return {
    showSuccess,
    isLoading,
    handleOnSubmit,
  };
};

export default useDownloaderForm;
