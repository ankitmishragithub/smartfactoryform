# Backend Setup Guide

## Prerequisites

1. **Node.js**: Download and install from [nodejs.org](https://nodejs.org/)
2. **MongoDB**: Install MongoDB locally or use MongoDB Atlas

## Setup Steps

### 1. Install Dependencies
```bash
cd backend
npm install
```

### 2. Environment Variables
Create a `.env` file in the `backend` directory:
```env
MONGO_URI=mongodb://localhost:27017/formsdb
PORT=4000
```

### 3. Start MongoDB
- **Local MongoDB**: Start the MongoDB service
- **MongoDB Atlas**: Use your Atlas connection string

### 4. Start the Server
```bash
npm start
```

The server should start on `http://localhost:4000`

## Features

### API Endpoints

#### Forms
- `GET /api/forms` - Get all forms
- `POST /api/forms` - Create new form
- `PUT /api/forms/:id` - Update form
- `DELETE /api/forms/:id` - Delete form
- `GET /api/forms/folders` - Get all folder names
- `GET /api/forms/folder/:folderName` - Get forms in folder

#### Responses
- `POST /api/responses` - Submit form response
- `GET /api/responses` - Get all responses (for submitted forms filtering)
- `GET /api/responses/form/:formId` - Get responses for specific form

## Troubleshooting

### "npm is not recognized"
- Install Node.js from [nodejs.org](https://nodejs.org/)
- Restart your terminal after installation

### "MongoNetworkError"
- Ensure MongoDB is running
- Check your MONGO_URI in .env file
- For MongoDB Atlas, ensure IP whitelist is configured

### "Module not found"
- Run `npm install` in the backend directory
- Ensure you're in the correct directory

## Database Schema

### Forms Collection
```javascript
{
  _id: ObjectId,
  schemaJson: Array, // Form fields including folderName and heading
  createdAt: Date
}
```

### Responses Collection
```javascript
{
  _id: ObjectId,
  form: ObjectId, // Reference to form
  answers: Object, // Form submission data
  submittedAt: Date,
  filledBy: ObjectId // Optional user reference
}
```

## Development Notes

- The frontend expects the backend to run on `http://localhost:4000`
- CORS is enabled for frontend development
- All requests are logged in development mode
- The "Submitted Forms" feature requires both forms and responses endpoints to work 