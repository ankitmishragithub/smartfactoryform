const mongoose = require('mongoose');
const Response = require('./models/Response');

async function fixDatabase() {
  try {
    // Connect to MongoDB
    const mongoUri = process.env.MONGO_URI || 'mongodb://localhost:27017/formsdb';
    console.log('Connecting to MongoDB...');
    await mongoose.connect(mongoUri);
    console.log('Connected to MongoDB');

    // Find responses missing essential fields
    const brokenResponses = await Response.find({
      $or: [
        { submitterName: { $exists: false } },
        { submitterEmail: { $exists: false } },
        { answers: { $exists: false } }
      ]
    });

    console.log(`Found ${brokenResponses.length} responses that need fixing`);

    if (brokenResponses.length === 0) {
      console.log('All responses already have the required fields!');
      return;
    }

    // Show what we found
    console.log('\nCurrent broken responses:');
    brokenResponses.forEach((response, index) => {
      console.log(`${index + 1}. ID: ${response._id}`);
      console.log(`   - Has submitterName: ${!!response.submitterName}`);
      console.log(`   - Has submitterEmail: ${!!response.submitterEmail}`);
      console.log(`   - Has answers: ${!!response.answers}`);
      console.log(`   - Form: ${response.form}`);
      console.log(`   - Submitted: ${response.submittedAt}`);
    });

    // Ask for confirmation (in a real scenario)
    console.log('\nFixing responses...');

    for (let i = 0; i < brokenResponses.length; i++) {
      const response = brokenResponses[i];
      
      const updateData = {};
      
      // Add missing submitterName
      if (!response.submitterName) {
        updateData.submitterName = 'Legacy User';
      }
      
      // Add missing submitterEmail  
      if (!response.submitterEmail) {
        updateData.submitterEmail = 'legacy@example.com';
      }
      
      // Add missing answers (empty object if not exists)
      if (!response.answers) {
        updateData.answers = {};
      }

      // Update the response
      await Response.updateOne(
        { _id: response._id },
        { $set: updateData }
      );

      console.log(`Fixed response ${i + 1}/${brokenResponses.length}: ${response._id}`);
    }

    console.log('\n✅ Database fix completed!');
    
    // Verify the fix
    const stillBroken = await Response.find({
      $or: [
        { submitterName: { $exists: false } },
        { submitterEmail: { $exists: false } },
        { answers: { $exists: false } }
      ]
    });

    console.log(`Remaining broken responses: ${stillBroken.length}`);

    if (stillBroken.length === 0) {
      console.log('🎉 All responses now have the required fields!');
    }

  } catch (error) {
    console.error('❌ Error fixing database:', error);
  } finally {
    await mongoose.disconnect();
    console.log('Disconnected from MongoDB');
  }
}

// Run the fix
if (require.main === module) {
  fixDatabase();
}

module.exports = fixDatabase; 