import React from 'react';
import { motion } from 'framer-motion';
import { 
  Mic, Activity, Brain, Award, ChevronRight, Sparkles, 
  Users, PlayCircle, MessageCircle, Target, Rocket, 
  HeartHandshake, Mail, Phone, MapPin 
} from 'lucide-react';
import { Link } from 'react-router-dom';
import Button from '../components/ui/Button';
import Card from '../components/ui/Card';
import { HoverEffect } from '../components/ui/card-hover-effect';
import Timeline from '../components/ui/timeline';


const Home = () => {
  const stats = [
    { icon: Activity, label: 'Confidence Score', value: '85%', color: 'text-green-600' },
    { icon: Brain, label: 'Pitch Stability', value: '92%', color: 'text-blue-600' },
    { icon: Award, label: 'Fluency Level', value: '78%', color: 'text-purple-600' },
  ];

  const features = [
    {
      icon: Mic,
      title: 'Real-time Voice Analysis',
      description: 'Get instant feedback on pitch, tone, and clarity as you speak.',
      link: '/voice-analysis',
    },
    {
      icon: Brain,
      title: 'AI Speech Coaching',
      description: 'Personalized exercises and tips to improve your speaking skills.',
      link: '/ai-coaching',
    },
    {
      icon: Users,
      title: 'Sign Language Translation',
      description: 'Break communication barriers with real-time sign language interpretation.',
      link: '/sign-language',
    },
  ];

  const howItWorks = [
    {
      icon: Target,
      title: 'Set Your Goals',
      description: 'Define your speaking objectives and areas for improvement.',
    },
    {
      icon: Mic,
      title: 'Practice Speaking',
      description: 'Record your voice and get real-time feedback from our AI.',
    },
    {
      icon: Brain,
      title: 'Receive Analysis',
      description: 'Get detailed insights and personalized recommendations.',
    },
    {
      icon: Rocket,
      title: 'Track Progress',
      description: 'Monitor your improvement over time with detailed analytics.',
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-rose-50 via-white to-indigo-50">
      
      {/* Hero Section */}
      <div className="px-4 py-20 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center max-w-4xl mx-auto"
        >
          <motion.div
            initial={{ scale: 0.9 }}
            animate={{ scale: 1 }}
            className="inline-flex items-center gap-2 bg-rose-300 px-4 py-2 rounded-full mb-6"
          >
            <Sparkles className="w-4 h-4" />
            <span className="text-sm font-medium">AI-Powered Voice Training</span>
          </motion.div>
          
          <h1 className="text-6xl font-bold bg-gradient-to-r from-rose-600 to-rose-400 bg-clip-text text-transparent mb-6">
            Master Your Voice with VocalEdge AI
          </h1>
          <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
            Your personal AI voice coach for better speech, confidence, and communication. Transform your speaking abilities with cutting-edge technology.
          </p>
          
          <div className="flex items-center justify-center gap-4">
            <Button
              size="lg"
              icon={<Mic className="w-5 h-5" />}
              className="bg-rose-400"
            >
              Start Free Trial
            </Button>
            <Button
              size="lg"
              // variant="outline"
              icon={<PlayCircle className="w-5 h-5" />}
            >
              Watch Demo
            </Button>
          </div>
        </motion.div>
      </div>

      {/* Stats Section */}
      <div className="px-4 py-12 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-7xl mx-auto ">
          {stats.map((stat, index) => (
            <Card key={stat.label} 
            className='bg-rose-200'
            >
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="flex items-center gap-4"
              >
                <div className="p-3 bg-gradient-to-br from-purple-100 to-indigo-200 rounded-lg">
                  <stat.icon className={`w-6 h-6 ${stat.color}`} />
                </div>
                <div>
                  <p className="text-sm text-neutral-800">{stat.label}</p>
                  <p className="text-2xl font-bold text-neutral-800">{stat.value}</p>
                </div>
              </motion.div>
            </Card>
          ))}
        </div>
      </div>

      {/* Features Section */}
      <div className="px-4 py-16 sm:px-6 lg:px-8 bg-gradient-to-br from-white via-purple-50 to-white">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-rose-500 mb-4">
              Powerful Features for Voice Mastery
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Discover our comprehensive suite of tools designed to enhance your speaking abilities.
            </p>
          </div>

          <HoverEffect items={[
            {title:"Ai face Recognition ",description: "Get instant feedback on pitch, tone, and clarity as you speak.", link: '/voice-analysis'},
            {title: 'AI Speech Coaching', description: 'Personalized exercises and tips to improve your speaking skills.',link: '/ai-coaching'},
            { title: 'Sign Language Translation',description: 'Break communication barriers with real-time sign language interpretation.',link: '/sign-language',
          },
            {title:"Ai face Recognition ",description: "Get instant feedback on pitch, tone, and clarity as you speak.", link:""},
            {title:"Ai face Recognition ",description: "Get instant feedback on pitch, tone, and clarity as you speak.", link:""},
            {title:"Ai face Recognition ",description: "Get instant feedback on pitch, tone, and clarity as you speak.", link:""},

          ]}/>



          {/* <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <Link key={feature.title} to={feature.link}>
                <Card className="h-full group hover:shadow-lg transition-all duration-300 bg-black">
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className="space-y-4"
                  >
                    <div className="p-3 bg-gradient-to-br from-purple-100 to-indigo-200 rounded-lg w-fit">
                      <feature.icon className="w-6 h-6 text-purple-600" />
                    </div>
                    <h3 className="text-xl font-semibold text-gray-200 group-hover:text-purple-600 transition-colors">
                      {feature.title}
                    </h3>
                    <p className="text-gray-400">
                      {feature.description}
                    </p>
                    <div className="flex items-center text-purple-600 font-medium">
                      Learn more
                      <ChevronRight className="w-4 h-4 ml-1 group-hover:translate-x-1 transition-transform" />
                    </div>
                  </motion.div>
                </Card>
              </Link>
            ))}
          </div> */}
        </div>
      </div>

      {/* How It Works Section */}
      <div className="px-4 py-16 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-rose-700 mb-4">
              How VocalEdge Works
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Follow these simple steps to start improving your speaking skills today.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            {howItWorks.map((step, index) => (
              <Card key={step.title} className="relative bg-gradient-to-r from-rose-200 to-rose-200">
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="text-center space-y-4"
                >
                  <div className="mx-auto p-3 bg-gradient-to-br from-purple-100 to-indigo-200 rounded-full w-16 h-16 flex items-center justify-center">
                    <step.icon className="w-8 h-8 text-purple-600" />
                  </div>
                  <h3 className="text-xl font-semibold text-neutral-700">
                    {step.title}
                  </h3>
                  <p className="text-gray-600">
                    {step.description}
                  </p>
                </motion.div>
              </Card>
            ))}
          </div>
        </div>
      </div>

      {/* Demo Video Section */}
      <div className="px-4 py-16 sm:px-6 lg:px-8 bg-gradient-to-br from-purple-50 via-white to-purple-50">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-rose-700 mb-4">
              See VocalEdge in Action
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Watch how our AI-powered platform helps users improve their speaking skills.
            </p>
          </div>
          <div className="aspect-video rounded-2xl overflow-hidden shadow-xl">
            <img 
              src="https://images.unsplash.com/photo-1516321497487-e288fb19713f?ixlib=rb-1.2.1&auto=format&fit=crop&w=2070&q=80" 
              alt="VocalEdge Demo"
              className="w-full h-full object-cover"
            />
          </div>
          <Timeline data={[
    {
      title: "Step 1: Start",
      content: <div className="p-6">
        <h2 className="text-2xl font-semibold mb-4 text-neural-500">Step 1: Vocal Edge Ai introduction</h2>
      <p className="text-lg mb-4 text-neural-500">This is where you begin your journey with VocalEdge.</p>
      <p className="text-lg mb-4 text-neural-500">Unlock the power of your voice through guided training and smart feedback.</p>
      <p className="text-lg mb-6 text-neural-500">Whether you're preparing for a presentation or improving daily communication, VocalEdge is your partner in vocal growth.</p>
    
      {/* Image Grid */}
      <div className="flex flex-col gap-6">
        {/* Row 1 */}
        <div className="flex gap-4">
          <img
            className="w-2/3 h-64 object-cover rounded-xl"
            src="https://plus.unsplash.com/premium_photo-1679814561282-2f735b0ce81f?q=80&w=1074&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
            alt="Voice training 1"
          />
          <img
            className="w-1/3 h-64 object-cover rounded-xl"
            src="https://images.unsplash.com/photo-1580587771525-78b9dba3b914?q=80&w=500"
            alt="Voice training 2"
          />
        </div>
    
        {/* Row 2 */}
        <div className="flex gap-4">
          <img
            className="w-2/3 h-64 object-cover rounded-xl"
            src="https://images.unsplash.com/photo-1718664485620-0e0a2f781120?q=80&w=1828&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
            alt="Voice training 3"
          />
          <img
            className="w-1/3 h-64 object-cover rounded-xl"
            src='https://plus.unsplash.com/premium_photo-1680392932981-b6d0a2cefdcb?q=80&w=1625&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D'
            alt="Voice training 4"
          />
        </div>
      </div>
    </div>
    
      // content:<div> <p>This is where you begin your journey with VocalEdge.</p>,
      // <div className="flex"></div>
      // <img className='' src="https://plus.unsplash.com/premium_photo-1679814561282-2f735b0ce81f?q=80&w=1074&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"></img>
      // </div>
      
    },
    {
      title: "Step 2: Analysis",
      content:<div className="p-6 mt-10">
      <h2 className="text-2xl font-semibold mb-4">Step 2: Sign Language Prediction</h2>
      <p className="text-lg mb-4">Our AI analyzes hand gestures in real-time to interpret sign language and convert it into speech or text instantly.</p>
      <p className="text-lg mb-6">This feature bridges the communication gap, helping individuals with speech or hearing impairments interact more confidently.</p>
    
      {/* Image Grid for Sign Language */}
      <div className="flex flex-col gap-6">
        {/* Row 1 */}
        <div className="flex gap-4">
          <img
            className="w-2/3 h-64 object-cover rounded-xl"
            src="https://images.unsplash.com/photo-1607746882042-944635dfe10e?q=80&w=1074"
            alt="AI analyzing hand gestures"
          />
          <img
            className="w-1/3 h-64 object-cover rounded-xl"
            src="https://media.istockphoto.com/id/1181189842/photo/shell-make-sure-youre-well-informed-of-the-weather.jpg?s=2048x2048&w=is&k=20&c=oGYS839XYBWbX8ZZVB8XCsoG-dd4QPTs-qihMbyQlAM="
            alt="Sign language prediction output"
          />
        </div>
    
        {/* Row 2 */}
        <div className="flex gap-4">
          <img
            className="w-2/3 h-64 object-cover rounded-xl"
            src="https://plus.unsplash.com/premium_photo-1729089391915-59a0f6248dd0?q=80&w=1887&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
            alt="Hand gesture being scanned"
          />
          <img
            className="w-1/3 h-64 object-cover rounded-xl"
            src="https://media.istockphoto.com/id/1083082134/photo/chinese-woman-making-framing-gesture-in-public-park.jpg?s=2048x2048&w=is&k=20&c=Avj5fdHAEXm06_eDl_LpvvMvkJ7HhHCkOYqdlXQiyWI="
            alt="Sign to speech interface"
          />
        </div>
      </div>
    </div>
    
    },
    {
      title: "Step 3: Improvement",
      content:<div className="p-6 mt-10">
      <h2 className="text-2xl font-semibold mb-4">Step 3: Speech Enhancement & Confidence Building</h2>
      <p className="text-lg mb-4">
        Using AI-based feedback, VocalEdge identifies issues like stuttering, pitch irregularities, and hesitation, then guides you through personalized vocal exercises.
      </p>
      <p className="text-lg mb-6">
        Our real-time coaching not only enhances speech clarity but also helps build the confidence to speak in public, interviews, and daily conversations.
      </p>
    
      {/* Image Grid for Speech Training */}
      <div className="flex flex-col gap-6">
        {/* Row 1 */}
        <div className="flex gap-4">
          <img
            className="w-2/3 h-64 object-cover rounded-xl"
            src="https://plus.unsplash.com/premium_photo-1679082305620-fa44b9a3b6ad?q=80&w=1740&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
            alt="AI analyzing speech patterns"
          />
          <img
            className="w-1/3 h-64 object-cover rounded-xl"
            src="https://images.unsplash.com/photo-1724125039015-e48bcead909d?q=80&w=1887&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
            alt="User practicing speech"
          />
        </div>
    
        {/* Row 2 */}
        <div className="flex gap-4">
          <img
            className="w-2/3 h-64 object-cover rounded-xl"
            src="https://images.unsplash.com/photo-1660794486044-ff1072c442f9?q=80&w=1631&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
            alt="Speaking confidently"
          />
          <img
            className="w-1/3 h-64 object-cover rounded-xl"
            src="https://plus.unsplash.com/premium_photo-1661544807248-2786202627e8?q=80&w=1744&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
            alt="Speech training screen"
          />
        </div>
      </div>
    </div>
    
    },
  ]}/>
        </div>
      </div>

      {/* Contact Section */}
      <div className="px-4 py-16 sm:px-6 lg:px-8 ">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
            <div>
              <h2 className="text-3xl font-bold text-gray-900 mb-4">
                Get in Touch
              </h2>
              <p className="text-lg text-gray-600 mb-8">
                Have questions about VocalEdge? Our team is here to help you get started on your journey to better speech.
              </p>
              <div className="space-y-6">
                <div className="flex items-center gap-4">
                  <div className="p-3 bg-purple-50 rounded-lg">
                    <Mail className="w-6 h-6 text-purple-600" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Email</p>
                    <p className="text-lg font-medium text-gray-900">contact@vocaledge.ai</p>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <div className="p-3 bg-purple-50 rounded-lg">
                    <Phone className="w-6 h-6 text-purple-600" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Phone</p>
                    <p className="text-lg font-medium text-gray-900">+1 (555) 123-4567</p>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <div className="p-3 bg-purple-50 rounded-lg">
                    <MapPin className="w-6 h-6 text-purple-600" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Location</p>
                    <p className="text-lg font-medium text-gray-900">San Francisco, CA</p>
                  </div>
                </div>
              </div>
            </div>
            <Card className="bg-gradient-to-br from-white to-purple-50  bg-gradient-to-r from-indigo-600 to-purple-800">
              <form className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Name
                  </label>
                  <input
                    type="text"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-600 focus:border-transparent"
                    placeholder="Your name"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Email
                  </label>
                  <input
                    type="email"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-600 focus:border-transparent"
                    placeholder="your@email.com"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Message
                  </label>
                  <textarea
                    rows={4}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-600 focus:border-transparent"
                    placeholder="Your message"
                  />
                </div>
                <Button size="lg" className="w-full">
                  Send Message
                </Button>
              </form>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;