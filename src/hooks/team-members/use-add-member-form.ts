"use client";

import { MemberFormData } from "@/types/team-members/team-members";
import { useState, useCallback } from "react";

const initialState: MemberFormData = {
  name: "",
  role: "",
  bio: "",
  expertise: [],
  image: "",
  email: "",
  password: "",
  mobile: "",
};

export function useAddMemberForm() {
  const [formData, setFormData] = useState<MemberFormData>(initialState);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const updateField = useCallback(
    (field: keyof MemberFormData, value: string) => {
      setFormData((prev) => ({
        ...prev,
        [field]: value,
      }));
      setError(null);
    },
    []
  );

  const addExpertise = useCallback(
    (expertise: string) => {
      const trimmed = expertise.trim().toLowerCase();
      if (trimmed && !formData.expertise.includes(trimmed)) {
        setFormData((prev) => ({
          ...prev,
          expertise: [...prev.expertise, trimmed],
        }));
      }
    },
    [formData.expertise]
  );

  const removeExpertise = useCallback((expertise: string) => {
    setFormData((prev) => ({
      ...prev,
      expertise: prev.expertise.filter((e) => e !== expertise),
    }));
  }, []);

  const setImage = useCallback((imageUrl: string) => {
    setFormData((prev) => ({
      ...prev,
      image: imageUrl,
    }));
  }, []);

  const resetForm = useCallback(() => {
    setFormData(initialState);
    setError(null);
    setSuccess(false);
  }, []);

  const setFormLoading = useCallback((loading: boolean) => {
    setIsLoading(loading);
  }, []);

  const setFormError = useCallback((err: string | null) => {
    setError(err);
  }, []);

  const setFormSuccess = useCallback((success: boolean) => {
    setSuccess(success);
  }, []);

  return {
    formData,
    isLoading,
    error,
    success,
    updateField,
    addExpertise,
    removeExpertise,
    setImage,
    resetForm,
    setFormLoading,
    setFormError,
    setFormSuccess,
  };
}
