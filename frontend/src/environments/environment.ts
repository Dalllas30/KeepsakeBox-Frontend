export const environment = {
  production: false,
  apiUrl: 'http://localhost:3000',         // json-server (legacy — unmigrated features)
  usersServiceUrl: 'http://localhost:8000', // FastAPI Users Service
  contentServiceUrl: 'http://localhost:8001', // FastAPI Content Service
  sessionServiceUrl: 'http://localhost:8002', // FastAPI Session Management Service
  keycloak: {
    url: 'http://localhost:8080',
    realm: 'keepsakebox',
    clientId: 'keepsakebox-frontend'
  },
  useEncryption: true,
  encryptionKey: '989$%&2!3123KeepsakeBox2021'
};