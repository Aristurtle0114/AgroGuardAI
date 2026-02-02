
import React, { useState } from 'react';
import PaymentModal from '../components/PaymentModal';
import { User } from '../types';
import { dataService } from '../services/dataService';

interface SubscriptionPageProps {
    onComplete: (user: User) => void;
    onCancel: () => void;
}

const plans = [
    {
        id: 'Free',
        name: 'Sprout',
        price: 'Free',
        period: 'forever',
        features: ['Basic Disease Detection (3/day)', 'Community Access', 'Ads Supported'],
        color: 'slate',
        popular: false
    },
    {
        id: 'Pro',
        name: 'Harvest',
        price: '₱299',
        period: 'per month',
        features: ['Unlimited Detections', 'Expert AI Chat', 'Weather Alerts', 'No Ads'],
        color: 'emerald',
        popular: true
    },
    {
        id: 'Enterprise',
        name: 'Estate',
        price: '₱899',
        period: 'per month',
        features: ['Multiple Farm Profiles', 'Priority Support', 'API Access', 'Advanced Analytics'],
        color: 'purple',
        popular: false
    }
];

const SubscriptionPage: React.FC<SubscriptionPageProps> = ({ onComplete, onCancel }) => {
    const [userName, setUserName] = useState('');
    const [farmName, setFarmName] = useState('');
    const [step, setStep] = useState(1); // 1: Info, 2: Plan
    const [selectedPlan, setSelectedPlan] = useState<any>(null);
    const [showPayment, setShowPayment] = useState(false);

    const handleInfoSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (userName && farmName) setStep(2);
    };

    const handlePlanSelect = (plan: any) => {
        setSelectedPlan(plan);
        if (plan.price === 'Free') {
            // Automatic "payment" for free tier
            const newUser: User = {
                id: `u_${Date.now()}`,
                name: userName,
                farm_name: farmName,
                plan: 'Free',
                subscription_status: 'active'
            };
            dataService.setUser(newUser);
            onComplete(newUser);
        } else {
            setShowPayment(true);
        }
    };

    const handlePaymentSuccess = () => {
        const newUser: User = {
            id: `u_${Date.now()}`,
            name: userName,
            farm_name: farmName,
            plan: selectedPlan.id,
            subscription_status: 'active'
        };
        dataService.setUser(newUser);
        onComplete(newUser);
    };

    return (
        <div className="min-h-screen bg-slate-50 dark:bg-slate-900 flex flex-col items-center py-12 px-4 transition-colors">

            {/* Header */}
            <div className="text-center max-w-2xl mx-auto mb-12">
                <h1 className="text-4xl font-bold text-slate-900 dark:text-white mb-4">
                    {step === 1 ? 'Start Your Journey' : 'Choose Your Plan'}
                </h1>
                <p className="text-slate-600 dark:text-slate-400 text-lg">
                    {step === 1 ? 'Join thousands of farmers protecting their crops with AI.' : 'Select the power of AI you need for your farm.'}
                </p>
            </div>

            {step === 1 ? (
                <div className="w-full max-w-md bg-white dark:bg-slate-800 rounded-2xl shadow-xl p-8 border border-slate-200 dark:border-slate-700 animate-slide-up">
                    <form onSubmit={handleInfoSubmit} className="space-y-6">
                        <div>
                            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">Full Name</label>
                            <input
                                type="text"
                                required
                                className="w-full px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-600 bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-white focus:ring-2 focus:ring-emerald-500 outline-none transition-all"
                                placeholder="Juan Dela Cruz"
                                value={userName}
                                onChange={e => setUserName(e.target.value)}
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">Farm Name</label>
                            <input
                                type="text"
                                required
                                className="w-full px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-600 bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-white focus:ring-2 focus:ring-emerald-500 outline-none transition-all"
                                placeholder="Sunny Acres Farm"
                                value={farmName}
                                onChange={e => setFarmName(e.target.value)}
                            />
                        </div>
                        <button
                            type="submit"
                            className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-4 rounded-xl shadow-lg shadow-emerald-200 dark:shadow-none transition-all transform hover:scale-[1.02]"
                        >
                            Next Step
                        </button>
                        <button
                            type="button"
                            onClick={onCancel}
                            className="w-full text-slate-400 text-sm hover:text-slate-600 dark:hover:text-slate-300"
                        >
                            Cancel
                        </button>
                    </form>
                </div>
            ) : (
                <div className="w-full max-w-6xl grid grid-cols-1 md:grid-cols-3 gap-8 animate-slide-up">
                    {plans.map((plan) => (
                        <div
                            key={plan.id}
                            className={`relative bg-white dark:bg-slate-800 rounded-3xl p-8 shadow-lg border-2 flex flex-col transition-all duration-300 hover:-translate-y-2 hover:shadow-2xl ${plan.popular
                                    ? 'border-emerald-500 dark:border-emerald-500 ring-4 ring-emerald-500/10'
                                    : 'border-slate-100 dark:border-slate-700'
                                }`}
                        >
                            {plan.popular && (
                                <div className="absolute -top-4 left-1/2 transform -translate-x-1/2 bg-gradient-to-r from-emerald-500 to-teal-500 text-white px-4 py-1 rounded-full text-sm font-bold shadow-md">
                                    Most Popular
                                </div>
                            )}

                            <div className="mb-8">
                                <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-2">{plan.name}</h3>
                                <div className="flex items-baseline gap-1">
                                    <span className="text-4xl font-extrabold text-slate-900 dark:text-white">{plan.price}</span>
                                    {plan.price !== 'Free' && <span className="text-slate-500 dark:text-slate-400">/{plan.period}</span>}
                                </div>
                            </div>

                            <div className="flex-1 space-y-4 mb-8">
                                {plan.features.map((feature, idx) => (
                                    <div key={idx} className="flex items-center gap-3 text-slate-600 dark:text-slate-300">
                                        <i className={`fa-solid fa-check-circle ${plan.popular ? 'text-emerald-500' : 'text-slate-400'}`}></i>
                                        <span>{feature}</span>
                                    </div>
                                ))}
                            </div>

                            <button
                                onClick={() => handlePlanSelect(plan)}
                                className={`w-full py-4 rounded-xl font-bold transition-all ${plan.popular
                                        ? 'bg-emerald-600 hover:bg-emerald-700 text-white shadow-lg shadow-emerald-200 dark:shadow-none'
                                        : 'bg-slate-100 dark:bg-slate-700 hover:bg-slate-200 dark:hover:bg-slate-600 text-slate-900 dark:text-white'
                                    }`}
                            >
                                {plan.price === 'Free' ? 'Get Started' : 'Subscribe Now'}
                            </button>
                        </div>
                    ))}
                </div>
            )}

            {showPayment && selectedPlan && (
                <PaymentModal
                    planName={selectedPlan.name}
                    price={selectedPlan.price}
                    onClose={() => setShowPayment(false)}
                    onSuccess={handlePaymentSuccess}
                />
            )}
        </div>
    );
};

export default SubscriptionPage;
