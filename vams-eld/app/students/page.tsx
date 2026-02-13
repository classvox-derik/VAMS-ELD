"use client";

import { useState } from "react";
import {
    User,
    Search,
    Filter,
    Plus,
    Edit,
    MessageCircle,
    TrendingUp,
    TrendingDown,
    Eye,
    Download,
    Star,
    Calendar,
    Book,
    MessageSquare
} from "lucide-react";

// Mock student data
const mockStudents = [
    {
        id: 1,
        name: "Alex Johnson",
        grade: "7th",
        avatar: "AJ",
        level: "Expanding",
        progress: {
            collaborative: 85,
            interpretive: 78,
            productive: 82
        },
        recentActivity: "Completed persuasive writing assignment",
        nextGoal: "Use more complex sentence structures",
        lastUpdated: "2024-03-05",
        totalAssignments: 12,
        completedAssignments: 10,
        feedbackCount: 3
    },
    {
        id: 2,
        name: "Maria Rodriguez",
        grade: "6th",
        avatar: "MR",
        level: "Emerging",
        progress: {
            collaborative: 65,
            interpretive: 72,
            productive: 60
        },
        recentActivity: "Participated in group discussion",
        nextGoal: "Expand vocabulary usage",
        lastUpdated: "2024-03-04",
        totalAssignments: 12,
        completedAssignments: 8,
        feedbackCount: 5
    },
    {
        id: 3,
        name: "James Smith",
        grade: "8th",
        avatar: "JS",
        level: "Bridging",
        progress: {
            collaborative: 92,
            interpretive: 88,
            productive: 90
        },
        recentActivity: "Presented research project",
        nextGoal: "Refine academic writing style",
        lastUpdated: "2024-03-06",
        totalAssignments: 12,
        completedAssignments: 12,
        feedbackCount: 1
    },
    {
        id: 4,
        name: "Sarah Lee",
        grade: "7th",
        avatar: "SL",
        level: "Expanding",
        progress: {
            collaborative: 78,
            interpretive: 85,
            productive: 75
        },
        recentActivity: "Submitted reading response",
        nextGoal: "Improve speaking fluency",
        lastUpdated: "2024-03-05",
        totalAssignments: 12,
        completedAssignments: 9,
        feedbackCount: 4
    },
    {
        id: 5,
        name: "Carlos Martinez",
        grade: "6th",
        avatar: "CM",
        level: "Emerging",
        progress: {
            collaborative: 70,
            interpretive: 68,
            productive: 65
        },
        recentActivity: "Completed vocabulary quiz",
        nextGoal: "Participate more in discussions",
        lastUpdated: "2024-03-03",
        totalAssignments: 12,
        completedAssignments: 7,
        feedbackCount: 6
    }
];

const StudentsPage = () => {
    const [searchTerm, setSearchTerm] = useState("");
    const [selectedGrade, setSelectedGrade] = useState("All");
    const [selectedLevel, setSelectedLevel] = useState("All");
    const [sortBy, setSortBy] = useState("name");
    const [sortOrder, setSortOrder] = useState("asc");
    const [selectedStudent, setSelectedStudent] = useState<number | null>(null);

    const grades = ["All", "6th", "7th", "8th"];
    const levels = ["All", "Emerging", "Expanding", "Bridging"];

    const filteredStudents = mockStudents
        .filter(student =>
            student.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            student.grade.toLowerCase().includes(searchTerm.toLowerCase())
        )
        .filter(student => selectedGrade === "All" || student.grade === selectedGrade)
        .filter(student => selectedLevel === "All" || student.level === selectedLevel)
        .sort((a, b) => {
            let aValue = a[sortBy as keyof typeof a];
            let bValue = b[sortBy as keyof typeof b];

            if (typeof aValue === 'string' && typeof bValue === 'string') {
                return sortOrder === 'asc' ? aValue.localeCompare(bValue) : bValue.localeCompare(aValue);
            }

            if (typeof aValue === 'number' && typeof bValue === 'number') {
                return sortOrder === 'asc' ? aValue - bValue : bValue - aValue;
            }

            return 0;
        });

    const getLevelColor = (level: string) => {
        switch (level) {
            case 'Emerging': return 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-200';
            case 'Expanding': return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-200';
            case 'Bridging': return 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-200';
            default: return 'bg-gray-100 text-gray-800';
        }
    };

    const getProgressColor = (percentage: number) => {
        if (percentage >= 80) return 'bg-green-500';
        if (percentage >= 60) return 'bg-yellow-500';
        return 'bg-red-500';
    };

    const calculateOverallProgress = (student: typeof mockStudents[0]) => {
        const total = student.progress.collaborative + student.progress.interpretive + student.progress.productive;
        return Math.round(total / 3);
    };

    return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            {/* Header */}
            <div className="glass rounded-2xl p-8 mb-8 border border-gray-200/50 dark:border-gray-700/50">
                <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6">
                    <div>
                        <h1 className="text-4xl font-bold bg-gradient-to-r from-primary-600 to-secondary-600 bg-clip-text text-transparent mb-2">
                            Student Portal
                        </h1>
                        <p className="text-gray-600 dark:text-gray-300 text-lg">
                            Monitor student progress and provide feedback
                        </p>
                    </div>
                    <div className="flex items-center space-x-6">
                        <div className="text-right">
                            <p className="text-sm text-gray-500 dark:text-gray-400">Total Students</p>
                            <p className="text-2xl font-bold text-primary-600">{mockStudents.length}</p>
                        </div>
                        <div className="grid grid-cols-3 gap-4 text-center">
                            <div>
                                <div className="text-lg font-bold text-blue-600">{mockStudents.filter(s => s.level === 'Emerging').length}</div>
                                <div className="text-xs text-gray-500 dark:text-gray-400">Emerging</div>
                            </div>
                            <div>
                                <div className="text-lg font-bold text-yellow-600">{mockStudents.filter(s => s.level === 'Expanding').length}</div>
                                <div className="text-xs text-gray-500 dark:text-gray-400">Expanding</div>
                            </div>
                            <div>
                                <div className="text-lg font-bold text-green-600">{mockStudents.filter(s => s.level === 'Bridging').length}</div>
                                <div className="text-xs text-gray-500 dark:text-gray-400">Bridging</div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Filters and Search */}
            <div className="glass rounded-xl p-6 mb-8 border border-gray-200/50 dark:border-gray-700/50">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
                    {/* Search */}
                    <div className="lg:col-span-2">
                        <div className="relative">
                            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                            <input
                                type="text"
                                placeholder="Search students by name or grade..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="w-full pl-10 pr-4 py-3 rounded-lg glass border border-gray-200/50 dark:border-gray-700/50 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                            />
                        </div>
                    </div>

                    {/* Grade Filter */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Grade</label>
                        <select
                            value={selectedGrade}
                            onChange={(e) => setSelectedGrade(e.target.value)}
                            className="w-full px-4 py-3 rounded-lg glass border border-gray-200/50 dark:border-gray-700/50 focus:outline-none focus:ring-2 focus:ring-primary-500"
                        >
                            {grades.map(grade => (
                                <option key={grade} value={grade}>{grade}</option>
                            ))}
                        </select>
                    </div>

                    {/* Level Filter */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Level</label>
                        <select
                            value={selectedLevel}
                            onChange={(e) => setSelectedLevel(e.target.value)}
                            className="w-full px-4 py-3 rounded-lg glass border border-gray-200/50 dark:border-gray-700/50 focus:outline-none focus:ring-2 focus:ring-primary-500"
                        >
                            {levels.map(level => (
                                <option key={level} value={level}>{level}</option>
                            ))}
                        </select>
                    </div>

                    {/* Sort Options */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Sort</label>
                        <div className="flex space-x-2">
                            <select
                                value={sortBy}
                                onChange={(e) => setSortBy(e.target.value)}
                                className="flex-1 px-4 py-3 rounded-lg glass border border-gray-200/50 dark:border-gray-700/50 focus:outline-none focus:ring-2 focus:ring-primary-500"
                            >
                                <option value="name">Name</option>
                                <option value="grade">Grade</option>
                                <option value="level">Level</option>
                                <option value="progress">Progress</option>
                            </select>
                            <button
                                onClick={() => setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc')}
                                className="px-4 py-3 rounded-lg glass border border-gray-200/50 dark:border-gray-700/50 hover:bg-primary-50 dark:hover:bg-gray-800 interactive"
                            >
                                {sortOrder === 'asc' ? '↑' : '↓'}
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            {/* Student Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
                {filteredStudents.map((student) => {
                    const overallProgress = calculateOverallProgress(student);

                    return (
                        <div
                            key={student.id}
                            className={`glass rounded-xl p-6 border border-gray-200/50 dark:border-gray-700/50 hover:shadow-lg transition-all duration-300 interactive ${selectedStudent === student.id ? 'ring-2 ring-primary-500' : ''
                                }`}
                            onClick={() => setSelectedStudent(selectedStudent === student.id ? null : student.id)}
                        >
                            {/* Student Header */}
                            <div className="flex items-center justify-between mb-4">
                                <div className="flex items-center space-x-4">
                                    <div className="w-16 h-16 rounded-full bg-gradient-to-r from-primary-500 to-secondary-500 flex items-center justify-center text-white text-xl font-bold shadow-lg">
                                        {student.avatar}
                                    </div>
                                    <div>
                                        <h3 className="font-bold text-gray-900 dark:text-white text-lg">{student.name}</h3>
                                        <div className="flex items-center space-x-2">
                                            <span className={`px-2 py-1 rounded-full text-xs font-medium ${getLevelColor(student.level)}`}>
                                                {student.level}
                                            </span>
                                            <span className="text-sm text-gray-500 dark:text-gray-400">{student.grade}</span>
                                        </div>
                                    </div>
                                </div>
                                <div className="flex space-x-2">
                                    <button className="p-2 text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors">
                                        <MessageCircle className="w-5 h-5" />
                                    </button>
                                    <button className="p-2 text-gray-400 hover:text-green-600 dark:hover:text-green-400 transition-colors">
                                        <Edit className="w-5 h-5" />
                                    </button>
                                </div>
                            </div>

                            {/* Progress Overview */}
                            <div className="mb-4">
                                <div className="flex justify-between items-center mb-2">
                                    <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Overall Progress</span>
                                    <span className="text-sm font-bold text-primary-600">{overallProgress}%</span>
                                </div>
                                <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-3">
                                    <div
                                        className={`h-3 rounded-full ${getProgressColor(overallProgress)} transition-all duration-500`}
                                        style={{ width: `${overallProgress}%` }}
                                    ></div>
                                </div>
                            </div>

                            {/* ELD Standards Progress */}
                            <div className="space-y-3 mb-4">
                                {[
                                    { label: 'Collaborative', value: student.progress.collaborative, color: 'bg-blue-500' },
                                    { label: 'Interpretive', value: student.progress.interpretive, color: 'bg-purple-500' },
                                    { label: 'Productive', value: student.progress.productive, color: 'bg-green-500' }
                                ].map((standard) => (
                                    <div key={standard.label} className="flex items-center justify-between">
                                        <span className="text-sm text-gray-600 dark:text-gray-300">{standard.label}</span>
                                        <div className="flex items-center space-x-3">
                                            <div className="w-20 bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                                                <div
                                                    className={`h-2 rounded-full ${standard.color} transition-all duration-500`}
                                                    style={{ width: `${standard.value}%` }}
                                                ></div>
                                            </div>
                                            <span className="text-sm font-medium text-gray-700 dark:text-gray-300">{standard.value}%</span>
                                        </div>
                                    </div>
                                ))}
                            </div>

                            {/* Stats */}
                            <div className="grid grid-cols-3 gap-4 mb-4 text-center">
                                <div>
                                    <div className="text-lg font-bold text-gray-900 dark:text-white">{student.completedAssignments}/{student.totalAssignments}</div>
                                    <div className="text-xs text-gray-500 dark:text-gray-400">Assignments</div>
                                </div>
                                <div>
                                    <div className="text-lg font-bold text-gray-900 dark:text-white">{student.feedbackCount}</div>
                                    <div className="text-xs text-gray-500 dark:text-gray-400">Feedback</div>
                                </div>
                                <div>
                                    <div className="text-lg font-bold text-gray-900 dark:text-white">+{Math.floor(Math.random() * 15) + 5}%</div>
                                    <div className="text-xs text-gray-500 dark:text-gray-400">Growth</div>
                                </div>
                            </div>

                            {/* Recent Activity */}
                            <div className="border-t border-gray-200/50 dark:border-gray-700/50 pt-4">
                                <div className="flex items-center justify-between text-sm text-gray-600 dark:text-gray-300 mb-2">
                                    <span className="flex items-center space-x-2">
                                        <Calendar className="w-4 h-4" />
                                        <span>Last Updated</span>
                                    </span>
                                    <span>{student.lastUpdated}</span>
                                </div>
                                <div className="text-sm text-gray-700 dark:text-gray-300 bg-gray-50 dark:bg-gray-800 p-3 rounded-lg">
                                    {student.recentActivity}
                                </div>
                                <div className="mt-2 text-sm text-gray-600 dark:text-gray-400">
                                    <span className="font-medium">Next Goal:</span> {student.nextGoal}
                                </div>
                            </div>

                            {/* Expanded View */}
                            {selectedStudent === student.id && (
                                <div className="mt-4 pt-4 border-t border-gray-200/50 dark:border-gray-700/50 animate-in slide-in-from-top-2 duration-300">
                                    <div className="grid grid-cols-2 gap-4 mb-4">
                                        <button className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
                                            <Eye className="w-4 h-4" />
                                            <span>View Profile</span>
                                        </button>
                                        <button className="flex items-center space-x-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors">
                                            <MessageSquare className="w-4 h-4" />
                                            <span>Send Feedback</span>
                                        </button>
                                    </div>
                                    <div className="grid grid-cols-2 gap-4">
                                        <button className="flex items-center space-x-2 px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors">
                                            <Book className="w-4 h-4" />
                                            <span>View Work</span>
                                        </button>
                                        <button className="flex items-center space-x-2 px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors">
                                            <Download className="w-4 h-4" />
                                            <span>Export Report</span>
                                        </button>
                                    </div>
                                </div>
                            )}
                        </div>
                    );
                })}
            </div>

            {filteredStudents.length === 0 && (
                <div className="text-center py-12">
                    <div className="glass rounded-xl p-8 border border-gray-200/50 dark:border-gray-700/50">
                        <User className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">No students found</h3>
                        <p className="text-gray-600 dark:text-gray-300">Try adjusting your search criteria or filters.</p>
                    </div>
                </div>
            )}
        </div>
    );
};

export default StudentsPage;