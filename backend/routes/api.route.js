const router = require('express').Router();
const { OAuth2Client } = require('google-auth-library');
const { google } = require('googleapis');

// Create OAuth2 client
const oauth2Client = new google.auth.OAuth2(
  process.env.GOOGLE_CLIENT_ID,
  process.env.GOOGLE_CLIENT_SECRET,
  process.env.GOOGLE_REDIRECT_URI
);

router.get('/', async (req, res, next) => {
  res.send({ message: 'Ok api is working 🚀' });
});

router.post('/create-tokens', async (req, res, next) => {
  try {
    const { code } = req.body;

    if (!code) {
      return res.status(400).json({
        message: 'Missing authorization code'
      });
    }

    try {
      console.log('Attempting to exchange code for tokens...');
      console.log('Using client ID:', process.env.GOOGLE_CLIENT_ID);
      console.log('Using redirect URI:', process.env.GOOGLE_REDIRECT_URI);
      
      // Exchange the authorization code for tokens
      const { tokens } = await oauth2Client.getToken(code);
      console.log('Token exchange successful');
      
      // Send back the tokens
      res.status(200).json({ 
        access_token: tokens.access_token,
        refresh_token: tokens.refresh_token,
        expiry_date: tokens.expiry_date
      });
    } catch (tokenError) {
      console.error('Token exchange error details:', tokenError);
      res.status(401).json({
        message: 'Failed to exchange authorization code for tokens',
        error: tokenError.message,
        details: tokenError.response?.data || tokenError
      });
    }
  } catch (error) {
    console.error('Server error:', error);
    next(error);
  }
});

router.get('/get-calendar-events', async (req, res, next) => {
  try {
    const { access_token, refresh_token, timeMin, timeMax } = req.query;
    
    if (!access_token) {
      return res.status(400).json({
        message: 'Missing access token'
      });
    }

    console.log('Fetching calendar events with params:', {
      timeMin,
      timeMax
    });

    oauth2Client.setCredentials({
      access_token,
      refresh_token
    });

    const calendar = google.calendar({ version: 'v3', auth: oauth2Client });
    
    const listParams = {
      calendarId: 'primary',
      timeMin: timeMin || (new Date()).toISOString(),
      maxResults: 100,
      singleEvents: true,
      orderBy: 'startTime',
    };

    // Only add timeMax if it's provided
    if (timeMax) {
      listParams.timeMax = timeMax;
    }

    console.log('Calendar API request params:', listParams);
    
    const response = await calendar.events.list(listParams);

    console.log('Calendar API response items:', response.data.items);

    const events = response.data.items.map(event => ({
      id: event.id,
      summary: event.summary,
      start: event.start.dateTime || event.start.date,
      end: event.end.dateTime || event.end.date,
    }));

    console.log('Processed events:', events);

    res.status(200).json({ events });
  } catch (error) {
    console.error('Calendar API error:', error);
    res.status(500).json({
      message: 'Failed to fetch calendar events',
      error: error.message
    });
  }
});

// Create new event
router.post('/create-event', async (req, res, next) => {
  try {
    const { access_token, refresh_token, summary, start, end } = req.body;

    if (!access_token) {
      return res.status(400).json({
        message: 'Missing access token'
      });
    }

    if (!summary || !start || !end) {
      return res.status(400).json({
        message: 'Missing required event details'
      });
    }

    oauth2Client.setCredentials({
      access_token,
      refresh_token
    });

    const calendar = google.calendar({ version: 'v3', auth: oauth2Client });
    
    const event = {
      summary,
      start: {
        date: start.date, // Use the date as is for all-day events
      },
      end: {
        date: end.date, // Use the date as is for all-day events
      }
    };

    try {
      const response = await calendar.events.insert({
        calendarId: 'primary',
        resource: event,
      });

      res.status(200).json({
        message: 'Event created successfully',
        event: response.data
      });
    } catch (calendarError) {
      console.error('Calendar API specific error:', calendarError);
      res.status(403).json({
        message: 'Failed to create calendar event',
        error: calendarError.message,
        details: calendarError.response?.data || calendarError
      });
    }
  } catch (error) {
    console.error('Calendar API error:', error);
    res.status(500).json({
      message: 'Failed to create calendar event',
      error: error.message
    });
  }
});

module.exports = router;
