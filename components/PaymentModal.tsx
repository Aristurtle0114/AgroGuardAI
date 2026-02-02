
import React, { useState } from 'react';

interface PaymentModalProps {
    planName: string;
    price: string;
    onClose: () => void;
    onSuccess: () => void;
}

const PaymentModal: React.FC<PaymentModalProps> = ({ planName, price, onClose, onSuccess }) => {
    const [isProcessing, setIsProcessing] = useState(false);
    const [step, setStep] = useState<'method' | 'processing' | 'success'>('method');

    const handlePayment = () => {
        setIsProcessing(true);
        setStep('processing');
        // Simulate API call
        setTimeout(() => {
            setIsProcessing(false);
            setStep('success');
            setTimeout(() => {
                onSuccess();
            }, 1500);
        }, 2000);
    };

    if (step === 'success') {
        return (
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
                <div className="bg-white dark:bg-slate-800 rounded-2xl w-full max-w-sm p-8 text-center animate-bounce-in">
                    <div className="w-20 h-20 bg-emerald-100 dark:bg-emerald-900/50 rounded-full flex items-center justify-center mx-auto mb-6">
                        <i className="fa-solid fa-check text-4xl text-emerald-500"></i>
                    </div>
                    <h3 className="text-2xl font-bold text-slate-800 dark:text-white mb-2">Payment Successful!</h3>
                    <p className="text-slate-500 dark:text-slate-400">Welcome to AgroGuard {planName}</p>
                </div>
            </div>
        );
    }

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
            <div className="bg-white dark:bg-slate-800 rounded-2xl w-full max-w-md shadow-2xl overflow-hidden border border-slate-100 dark:border-slate-700">
                <div className="bg-slate-50 dark:bg-slate-900/50 p-6 border-b border-slate-100 dark:border-slate-700 flex justify-between items-center">
                    <div>
                        <h3 className="text-lg font-bold text-slate-800 dark:text-white">Secure Checkout</h3>
                        <p className="text-sm text-slate-500 dark:text-slate-400">{planName} • {price}</p>
                    </div>
                    <button onClick={onClose} className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200">
                        <i className="fa-solid fa-xmark text-xl"></i>
                    </button>
                </div>

                <div className="p-6">
                    {step === 'processing' ? (
                        <div className="text-center py-8">
                            <div className="animate-spin w-12 h-12 border-4 border-emerald-500 border-t-transparent rounded-full mx-auto mb-4"></div>
                            <p className="text-slate-600 dark:text-slate-300 font-medium">Processing secure payment...</p>
                            <p className="text-xs text-slate-400 mt-2">Do not close this window</p>
                        </div>
                    ) : (
                        <div className="space-y-4">
                            <p className="text-sm font-medium text-slate-700 dark:text-slate-300 mb-4">Select Payment Method</p>

                            <button onClick={handlePayment} className="w-full flex items-center justify-between p-4 border border-slate-200 dark:border-slate-600 rounded-xl hover:border-emerald-500 dark:hover:border-emerald-500 hover:bg-emerald-50 dark:hover:bg-emerald-900/20 transition-all group">
                                <div className="flex items-center gap-3">
                                    <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center text-blue-600">
                                        <i className="fa-brands fa-google-pay text-xl"></i>
                                    </div>
                                    <span className="font-semibold text-slate-700 dark:text-slate-200 group-hover:text-emerald-700 dark:group-hover:text-emerald-400">GCash / E-Wallet</span>
                                </div>
                                <i className="fa-solid fa-chevron-right text-slate-300 group-hover:text-emerald-500"></i>
                            </button>

                            <button onClick={handlePayment} className="w-full flex items-center justify-between p-4 border border-slate-200 dark:border-slate-600 rounded-xl hover:border-emerald-500 dark:hover:border-emerald-500 hover:bg-emerald-50 dark:hover:bg-emerald-900/20 transition-all group">
                                <div className="flex items-center gap-3">
                                    <div className="w-10 h-10 bg-indigo-100 rounded-lg flex items-center justify-center text-indigo-600">
                                        <i className="fa-solid fa-credit-card text-xl"></i>
                                    </div>
                                    <span className="font-semibold text-slate-700 dark:text-slate-200 group-hover:text-emerald-700 dark:group-hover:text-emerald-400">Credit / Debit Card</span>
                                </div>
                                <i className="fa-solid fa-chevron-right text-slate-300 group-hover:text-emerald-500"></i>
                            </button>

                            <div className="mt-6 flex items-center justify-center gap-2 text-xs text-slate-400">
                                <i className="fa-solid fa-lock"></i>
                                <span>Payments are SSL Encrypted & Secured</span>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default PaymentModal;
