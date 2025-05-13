// Mock exchange partner data
const exchangePartners = [
    {
      id: 'exchange_a',
      name: 'Exchange A',
      countries: ['UG'], // Uganda
      currencies: ['UGX'],
      oauth: {
        authUrl: process.env.NODE_ENV === 'production' 
          ? 'https://exchange_a.com/oauth/authorize'
          : 'http://localhost:8080/mock/oauth/authorize',
        tokenUrl: process.env.NODE_ENV === 'production'
          ? 'https://exchange_a.com/oauth/token'
          : 'http://localhost:8080/mock/oauth/token',
        clientId: process.env.EXCHANGE_A_CLIENT_ID || 'mock_client_id_a'
      }
    },
    {
      id: 'exchange_b',
      name: 'Exchange B',
      countries: ['UG'], // Uganda
      currencies: ['UGX'],
      oauth: {
        authUrl: process.env.NODE_ENV === 'production'
          ? 'https://exchange_b.com/oauth/authorize'
          : 'http://localhost:8080/mock/oauth/authorize',
        tokenUrl: process.env.NODE_ENV === 'production'
          ? 'https://exchange_b.com/oauth/token'
          : 'http://localhost:8080/mock/oauth/token',
        clientId: process.env.EXCHANGE_B_CLIENT_ID || 'mock_client_id_b'
      }
    },
]

module.exports = {
  exchangePartners
}