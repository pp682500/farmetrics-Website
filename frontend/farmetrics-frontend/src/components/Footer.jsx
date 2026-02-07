function Footer({ setPage }) {
    return (
        <footer className="bg-green-900 text-green-100 py-12 mt-auto">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
                    {/* Brand & Mission */}
                    <div>
                        <h2 className="text-2xl font-bold text-white mb-4">Farmetrics 🌾</h2>
                        <p className="text-green-200 text-sm leading-relaxed mb-4">
                            Empowering farmers with data-driven insights to maximize yield, optimize costs, and ensure sustainable growth.
                        </p>
                        <div className="flex space-x-4">
                            <a href="https://www.linkedin.com/in/priyam-pandey6825/" target="_blank" rel="noopener noreferrer" className="hover:text-white transition">LinkedIn</a>
                            <a href="https://www.instagram.com/pp_682500?igsh=c2loeTI3OGhkdDhi" target="_blank" rel="noopener noreferrer" className="hover:text-white transition">Instagram</a>
                        </div>
                    </div>

                    {/* Quick Links */}
                    <div>
                        <h3 className="text-lg font-semibold text-white mb-4">Quick Links</h3>
                        <ul className="space-y-2 text-sm">
                            <li><button onClick={() => setPage("home")} className="hover:text-white transition">Home</button></li>
                            <li><button onClick={() => setPage("calculator")} className="hover:text-white transition">Calculator</button></li>
                            <li><button onClick={() => setPage("resources")} className="hover:text-white transition">Resources</button></li>
                            <li><button onClick={() => setPage("bhulekh")} className="hover:text-white transition">Bhulekh Records</button></li>
                            <li><button onClick={() => setPage("support")} className="hover:text-white transition">Feedback & Complaints</button></li>
                        </ul>
                    </div>

                    {/* Founders & Contact */}
                    <div>
                        <h3 className="text-lg font-semibold text-white mb-4">The Creator</h3>
                        <div className="space-y-3 mb-6">
                            <div className="flex items-center gap-3">
                                <div className="w-12 h-12 rounded-full bg-green-800 flex items-center justify-center text-2xl border-2 border-green-600 shadow-md">👨‍💻</div>
                                <div>
                                    <p className="font-bold text-white text-lg">Priyam Pandey</p>
                                    <p className="text-xs text-green-300 uppercase tracking-wide">Solo Developer & Founder</p>
                                </div>
                            </div>
                            <p className="text-sm text-green-200 opacity-90 italic">
                                "Built with passion to help farmers succeed."
                            </p>
                        </div>

                        <h4 className="text-sm font-semibold text-white mb-1">Contact</h4>
                        <p className="text-sm text-green-300 hover:text-white transition cursor-pointer">priyam6849@gmail.com</p>
                    </div>
                </div>

                <div className="border-t border-green-800 pt-8 text-center text-sm text-green-400">
                    <p>&copy; {new Date().getFullYear()} Farmetrics. All rights reserved.</p>
                </div>
            </div>
        </footer>
    );
}

export default Footer;
