'use client';
import { useState, FormEvent, ChangeEvent } from 'react';
import { generateClient } from 'aws-amplify/data';
import { Schema } from '@/amplify/data/resource'; // adjust path to your actual schema

const client = generateClient<Schema>();

export default function Home() {
  const [email, setEmail] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(false);

  const handleLogin = async (e: FormEvent) => {
    e.preventDefault();

    try {
      const result = await client.models.Login.list({
        filter: {
          email: { eq: email },
          password: { eq: password },
        },
      });

      if (result?.data?.length > 0) {
        setIsLoggedIn(true);
      } else {
        setIsLoggedIn(false);
      }
    } catch (err) {
      console.error('Login failed:', err);
      setIsLoggedIn(false);
    }
  };

  const handleLogout = () => {
    setIsLoggedIn(false);
    setEmail('');
    setPassword('');
  };

  return (
    <div className="container">
      {!isLoggedIn ? (
        <form className="card" onSubmit={handleLogin}>
          <h2 className="title">Login</h2>
          <label>Email</label>
          <input
            className="input"
            type="email"
            value={email}
            placeholder="Enter your email"
            onChange={(e: ChangeEvent<HTMLInputElement>) => setEmail(e.target.value)}
            required
          />
          <label>Password</label>
          <input
            className="input"
            type="password"
            value={password}
            placeholder="Enter your password"
            onChange={(e: ChangeEvent<HTMLInputElement>) => setPassword(e.target.value)}
            required
          />
          <button className="button" type="submit">Login</button>
        </form>
      ) : (
        <div className="card">
          <h2 className="title">Welcome, {email}!</h2>
          <button className="button" onClick={handleLogout}>Logout</button>
        </div>
      )}

      <style jsx>{`
        .container {
          min-height: 100vh;
          display: flex;
          align-items: center;
          justify-content: center;
          background: #f0f2f5;
          padding: 20px;
          color: black;
        }

        .card {
          background: white;
          padding: 30px;
          border-radius: 10px;
          box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1);
          width: 100%;
          max-width: 400px;
          color: black;
        }

        .title {
          text-align: center;
          margin-bottom: 20px;
          color: black;
          font-size: 24px;
        }

        .input {
          width: 100%;
          padding: 10px;
          margin-bottom: 15px;
          border: 1px solid #ccc;
          border-radius: 6px;
          color: black;
        }

        .button {
          width: 100%;
          padding: 10px;
          background: #0070f3;
          color: white;
          border: none;
          border-radius: 6px;
          cursor: pointer;
          font-weight: bold;
          transition: background 0.2s;
        }

        .button:hover {
          background: #005bb5;
        }

        label {
          font-weight: 500;
          margin-bottom: 5px;
          display: block;
          color: black;
        }
      `}</style>
    </div>
  );
}
