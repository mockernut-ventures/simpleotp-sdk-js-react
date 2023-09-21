# simpleotp-sdk-js-react

# **Installation**:

   First, make sure you have the `@simpleotp/core` library installed in your project since the React Simple OTP plugin depends on it. Also make sure to install this plugin.

   ```bash
   npm install @simpleotp/core
   npm install @simpleotp/react
   ```

# **Import and Setup**:

   In your React application, you'll need to import the `SimpleOTPProvider` component from the plugin and wrap your entire application with it. Typically, this is done in your top-level component, like `App.js`.

   ```jsx
   import React from 'react';
   import SimpleOTPProvider from '@simpleotp/react';

   function App() {
     return (
       <SimpleOTPProvider siteID="yourSiteID - given to you after you sign up for a Simple OTP subscription and create a site">
         {/* Your app's components go here */}
       </SimpleOTPProvider>
     );
   }

   export default App;
   ```

   Replace `"yourSiteID"` and `"yourAPIURL"` with the actual values you need for your SimpleOTP setup.

# **Usage in Components**:

   Now, you can use the `useSimpleOTP` hook in any of your components where you want to access the `ReactSimpleOTP` instance. Here's an example of how to use the sign-in flow, the auth flow, and the sign-out flow in different React components using Tailwind CSS for styling:

   
SignIn:
```jsx
import React, { useContext, useState } from 'react';
import { AuthStatusCode, SignInStatusCode } from '@simpleotp/core';
import { useSimpleOTP } from '@simpleotp/react'; // Update the import path
import { useHistory } from 'react-router-dom';

function SignIn({ email }) {
  const history = useHistory();
  const simpleOTP = useSimpleOTP();
  const [signInStatus, setSignInStatus] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [inputEmail, setInputEmail] = useState(email || '');

  const signIn = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    const response = await simpleOTP.signIn(inputEmail);

    if (response.code === SignInStatusCode.OK.description) {
      history.push({ pathname: '/sign-in/confirmation', search: `email=${inputEmail}` });
    } else {
      setIsLoading(false);
      setSignInStatus(response);
    }
  };

  if (simpleOTP.isAuthenticatedRef()) {
    history.push('/');
    return null;
  }

  return (
    <div className="flex min-h-full flex-1 flex-col justify-center px-6 py-12 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-sm">
        <h2 className="mt-10 text-center text-2xl font-bold leading-9 tracking-tight text-white">
          Sign in to your account
        </h2>
      </div>
      <div className="mt-5 sm:mx-auto sm:w-full sm:max-w-sm">
        <form onSubmit={signIn} className="space-y-6">
          {signInStatus && (
            <div
              className={`${
                [SignInStatusCode.InternalServerError.description, SignInStatusCode.InvalidSite.description, SignInStatusCode.SiteNotFound.description].includes(
                  signInStatus.code
                )
                  ? 'bg-red-100 border border-red-400 text-red-700'
                  : 'bg-yellow-100 border border-yellow-400 text-yellow-700'
              } px-4 py-3 rounded relative`}
              role="alert"
            >
              <span className="block sm:inline">{signInStatus.message}</span>
            </div>
          )}
          <div>
            <label htmlFor="email" className="block text-sm font-medium leading-6 text-white">
              Email address
            </label>
            <div className="mt-2">
              <input
                id="email"
                name="email"
                type="email"
                autoComplete="email"
                required
                value={inputEmail}
                onChange={(e) => setInputEmail(e.target.value)}
                className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
              />
            </div>
          </div>
          <div>
            <button type="submit" disabled={!inputEmail}>
              Sign In
            </button>
          </div>
          <p className="mt-10 text-center text-sm text-gray-500">
            We'll send a magic sign in link to your email when you click "Sign in," even if you don't have an account yet.
          </p>
        </form>
      </div>
    </div>
  );
}

export default SignIn;
```

Auth:
```jsx
import React, { useEffect, useState } from 'react';
import { AuthStatusCode } from '@simpleotp/core';
import { useSimpleOTP } from '@simpleotp/react';
import { useHistory } from 'react-router-dom';

function Authentication() {
  const history = useHistory();
  const simpleOTP = useSimpleOTP();
  const [authErrorMessage, setAuthErrorMessage] = useState(null);

  useEffect(() => {
    const authenticateUser = async () => {
      const authResponse = await simpleOTP.authWithURLCode();

      if (authResponse.code !== AuthStatusCode.OK.description) {
        setAuthErrorMessage(authResponse.message);
      } else {
        history.push('/');
      }
    };

    authenticateUser();
  }, [simpleOTP, history]);

  return (
    <div className="flex min-h-full flex-1 flex-col justify-center px-6 py-12 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-sm">
        <h2 className="mt-10 text-center text-2xl font-bold leading-9 tracking-tight text-white">
          Authentication
        </h2>
      </div>
      <div className="mt-5 sm:mx-auto sm:w-full sm:max-w-sm">
        {!authErrorMessage ? (
          <span className="text-2xl font-sans text-white">
            Authenticating you, one moment...
          </span>
        ) : (
          <span className="text-2xl font-sans text-white">
            There was an error authenticating you: {authErrorMessage}
          </span>
        )}
      </div>
    </div>
  );
}

export default Authentication;
```

SignOut:
```jsx
import React from 'react';
import { useSimpleOTP } from './SimpleOTPProvider'; // Update the import path
import { useHistory } from 'react-router-dom';

function AuthButton() {
  const history = useHistory();
  const simpleOTP = useSimpleOTP();

  const isAuthenticated = simpleOTP.isAuthenticatedRef();

  const signIn = () => {
    history.push('/sign-in');
  };

  const signOut = () => {
    simpleOTP.signOut();
    history.push('/');
  };

  return (
    <a href="#">
      {/* User Icon goes here */}
      <span onClick={signIn}>
        {!isAuthenticated ? (
          <>
            Sign in <span aria-hidden="true">&rarr;</span>
          </>
        ) : (
          <>
            Sign out <span aria-hidden="true">&rarr;</span>
          </>
        )}
      </span>
    </a>
  );
}

export default AuthButton;
```

   In this example, we're using the `simpleOTPInstance` obtained from `useSimpleOTP` to manage authentication-related logic and display content based on the user's authentication state.

# **Accessing Authentication State**:

   The `simpleOTPInstance` provides methods like `authWithURLCode` and properties like `isAuthenticatedRef()` and `getUserRef()` for managing authentication and accessing user-related data. You can use these methods and properties in your components to handle authentication flows.

# **Error Handling and Additional Logic**:

   Depending on your specific application requirements, you may need to add error handling, loading states, or additional logic to manage the authentication flow effectively.
   The `SimpleOTPProvider` wraps your app with the necessary context to provide access to the `ReactSimpleOTP` instance, which can then be used in various components to handle authentication and user-related functionality.
