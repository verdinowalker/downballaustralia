import { adminResources as baseAdminResources } from "./admin-config";

const playerFields = baseAdminResources.players.fields.flatMap((field) =>
  field.key === "height_cm"
    ? [field, { key: "weight_kg", label: "Weight (kg)", type: "number" as const }]
    : [field]
);

export const adminResources = {
  ...baseAdminResources,
  players: {
    ...baseAdminResources.players,
    description: "Manage player profiles, photos, teams, heights, weights and statistics.",
    fields: playerFields
  }
};
