// Simple server starter for testing without full Node.js setup
// This is a standalone script that provides the backend functionality

const http = require('http');
const url = require('url');

// In-memory data store
let forms = [
  {
    _id: 'form_1',
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
    _id: 'form_2',
    schemaJson: [
      { id: 'folderName_2', type: 'folderName', label: 'HR', required: false },
      { id: 'heading_2', type: 'heading', label: 'Employee Survey', required: false },
      { id: 'employee_id', type: 'text', label: 'Employee ID', required: true },
      { id: 'department', type: 'select', label: 'Department', options: ['IT', 'Marketing', 'Sales', 'HR', 'Finance'], required: true },
      { id: 'satisfaction', type: 'select', label: 'Job Satisfaction', options: ['Very Satisfied', 'Satisfied', 'Neutral', 'Dissatisfied', 'Very Dissatisfied'], required: true }
    ],
    createdAt: new Date('2024-01-20')
  },
  {
    _id: 'form_3',
    schemaJson: [
      { id: 'folderName_3', type: 'folderName', label: 'Support', required: false },
      { id: 'heading_3', type: 'heading', label: 'Support Ticket', required: false },
      { id: 'ticket_type', type: 'select', label: 'Issue Type', options: ['Bug Report', 'Feature Request', 'Technical Support'], required: true },
      { id: 'description', type: 'textarea', label: 'Issue Description', required: true }
    ],
    createdAt: new Date('2024-01-25')
  }
];

let responses = [
  {
    _id: 'resp_1',
    form: 'form_1',
    submitterName: 'John Doe',
    submitterEmail: 'john.doe@example.com',
    answers: { name_1: 'John Doe', email_1: 'john@example.com', rating_1: 'Excellent', comments_1: 'Great service!' },
    submittedAt: new Date('2024-01-16')
  },
  {
    _id: 'resp_2',
    form: 'form_1',
    submitterName: 'Jane Smith',
    submitterEmail: 'jane.smith@example.com',
    answers: { name_1: 'Jane Smith', email_1: 'jane@example.com', rating_1: 'Good', comments_1: 'Good overall.' },
    submittedAt: new Date('2024-01-17')
  },
  {
    _id: 'resp_3',
    form: 'form_2',
    submitterName: 'Alice Johnson',
    submitterEmail: 'alice.johnson@company.com',
    answers: { employee_id: 'EMP001', department: 'IT', satisfaction: 'Satisfied' },
    submittedAt: new Date('2024-01-21')
  }
];

// CORS headers
function setCorsHeaders(res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
}

// Parse JSON body
function parseBody(req) {
  return new Promise((resolve) => {
    let body = '';
    req.on('data', chunk => body += chunk);
    req.on('end', () => {
      try {
        resolve(body ? JSON.parse(body) : {});
      } catch {
        resolve({});
      }
    });
  });
}

// Create HTTP server
const server = http.createServer(async (req, res) => {
  setCorsHeaders(res);
  
  // Handle preflight OPTIONS requests
  if (req.method === 'OPTIONS') {
    res.writeHead(200);
    res.end();
    return;
  }
  
  const parsedUrl = url.parse(req.url, true);
  const path = parsedUrl.pathname;
  
  console.log(`${req.method} ${path}`);
  
  try {
    // API Routes
    if (path === '/api/forms' && req.method === 'GET') {
      res.writeHead(200, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify(forms));
      
    } else if (path === '/api/responses' && req.method === 'GET') {
      res.writeHead(200, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify(responses));
      
    } else if (path === '/api/responses' && req.method === 'POST') {
      const body = await parseBody(req);
      const { form, submitterName, submitterEmail, answers } = body;
      
      if (!form || !answers) {
        res.writeHead(400, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ error: 'Form ID and answers are required' }));
        return;
      }
      
      if (!submitterName || !submitterEmail) {
        res.writeHead(400, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ error: 'Submitter name and email are required' }));
        return;
      }
      
      const newResponse = {
        _id: `resp_${Date.now()}`,
        form,
        submitterName: submitterName.trim(),
        submitterEmail: submitterEmail.trim(),
        answers,
        submittedAt: new Date()
      };
      
      responses.push(newResponse);
      
      res.writeHead(201, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify(newResponse));
      
    } else if (path.startsWith('/api/forms/') && req.method === 'GET') {
      const formId = path.split('/').pop();
      const form = forms.find(f => f._id === formId);
      
      if (form) {
        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify(form));
      } else {
        res.writeHead(404, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ error: 'Form not found' }));
      }
      
    } else {
      res.writeHead(404, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ error: 'Not found' }));
    }
    
  } catch (error) {
    console.error('Server error:', error);
    res.writeHead(500, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({ error: 'Internal server error' }));
  }
});

const PORT = process.env.PORT || 4000;

server.listen(PORT, () => {
  console.log('='.repeat(50));
  console.log('🚀 Simple Forms Backend Server Started');
  console.log('='.repeat(50));
  console.log(`Server running on: http://localhost:${PORT}`);
  console.log('API Endpoints:');
  console.log('  GET  /api/forms     - Get all forms');
  console.log('  GET  /api/responses - Get all responses');
  console.log('  POST /api/responses - Submit form response');
  console.log('  GET  /api/forms/:id - Get specific form');
  console.log('');
  console.log('Sample Data:');
  console.log(`  📁 ${forms.length} forms available`);
  console.log(`  📝 ${responses.length} responses available`);
  console.log('  📋 Forms with responses:', responses.map(r => r.form).join(', '));
  console.log('');
  console.log('💡 This demonstrates the "Submitted Forms" filtering feature');
  console.log('   Only forms with responses will appear in the Submitted Forms page');
  console.log('='.repeat(50));
});

server.on('error', (err) => {
  if (err.code === 'EADDRINUSE') {
    console.log(`Port ${PORT} is already in use. Trying port ${PORT + 1}...`);
    server.listen(PORT + 1);
  } else {
    console.error('Server error:', err);
  }
}); 