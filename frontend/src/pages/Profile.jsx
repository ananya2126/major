import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../services/api";
import { BookOpen, Smartphone, Mail, User, Edit3, Award, TrendingUp, GraduationCap, Star } from "lucide-react";

const Profile = () => {

    const [form, setForm] = useState({
        name: "",
        stream: "",
        mobile: "",
        ssc: "",
        inter: "",
        email: ""
    });

    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const navigate = useNavigate();

    useEffect(() => {

        const token = localStorage.getItem("token");

        if (!token) {
            navigate("/");
            return;
        }

        api.get("/user/profile")
            .then(res => {
                setForm(res.data);
                setLoading(false);
            })
            .catch(() => {
                setError("Failed to load profile");
                setLoading(false);
            });

    }, [navigate]);


    const handleUpdate = async () => {

        try {

            await api.put("/user/update-profile", form);

            alert("Profile updated successfully");

        } catch {

            alert("Update failed");

        }

    };


    if (loading)
        return (
            <div className="flex justify-center items-center min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50">
                <div className="animate-spin rounded-full h-16 w-16 border-4 border-indigo-200 border-t-indigo-600"></div>
            </div>
        );


    if (error)
        return (
            <div className="flex justify-center items-center min-h-screen bg-gradient-to-br from-red-50 via-white to-pink-50">
                <div className="bg-white rounded-2xl shadow-xl p-8 text-center max-w-md mx-4">
                    <div className="text-red-500 mb-4">
                        <svg className="w-16 h-16 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
                        </svg>
                    </div>
                    <h2 className="text-xl font-bold text-gray-800 mb-2">Oops!</h2>
                    <p className="text-red-600 font-medium">{error}</p>
                </div>
            </div>
        );


    return (

        <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50 py-8 px-4">

            <div className="max-w-6xl mx-auto">

                {/* Header */}
                <div className="text-center mb-8">
                    <h1 className="text-4xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent mb-2">
                        My Profile
                    </h1>
                    <p className="text-gray-600 text-lg">Manage your academic information and personal details</p>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

                    {/* Left Profile Card */}
                    <div className="lg:col-span-1">
                        <div className="bg-white rounded-3xl shadow-xl overflow-hidden transform hover:scale-105 transition-all duration-300">

                            {/* Header Gradient */}
                            <div className="bg-gradient-to-r from-indigo-500 to-purple-600 h-32 relative">
                                <div className="absolute -bottom-12 left-1/2 transform -translate-x-1/2">
                                    <div className="w-24 h-24 rounded-full bg-white shadow-lg flex items-center justify-center border-4 border-white">
                                        <div className="w-20 h-20 rounded-full bg-gradient-to-r from-indigo-500 to-purple-600 text-white flex items-center justify-center text-3xl font-bold">
                                            {form.name?.[0]?.toUpperCase() || <User size={32} />}
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Profile Info */}
                            <div className="pt-16 pb-8 px-6 text-center">

                                <h2 className="text-2xl font-bold text-gray-800 mb-2">
                                    {form.name}
                                </h2>

                                <div className="flex items-center justify-center gap-2 text-indigo-600 mb-1">
                                    <GraduationCap size={16} />
                                    <span className="font-medium">{form.stream || "Student"}</span>
                                </div>

                                <div className="space-y-4 mt-6">

                                    <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-xl hover:bg-indigo-50 transition-colors">
                                        <div className="p-2 bg-indigo-100 rounded-lg">
                                            <Mail className="text-indigo-600" size={18} />
                                        </div>
                                        <div className="text-left">
                                            <p className="text-xs text-gray-500 uppercase tracking-wide">Email</p>
                                            <p className="text-sm font-medium text-gray-800">{form.email}</p>
                                        </div>
                                    </div>

                                    <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-xl hover:bg-purple-50 transition-colors">
                                        <div className="p-2 bg-purple-100 rounded-lg">
                                            <Smartphone className="text-purple-600" size={18} />
                                        </div>
                                        <div className="text-left">
                                            <p className="text-xs text-gray-500 uppercase tracking-wide">Phone</p>
                                            <p className="text-sm font-medium text-gray-800">{form.mobile || "Not provided"}</p>
                                        </div>
                                    </div>

                                </div>

                            </div>

                        </div>
                    </div>


                    {/* Right Form Card */}
                    <div className="lg:col-span-2">
                        <div className="bg-white rounded-3xl shadow-xl p-8">

                            <div className="flex items-center gap-3 mb-8">
                                <div className="p-3 bg-gradient-to-r from-indigo-500 to-purple-600 rounded-xl text-white">
                                    <Edit3 size={24} />
                                </div>
                                <div>
                                    <h2 className="text-2xl font-bold text-gray-800">
                                        Academic Information
                                    </h2>
                                    <p className="text-gray-600">Update your educational details</p>
                                </div>
                            </div>


                            <div className="space-y-6">

                                {/* Name Field */}
                                <div className="group">
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Full Name
                                    </label>
                                    <div className="relative">
                                        <input
                                            value={form.name}
                                            onChange={e =>
                                                setForm({ ...form, name: e.target.value })
                                            }
                                            placeholder="Enter your full name"
                                            className="w-full border-2 border-gray-200 rounded-xl px-4 py-3 focus:outline-none focus:border-indigo-500 focus:ring-4 focus:ring-indigo-100 transition-all duration-200"
                                        />
                                        <User className="absolute right-3 top-3.5 text-gray-400" size={18} />
                                    </div>
                                </div>

                                {/* Stream Field */}
                                <div className="group">
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Stream/Specialization
                                    </label>
                                    <div className="relative">
                                        <input
                                            value={form.stream}
                                            onChange={e =>
                                                setForm({ ...form, stream: e.target.value })
                                            }
                                            placeholder="e.g., Computer Science, Mechanical Engineering"
                                            className="w-full border-2 border-gray-200 rounded-xl px-4 py-3 focus:outline-none focus:border-indigo-500 focus:ring-4 focus:ring-indigo-100 transition-all duration-200"
                                        />
                                        <BookOpen className="absolute right-3 top-3.5 text-gray-400" size={18} />
                                    </div>
                                </div>

                                {/* SSC Score */}
                                <div className="group">
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        SSC Percentage
                                    </label>
                                    <div className="relative">
                                        <input
                                            type="number"
                                            value={form.ssc}
                                            onChange={e =>
                                                setForm({ ...form, ssc: e.target.value })
                                            }
                                            placeholder="Enter SSC percentage"
                                            className="w-full border-2 border-gray-200 rounded-xl px-4 py-3 focus:outline-none focus:border-green-500 focus:ring-4 focus:ring-green-100 transition-all duration-200"
                                        />
                                        <Award className="absolute right-3 top-3.5 text-gray-400" size={18} />
                                    </div>
                                    
                                </div>

                                {/* Inter Score */}
                                <div className="group">
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Intermediate Percentage
                                    </label>
                                    <div className="relative">
                                        <input
                                            type="number"
                                            value={form.inter}
                                            onChange={e =>
                                                setForm({ ...form, inter: e.target.value })
                                            }
                                            placeholder="Enter intermediate percentage"
                                            className="w-full border-2 border-gray-200 rounded-xl px-4 py-3 focus:outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-100 transition-all duration-200"
                                        />
                                        <TrendingUp className="absolute right-3 top-3.5 text-gray-400" size={18} />
                                    </div>
                                    
                                </div>

                                {/* Update Button */}
                                <button
                                    onClick={handleUpdate}
                                    className="w-full bg-gradient-to-r from-indigo-500 to-purple-600 text-white py-4 rounded-xl font-bold hover:from-indigo-600 hover:to-purple-700 transform hover:scale-105 transition-all duration-200 shadow-lg hover:shadow-xl flex items-center justify-center gap-2"
                                >
                                    <Star size={20} />
                                    Update Profile
                                </button>

                            </div>

                        </div>
                    </div>

                </div>

            </div>

        </div>

    );

};

export default Profile;

