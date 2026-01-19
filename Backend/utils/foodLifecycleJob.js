const cron = require('node-cron');
const Food = require('../models/food');

const startFoodLifecycleJob = () => {
  // Runs every day at midnight
  cron.schedule('0 0 * * *', async () => {
    try {
      const threeDaysAgo = new Date();
      threeDaysAgo.setDate(threeDaysAgo.getDate() - 3);

      const result = await Food.updateMany(
        {
          foodType: 'edible',
          createdAt: { $lte: threeDaysAgo },
        },
        {
          foodType: 'compost',
        }
      );

      console.log(
        `[Food Lifecycle Job] Updated ${result.modifiedCount} food items to compost`
      );
    } catch (error) {
      console.error('[Food Lifecycle Job] Error:', error.message);
    }
  });
};

module.exports = startFoodLifecycleJob;