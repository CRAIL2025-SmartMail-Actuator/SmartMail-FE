import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Mail, Send, Clock, CheckCircle, User, Bot, Sparkles, Play, RotateCcw } from 'lucide-react';

const EmailDemo = () => {
  const [currentStep, setCurrentStep] = useState(0);
  const [isPlaying, setIsPlaying] = useState(true);
  const [isComplete, setIsComplete] = useState(false);

  const demoSteps = [
    {
      title: "Email Received",
      description: "Customer inquiry arrives in your inbox",
      icon: Mail,
      color: "from-blue-500 to-cyan-500",
      status: "received",
      duration: 1500
    },
    {
      title: "AI Analysis",
      description: "AI analyzes content and determines best response",
      icon: Bot,
      color: "from-purple-500 to-violet-500",
      status: "processing",
      duration: 2500
    },
    {
      title: "Response Generated",
      description: "Personalized response created using company knowledge",
      icon: Sparkles,
      color: "from-pink-500 to-rose-500",
      status: "generated",
      duration: 2000
    },
    {
      title: "Auto-Sent",
      description: "Response automatically sent to customer",
      icon: Send,
      color: "from-green-500 to-emerald-500",
      status: "sent",
      duration: 1500
    }
  ];

  useEffect(() => {
    if (isPlaying && !isComplete) {
      const currentStepData = demoSteps[currentStep];
      const timer = setTimeout(() => {
        if (currentStep >= demoSteps.length - 1) {
          setIsComplete(true);
          setIsPlaying(false);
          setTimeout(() => {startDemo();}, 3000);
        } else {
          setCurrentStep(prev => prev + 1);
        }
      }, currentStepData.duration);
      return () => clearTimeout(timer);
    }
  }, [isPlaying, currentStep, isComplete]);

  const startDemo = () => {
    setCurrentStep(0);
    setIsComplete(false);
    setIsPlaying(true);
  };

  // const resetDemo = () => {
  //   setCurrentStep(0);
  //   setIsComplete(false);
  //   setIsPlaying(false);
  // };

  return (
    <section id="demo" className="from-gray-50 to-white relative overflow-hidden">
      {/* Background Elements */}
      <div className="absolute inset-0">
        <motion.div 
          className="absolute top-1/4 left-20 w-32 h-32 bg-blue-200 rounded-full opacity-10"
          animate={{ 
            scale: [1, 1.3, 1],
            opacity: [0.1, 0.2, 0.1]
          }}
          transition={{ 
            duration: 6,
            repeat: Infinity,
            repeatType: "reverse"
          }}
        />
        <motion.div 
          className="absolute bottom-1/4 right-20 w-24 h-24 bg-purple-200 rounded-full opacity-10"
          animate={{ 
            scale: [1.2, 1, 1.2],
            opacity: [0.2, 0.1, 0.2]
          }}
          transition={{ 
            duration: 8,
            repeat: Infinity,
            repeatType: "reverse"
          }}
        />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
       
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          {/* Demo Visualization */}
          <motion.div 
            className="relative"
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
          >
            <div className="bg-white rounded-2xl shadow-2xl overflow-hidden border border-gray-200">
              {/* Email Interface Header */}
              <div className="bg-gradient-to-r from-gray-800 to-gray-900 p-4">
                <div className="flex items-center">
                  <div className="flex space-x-2">
                    <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                    <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
                    <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                  </div>
                  <div className="flex-1 text-center">
                    <span className="text-white text-sm font-medium">AI Email Dashboard</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <motion.div 
                      className={`w-2 h-2 rounded-full ${
                        isPlaying ? 'bg-green-400' : isComplete ? 'bg-blue-400' : 'bg-gray-400'
                      }`}
                      animate={isPlaying ? { scale: [1, 1.2, 1] } : {}}
                      transition={{ duration: 1, repeat: isPlaying ? Infinity : 0 }}
                    />
                    <span className="text-white text-xs">
                      {isPlaying ? 'Processing' : isComplete ? 'Complete' : 'Ready'}
                    </span>
                  </div>
                </div>
              </div>

              {/* Email Content */}
              <div className="p-6 space-y-6 min-h-[400px]">
                {/* Incoming Email */}
                <motion.div 
                  className="flex items-start space-x-4 p-4 bg-blue-50 rounded-lg border-l-4 border-blue-500"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ 
                    opacity: currentStep >= 0 || !isPlaying ? 1 : 0.3, 
                    x: 0,
                    scale: currentStep === 0 && isPlaying ? [1, 1.02, 1] : 1
                  }}
                  transition={{ duration: 0.5 }}
                >
                  <div className="flex-shrink-0">
                    <div className="w-10 h-10 bg-blue-500 rounded-full flex items-center justify-center">
                      <User className="w-5 h-5 text-white" />
                    </div>
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center justify-between mb-2">
                      <span className="font-semibold text-gray-900">customer@example.com</span>
                      <span className="text-xs text-gray-500">2:34 PM</span>
                    </div>
                    <p className="text-sm text-gray-700 mb-2">
                      <strong>Subject:</strong> Question about your pricing plans
                    </p>
                    <p className="text-sm text-gray-600">
                      Hi, I'm interested in your professional plan. Could you tell me more about the features included and pricing options?
                    </p>
                  </div>
                  {currentStep === 0 && isPlaying && (
                    <motion.div
                      className="absolute -top-2 -right-2 bg-blue-500 text-white p-2 rounded-full"
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      transition={{ duration: 0.3 }}
                    >
                      <Mail className="w-4 h-4" />
                    </motion.div>
                  )}
                </motion.div>

                {/* AI Processing Indicator */}
                <AnimatePresence>
                  {currentStep >= 1 && currentStep <= 2 && isPlaying && (
                    <motion.div
                      initial={{ opacity: 0, scale: 0.8 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.8 }}
                      className="flex items-center justify-center py-8"
                    >
                      <div className="relative">
                        <div className="flex items-center space-x-3 bg-purple-50 px-8 py-4 rounded-full border border-purple-200">
                          <motion.div
                            animate={{ rotate: 360 }}
                            transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                          >
                            <Bot className="w-6 h-6 text-purple-600" />
                          </motion.div>
                          <div className="text-center">
                            <div className="text-purple-700 font-medium">
                              {currentStep === 1 ? 'AI is analyzing email content...' : 'Generating personalized response...'}
                            </div>
                            <div className="text-sm text-purple-500 mt-1">
                              {currentStep === 1 ? 'Understanding context and intent' : 'Using company knowledge base'}
                            </div>
                          </div>
                        </div>
                        
                        {/* Progress dots */}
                        <div className="flex justify-center mt-4 space-x-2">
                          {[0, 1, 2].map((dot) => (
                            <motion.div
                              key={dot}
                              className="w-2 h-2 bg-purple-400 rounded-full"
                              animate={{ 
                                scale: [1, 1.5, 1],
                                opacity: [0.5, 1, 0.5]
                              }}
                              transition={{ 
                                duration: 0.8,
                                repeat: Infinity,
                                delay: dot * 0.2
                              }}
                            />
                          ))}
                        </div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>

                {/* AI Response */}
                <motion.div 
                  className="flex items-start space-x-4 p-4 bg-green-50 rounded-lg border-l-4 border-green-500 relative"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ 
                    opacity: currentStep >= 3 || (isComplete && !isPlaying) ? 1 : 0.3, 
                    x: 0,
                    scale: currentStep === 3 && isPlaying ? [1, 1.02, 1] : 1
                  }}
                  transition={{ duration: 0.5, delay: 0.2 }}
                >
                  <div className="flex-shrink-0">
                    <div className="w-10 h-10 bg-green-500 rounded-full flex items-center justify-center">
                      <Bot className="w-5 h-5 text-white" />
                    </div>
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center justify-between mb-2">
                      <span className="font-semibold text-gray-900">AI Assistant</span>
                      {(currentStep >= 3 || isComplete) && (
                        <motion.span 
                          className="text-xs bg-green-500 text-white px-2 py-1 rounded-full flex items-center gap-1"
                          initial={{ scale: 0 }}
                          animate={{ scale: 1 }}
                          transition={{ duration: 0.3 }}
                        >
                          <Send className="w-3 h-3" />
                          Auto-Sent
                        </motion.span>
                      )}
                    </div>
                    <p className="text-sm text-gray-700 mb-2">
                      <strong>Subject:</strong> Re: Question about your pricing plans
                    </p>
                    <motion.div 
                      className="text-sm text-gray-600 space-y-2"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: currentStep >= 3 || isComplete ? 1 : 0.3 }}
                      transition={{ duration: 0.5, delay: 0.3 }}
                    >
                      <p>Hi there!</p>
                      <p>Thank you for your interest in our professional plan! I'd be happy to help you with pricing information.</p>
                      <p>Our Professional Plan includes:</p>
                      <ul className="list-disc list-inside space-y-1 ml-4">
                        <li>Advanced AI features</li>
                        <li>Priority customer support</li>
                        <li>Custom integrations</li>
                        <li>Advanced analytics dashboard</li>
                      </ul>
                      <p>I'll send you detailed pricing information right away. Is there anything specific you'd like to know?</p>
                      <p>Best regards,<br/>Your AI Assistant</p>
                    </motion.div>
                  </div>
                  
                  {currentStep === 3 && isPlaying && (
                    <motion.div
                      className="absolute -top-2 -right-2 bg-green-500 text-white p-2 rounded-full"
                      initial={{ scale: 0, rotate: -180 }}
                      animate={{ scale: 1, rotate: 0 }}
                      transition={{ duration: 0.5 }}
                    >
                      <Send className="w-4 h-4" />
                    </motion.div>
                  )}
                </motion.div>
              </div>
            </div>

            {/* Floating Success Indicator */}
            <AnimatePresence>
              {isComplete && (
                <motion.div
                  initial={{ opacity: 0, scale: 0, rotate: -180 }}
                  animate={{ opacity: 1, scale: 1, rotate: 0 }}
                  exit={{ opacity: 0, scale: 0 }}
                  className="absolute -top-4 -right-4 bg-green-500 text-white p-4 rounded-full shadow-lg z-10"
                >
                  <CheckCircle className="w-8 h-8" />
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>

          {/* Process Steps */}
          <motion.div 
            className="space-y-6"
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            {demoSteps.map((step, index) => {
              const Icon = step.icon;
              const isActive = currentStep >= index || isComplete;
              const isCurrent = currentStep === index && isPlaying;
              const isCompleted = currentStep > index || isComplete;

              return (
                <motion.div
                  key={index}
                  className={`flex items-center space-x-4 p-6 rounded-xl transition-all duration-500 ${
                    isActive ? 'bg-white shadow-lg border border-gray-200' : 'bg-gray-50 border border-gray-100'
                  }`}
                  animate={{
                    scale: isCurrent ? 1.05 : 1,
                    opacity: isActive ? 1 : 0.6
                  }}
                  transition={{ duration: 0.3 }}
                >
                  <motion.div 
                    className={`flex-shrink-0 w-14 h-14 rounded-full bg-gradient-to-br ${step.color} flex items-center justify-center relative`}
                    animate={isCurrent ? { 
                      scale: [1, 1.1, 1]
                    } : {}}
                    transition={{ duration: 1, repeat: isCurrent ? Infinity : 0 }}
                  >
                    <Icon className="w-7 h-7 text-white" />
                    
                    {/* Progress ring for current step */}
                    {isCurrent && (
                      <motion.div 
                        className="absolute inset-0 rounded-full border-4 border-white border-t-transparent"
                        animate={{ rotate: 360 }}
                        transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                      />
                    )}
                    
                    {/* Checkmark for completed steps */}
                    {isCompleted && (
                      <motion.div
                        className="absolute -top-1 -right-1 w-6 h-6 bg-green-500 rounded-full flex items-center justify-center"
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        transition={{ duration: 0.3 }}
                      >
                        <CheckCircle className="w-4 h-4 text-white" />
                      </motion.div>
                    )}
                  </motion.div>
                  
                  <div className="flex-1">
                    <h3 className={`font-bold mb-2 transition-colors text-lg ${
                      isActive ? 'text-gray-900' : 'text-gray-600'
                    }`}>
                      {step.title}
                    </h3>
                    <p className={`text-sm transition-colors ${
                      isActive ? 'text-gray-600' : 'text-gray-400'
                    }`}>
                      {step.description}
                    </p>
                    
                    {/* Time indicator */}
                    {isCurrent && (
                      <motion.div
                        className="flex items-center mt-2 text-xs text-blue-600"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                      >
                        <Clock className="w-3 h-3 mr-1" />
                        Processing... ({(step.duration / 1000).toFixed(1)}s)
                      </motion.div>
                    )}
                  </div>

                  {/* Status Indicator */}
                  <div className="flex-shrink-0">
                    {isCurrent ? (
                      <motion.div
                        className="w-6 h-6 border-2 border-blue-500 rounded-full border-t-transparent"
                        animate={{ rotate: 360 }}
                        transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                      />
                    ) : isCompleted ? (
                      <CheckCircle className="w-6 h-6 text-green-500" />
                    ) : (
                      <Clock className="w-6 h-6 text-gray-400" />
                    )}
                  </div>
                </motion.div>
              );
            })}

            {/* Demo Results */}
            <motion.div 
              className="mt-8 p-6 bg-gradient-to-r from-blue-50 to-purple-50 rounded-xl border border-blue-200"
              initial={{ opacity: 0, y: 20 }}
              animate={{ 
                opacity: isComplete ? 1 : 0.6, 
                y: 0,
                scale: isComplete ? [1, 1.02, 1] : 1
              }}
              transition={{ duration: 0.6, delay: 0.4 }}
            >
              <h4 className="font-bold text-gray-900 mb-4 text-lg">Demo Results:</h4>
              <div className="grid grid-cols-2 gap-6">
                <div className="text-center">
                  <motion.div 
                    className="text-3xl font-bold text-blue-600 mb-1"
                    animate={isComplete ? { scale: [1, 1.1, 1] } : {}}
                    transition={{ duration: 0.5 }}
                  >
                    {isComplete ? '23s' : '--'}
                  </motion.div>
                  <div className="text-sm text-gray-600">Total Response Time</div>
                </div>
                <div className="text-center">
                  <motion.div 
                    className="text-3xl font-bold text-green-600 mb-1"
                    animate={isComplete ? { scale: [1, 1.1, 1] } : {}}
                    transition={{ duration: 0.5, delay: 0.1 }}
                  >
                    {isComplete ? '96%' : '--'}
                  </motion.div>
                  <div className="text-sm text-gray-600">Confidence Score</div>
                </div>
              </div>
              
              {isComplete && (
                <motion.div
                  className="mt-4 p-3 bg-green-100 rounded-lg border border-green-200"
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.5, delay: 0.5 }}
                >
                  <div className="flex items-center justify-center text-green-700 font-medium">
                    <CheckCircle className="w-5 h-5 mr-2" />
                    Email successfully processed and sent!
                  </div>
                </motion.div>
              )}
            </motion.div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default EmailDemo;
