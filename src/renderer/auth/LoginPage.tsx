import React, { useContext } from 'react';
import { Link } from 'react-router-dom';
import AuthContext from './AuthContext';

import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import Label from '../components/ui/label';

import imagePath from '../../../assets/images/placeholder.svg';

function LoginPage() {
  const authContext = useContext(AuthContext);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    // Safely access loginUser
    authContext?.loginUser(e);
  };

  return (
    <div className="w-full lg:grid h-screen lg:min-h-[600px] lg:grid-cols-2 xl:min-h-[800px]">
      <div className="flex items-center h-full justify-center py-12">
        <div className="mx-auto grid w-[350px] gap-6">
          <div className="grid gap-2 text-center">
            <h1 className="text-3xl font-bold">Hey there 👋🏼</h1>
            <p className="text-balance text-sm text-muted-foreground">
              Enter your username below to login
              <br />
              to your account
            </p>
          </div>
          <form onSubmit={handleSubmit}>
            <div className="grid gap-4">
              <div className="grid gap-2">
                <Label htmlFor="username">Username</Label>
                <Input
                  id="text"
                  type="text"
                  name="username"
                  placeholder="Enter username"
                  required
                />
              </div>
              <div className="grid gap-2">
                <div className="flex items-center">
                  <Label htmlFor="password">Password</Label>
                  <Link
                    to="/forgot-password"
                    className="ml-auto inline-block text-sm underline"
                  >
                    Forgot your password?
                  </Link>
                </div>
                <Input id="password" type="password" name="password" required />
              </div>
              <Button asChild={false} type="submit" className="w-full">
                Login
              </Button>
            </div>
          </form>
          {/* <div className="mt-4 text-center text-sm">
            Don&apos;t have an account?{' '}
            <Link to="/" className="underline">
              Sign up
            </Link>
          </div> */}
        </div>
      </div>
      <div className="hidden bg-muted lg:block">
        <image
          src={imagePath}
          width="1920"
          height="1080"
          className="h-full w-full object-cover dark:brightness-[0.2] dark:grayscale"
        />
      </div>
    </div>
  );
}

export default LoginPage;
