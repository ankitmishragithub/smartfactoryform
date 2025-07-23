const mongoose = require('mongoose');
require('dotenv').config();

const FormSchema = new mongoose.Schema({
  folderName: { type: String, required: true },
  schemaJson: { type: Object, required: true },
  createdAt:  { type: Date, default: Date.now }
});

const Form = mongoose.model('Form', FormSchema);

async function testAPI() {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGO_URI);
    console.log('✅ Connected to MongoDB');

    // Test creating a form with folderName
    const testForm = {
      folderName: 'Test Folder',
      schemaJson: [
        {
          id: 'heading-1',
          type: 'heading',
          label: 'Test Form'
        },
        {
          id: 'field-1',
          type: 'text',
          label: 'Test Field',
          required: false
        }
      ]
    };

    console.log('📤 Creating test form:', testForm);
    
    const createdForm = await Form.create(testForm);
    console.log('✅ Form created successfully:', {
      id: createdForm._id,
      folderName: createdForm.folderName,
      fieldsCount: createdForm.schemaJson.length
    });

    // Test reading the form back
    const readForm = await Form.findById(createdForm._id);
    console.log('✅ Form read back:', {
      id: readForm._id,
      folderName: readForm.folderName,
      fieldsCount: readForm.schemaJson.length
    });

    // Test updating the form
    const updatedForm = await Form.findByIdAndUpdate(
      createdForm._id,
      { 
        folderName: 'Updated Folder',
        schemaJson: testForm.schemaJson
      },
      { new: true }
    );
    
    console.log('✅ Form updated successfully:', {
      id: updatedForm._id,
      folderName: updatedForm.folderName,
      fieldsCount: updatedForm.schemaJson.length
    });

    // Test getting folders
    const folders = await Form.distinct('folderName');
    console.log('✅ Folders found:', folders);

    // Clean up
    await Form.findByIdAndDelete(createdForm._id);
    console.log('✅ Test form deleted');

  } catch (error) {
    console.error('❌ Test failed:', error);
  } finally {
    await mongoose.disconnect();
    console.log('✅ Disconnected from MongoDB');
    process.exit(0);
  }
}

// Run the test
testAPI(); 