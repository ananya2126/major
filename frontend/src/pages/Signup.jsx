import React, { useState } from 'react';
import api from '../services/api';
import { useNavigate, Link } from 'react-router-dom';
import { UserPlus, ArrowRight, Mail, Lock, User } from 'lucide-react';

const Signup = () => {
    const [req, setReq] = useState({ name: '', username: '', email: '', password: '', role: 'STUDENT' });
    const navigate = useNavigate();

    const handleSignup = async (e) => {
        e.preventDefault();
        try {
            await api.post('/auth/signup', req);
            alert("Account created successfully!");
            navigate('/login');
        } catch (err) {
            alert("Registration failed. Email or Username might be taken.");
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center p-6 bg-slate-50">
            <div className="w-full max-w-md">
                <div className="text-center mb-8">
                    <div className="inline-flex p-4 bg-indigo-600 rounded-3xl shadow-2xl shadow-indigo-200 mb-4 text-white">
                        <UserPlus size={40} />
                    </div>
                    <h1 className="text-4xl font-black text-slate-900 mb-2">Create Account</h1>
                    <p className="text-slate-500">Join our academic community today</p>
                </div>

                <form onSubmit={handleSignup} className="space-y-4">
                    <div className="bg-white rounded-2xl border border-slate-200 p-1 focus-within:border-indigo-500 transition-all flex items-center px-4">
                        <User className="text-slate-400" size={20}/>
                        <input className="w-full p-4 bg-transparent outline-none font-medium" placeholder="Full Name" onChange={e => setReq({...req, name: e.target.value})} required />
                    </div>
                    <div className="bg-white rounded-2xl border border-slate-200 p-1 focus-within:border-indigo-500 transition-all flex items-center px-4">
                        <User className="text-slate-400" size={20}/>
                        <input className="w-full p-4 bg-transparent outline-none font-medium" placeholder="Username" onChange={e => setReq({...req, username: e.target.value})} required />
                    </div>
                    <div className="bg-white rounded-2xl border border-slate-200 p-1 focus-within:border-indigo-500 transition-all flex items-center px-4">
                        <Mail className="text-slate-400" size={20}/>
                        <input className="w-full p-4 bg-transparent outline-none font-medium" type="email" placeholder="Email" onChange={e => setReq({...req, email: e.target.value})} required />
                    </div>
                    <div className="bg-white rounded-2xl border border-slate-200 p-1 focus-within:border-indigo-500 transition-all flex items-center px-4">
                        <Lock className="text-slate-400" size={20}/>
                        <input className="w-full p-4 bg-transparent outline-none font-medium" type="password" placeholder="Password" onChange={e => setReq({...req, password: e.target.value})} required />
                    </div>
                    
                    <button className="w-full bg-indigo-600 text-white py-5 rounded-2xl font-bold hover:bg-indigo-700 transition-all shadow-xl flex items-center justify-center gap-2 group">
                        Register Now <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform"/>
                    </button>
                </form>
                
                <p className="mt-8 text-center font-medium text-slate-500">
                    Already have an account? <Link to="/login" className="text-indigo-600 hover:underline">Sign In</Link>
                </p>
            </div>
        </div>
    );
};

export default Signup;