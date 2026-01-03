import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

export function useUserRole() {
  return useQuery({
    queryKey: ["user-role"],
    queryFn: async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return { isAdmin: false, roles: [] };

      const { data, error } = await supabase
        .from("user_roles")
        .select("role")
        .eq("user_id", user.id);

      if (error) {
        console.error("Error fetching user roles:", error);
        return { isAdmin: false, roles: [] };
      }

      const roles = data?.map((r) => r.role) || [];
      return {
        isAdmin: roles.includes("admin"),
        roles,
      };
    },
  });
}

export function useAllUsers() {
  return useQuery({
    queryKey: ["all-users-with-roles"],
    queryFn: async () => {
      // Get all users from auth (we'll use profiles if available, otherwise just roles)
      const { data: rolesData, error: rolesError } = await supabase
        .from("user_roles")
        .select("user_id, role, created_at");

      if (rolesError) {
        console.error("Error fetching roles:", rolesError);
        throw rolesError;
      }

      // Group roles by user_id
      const userRolesMap = new Map<string, { roles: string[], created_at: string }>();
      rolesData?.forEach((r) => {
        if (!userRolesMap.has(r.user_id)) {
          userRolesMap.set(r.user_id, { roles: [], created_at: r.created_at });
        }
        userRolesMap.get(r.user_id)!.roles.push(r.role);
      });

      return Array.from(userRolesMap.entries()).map(([userId, data]) => ({
        user_id: userId,
        roles: data.roles,
        created_at: data.created_at,
      }));
    },
  });
}
