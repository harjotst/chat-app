const mongoose = require('mongoose');

const Activity = require('../../models/Activity');

const connectDB = async () => {
  await mongoose.connect(
    'mongodb+srv://harjotst:test1234@cluster0.sypn4.mongodb.net/?retryWrites=true&w=majority',
    {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    }
  );
  console.log('Connected to database.');
};

connectDB().then(() => {
  const userIds = ['644b06df40cddb69795b52f2', '644b072640cddb69795b52f8'];

  const roomId = '6452b0b13a026568a9b272c7';

  async function createActivities() {
    for (let i = 0; i < 50; i++) {
      const userId = userIds[Math.floor(Math.random() * userIds.length)];

      const activity = new Activity({
        contentType: 'message',
        content: `Unique message ${i + 1}`,
        userId,
        roomId,
      });

      await activity.save();
    }

    console.log('50 unique message activities created!');

    mongoose.connection.close();
  }

  createActivities()
    .then(() => {
      console.log('Inserted test data.');

      process.exit(0);
    })
    .catch((error) => console.error(error));
});
