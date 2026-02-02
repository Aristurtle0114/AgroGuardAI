<div align="center">
<img width="1200" height="475" alt="GHBanner" src="https://github.com/user-attachments/assets/0aa67016-6eaf-458a-adb2-6e31a0763ed6" />
</div>

# Run and deploy your AI Studio app

This contains everything you need to run your app locally.

View your app in AI Studio: https://ai.studio/apps/drive/1yFX1EU61EkfgHbkF_Zl1Cn00x7X-Xqco

## Run Locally

**Prerequisites:**  Node.js


1. Install dependencies:
   `npm install`
2. Set the `GEMINI_API_KEY` in [.env.local](.env.local) to your Gemini API key
3. Run the app:
   `npm run dev`

## Deployment

### Vercel

1. Push your code to a Git repository (GitHub, GitLab, Bitbucket).
2. Import the project into Vercel.
3. Vercel will automatically detect Vite and set the correct build settings.
4. **Important**: Add your `GEMINI_API_KEY` in the Vercel Project Settings > Environment Variables.
5. Deploy!

## Troubleshooting

- **Error: "An API Key must be set..."**
  - This means the `VITE_GEMINI_API_KEY` is not being read.
  - **Solution**: 
    1. Ensure your `.env` file has the key with the `VITE_` prefix.
    2. **Restart the development server** (`Ctrl+C` then `npm run dev`). Vite does not pick up new env vars automatically.

