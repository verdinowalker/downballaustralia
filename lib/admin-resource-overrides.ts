import type { AdminResource } from "./admin-config";

export function applyAdminResourceOverrides(slug: string, resource: AdminResource): AdminResource {
  if (slug !== "players" || resource.fields.some((field) => field.key === "weight_kg")) {
    return resource;
  }

  const heightIndex = resource.fields.findIndex((field) => field.key === "height_cm");
  const fields = [...resource.fields];
  fields.splice(heightIndex >= 0 ? heightIndex + 1 : fields.length, 0, {
    key: "weight_kg",
    label: "Weight (kg)",
    type: "number"
  });

  return {
    ...resource,
    description: "Manage player profiles, photos, teams, height, weight and statistics.",
    fields
  };
}
