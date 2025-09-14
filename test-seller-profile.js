const axios = require('axios');
const { SESSION_COOKIE_NAME } = require('./lib/auth');
const dotenv = require('dotenv');
dotenv.config();

async function testSellerProfile() {
  try {
    // Get the session cookie from environment or prompt
    const sessionCookie = process.env.TEST_SESSION_COOKIE;
    
    if (!sessionCookie) {
      console.error('Please set TEST_SESSION_COOKIE environment variable');
      console.log(`Get the ${SESSION_COOKIE_NAME} cookie from your browser after logging in`);
      process.exit(1);
    }

    const response = await axios.get('http://localhost:3000/api/seller/profile', {
      headers: {
        'Cookie': `${SESSION_COOKIE_NAME}=${sessionCookie}`,
        'Accept': 'application/json'
      },
      withCredentials: true
    });

    console.log('Response status:', response.status);
    console.log('Response data:', response.data);
  } catch (error) {
    if (error.response) {
      console.error('Error response:', {
        status: error.response.status,
        statusText: error.response.statusText,
        data: error.response.data
      });
    } else {
      console.error('Error:', error.message);
    }
  }
}

testSellerProfile();
