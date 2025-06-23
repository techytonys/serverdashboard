# VPS Server Dashboard

A modern dashboard for managing Linode VPS servers with integrated billing and provisioning capabilities.

## Features

- **Linode API Integration**: Connect to your Linode account using API tokens
- **Server Management**: View, monitor, and manage your Linode instances
- **Billing Information**: Track account balance, usage, and invoices
- **Real-time Status**: Live connection status and server monitoring
- **Modern UI**: Clean, responsive interface with regular CSS styling

## Prerequisites

- Node.js 18.x or later
- npm or yarn package manager
- Linode API token

## Getting Started

### 1. Install Dependencies

```bash
npm install
```

### 2. Environment Setup

Copy the environment example file:

```bash
cp .env.example .env.local
```

Edit `.env.local` and add your Linode API token:

```env
LINODE_API_TOKEN=your_linode_api_token_here
```

To get your Linode API token:

1. Log into your Linode account
2. Go to your profile settings
3. Navigate to "API Tokens"
4. Create a new Personal Access Token
5. Grant necessary permissions (Account: Read Only, Linodes: Read/Write)

### 3. Run the Development Server

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## Verification

### Test Linode API Connection

Before running the full application, you can test your Linode API connection:

```bash
node test-api.js
```

This will verify:

- Your API token is valid
- You can connect to Linode API
- Display basic account information
- List your current Linode instances

If the test fails, check:

1. Your API token is correctly set in `.env.local`
2. The token has necessary permissions
3. Your internet connection allows access to api.linode.com

## Project Structure

```
src/
├── app/
│   ├── api/           # API routes for Linode integration
│   ├── globals.css    # Global CSS styles
│   └── page.tsx       # Main dashboard page
├── components/        # React components
│   ├── Dashboard.tsx  # Main dashboard component
│   ├── Sidebar.tsx    # Navigation sidebar
│   ├── ServerList.tsx # Server management interface
│   ├── BillingInfo.tsx # Billing information display
│   └── ConnectionStatus.tsx # API connection status
├── lib/
│   └── linode-client.ts # Linode API client
└── types/
    └── linode.ts      # TypeScript type definitions
```

## API Endpoints

- `GET /api/test-connection` - Test Linode API connection
- `GET /api/linodes` - Fetch all Linode instances
- `GET /api/billing` - Fetch account and billing information

## Technology Stack

- **Framework**: Next.js 14+ with App Router
- **Language**: TypeScript
- **Styling**: Regular CSS (no frameworks)
- **API**: Linode API v4 via REST
- **HTTP Client**: Axios

## Security Notes

- Never commit your `.env.local` file to version control
- Keep your Linode API token secure and rotate it regularly
- Use read-only permissions where possible
- Always validate API responses in production

## Troubleshooting

### Connection Issues

1. Verify your Linode API token is correct
2. Check that the token has necessary permissions
3. Ensure your network allows connections to api.linode.com
4. Check the browser console and server logs for error details

## Learn More

To learn more about the technologies used:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Linode API Documentation](https://www.linode.com/api/v4) - comprehensive API reference.
- [TypeScript Documentation](https://www.typescriptlang.org/docs/) - TypeScript language guide.
