
import { useEffect, useState } from "react";
import { supabase } from "../lib/supabase";
import { initialFields } from "../data/defaults";

export function useFormFields() {
  const [formFields, setFormFields] = useState(initialFields);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadFields() {
      try {
        const { data, error } = await supabase
          .from("form_fields")
          .select("*")
          .eq("is_active", true)
          .order("sort_order", { ascending: true });

        if (!error && data?.length) {
          setFormFields(data);
        }
      } finally {
        setLoading(false);
      }
    }

    loadFields();
  }, []);

  return {
    formFields,
    setFormFields,
    loading,
  };
}