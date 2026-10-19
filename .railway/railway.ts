import { defineRailway, github, project, service } from "railway/iac";

// This repository manages only the bot service. MySQL remains managed by the
// Railway project so service variables and the persistent volume stay intact.
export const partial = "weather-bot";

export default defineRailway(() => {
  const weatherBot = service("weather-bot", {
    source: github("white921/discord-weather-bot", {
      branch: "main",
      checkSuites: false,
    }),
    build: {
      buildCommand: "npm run build",
      buildEnvironment: "V3",
      builder: "NIXPACKS",
    },
    start: "npm start",
    preDeploy: "npx prisma migrate deploy",
    replicas: { "asia-southeast1-eqsg3a": 1 },
  });

  return project("discord-weather-bot", {
    variables: { managed: false },
    resources: [weatherBot],
  });
});
