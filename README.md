# simpleotp-sdk-js-react

Here's 

1. **Installation**:

   First, make sure you have the `@simpleotp/core` library installed in your project since the React Simple OTP plugin depends on it. Also make sure to install this plugin.

   ```bash
   npm install @simpleotp/core
   npm install @simpleotp/react
   ```

2. **Import and Setup**:

   In your React application, you'll need to import the `SimpleOTPProvider` component from the plugin and wrap your entire application with it. Typically, this is done in your top-level component, like `App.js`.

   ```jsx
   import React from 'react';
   import SimpleOTPProvider from '@simpleotp/react';

   function App() {
     return (
       <SimpleOTPProvider siteID="yourSiteID">
         {/* Your app's components go here */}
       </SimpleOTPProvider>
     );
   }

   export default App;
   ```

   Replace `"yourSiteID"` and `"yourAPIURL"` with the actual values you need for your SimpleOTP setup.

3. **Usage in Components**:

   Now, you can use the `useSimpleOTP` hook in any of your components where you want to access the `ReactSimpleOTP` instance:

import React, { useState, useEffect } from 'react';
import { useSimpleOTP } from './SimpleOTPProvider'; // Adjust the import path as needed

function AuthComponent() {
  const simpleOTPInstance = useSimpleOTP();

  // Use simpleOTPInstance methods and properties as needed
  const isAuthenticated = simpleOTPInstance.isAuthenticatedRef();
  const user = simpleOTPInstance.getUserRef();

  const [isSignIn, setIsSignIn] = useState(false);

  useEffect(() => {
    // Check if the URL contains the authentication code
    const urlSearchParams = new URLSearchParams(window.location.search);
    const codeFromURL = urlSearchParams.get('code');

    if (codeFromURL) {
      // If the code is in the URL, call authWithURLCode to complete authentication
      handleAuthWithURLCode(codeFromURL);
    }
  }, []);

  const handleSignIn = async () => {
    try {
      setIsSignIn(true); // Set the flag to indicate sign-in initiated
      await simpleOTPInstance.signIn(); // Call signIn to send the authentication code via email
    } catch (error) {
      // Handle any errors that occur during sign-in
      console.error('Sign-in error:', error);
    }
  };

  const handleAuthWithURLCode = async (code) => {
    try {
      const authResult = await simpleOTPInstance.authWithURLCode(code); // Complete authentication
      if (authResult.code === 'OK') {
        // Authentication successful
        console.log('Authentication successful');
      } else {
        // Handle authentication failure
        console.error('Authentication failed');
      }
    } catch (error) {
      // Handle any errors that occur during authentication
      console.error('Authentication error:', error);
    }
  };

  // Render your component based on the authentication state
  return (
    <div>
      {isAuthenticated ? (
        <div>
          <p>Welcome, {user}</p>
          <button onClick={simpleOTPInstance.signOut}>Log Out</button>
        </div>
      ) : (
        <div>
          {isSignIn ? (
            <div>
              <p>Signing in...</p>
            </div>
          ) : (
            <div>
              <p>You are not authenticated.</p>
              <button onClick={handleSignIn}>Log In</button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export default AuthComponent;


   In this example, we're using the `simpleOTPInstance` obtained from `useSimpleOTP` to manage authentication-related logic and display content based on the user's authentication state.

4. **Accessing Authentication State**:

   The `simpleOTPInstance` provides methods like `authWithURLCode` and properties like `isAuthenticatedRef()` and `getUserRef()` for managing authentication and accessing user-related data. You can use these methods and properties in your components to handle authentication flows.

5. **Logging Out**:

   If you have a logout feature, you can use the `signOut` method provided by `simpleOTPInstance` to log the user out:

   ```jsx
   function LogoutButton() {
     const simpleOTPInstance = useSimpleOTP();

     const handleLogout = () => {
       simpleOTPInstance.signOut();
     };

     return (
       <button onClick={handleLogout}>Log Out</button>
     );
   }
   ```

6. **Error Handling and Additional Logic**:

   Depending on your specific application requirements, you may need to add error handling, loading states, or additional logic to manage the authentication flow effectively.
   The `SimpleOTPProvider` wraps your app with the necessary context to provide access to the `ReactSimpleOTP` instance, which can then be used in various components to handle authentication and user-related functionality.
