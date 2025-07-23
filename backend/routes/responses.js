const express = require('express');
const { requireAuth, requireAdmin } = require('../middleware/auth');
const Response = require('../models/Response');
const router = express.Router();

// Submit (no auth required for public forms)
router.post('/', async (req, res) => {
  try {
    const { form, formId, bundleId, submitterName, submitterEmail, answers } = req.body;
    
    // Support both 'form' and 'formId' for backward compatibility
    const actualFormId = form || formId;
    
    if (!actualFormId) {
      return res.status(400).json({ error: 'Form ID is required' });
    }
    
    if (!submitterName || !submitterEmail) {
      return res.status(400).json({ error: 'Submitter name and email are required' });
    }
    
    let resp;
    if (global.usingMongoDB) {
      resp = await Response.create({
        form: actualFormId,
        bundle: bundleId || null,
        filledBy: req.user?.id || null, // Optional user if authenticated
        submitterName: submitterName.trim(),
        submitterEmail: submitterEmail.trim(),
        answers
      });
    } else {
      resp = global.fallbackData.createResponse({
        form: actualFormId,
        bundle: bundleId || null,
        filledBy: req.user?.id || null,
        submitterName: submitterName.trim(),
        submitterEmail: submitterEmail.trim(),
    answers
  });
    }
    
  res.status(201).json(resp);
  } catch (error) {
    console.error('Error submitting response:', error);
    res.status(500).json({ error: 'Failed to submit response' });
  }
});

// Get all responses (for finding submitted forms)
router.get('/', async (req, res) => {
  try {
    let responses;
    if (global.usingMongoDB) {
      responses = await Response.find({})
        .sort({ submittedAt: -1 });
    } else {
      responses = global.fallbackData.getAllResponses();
    }
    res.json(responses);
  } catch (error) {
    console.error('Error fetching responses:', error);
    res.status(500).json({ error: 'Failed to fetch responses' });
  }
});

// Get a specific response by ID
router.get('/:responseId', async (req, res) => {
  try {
    const { responseId } = req.params;
    let response;
    
    if (global.usingMongoDB) {
      response = await Response.findById(responseId);
    } else {
      response = global.fallbackData.getResponseById(responseId);
    }
    
    if (!response) {
      return res.status(404).json({ error: 'Response not found' });
    }
    
    res.json(response);
  } catch (error) {
    console.error('Error fetching response:', error);
    res.status(500).json({ error: 'Failed to fetch response' });
  }
});

// Get a specific response by ID
router.get('/:responseId', async (req, res) => {
  try {
    const { responseId } = req.params;
    let response;
    
    if (global.usingMongoDB) {
      response = await Response.findById(responseId);
    } else {
      response = global.fallbackData.getResponseById(responseId);
    }
    
    if (!response) {
      return res.status(404).json({ error: 'Response not found' });
    }
    
    console.log('Fetching response:', responseId);
    console.log('Response fields:', Object.keys(response.toObject ? response.toObject() : response));
    
    res.json(response);
  } catch (error) {
    console.error('Error fetching response:', error);
    res.status(500).json({ error: 'Failed to fetch response' });
  }
});

// Debug endpoint to check response structure
router.get('/debug/structure', async (req, res) => {
  try {
    let responses;
    if (global.usingMongoDB) {
      responses = await Response.find({}).limit(3);
    } else {
      responses = global.fallbackData.getAllResponses();
    }
    
    const debugInfo = {
      totalResponses: responses.length,
      sampleResponses: responses.map(r => ({
        _id: r._id,
        hasForm: !!r.form,
        hasSubmitterName: !!r.submitterName,
        hasSubmitterEmail: !!r.submitterEmail,
        hasAnswers: !!r.answers,
        answersType: typeof r.answers,
        answersKeys: r.answers ? Object.keys(r.answers) : [],
        submittedAt: r.submittedAt,
        allFields: Object.keys(r.toObject ? r.toObject() : r)
      }))
    };
    
    res.json(debugInfo);
  } catch (error) {
    console.error('Error in debug endpoint:', error);
    res.status(500).json({ error: 'Debug failed', details: error.message });
  }
});

// Admin: list by form
router.get('/form/:formId', requireAuth, requireAdmin, async (req, res) => {
  const responses = await Response.find({ form: req.params.formId })
    .populate('filledBy', 'email')
    .sort({ submittedAt: -1 });
  res.json(responses);
});

// Admin: list by bundle
router.get('/bundle/:bundleId', requireAuth, requireAdmin, async (req, res) => {
  const responses = await Response.find({ bundle: req.params.bundleId })
    .populate('filledBy', 'email')
    .sort({ submittedAt: -1 });
  res.json(responses);
});

module.exports = router;
