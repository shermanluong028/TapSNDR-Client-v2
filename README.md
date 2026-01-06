# Ticket Management System Frontend

This is the frontend application for the Ticket Management System, built with React, TypeScript, and Tailwind CSS.

## Features

- User Authentication (Login/Register)
- Ticket Management
  - Create new tickets
  - View ticket list
  - Filter tickets by status
  - Validate tickets
- Wallet Management
  - View wallet balance
  - Make deposits and withdrawals
  - View transaction history
- Responsive Design
- Role-based Access Control

## Prerequisites

- Node.js (v14 or higher)
- npm (v6 or higher)
- Backend API running on `http://localhost:3000`

## Installation

1. Clone the repository:

```bash
git clone <repository-url>
cd ticket_management_frontend
```

2. Install dependencies:

```bash
npm install
```

3. Create a `.env` file in the root directory:

```env
VITE_API_URL=http://localhost:3000
```

## Development

To start the development server:

```bash
npm run dev
```

The application will be available at `http://localhost:5173`.

## Building for Production

To create a production build:

```bash
npm run build
```

The built files will be in the `dist` directory.

## Project Structure

```
src/
├── components/
│   ├── common/          # Reusable UI components
│   ├── layout/          # Layout components (Header, etc.)
│   └── tickets/         # Ticket-related components
├── pages/
│   ├── auth/           # Authentication pages
│   ├── dashboard/      # Dashboard pages
│   ├── tickets/        # Ticket pages
│   └── wallet/         # Wallet pages
├── services/           # API services
├── hooks/              # Custom React hooks
├── types/              # TypeScript type definitions
└── utils/              # Utility functions
```

## API Integration

The frontend communicates with the backend API using the following endpoints:

- Authentication

  - POST `/auth/login`
  - POST `/auth/register`

- Tickets

  - GET `/tickets`
  - GET `/tickets/:id`
  - POST `/tickets`
  - PUT `/tickets/:id/validate`
  - GET `/tickets/status/:status`

- Wallet
  - GET `/wallet`
  - GET `/wallet/:type`
  - POST `/wallet/connect`
  - GET `/wallet/:id/transactions`
  - POST `/wallet/transaction`

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details.
