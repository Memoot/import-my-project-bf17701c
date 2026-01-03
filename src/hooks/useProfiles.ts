import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

export interface Profile {
  id: string;
  email: string | null;
  display_name: string | null;
  created_at: string;
  updated_at: string;
}

export function useProfiles() {
  return useQuery({
    queryKey: ["profiles"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("profiles")
        .select("*")
        .order("created_at", { ascending: false });

      if (error) throw error;
      return data as Profile[];
    },
  });
}

// Escape SQL wildcard characters to prevent pattern injection
const escapeSqlWildcards = (input: string): string => {
  return input.replace(/[%_\\]/g, '\\$&');
};

export function useSearchProfileByEmail(email: string) {
  return useQuery({
    queryKey: ["profile-search", email],
    queryFn: async () => {
      if (!email.trim()) return null;
      
      // Sanitize input by escaping SQL wildcards
      const sanitizedEmail = escapeSqlWildcards(email.trim());
      
      const { data, error } = await supabase
        .from("profiles")
        .select("*")
        .ilike("email", `%${sanitizedEmail}%`)
        .limit(10);

      if (error) throw error;
      return data as Profile[];
    },
    enabled: email.trim().length > 2,
  });
}
