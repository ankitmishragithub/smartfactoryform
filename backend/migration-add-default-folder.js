const mongoose = require('mongoose');
require('dotenv').config();

const FormSchema = new mongoose.Schema({
  folderName: { type: String, required: true },
  schemaJson: { type: Object, required: true },
  createdAt:  { type: Date, default: Date.now }
});

const Form = mongoose.model('Form', FormSchema);

async function migrateExistingForms() {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGO_URI);
    console.log('Connected to MongoDB');

    // Find forms without folderName
    const formsWithoutFolder = await Form.find({ 
      $or: [
        { folderName: { $exists: false } },
        { folderName: null },
        { folderName: '' }
      ]
    });

    console.log(`Found ${formsWithoutFolder.length} forms without folder names`);

    if (formsWithoutFolder.length === 0) {
      console.log('No migration needed. All forms already have folder names.');
      process.exit(0);
    }

    // Set default folder name for existing forms
    const defaultFolderName = 'Default';
    
    const result = await Form.updateMany(
      { 
        $or: [
          { folderName: { $exists: false } },
          { folderName: null },
          { folderName: '' }
        ]
      },
      { $set: { folderName: defaultFolderName } }
    );

    console.log(`✅ Migration completed! Updated ${result.modifiedCount} forms with folder name: "${defaultFolderName}"`);
    
  } catch (error) {
    console.error('❌ Migration failed:', error);
  } finally {
    await mongoose.disconnect();
    console.log('Disconnected from MongoDB');
    process.exit(0);
  }
}

// Run the migration
migrateExistingForms(); 