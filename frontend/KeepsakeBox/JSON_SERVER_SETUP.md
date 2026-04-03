# JSON Server Setup for Frontend Testing

This guide explains how to configure your frontend to use JSON Server (db.json) for testing while the backend is being developed.

## Prerequisites
- Node.js and npm installed
- The project dependencies installed

## Installation Steps

### 1. Install Dependencies
Install the required npm packages:

```bash
npm install
```

This will install `json-server` and `concurrently` as dev dependencies (already added to package.json).

### 2. Start the Development Environment

#### Option A: Run Both Servers (Recommended)
```bash
npm run start:with-json-server
```

This command will start:
- JSON Server on `http://localhost:3000`
- Angular Dev Server on `http://localhost:4200`

#### Option B: Run Servers Separately

**Terminal 1 - JSON Server:**
```bash
npm run json-server
```
This starts JSON Server at `http://localhost:3000`

**Terminal 2 - Angular Dev Server:**
```bash
npm start
```
This starts the Angular app at `http://localhost:4200`

## How It Works

### API Endpoints

The app now uses the following endpoints on JSON Server:

**Authentication:**
- `GET http://localhost:3000/caregivers?email=EMAIL&password=PASSWORD` - Login
- `GET http://localhost:3000/caregivers?email=EMAIL` - Validate email
- `POST http://localhost:3000/caregivers` - Register new caregiver

**Data Access:**
- `GET http://localhost:3000/caregivers` - Get all caregivers
- `GET http://localhost:3000/patients` - Get all patients
- `GET http://localhost:3000/messages` - Get all messages
- `GET http://localhost:3000/observations` - Get all observations
- `GET http://localhost:3000/images` - Get all images

### Testing Registration

To test the registration flow:

1. Start both servers with `npm run start:with-json-server`
2. Navigate to the login page and click "Register"
3. Fill in the registration form (Step 1 & Step 2)
4. Submit the form
5. The caregiver data will be saved to `db.json` under the `caregivers` array
6. You'll be automatically logged in and redirected

### Adding Test Data

You can manually add test data to `db.json`:

```json
{
  "caregivers": [
    {
      "id": 1,
      "name": "John Doe",
      "email": "john@example.com",
      "password": "hashed-password",
      "phone": "123456789",
      "birthDate": "1990-01-01",
      "profileImage": "",
      "caregiverType": "Formal",
      "speciality": "Nursing",
      "token": "fake-jwt-token"
    }
  ],
  "patients": [],
  "messages": [],
  "observations": [],
  "images": []
}
```

### Important Notes

- **Passwords:** Currently passwords are stored as-is. In production, ensure proper encryption.
- **Token:** A temporary token is generated on registration/login. Replace with real JWT in production.
- **Data Persistence:** All data persists in `db.json`. To reset, delete entries from the file.
- **API Endpoints:** All API calls now go to `http://localhost:3000` (configured in `environment.ts`)

## Troubleshooting

### JSON Server Not Starting
```bash
# Check if port 3000 is in use
netstat -ano | findstr :3000

# If occupied, kill the process or use a different port
npm run json-server -- --port 3001
```

### Port Already in Use
If port 4200 (Angular) or 3000 (JSON Server) is occupied:

```bash
# Change the Angular dev server port
ng serve --port 4300

# Change JSON Server port
json-server --watch db.json --port 3001
```

### Clear JSON Server Data
Simply edit `db.json` and remove the caregiver entries you want to reset.

## Next Steps: Switching to Backend

When your backend API is ready:

1. Update the `environment.ts` file to point to your backend:
   ```typescript
   export const environment = {
     production: false,
     apiUrl: 'http://localhost:8080'  // Your backend URL
   };
   ```

2. The authentication service methods don't need changes - they'll work with your backend as long as the API endpoints follow the same pattern.

3. Update the `AuthenticationService` to use the proper backend endpoints if your API structure differs.

## References

- [JSON Server Documentation](https://github.com/typicode/json-server)
- [Concurrently NPM](https://www.npmjs.com/package/concurrently)
