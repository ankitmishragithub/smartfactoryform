const mongoose = require('mongoose');
const Form = require('./models/Form');
const Response = require('./models/Response');

async function initDatabase() {
  try {
    // Check if we already have data
    const existingForms = await Form.countDocuments();
    const existingResponses = await Response.countDocuments();
    
    if (existingForms > 0) {
      console.log(`Database already has ${existingForms} forms and ${existingResponses} responses`);
      return;
    }
    
    console.log('Initializing database with sample data...');
    
    // Create sample forms
    const sampleForms = [
      {
        schemaJson: [
          {
            id: 'folderName_1',
            type: 'folderName',
            label: 'Marketing',
            required: false
          },
          {
            id: 'heading_1',
            type: 'heading',
            label: 'Customer Feedback Form',
            required: false
          },
          {
            id: 'name_1',
            type: 'text',
            label: 'Your Name',
            required: true
          },
          {
            id: 'email_1',
            type: 'email',
            label: 'Email Address',
            required: true
          },
          {
            id: 'rating_1',
            type: 'select',
            label: 'Overall Rating',
            options: ['Excellent', 'Good', 'Average', 'Poor'],
            required: true
          },
          {
            id: 'comments_1',
            type: 'textarea',
            label: 'Additional Comments',
            required: false
          }
        ]
      },
      {
        schemaJson: [
          {
            id: 'folderName_2',
            type: 'folderName',
            label: 'HR',
            required: false
          },
          {
            id: 'heading_2',
            type: 'heading',
            label: 'Employee Survey',
            required: false
          },
          {
            id: 'employee_id',
            type: 'text',
            label: 'Employee ID',
            required: true
          },
          {
            id: 'department',
            type: 'select',
            label: 'Department',
            options: ['IT', 'Marketing', 'Sales', 'HR', 'Finance'],
            required: true
          },
          {
            id: 'satisfaction',
            type: 'select',
            label: 'Job Satisfaction',
            options: ['Very Satisfied', 'Satisfied', 'Neutral', 'Dissatisfied', 'Very Dissatisfied'],
            required: true
          },
          {
            id: 'suggestions',
            type: 'textarea',
            label: 'Suggestions for Improvement',
            required: false
          }
        ]
      },
      {
        schemaJson: [
          {
            id: 'folderName_3',
            type: 'folderName',
            label: 'Support',
            required: false
          },
          {
            id: 'heading_3',
            type: 'heading',
            label: 'Support Ticket',
            required: false
          },
          {
            id: 'ticket_type',
            type: 'select',
            label: 'Issue Type',
            options: ['Bug Report', 'Feature Request', 'Technical Support', 'General Inquiry'],
            required: true
          },
          {
            id: 'priority',
            type: 'select',
            label: 'Priority',
            options: ['Low', 'Medium', 'High', 'Critical'],
            required: true
          },
          {
            id: 'description',
            type: 'textarea',
            label: 'Issue Description',
            required: true
          }
        ]
      }
    ];
    
    // Insert sample forms
    const createdForms = await Form.insertMany(sampleForms);
    console.log(`Created ${createdForms.length} sample forms`);
    
    // Create sample responses for some forms
    const sampleResponses = [
      {
        form: createdForms[0]._id, // Customer Feedback Form
        submitterName: 'John Doe',
        submitterEmail: 'john.doe@example.com',
        answers: {
          name_1: 'John Doe',
          email_1: 'john.doe@example.com',
          rating_1: 'Excellent',
          comments_1: 'Great service, very satisfied!'
        }
      },
      {
        form: createdForms[0]._id, // Customer Feedback Form
        submitterName: 'Jane Smith',
        submitterEmail: 'jane.smith@example.com',
        answers: {
          name_1: 'Jane Smith',
          email_1: 'jane.smith@example.com',
          rating_1: 'Good',
          comments_1: 'Overall positive experience with minor issues.'
        }
      },
      {
        form: createdForms[1]._id, // Employee Survey
        submitterName: 'Alice Johnson',
        submitterEmail: 'alice.johnson@company.com',
        answers: {
          employee_id: 'EMP001',
          department: 'IT',
          satisfaction: 'Satisfied',
          suggestions: 'More flexible working hours would be great.'
        }
      },
      {
        form: createdForms[2]._id, // Support Ticket
        submitterName: 'Bob Wilson',
        submitterEmail: 'bob.wilson@support.com',
        answers: {
          ticket_type: 'Bug Report',
          priority: 'Medium',
          description: 'Login button not working on mobile devices.'
        }
      }
    ];
    
    // Insert sample responses
    const createdResponses = await Response.insertMany(sampleResponses);
    console.log(`Created ${createdResponses.length} sample responses`);
    
    console.log('Database initialization complete!');
    console.log(`Total: ${createdForms.length} forms, ${createdResponses.length} responses`);
    console.log('Forms with responses:', createdResponses.map(r => r.form.toString()));
    
  } catch (error) {
    console.error('Error initializing database:', error);
  }
}

module.exports = initDatabase; 