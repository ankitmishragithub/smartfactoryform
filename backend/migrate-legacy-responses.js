const mongoose = require('mongoose');
const Response = require('./models/Response');

// This script adds submitterName and submitterEmail to legacy responses

async function migrateLegacyResponses() {
  try {
    // Use environment variable or default to local MongoDB
    const mongoUri = process.env.MONGO_URI || 'mongodb://localhost:27017/formsdb';
    
    console.log('Connecting to MongoDB...');
    await mongoose.connect(mongoUri);
    console.log('Connected to MongoDB');

    // Find responses that don't have submitterName or submitterEmail
    const legacyResponses = await Response.find({
      $or: [
        { submitterName: { $exists: false } },
        { submitterEmail: { $exists: false } },
        { submitterName: null },
        { submitterEmail: null },
        { submitterName: "" },
        { submitterEmail: "" }
      ]
    });

    console.log(`Found ${legacyResponses.length} legacy responses to migrate`);

    if (legacyResponses.length === 0) {
      console.log('No legacy responses found. All responses already have submitter information.');
      return;
    }

    // Update each legacy response
    for (let i = 0; i < legacyResponses.length; i++) {
      const response = legacyResponses[i];
      
      // Try to extract name and email from answers if available
      let extractedName = 'Anonymous User';
      let extractedEmail = 'legacy@example.com';

      if (response.answers && typeof response.answers === 'object') {
        // Look for common field names that might contain name
        const nameFields = ['name', 'fullName', 'firstName', 'name_1', 'your_name'];
        const emailFields = ['email', 'emailAddress', 'email_1', 'your_email'];

        for (const field of nameFields) {
          if (response.answers[field] && typeof response.answers[field] === 'string') {
            extractedName = response.answers[field];
            break;
          }
        }

        for (const field of emailFields) {
          if (response.answers[field] && typeof response.answers[field] === 'string') {
            extractedEmail = response.answers[field];
            break;
          }
        }
      }

      // Update the response
      await Response.updateOne(
        { _id: response._id },
        {
          $set: {
            submitterName: response.submitterName || extractedName,
            submitterEmail: response.submitterEmail || extractedEmail
          }
        }
      );

      console.log(`Migrated response ${i + 1}/${legacyResponses.length}: ${response._id}`);
      console.log(`  - Name: ${extractedName}`);
      console.log(`  - Email: ${extractedEmail}`);
    }

    console.log('Migration completed successfully!');
    
    // Verify the migration
    const remainingLegacy = await Response.find({
      $or: [
        { submitterName: { $exists: false } },
        { submitterEmail: { $exists: false } }
      ]
    });

    console.log(`Remaining legacy responses: ${remainingLegacy.length}`);

  } catch (error) {
    console.error('Migration failed:', error);
  } finally {
    await mongoose.disconnect();
    console.log('Disconnected from MongoDB');
  }
}

// Run the migration if this script is executed directly
if (require.main === module) {
  migrateLegacyResponses();
}

module.exports = migrateLegacyResponses; 