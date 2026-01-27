const cron = require("node-cron");
const Food = require("../models/food");

const startFoodLifecycleJob = () => {
  console.log("[Food Lifecycle Job] Initialized");

  // Run every day at midnight
  cron.schedule("0 0 * * *", async () => {
    try {
      console.log("[Food Lifecycle Job] Running...");

      const threeDaysAgo = new Date();
      threeDaysAgo.setDate(threeDaysAgo.getDate() - 3);

      const result = await Food.updateMany(
        {
          foodType: "edible",
          status: "available",
          createdAt: { $lte: threeDaysAgo },
        },
        {
          $set: {
            foodType: "compost",
            status: "picked", // optional but logical
          },
        }
      );

      console.log(
        `[Food Lifecycle Job] Converted ${result.modifiedCount} food items to compost`
      );
    } catch (error) {
      console.error("[Food Lifecycle Job] Error:", error);
    }
  });
};

module.exports = startFoodLifecycleJob;