// Fallback in-memory data for development/testing when MongoDB is not available

let memoryForms = [];
let memoryResponses = [];
let idCounter = 1;

// Generate sample data
function initializeMemoryData() {
  // Sample forms with different folders
  memoryForms = [
    {
      _id: `form_${idCounter++}`,
      schemaJson: [
        { id: 'folderName_1', type: 'folderName', label: 'Marketing', required: false },
        { id: 'heading_1', type: 'heading', label: 'Customer Feedback Form', required: false },
        { id: 'name_1', type: 'text', label: 'Your Name', required: true },
        { id: 'email_1', type: 'email', label: 'Email Address', required: true },
        { id: 'rating_1', type: 'select', label: 'Overall Rating', options: ['Excellent', 'Good', 'Average', 'Poor'], required: true },
        { id: 'comments_1', type: 'textarea', label: 'Additional Comments', required: false }
      ],
      createdAt: new Date('2024-01-15')
    },
    {
      _id: `form_${idCounter++}`,
      schemaJson: [
        { id: 'folderName_2', type: 'folderName', label: 'HR', required: false },
        { id: 'heading_2', type: 'heading', label: 'Employee Survey', required: false },
        { id: 'employee_id', type: 'text', label: 'Employee ID', required: true },
        { id: 'department', type: 'select', label: 'Department', options: ['IT', 'Marketing', 'Sales', 'HR', 'Finance'], required: true },
        { id: 'satisfaction', type: 'select', label: 'Job Satisfaction', options: ['Very Satisfied', 'Satisfied', 'Neutral', 'Dissatisfied', 'Very Dissatisfied'], required: true },
        { id: 'suggestions', type: 'textarea', label: 'Suggestions for Improvement', required: false }
      ],
      createdAt: new Date('2024-01-20')
    },
    {
      _id: `form_${idCounter++}`,
      schemaJson: [
        { id: 'folderName_3', type: 'folderName', label: 'Support', required: false },
        { id: 'heading_3', type: 'heading', label: 'Support Ticket', required: false },
        { id: 'ticket_type', type: 'select', label: 'Issue Type', options: ['Bug Report', 'Feature Request', 'Technical Support', 'General Inquiry'], required: true },
        { id: 'priority', type: 'select', label: 'Priority', options: ['Low', 'Medium', 'High', 'Critical'], required: true },
        { id: 'description', type: 'textarea', label: 'Issue Description', required: true }
      ],
      createdAt: new Date('2024-01-25')
    },
    {
      _id: `form_${idCounter++}`,
      schemaJson: [
        { id: 'folderName_4', type: 'folderName', label: 'Marketing/Campaigns', required: false },
        { id: 'heading_4', type: 'heading', label: 'Campaign Effectiveness Survey', required: false },
        { id: 'campaign_name', type: 'text', label: 'Campaign Name', required: true },
        { id: 'effectiveness', type: 'select', label: 'Effectiveness Rating', options: ['Very Effective', 'Effective', 'Somewhat Effective', 'Not Effective'], required: true },
        { id: 'feedback', type: 'textarea', label: 'Additional Feedback', required: false }
      ],
      createdAt: new Date('2024-02-01')
    }
  ];

  // Sample responses (only for some forms to demonstrate filtering)
  memoryResponses = [
    {
      _id: `resp_${idCounter++}`,
      form: memoryForms[0]._id, // Customer Feedback Form has responses
      submitterName: 'John Doe',
      submitterEmail: 'john.doe@example.com',
      answers: {
        name_1: 'John Doe',
        email_1: 'john.doe@example.com',
        rating_1: 'Excellent',
        comments_1: 'Great service, very satisfied!'
      },
      submittedAt: new Date('2024-01-16')
    },
    {
      _id: `resp_${idCounter++}`,
      form: memoryForms[0]._id, // Customer Feedback Form has multiple responses
      submitterName: 'Jane Smith',
      submitterEmail: 'jane.smith@example.com',
      answers: {
        name_1: 'Jane Smith',
        email_1: 'jane.smith@example.com',
        rating_1: 'Good',
        comments_1: 'Overall positive experience with minor issues.'
      },
      submittedAt: new Date('2024-01-17')
    },
    {
      _id: `resp_${idCounter++}`,
      form: memoryForms[1]._id, // Employee Survey has responses
      submitterName: 'Alice Johnson',
      submitterEmail: 'alice.johnson@company.com',
      answers: {
        employee_id: 'EMP001',
        department: 'IT',
        satisfaction: 'Satisfied',
        suggestions: 'More flexible working hours would be great.'
      },
      submittedAt: new Date('2024-01-21')
    },
    {
      _id: `resp_${idCounter++}`,
      form: memoryForms[3]._id, // Campaign Survey has responses
      submitterName: 'Bob Wilson',
      submitterEmail: 'bob.wilson@marketing.com',
      answers: {
        campaign_name: 'Summer Sale 2024',
        effectiveness: 'Very Effective',
        feedback: 'Great response from customers, exceeded expectations.'
      },
      submittedAt: new Date('2024-02-02')
    }
  ];

  console.log('Memory data initialized:');
  console.log(`- ${memoryForms.length} forms created`);
  console.log(`- ${memoryResponses.length} responses created`);
  console.log('- Forms with responses:', memoryResponses.map(r => r.form));
}

// Initialize data on module load
initializeMemoryData();

module.exports = {
  // Forms operations
  getAllForms: () => memoryForms,
  getFormById: (id) => memoryForms.find(f => f._id === id),
  createForm: (formData) => {
    const newForm = {
      _id: `form_${idCounter++}`,
      ...formData,
      createdAt: new Date()
    };
    memoryForms.push(newForm);
    return newForm;
  },
  updateForm: (id, formData) => {
    const index = memoryForms.findIndex(f => f._id === id);
    if (index !== -1) {
      memoryForms[index] = { ...memoryForms[index], ...formData };
      return memoryForms[index];
    }
    return null;
  },
  deleteForm: (id) => {
    const index = memoryForms.findIndex(f => f._id === id);
    if (index !== -1) {
      const deleted = memoryForms.splice(index, 1)[0];
      // Also delete related responses
      memoryResponses = memoryResponses.filter(r => r.form !== id);
      return deleted;
    }
    return null;
  },

  // Responses operations
  getAllResponses: () => memoryResponses,
  getResponseById: (responseId) => memoryResponses.find(r => r._id === responseId),
  getResponsesByForm: (formId) => memoryResponses.filter(r => r.form === formId),
  createResponse: (responseData) => {
    const newResponse = {
      _id: `resp_${idCounter++}`,
      ...responseData,
      submitterName: responseData.submitterName || 'Anonymous User',
      submitterEmail: responseData.submitterEmail || 'legacy@example.com',
      submittedAt: new Date()
    };
    memoryResponses.push(newResponse);
    return newResponse;
  },

  // Utility
  reset: () => {
    memoryForms = [];
    memoryResponses = [];
    idCounter = 1;
    initializeMemoryData();
  }
}; 