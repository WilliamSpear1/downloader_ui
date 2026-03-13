import server from "@/api/axiosInstance";
import type { Schema } from "@/schemas/formSchema";
import axios from "axios";
import { useEffect, useState } from "react";
import type { UseFormReturn } from "react-hook-form";

const useDownloaderForm = (form: UseFormReturn<Schema>) => {
  const [showSuccess, setShowSuccess] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

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
