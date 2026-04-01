import React, { useState } from 'react';
import api from '../services/api';
import { useNavigate, Link } from 'react-router-dom';
import { ShieldCheck, ArrowRight } from 'lucide-react';

const Login = () => {
    const [creds, setCreds] = useState({ email: '', password: '' });
    const navigate = useNavigate();

    const handleLogin = async (e) => {
        e.preventDefault();
        try {
            localStorage.removeItem("token");
            const res = await api.post('/auth/login', creds);
            localStorage.setItem('token', res.data.token);
            window.dispatchEvent(new Event('authChange'));
            navigate('/feed');
        } catch(err) { 
            alert("Invalid Credentials. Please try again."); 
            //console.error(err); 
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center p-6">
            <div className="w-full max-w-md">
                <div className="text-center mb-10">
                    <div className="inline-flex p-4 bg-indigo-600 rounded-3xl shadow-2xl shadow-indigo-200 mb-4 text-white">
                        <ShieldCheck size={40} />
                    </div>
                    <h1 className="text-4xl font-black text-slate-900 mb-2">Welcome Back.</h1>
                    <p className="text-slate-500">Sign in to manage your education portal</p>
                </div>

                <form onSubmit={handleLogin} className="space-y-4">
                    <div className="group bg-white rounded-2xl border border-slate-200 p-1 focus-within:border-indigo-500 transition-all">
                        <input 
                            className="w-full p-4 bg-transparent outline-none font-medium" 
                            type="email" placeholder="Email address"
                            onChange={e => setCreds({...creds, email: e.target.value})} 
                        />
                    </div>
                    <div className="group bg-white rounded-2xl border border-slate-200 p-1 focus-within:border-indigo-500 transition-all">
                        <input 
                            className="w-full p-4 bg-transparent outline-none font-medium" 
                            type="password" placeholder="Password"
                            onChange={e => setCreds({...creds, password: e.target.value})} 
                        />
                    </div>
                    <button className="w-full bg-slate-900 text-white py-5 rounded-2xl font-bold hover:bg-black transition-all shadow-xl flex items-center justify-center gap-2 group">
                        Enter Dashboard <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform"/>
                    </button>
                </form>
                <p className="mt-8 text-center font-medium text-slate-500">
                    Don't have an account? <Link to="/signup" className="text-indigo-600 hover:underline">Register here</Link>
                </p>
            </div>
        </div>
    );
};
export default Login;