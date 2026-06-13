# Google Maps API Setup Guide

This guide explains how to set up and configure Google Maps API for the SCOOPEX Shift application.

## Prerequisites

- A Google Cloud Platform account
- A project in Google Cloud Console

## Step 1: Create API Credentials

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Select or create a project
3. Navigate to **APIs & Services** > **Credentials**
4. Click **Create Credentials** > **API Key**
5. Copy the generated API key

## Step 2: Enable Required APIs

Enable the following APIs in your Google Cloud project:

1. **Maps JavaScript API**
   - Navigate to **APIs & Services** > **Library**
   - Search for "Maps JavaScript API"
   - Click **Enable**

2. **Places API**
   - Search for "Places API"
   - Click **Enable**

3. **Geocoding API**
   - Search for "Geocoding API"
   - Click **Enable**

## Step 3: Configure API Key Restrictions (Recommended)

### Application Restrictions
1. Go to **APIs & Services** > **Credentials**
2. Click on your API key
3. Under **Application restrictions**, select:
   - **HTTP referrers (web sites)** for production
   - Add your domain(s): `yourdomain.com/*`, `*.yourdomain.com/*`
   - For development: `localhost:*`, `127.0.0.1:*`

### API Restrictions
1. Under **API restrictions**, select **Restrict key**
2. Select only the APIs you need:
   - Maps JavaScript API
   - Places API
   - Geocoding API

## Step 4: Set Up Environment Variables

1. Copy `.env.example` to `.env`:
   ```bash
   cp .env.example .env
   ```

2. Add your API key to `.env`:
   ```
   VITE_GOOGLE_MAPS_API_KEY=YOUR_API_KEY_HERE
   ```

3. **Important**: Never commit `.env` to version control. The `.gitignore` file is configured to exclude it.

## Step 5: Verify Setup

1. Start the development server
2. Navigate to the Quote Calculator
3. Verify that:
   - The map loads correctly
   - Address autocomplete works
   - Current location detection works
   - Markers appear when locations are selected

## Troubleshooting

### Map Not Loading
- Check browser console for errors
- Verify API key is correct in `.env`
- Ensure all required APIs are enabled
- Check API key restrictions

### Autocomplete Not Working
- Verify Places API is enabled
- Check API key restrictions
- Ensure proper bounds are set for Mumbai-Karjat region

### Geocoding Errors
- Verify Geocoding API is enabled
- Check API quota limits
- Review error messages in console

## Cost Optimization

### Free Tier
Google Maps provides $200 monthly credit, which includes:
- 28,000 map loads
- 40,000 geocoding requests
- 17,000 autocomplete requests

### Best Practices
1. Implement API key restrictions
2. Use session tokens for autocomplete
3. Cache geocoding results when possible
4. Monitor usage in Google Cloud Console

## Security Best Practices

1. **Never expose API keys in client-side code** (except for Maps JavaScript API which requires it)
2. **Use HTTP referrer restrictions** for production
3. **Enable only required APIs**
4. **Monitor API usage** regularly
5. **Rotate API keys** periodically
6. **Set up billing alerts** to avoid unexpected charges
7. **Never commit `.env` to version control** - always use `.env.example` as a template

## Regional Configuration

The application is configured for the Mumbai to Karjat corridor:
- Bounds: 18.70°N–19.40°N, 72.85°E–73.45°E
- Country restriction: India (IN)
- Default center: Mumbai (19.0760°N, 72.8777°E)

## Support

For issues with Google Maps API:
- [Google Maps Platform Documentation](https://developers.google.com/maps/documentation)
- [Google Maps Platform Support](https://developers.google.com/maps/support)
- [Stack Overflow - google-maps](https://stackoverflow.com/questions/tagged/google-maps)

## Additional Resources

- [Maps JavaScript API Documentation](https://developers.google.com/maps/documentation/javascript)
- [Places API Documentation](https://developers.google.com/maps/documentation/places/web-service)
- [Geocoding API Documentation](https://developers.google.com/maps/documentation/geocoding)
- [API Key Best Practices](https://developers.google.com/maps/api-key-best-practices)
