import { useState } from "react";
import { supabase } from "../supabaseClient";
import { ClockIcon, UserGroupIcon, ShieldCheckIcon } from "../components/Icons";

function Support({ user, showToast }) {
    const [formData, setFormData] = useState({
        type: "feedback",
        subject: "",
        message: "",
        email: user?.email || "",
    });
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);

        try {
            const { error } = await supabase.from("feedback").insert([
                {
                    user_id: user?.id || null,
                    user_email: formData.email,
                    type: formData.type,
                    subject: formData.subject,
                    message: formData.message,
                },
            ]);

            if (error) throw error;

            showToast("Thank you for your feedback! We will look into it.", "success");
            setFormData({
                type: "feedback",
                subject: "",
                message: "",
                email: user?.email || "",
            });
        } catch (error) {
            console.error("Error submitting feedback:", error);
            showToast("Failed to submit. Please try again later.", "error");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-transparent py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-3xl mx-auto">
                <div className="text-center mb-12">
                    <h1 className="text-4xl font-extrabold text-green-900 mb-4">
                        Feedback & Complaints
                    </h1>
                    <p className="text-lg text-gray-600">
                        We value your input. Help us improve Farmetrics or report any issues you encounter.
                    </p>
                </div>

                <div className="bg-white rounded-2xl shadow-xl overflow-hidden border border-gray-100">
                    <div className="p-8 sm:p-12">
                        <form onSubmit={handleSubmit} className="space-y-6">
                            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                                <div>
                                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                                        I want to submit a:
                                    </label>
                                    <select
                                        value={formData.type}
                                        onChange={(e) => setFormData({ ...formData, type: e.target.value })}
                                        className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all outline-none bg-gray-50"
                                    >
                                        <option value="feedback">✨ Feedback / Suggestion</option>
                                        <option value="complaint">⚠️ Complaint / Issue</option>
                                    </select>
                                </div>

                                <div>
                                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                                        Email Address
                                    </label>
                                    <input
                                        type="email"
                                        required
                                        value={formData.email}
                                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                        placeholder="your@email.com"
                                        className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all outline-none bg-gray-50"
                                    />
                                </div>
                            </div>

                            <div>
                                <label className="block text-sm font-semibold text-gray-700 mb-2">
                                    Subject
                                </label>
                                <input
                                    type="text"
                                    required
                                    value={formData.subject}
                                    onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                                    placeholder="What is this about?"
                                    className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all outline-none bg-gray-50"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-semibold text-gray-700 mb-2">
                                    Message
                                </label>
                                <textarea
                                    required
                                    rows="5"
                                    value={formData.message}
                                    onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                                    placeholder="Share your thoughts or describe the issue in detail..."
                                    className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all outline-none bg-gray-50 resize-none"
                                ></textarea>
                            </div>

                            <div>
                                <button
                                    type="submit"
                                    disabled={loading}
                                    className={`w-full py-4 px-6 rounded-xl text-white font-bold text-lg shadow-lg transform transition-all active:scale-95 ${loading
                                        ? "bg-gray-400 cursor-not-allowed"
                                        : "bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800"
                                        }`}
                                >
                                    {loading ? (
                                        <span className="flex items-center justify-center gap-2">
                                            <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                            </svg>
                                            Submitting...
                                        </span>
                                    ) : (
                                        "Submit Feedback"
                                    )}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>

                <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-6 text-center">
                    <div className="group p-6 bg-white rounded-xl shadow-sm border border-gray-100 transition-all hover:shadow-md hover:border-blue-200">
                        <div className="h-16 w-16 bg-blue-50 text-blue-600 rounded-full flex items-center justify-center mx-auto mb-4 transition-all group-hover:bg-blue-600 group-hover:text-white">
                            <ClockIcon />
                        </div>
                        <h3 className="font-bold text-gray-900 group-hover:text-blue-700 transition-colors">Swift Response</h3>
                        <p className="text-sm text-gray-500 mt-2">We aim to review all messages within 24-48 hours.</p>
                    </div>
                    <div className="group p-6 bg-white rounded-xl shadow-sm border border-gray-100 transition-all hover:shadow-md hover:border-green-200">
                        <div className="h-16 w-16 bg-green-50 text-green-600 rounded-full flex items-center justify-center mx-auto mb-4 transition-all group-hover:bg-green-600 group-hover:text-white">
                            <UserGroupIcon />
                        </div>
                        <h3 className="font-bold text-gray-900 group-hover:text-green-700 transition-colors">User Driven</h3>
                        <p className="text-sm text-gray-500 mt-2">Your feedback directly influences our roadmap.</p>
                    </div>
                    <div className="group p-6 bg-white rounded-xl shadow-sm border border-gray-100 transition-all hover:shadow-md hover:border-purple-200">
                        <div className="h-16 w-16 bg-purple-50 text-purple-600 rounded-full flex items-center justify-center mx-auto mb-4 transition-all group-hover:bg-purple-600 group-hover:text-white">
                            <ShieldCheckIcon />
                        </div>
                        <h3 className="font-bold text-gray-900 group-hover:text-purple-700 transition-colors">Secure & Private</h3>
                        <p className="text-sm text-gray-500 mt-2">Your data is stored securely and handled with care.</p>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Support;
