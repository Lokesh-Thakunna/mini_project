import React from "react";
import { Link } from "react-router-dom";

const Home = () => {
    return (
        <div className="bg-slate-50 text-gray-800">

            {/* ================= HERO SECTION ================= */}
            <section
                className="relative text-white min-h-[520px] flex items-center"
                style={{
                    backgroundImage:
                        "linear-gradient(rgba(30,58,138,0.75), rgba(30,58,138,0.75)), url('/images/hero-bg.png')",
                    backgroundRepeat: "no-repeat",
                    backgroundSize: "cover",
                    backgroundPosition: "center",
                }}
            >
                <div className="max-w-7xl mx-auto px-6 py-20 text-center w-full">
                    <h1 className="text-4xl md:text-5xl font-bold mb-4">
                        Ensuring Transparency in Public Fund Utilization
                    </h1>

                    <p className="text-lg text-blue-100 mb-8">
                        Track government funds securely using Blockchain Technology
                    </p>

                    <div className="flex justify-center gap-4 flex-wrap">
                        <Link
                            to="/public/schemes"
                            className="bg-blue-600 hover:bg-blue-500 text-white px-6 py-3 rounded-lg font-semibold transition shadow"
                        >
                            View Public Dashboard
                        </Link>

                        <Link
                            to="/admin"
                            className="bg-white text-blue-700 px-6 py-3 rounded-lg font-semibold hover:bg-blue-50 transition shadow"
                        >
                            Admin Login
                        </Link>
                        
                    </div>
                </div>
            </section>

            {/* ================= STATS SECTION ================= */}
            <section className="max-w-7xl mx-auto px-6 -mt-12 relative z-10">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                    <StatCard title="Total Funds Allocated" value="₹12,50,00,000" />
                    <StatCard title="Funds Utilized" value="₹8,75,00,000" />
                    <StatCard title="Active Schemes" value="15" />
                    <StatCard title="Blockchain Transactions" value="1,240" />
                </div>
            </section>

            {/* ================= HOW TFTS WORKS ================= */}
            <section className="max-w-7xl mx-auto px-6 py-20">
                <h2 className="text-3xl font-bold text-center mb-12">
                    How TFTS Works
                </h2>

                <div className="grid grid-cols-1 md:grid-cols-4 gap-8 text-center">
                    <WorkStep
                        step="1"
                        title="Admin Adds Scheme"
                        image="/images/steps/admin.jpg"
                    />
                    <WorkStep
                        step="2"
                        title="Funds Released via Smart Contract"
                        image="/images/steps/contract.jpg"
                    />
                    <WorkStep
                        step="3"
                        title="Utilization Department Spends Funds"
                        image="/images/steps/utilization.jpg"
                    />
                    <WorkStep
                        step="4"
                        title="Public Tracks Transactions"
                        image="/images/steps/public.jpg"
                    />
                </div>
            </section>

            {/* ================= TRANSPARENCY & SECURITY ================= */}
            <section className="bg-white py-20">
                <div className="max-w-7xl mx-auto px-6">
                    <h2 className="text-3xl font-bold text-center mb-12">
                        Transparency & Security
                    </h2>

                    <div className="grid grid-cols-1 md:grid-cols-4 gap-8 text-center">
                        <FeatureCard
                            title="Blockchain Secured"
                            image="/images/features/blockchain1.jpg"
                        />
                        <FeatureCard
                            title="Public Visibility"
                            image="/images/features/visibility.jpg"
                        />
                        <FeatureCard
                            title="Immutable Records"
                            image="/images/features/immutable.jpg"
                        />
                        <FeatureCard
                            title="Real-Time Tracking"
                            image="/images/features/realtime.jpg"
                        />
                    </div>
                </div>
            </section>

            {/* ================= FOOTER ================= */}
            <footer className="bg-gradient-to-r from-blue-800 via-green-800 to-purple-800 text-blue-100 py-6 text-center text-sm">
                <h1>© 2025 Transparent Fund Tracking System | Developed by Lokesh Thakuuna</h1>
                <h2>Contact : lokeshthakunna@gmail.com</h2>
            </footer>

        </div>
    );
};

/* ================= COMPONENTS ================= */

const StatCard = ({ title, value }) => (
<div className="
  bg-gradient-to-br from-blue-400 via-green-400 to-purple-400
  hover:bg-gradient-to-br hover:from-blue-800 hover:via-green-800 hover:to-purple-800

  border border-blue-200
  rounded-xl p-6

  shadow-sm hover:shadow-md
  transition-all duration-300

  text-center
">


        <p className="text-xl font-bold-mt-1 text-black-900">{title}</p>
        <h3 className="text-2xl font-bold mt-2 text-gray-800">{value}</h3>
    </div>
);

const WorkStep = ({ step, title, image }) => (
<div className=" bg-gradient-to-br from-blue-400 via-green-400 to-purple-400 rounded-xl p-8 shadow-sm transition-all duration-300 ease-in-out hover:shadow-xl hover:-translate-y-1 hover:scale-[1.02] hover:border-blue-500 text-center text-gray-900 hover:text-white">

        <img
            src={image}
            alt={title}
            className="w-20 h-16 mx-auto mb-4 object-contain"
        />
        <div className="w-8 h-8 mx-auto mb-2 rounded-full bg-blue-600 text-white flex items-center justify-center font-bold">
            {step}
        </div>
        <h3 className="font-semibold text-sm text-gray-800">
            {title}
        </h3>
    </div>
);

const FeatureCard = ({ title, image }) => (
<div className=" bg-gradient-to-br from-blue-400 via-green-400 to-purple-400 border-blue-200 rounded-xl p-8 shadow-sm transition-all duration-300 ease-in-out hover:shadow-xl hover:-translate-y-1 hover:scale-[1.02] hover:border-blue-500 text-center text-gray-900 hover:text-white">
        
        <img
            src={image}
            alt={title}
            className="w-20 h-20 mx-auto mb-4 object-contain"
        />
        <h3 className="font-semibold text-lg text-gray-800">
            {title}
        </h3>
    </div>
);

export default Home;
