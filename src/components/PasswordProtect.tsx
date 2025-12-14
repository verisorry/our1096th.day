// disclaimer: i am FULLY aware that this isn't secure at all and the password
// is visible on client side
// BUT this is really just for a fun gift so... it's just the act of having
// to enter a password that gives it a little zing

'use client';

import { useState, useRef, useEffect, startTransition } from 'react';

export default function PasswordProtect({ children }: { children: React.ReactNode }) {
    const [password, setPassword] = useState('');
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [errorMessage, setErrorMessage] = useState('');
    const [mounted, setMounted] = useState(false);
    const formRef = useRef<HTMLFormElement>(null);

    useEffect(() => {
        startTransition(() => {
            const isAuth = sessionStorage.getItem('authenticated') === 'true';
            setIsAuthenticated(isAuth);
            setMounted(true);
        });
    }, []);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (password === process.env.NEXT_PUBLIC_SITE_PASSWORD) {
            setIsAuthenticated(true);
            sessionStorage.setItem('authenticated', 'true');
        } else {
            console.log('error')
            setErrorMessage('Password Incorrect!');
        }
    };

    if (!mounted) {
        return null;
    }

    if (isAuthenticated) {
        return <>{children}</>;
    }

    return (
        <div className="min-h-screen bg-zinc-50 flex items-center justify-center px-4">
            <div className="bg-zinc-100 p-8 rounded-lg border border-zinc-200 max-w-md w-full">
                <h1 className="text-2xl font-bold text-zinc-800 mb-2 text-center">
                    Happy Anniversary!
                </h1>
                <p className="text-zinc-600 text-sm mb-6 text-center">
                    Enter password in your card to access
                </p>
                <form ref={formRef} onSubmit={handleSubmit} onChange={() => setErrorMessage('')}>
                    <input
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        placeholder="Password"
                        className="w-full px-4 py-2 bg-white border border-zinc-300 rounded text-zinc-800 focus:outline-none focus:border-blue-500"
                        autoFocus
                    />

                    <p className='text-sm text-red-700 mt-3'>{errorMessage}</p>
                    
                    <button
                        type="submit"
                        className="cursor-pointer w-full mt-4 bg-green-600 hover:bg-green-700 text-white py-2 rounded-lg font-medium transition-colors"
                    >
                        Enter
                    </button>
                </form>
            </div>
        </div>
    );
}