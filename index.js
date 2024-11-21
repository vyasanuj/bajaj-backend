const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors({
    origin: '*', 
    methods: ['GET', 'POST'],
    allowedHeaders: ['Content-Type']
  }));
app.use(bodyParser.json());

// Helper functions
const isPrime = (num) => {
  num = parseInt(num);
  if (num <= 1) return false;
  for (let i = 2; i <= Math.sqrt(num); i++) {
    if (num % i === 0) return false;
  }
  return true;
};

const getFileDetails = (base64String) => {
  if (!base64String) {
    return {
      file_valid: false
    };
  }

  try {
    // Get file type and size from base64
    const buffer = Buffer.from(base64String, 'base64');
    const fileSize = Math.round(buffer.length / 1024); // Convert to KB

    return {
      file_valid: true,
      file_mime_type: 'application/octet-stream', // You might want to implement proper MIME detection
      file_size_kb: fileSize.toString()
    };
  } catch (error) {
    return {
      file_valid: false
    };
  }
};

// POST endpoint
app.post('/bfhl', (req, res) => {
  try {
    const { data, file_b64 } = req.body;

    if (!Array.isArray(data)) {
      return res.status(400).json({
        is_success: false,
        message: 'Invalid data format'
      });
    }

    const numbers = data.filter(item => !isNaN(item));
    const alphabets = data.filter(item => isNaN(item));
    const lowercaseAlphabets = alphabets.filter(char => char.match(/[a-z]/));
    const highestLowercase = lowercaseAlphabets.length > 0 ? 
      [lowercaseAlphabets.reduce((a, b) => a > b ? a : b)] : 
      [];

    const response = {
      is_success: true,
      user_id: "john_doe_17091999", // Replace with actual user_id logic
      email: "john@xyz.com", // Replace with actual email
      roll_number: "ABCD123", // Replace with actual roll number
      numbers,
      alphabets,
      highest_lowercase_alphabet: highestLowercase,
      is_prime_found: numbers.some(num => isPrime(num)),
      ...getFileDetails(file_b64)
    };

    res.json(response);
  } catch (error) {
    res.status(500).json({
      is_success: false,
      message: 'Internal server error'
    });
  }
});

// GET endpoint
app.get('/bfhl', (req, res) => {
  res.json({
    operation_code: 1
  });
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});