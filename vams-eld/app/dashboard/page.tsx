import { useState } from "react";
import {
    Calendar,
    Target,
    Users,
    BookOpen,
    TrendingUp,
    MessageCircle,
    Plus,
    Edit,
    CheckCircle,
    Clock,
    AlertCircle
} from "lucide-react";

// Mock data for dashboard
const mockGoals = [
    {
        id: 1,
        title: "Use descriptive adjectives in writing",
        description: "Students will be able to identify and use at least 5 descriptive adjectives in their writing samples.",
        status: "in-progress",
        progress: 65,
        dueDate: "2024-03-15",
        students: 23
    },
    {
        id: 2,
        title: "Participate in academic discussions",
        description: "Students will actively participate in small group discussions using academic vocabulary.",
        status: "completed",
        progress: 100,
        dueDate: "2024-03-10",
        students: 18
    },
    {
        id: 3,
        title: "Identify main idea in texts",
        description: "Students will be able to identify the main idea in grade-level appropriate texts.",
        status: "pending",
        progress: 0,
        dueDate: "2024-03-20",
        students: 25
    }
];

const mockUnits = [
    {
        id: 1,
        title: "Unit 1: Personal Narratives",
        description: "Writing personal stories with clear sequence and details",
        progress: 75,
        students: 28,
        color: "from-blue-500 to-cyan-500"
    },
    {
        id: 2,
        title: "Unit 2: Informational Texts",
        description: "Reading and summarizing non-fiction texts",
        progress: 45,
        students: 26,
        color: "from-purple-500 to-pink-500"
    },
    {
        id: 3,
        title: "Unit 3: Persuasive Writing",
        description: "Writing opinion pieces with supporting reasons",
        progress: 20,
        students: 24,
        color: "from-orange-500 to-red-500"
    }
];

const mockAnnouncements = [
    {
        id: 1,
        title: "Parent-Teacher Conferences",
        content: "Scheduled for March 15th. Please sign up for your preferred time slot.",
        date: "2024-03-01",
        priority: "high"
    },
    {
        id: 2,
        title: "New Vocabulary Strategy",
        content: "We're introducing word maps this week to help with vocabulary retention.",
        date: "2024-03-03",
        priority: "medium"
    }
];

const mockProgressData = {
    collaborative: 78,
    interpretive: 82,
    productive: 74,
    overall: 78
};

const DashboardPage = () => {
    const [selectedUnit, setSelectedUnit] = useState<number | null>(null);

    const getStatusColor = (status: string) => {
        switch (status) {
            case 'completed': return 'text-green-600 bg-green-100 dark:bg-green-900/30';
            case 'in-progress': return 'text-blue-600 bg-blue-100 dark:bg-blue-900/30';
            case 'pending': return 'text-gray-600 bg-gray-100 dark:bg-gray-700';
            default: return 'text-gray-600 bg-gray-100';
        }
    };

    const getPriorityColor = (priority: string) => {
        switch (priority) {
            case 'high': return 'border-red-500 bg-red-50 dark:bg-red-900/20';
            case 'medium': return 'border-yellow-500 bg-yellow-50 dark:bg-yellow-900/20';
            case 'low': return 'border-green-500 bg-green-50 dark:bg-green-900/20';
            default: return 'border-gray-300 bg-gray-50';
        }
    };

    return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            {/* Welcome Section */}
            <div className="glass rounded-2xl p-8 mb-8 border border-gray-200/50 dark:border-gray-700/50">
                <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6">
                    <div>
                        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">Welcome to VAMS ELD</h1>
                        <p className="text-gray-600 dark:text-gray-300">Your English Language Development dashboard</p>
                    </div>
                    <div className="flex items-center space-x-4">
                        <div className="text-right">
                            <p className="text-sm text-gray-500 dark:text-gray-400">Active Students</p>
                            <p className="text-2xl font-bold text-primary-600">28</p>
                        </div>
                        <div className="text-right">
                            <p className="text-sm text-gray-500 dark:text-gray-400">Current Unit</p>
                            <p className="text-lg font-semibold text-gray-900 dark:text-white">Personal Narratives</p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Announcement Bar */}
            <div className="mb-8">
                <div className="glass rounded-xl p-6 border border-gray-200/50 dark:border-gray-700/50">
                    <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center space-x-2">
                        <AlertCircle className="w-5 h-5 text-yellow-500" />
                        <span>Announcements</span>
                    </h2>
                    <div className="space-y-3">
                        {mockAnnouncements.map((announcement) => (
                            <div
                                key={announcement.id}
                                className={`p-4 rounded-lg border-l-4 ${getPriorityColor(announcement.priority)}`}
                            >
                                <div className="flex justify-between items-start">
                                    <div>
                                        <h3 className="font-medium text-gray-900 dark:text-white">{announcement.title}</h3>
                                        <p className="text-gray-600 dark:text-gray-300 text-sm mt-1">{announcement.content}</p>
                                    </div>
                                    <span className="text-xs text-gray-500 dark:text-gray-400">{announcement.date}</span>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Left Column: Goals & Units */}
                <div className="lg:col-span-2 space-y-8">
                    {/* Current Goals */}
                    <div className="glass rounded-xl p-6 border border-gray-200/50 dark:border-gray-700/50">
                        <div className="flex items-center justify-between mb-6">
                            <h2 className="text-xl font-semibold text-gray-900 dark:text-white flex items-center space-x-2">
                                <Target className="w-5 h-5 text-primary-600" />
                                <span>Current Goals</span>
                            </h2>
                            <button className="flex items-center space-x-2 px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors interactive">
                                <Plus className="w-4 h-4" />
                                <span>Add Goal</span>
                            </button>
                        </div>

                        <div className="space-y-4">
                            {mockGoals.map((goal) => (
                                <div key={goal.id} className="border border-gray-200/50 dark:border-gray-700/50 rounded-lg p-4 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors">
                                    <div className="flex items-center justify-between mb-3">
                                        <div className="flex items-center space-x-3">
                                            <div className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(goal.status)}`}>
                                                {goal.status === 'completed' && <CheckCircle className="w-4 h-4 inline mr-1" />}
                                                {goal.status === 'in-progress' && <Clock className="w-4 h-4 inline mr-1" />}
                                                {goal.status === 'pending' && <AlertCircle className="w-4 h-4 inline mr-1" />}
                                                {goal.status}
                                            </div>
                                            <span className="text-sm text-gray-500 dark:text-gray-400">Due: {goal.dueDate}</span>
                                        </div>
                                        <button className="p-2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200">
                                            <Edit className="w-4 h-4" />
                                        </button>
                                    </div>
                                    <h3 className="font-semibold text-gray-900 dark:text-white mb-1">{goal.title}</h3>
                                    <p className="text-gray-600 dark:text-gray-300 text-sm mb-3">{goal.description}</p>
                                    <div className="flex items-center justify-between">
                                        <div className="flex items-center space-x-4 text-sm text-gray-500 dark:text-gray-400">
                                            <span>{goal.students} students</span>
                                            <span>Progress: {goal.progress}%</span>
                                        </div>
                                        <div className="w-32 bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                                            <div
                                                className="bg-primary-600 h-2 rounded-full"
                                                style={{ width: `${goal.progress}%` }}
                                            ></div>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Unit Quick Access */}
                    <div className="glass rounded-xl p-6 border border-gray-200/50 dark:border-gray-700/50">
                        <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-6 flex items-center space-x-2">
                            <BookOpen className="w-5 h-5 text-secondary-600" />
                            <span>Unit Quick Access</span>
                        </h2>

                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                            {mockUnits.map((unit) => (
                                <div
                                    key={unit.id}
                                    className={`glass rounded-xl p-6 border border-gray-200/50 dark:border-gray-700/50 cursor-pointer interactive ${selectedUnit === unit.id ? 'ring-2 ring-primary-500' : ''
                                        }`}
                                    onClick={() => setSelectedUnit(unit.id)}
                                >
                                    <div className={`w-full h-2 rounded-full mb-4 bg-gradient-to-r ${unit.color}`} style={{ width: `${unit.progress}%` }}></div>
                                    <h3 className="font-bold text-gray-900 dark:text-white mb-2">{unit.title}</h3>
                                    <p className="text-gray-600 dark:text-gray-300 text-sm mb-4">{unit.description}</p>
                                    <div className="flex items-center justify-between text-sm text-gray-500 dark:text-gray-400">
                                        <span>{unit.students} students</span>
                                        <span>{unit.progress}% complete</span>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Right Column: Progress & Stats */}
                <div className="space-y-8">
                    {/* Progress Gauge */}
                    <div className="glass rounded-xl p-6 border border-gray-200/50 dark:border-gray-700/50">
                        <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-6 flex items-center space-x-2">
                            <TrendingUp className="w-5 h-5 text-green-600" />
                            <span>Language Acquisition Progress</span>
                        </h2>

                        <div className="space-y-6">
                            {/* Overall Progress */}
                            <div className="text-center">
                                <div className="relative w-40 h-40 mx-auto mb-4">
                                    <svg className="w-40 h-40 transform -rotate-90" viewBox="0 0 120 120">
                                        <circle
                                            cx="60"
                                            cy="60"
                                            r="54"
                                            fill="none"
                                            stroke="#e5e7eb"
                                            strokeWidth="8"
                                            className="dark:stroke-gray-700"
                                        />
                                        <circle
                                            cx="60"
                                            cy="60"
                                            r="54"
                                            fill="none"
                                            stroke="#3b82f6"
                                            strokeWidth="8"
                                            strokeLinecap="round"
                                            strokeDasharray={`${2 * Math.PI * 54 * mockProgressData.overall / 100} 339`}
                                            className="transition-all duration-1000"
                                        />
                                    </svg>
                                    <div className="absolute inset-0 flex items-center justify-center">
                                        <div className="text-center">
                                            <div className="text-2xl font-bold text-gray-900 dark:text-white">{mockProgressData.overall}%</div>
                                            <div className="text-sm text-gray-500 dark:text-gray-400">Overall</div>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* ELD Standards Breakdown */}
                            <div className="space-y-4">
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center space-x-3">
                                        <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
                                        <span className="font-medium text-gray-900 dark:text-white">Collaborative</span>
                                    </div>
                                    <span className="text-sm text-gray-500 dark:text-gray-400">{mockProgressData.collaborative}%</span>
                                </div>
                                <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                                    <div
                                        className="bg-blue-500 h-2 rounded-full"
                                        style={{ width: `${mockProgressData.collaborative}%` }}
                                    ></div>
                                </div>

                                <div className="flex items-center justify-between">
                                    <div className="flex items-center space-x-3">
                                        <div className="w-3 h-3 bg-purple-500 rounded-full"></div>
                                        <span className="font-medium text-gray-900 dark:text-white">Interpretive</span>
                                    </div>
                                    <span className="text-sm text-gray-500 dark:text-gray-400">{mockProgressData.interpretive}%</span>
                                </div>
                                <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                                    <div
                                        className="bg-purple-500 h-2 rounded-full"
                                        style={{ width: `${mockProgressData.interpretive}%` }}
                                    ></div>
                                </div>

                                <div className="flex items-center justify-between">
                                    <div className="flex items-center space-x-3">
                                        <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                                        <span className="font-medium text-gray-900 dark:text-white">Productive</span>
                                    </div>
                                    <span className="text-sm text-gray-500 dark:text-gray-400">{mockProgressData.productive}%</span>
                                </div>
                                <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                                    <div
                                        className="bg-green-500 h-2 rounded-full"
                                        style={{ width: `${mockProgressData.productive}%` }}
                                    ></div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Quick Actions */}
                    <div className="glass rounded-xl p-6 border border-gray-200/50 dark:border-gray-700/50">
                        <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-6">Quick Actions</h2>
                        <div className="space-y-4">
                            <button className="w-full flex items-center space-x-4 p-4 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors interactive">
                                <div className="w-10 h-10 rounded-lg bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center">
                                    <Users className="w-5 h-5 text-blue-600" />
                                </div>
                                <div className="text-left">
                                    <div className="font-medium text-gray-900 dark:text-white">View Students</div>
                                    <div className="text-sm text-gray-500 dark:text-gray-400">Manage student profiles and progress</div>
                                </div>
                            </button>

                            <button className="w-full flex items-center space-x-4 p-4 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors interactive">
                                <div className="w-10 h-10 rounded-lg bg-green-100 dark:bg-green-900/30 flex items-center justify-center">
                                    <BookOpen className="w-5 h-5 text-green-600" />
                                </div>
                                <div className="text-left">
                                    <div className="font-medium text-gray-900 dark:text-white">Access Scaffolds</div>
                                    <div className="text-sm text-gray-500 dark:text-gray-400">Find teaching resources</div>
                                </div>
                            </button>

                            <button className="w-full flex items-center space-x-4 p-4 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors interactive">
                                <div className="w-10 h-10 rounded-lg bg-purple-100 dark:bg-purple-900/30 flex items-center justify-center">
                                    <MessageCircle className="w-5 h-5 text-purple-600" />
                                </div>
                                <div className="text-left">
                                    <div className="font-medium text-gray-900 dark:text-white">Send Messages</div>
                                    <div className="text-sm text-gray-500 dark:text-gray-400">Communicate with students</div>
                                </div>
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default DashboardPage;