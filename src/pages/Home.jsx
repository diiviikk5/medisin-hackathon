import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import {
  Pill, MessageSquare, ShoppingBag,
  AlertTriangle, Star, Zap, Shield, Heart
} from 'lucide-react'

import { FanButton } from '../components/FanButton'
import { FakeVolumeControl } from '../components/FakeVolumeControl'
import { AnxietyCursor } from '../components/AnxietyCursor'
import { MoeChat } from '../components/MoeChat'
import { PanicButton } from '../components/PanicButton'

// FAQ Data
const faqs = [
  {
    question: "Does MediSIN? actually cure anything?",
    answer: "Yes! It cures your faith in the healthcare system and your bank account balance."
  },
  {
    question: "Are your medicines FDA approved?",
    answer: "We're pending approval from the Department of Disappointment and the Bureau of Bad Decisions."
  },
  {
    question: "What if I have an allergic reaction?",
    answer: "Perfect! That means it's working. Side effects are our main effects."
  },
  {
    question: "Can I get a refund if unsatisfied?",
    answer: "Dissatisfaction is the intended outcome. Working as designed."
  },
  {
    question: "Do you accept insurance?",
    answer: "We accept thoughts, prayers, and the crushing weight of your expectations."
  },
  {
    question: "Why are your prices so low?",
    answer: "Quality control is expensive. We skipped it."
  },
  {
    question: "Is this legal?",
    answer: "Our lawyers are as fake as our medicine. Next question."
  }
]

// Testimonials
const testimonials = [
  {
    name: "Divik Arora",
    job: "Professional Overthinker",
    avatar: "DA",
    quote: "MediSIN helped me after my breakup. Now I overthink my health decisions too!"
  },
  {
    name: "Arnav Chauhan", 
    job: "Procrastinator",
    avatar: "AC",
    quote: "Kal bataunga"
  },
  {
    name: "Ansh Kaushik",
    job: "Job? What Job? I'm the final boss",
    avatar: "AK", 
    quote: "The Final Boss goes to MediHUB (pro-tip: use dark mode)"
  },
  {
    name: "Aarushi Prajapati",
    job: "Serial Sleeper",
    avatar: "AP",
    quote: "I sleep through all my problems, but MediSIN? keeps me entertained while I do it."
  },
  {
    name: "Alakh Pandey",
    job: "Physics Teacher and Super Hero",
    avatar: "UR",
    quote: "Kyu nahi ho rahi padhai?"
  },
  {
    name: "Shah Rukh Khan",
    job: "Actor", 
    avatar: "SRK",
    quote: "HEHEHEHEHEHEHEHEHEH"
  }
]

// FAQ Component
function FAQSection({ isPHMode }) {
  const [openIndex, setOpenIndex] = useState(null)

  const toggle = (index) => {
    setOpenIndex(openIndex === index ? null : index)
  }

  return (
    <section className="section">
      <div className="container">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold mb-4">
            Frequently Asked <span className="accent-text">Questions</span>
          </h2>
          <p className="text-xl text-slate-400">
            {isPHMode ? 
              "Everything you need to know about premium healthcare" :
              "Because someone has to ask the uncomfortable questions"
            }
          </p>
        </div>
        
        <div className="max-w-4xl mx-auto space-y-4">
          {faqs.map((item, idx) => (
            <div key={idx} className="card">
              <div 
                className={openIndex === idx ? 'faq-question open' : 'faq-question'} 
                onClick={() => toggle(idx)}
              >
                {item.question}
              </div>
              {openIndex === idx && (
                <p className="faq-answer animate-slide-up">
                  {item.answer}
                </p>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

// Testimonials Component
function TestimonialsSection({ isPHMode }) {
  return (
    <section className="section bg-slate-900/50 relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-r from-purple-900/20 to-blue-900/20"></div>
      
      <div className="container relative z-10">
        <div className="text-center mb-16">
          <h2 className="text-5xl font-bold mb-6">
            What Our <span className="accent-text">{isPHMode ? 'Users' : 'Victims'}</span> Say
          </h2>
          <p className="text-xl text-slate-400 max-w-2xl mx-auto">
            {isPHMode ? 
              "Satisfied customers sharing their premium healthcare experiences" :
              "Real reviews from real people with questionable judgment and excellent storytelling skills"
            }
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8 max-w-7xl mx-auto">
          {testimonials.map(({ name, job, avatar, quote }, idx) => (
            <div 
              key={idx} 
              className="testimonial group"
              style={{ animationDelay: `${idx * 0.2}s` }}
            >
              <div className="testimonial-header">
                <div className="testimonial-avatar">
                  {avatar}
                </div>
                <div className="flex-1">
                  <div className="testimonial-name">{name}</div>
                  <div className="testimonial-job">{job}</div>
                </div>
              </div>
              <div className="testimonial-quote">
                {quote}
              </div>
              
              <div className="flex items-center mt-6 gap-1">
                {[...Array(5)].map((_, i) => (
                  <Star 
                    key={i} 
                    className="w-5 h-5 text-yellow-400 fill-current" 
                  />
                ))}
                <span className="ml-2 text-sm text-purple-200/70">
                  {idx === 0 ? "5/5 - Life changing" : 
                   idx === 1 ? "5/5 - Aunty approved" :
                   idx === 2 ? "5/5 - Meta anxiety" :
                   idx === 3 ? "5/5 - Perfectly balanced" :
                   idx === 4 ? "5/5 - Efficient chaos" :
                   "5/5 - Genius strategy"}
                </span>
              </div>
            </div>
          ))}
        </div>
        
        <div className="text-center mt-16">
          <p className="text-slate-500 italic text-lg">
            * All testimonials are real. Reality is optional. Side effects may include uncontrollable laughter.
          </p>
        </div>
      </div>
    </section>
  )
}

// Main Home Component
export function Home() {
  const [isPHMode, setIsPHMode] = useState(false)

  // Check for PH theme changes
  useEffect(() => {
    const checkTheme = () => {
      setIsPHMode(document.body.classList.contains('ph-theme'))
    }

    checkTheme()
    const observer = new MutationObserver(checkTheme)
    observer.observe(document.body, { 
      attributes: true, 
      attributeFilter: ['class'] 
    })

    return () => observer.disconnect()
  }, [])

  return (
    <div className="min-h-screen bg-orbs">
      {/* UTILITIES - POSITIONED TO AVOID OVERLAPS */}
      
      {/* Anxiety Cursor - Top Left */}
      <div className="fixed top-28 left-4 z-40">
        <AnxietyCursor />
      </div>
      
      {/* Volume Control - Top Right (away from navbar) */}
      <div className="fixed top-28 right-20 z-40">
        <FakeVolumeControl />
      </div>
      
      {/* Panic Button - Bottom Left */}
      <div className="fixed bottom-8 left-4 z-40">
        <PanicButton />
      </div>
      
      {/* Moe Chat - Bottom Right (away from toaster) */}
      <div className="fixed bottom-8 right-20 z-40">
        <MoeChat />
      </div>

      {/* Hero Section */}
      <section className="section relative pt-8">
        <div className="container text-center animate-fade-in">
          <div className="space-y-8 mb-16">
            <h1 className="hero-title">
              {isPHMode ? (
                <>Medi<span className="accent-text">HUB</span></>
              ) : (
                <>Medi<span className="accent-text">SIN?</span></>
              )}
            </h1>
            <p className="hero-subtitle">
              The <span className="accent-text font-semibold">problem</span> to all your solutions. 
              <br className="hidden md:block" />
              {isPHMode ? 
                "Premium healthcare content for your complete satisfaction." :
                "Proudly useless, expertly wrong, surprisingly entertaining."
              }
            </p>
            
            <div className="flex flex-col sm:flex-row gap-6 justify-center items-center animate-delayed-fade-in">
              <Link to="/catalog" className="btn-primary group">
                <span className="flex items-center gap-3">
                  <Pill className="w-5 h-5 group-hover:rotate-12 transition-transform" />
                  {isPHMode ? "Browse Premium Content" : "Start Making Mistakes"}
                </span>
              </Link>
              <Link to="/advice" className="btn-secondary group">
                <span className="flex items-center gap-3">
                  <MessageSquare className="w-5 h-5 group-hover:scale-110 transition-transform" />
                  {isPHMode ? "Get Expert Consultation" : "Get Bad Advice"}
                </span>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="section">
        <div className="container">
          <div className="text-center mb-20 animate-slide-up">
            <h2 className="text-5xl font-bold mb-6">
              Why Choose <span className="accent-text">{isPHMode ? 'MediHUB?' : 'MediSIN?'}</span>
            </h2>
            <p className="text-xl text-slate-400 max-w-3xl mx-auto">
              {isPHMode ? 
                "Because premium healthcare deserves premium attention and complete satisfaction." :
                "Because regular healthcare is overrated, and disappointment builds character."
              }
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 mb-20">
            {[
              {
                icon: Shield,
                title: isPHMode ? "Premium Quality" : "Guaranteed Uselessness",
                description: isPHMode ? 
                  "We guarantee premium healthcare content that satisfies all your needs and desires." :
                  "We promise zero medical benefit from any of our products. Your disappointment is our success metric.",
                color: "from-red-500 to-red-400"
              },
              {
                icon: Star,
                title: isPHMode ? "Expert Content" : "Expert Wrongness",
                description: isPHMode ?
                  "Our healthcare professionals create content that exceeds expectations." :
                  "Our advisors are certified professionals in the fine art of confidently incorrect guidance.",
                color: "from-primary-500 to-blue-400"
              },
              {
                icon: Heart,
                title: isPHMode ? "Premium Experience" : "Premium Placebos",
                description: isPHMode ?
                  "Experience healthcare like never before with our premium service." :
                  "Feel treated without the inconvenience of actual treatment. Psychology meets luxury packaging.",
                color: "from-purple-500 to-pink-400"
              },
              {
                icon: Zap,
                title: isPHMode ? "Instant Satisfaction" : "Instant Regret",
                description: isPHMode ?
                  "Get immediate results that satisfy your healthcare needs instantly." :
                  "Experience buyer's remorse in real-time. Our products work faster than any actual medicine.",
                color: "from-orange-500 to-yellow-400"
              },
              {
                icon: ShoppingBag,
                title: isPHMode ? "Premium Pricing" : "Poverty Mode Pricing",
                description: isPHMode ?
                  "Premium content deserves premium pricing for the ultimate experience." :
                  "Because being broke shouldn't stop you from making questionable health decisions.",
                color: "from-green-500 to-emerald-400"
              },
              {
                icon: AlertTriangle,
                title: isPHMode ? "Full Satisfaction" : "Side Effects Included",
                description: isPHMode ?
                  "Complete satisfaction guaranteed with every premium healthcare experience." :
                  "Every product comes with more side effects than benefits. That's not a bug, it's a feature.",
                color: "from-amber-500 to-orange-400"
              }
            ].map((feature, index) => (
              <div 
                key={index} 
                className="feature-card animate-slide-up" 
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <div className={`feature-icon bg-gradient-to-r ${feature.color} p-4 rounded-2xl mb-6 inline-block group-hover:animate-bounce-slow`}>
                  <feature.icon className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-2xl font-bold mb-4 text-slate-100">
                  {feature.title}
                </h3>
                <p className="text-slate-400 leading-relaxed">
                  {feature.description}
                </p>
              </div>
            ))}
          </div>

          {/* CTA Section */}
          <div className="text-center card max-w-4xl mx-auto animate-delayed-slide-up">
            <h3 className="text-3xl font-bold mb-4 text-slate-100">
              {isPHMode ? 
                "Ready for Premium Healthcare?" :
                "Ready to Embrace Disappointment?"
              }
            </h3>
            <p className="text-xl text-slate-400 mb-8">
              {isPHMode ?
                "Join millions of satisfied users enjoying our premium healthcare content." :
                "Join thousands of satisfied customers in their journey towards premium dissatisfaction."
              }
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link to="/catalog" className="btn-primary">
                {isPHMode ? "Browse Premium Content" : "Browse Our Failures"}
              </Link>
              <Link to="/advice" className="btn-secondary">
                {isPHMode ? "Get Premium Consultation" : "Get Disappointed Now"}
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <TestimonialsSection isPHMode={isPHMode} />

      {/* FAQ Section */}
      <FAQSection isPHMode={isPHMode} />

      {/* Stats Section */}
      <section className="section">
        <div className="container">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            {[
              { 
                number: isPHMode ? "100%" : "0%", 
                label: isPHMode ? "Satisfaction Rate" : "Success Rate" 
              },
              { 
                number: "100%", 
                label: isPHMode ? "Premium Quality" : "Disappointment Guaranteed" 
              },
              { 
                number: isPHMode ? "24/7" : "∞", 
                label: isPHMode ? "Premium Access" : "Regret Level" 
              },
              { 
                number: isPHMode ? "1M+" : "404", 
                label: isPHMode ? "Satisfied Users" : "Benefits Found" 
              }
            ].map((stat, index) => (
              <div key={index} className="space-y-2">
                <div className="text-4xl md:text-5xl font-black accent-text">
                  {stat.number}
                </div>
                <div className="text-slate-400 text-sm md:text-base">
                  {stat.label}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Fan Button */}
      <FanButton />
    </div>
  )
}
