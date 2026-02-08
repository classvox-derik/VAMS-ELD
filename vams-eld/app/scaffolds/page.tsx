import { useState } from "react";
import {
    Search,
    Filter,
    Download,
    FileText,
    FileSpreadsheet,
    FilePdf,
    Star,
    ChevronDown,
    ChevronUp
} from "lucide-react";

// Mock scaffold data
const mockScaffolds = [
    {
        id: 1,
        title: "Graphic Organizer: Story Map",
        description: "Help students organize story elements including characters, setting, problem, and solution.",
        level: "Emerging",
        category: "Graphic Organizers",
        type: "PDF",
        url: "/scaffolds/story-map.pdf",
        downloads: 156,
        rating: 4.5,
        tags: ["Reading", "Writing", "Narrative"]
    },
    {
        id: 2,
        title: "Sentence Frames: Opinion Writing",
        description: "Structured sentence starters for expressing opinions and supporting ideas.",
        level: "Expanding",
        category: "Sentence Frames",
        type: "Google Doc",
        url: "https://docs.google.com/document/d/1example/edit",
        downloads: 89,
        rating: 4.2,
        tags: ["Writing", "Speaking", "Opinion"]
    },
    {
        id: 3,
        title: "Vocabulary Word Bank",
        description: "Interactive vocabulary building tool with visual supports and sentence examples.",
        level: "Bridging",
        category: "Word Banks",
        type: "Google Sheet",
        url: "https://docs.google.com/spreadsheets/d/1example/edit",
        downloads: 234,
        rating: 4.8,
        tags: ["Vocabulary", "Reading", "Writing"]
    },
    {
        id: 4,
        title: "Discussion Prompts: Collaborative Conversation",
        description: "Guided prompts for structured academic discussions and peer collaboration.",
        level: "Emerging",
        category: "Discussion Tools",
        type: "PDF",
        url: "/scaffolds/discussion-prompts.pdf",
        downloads: 123,
        rating: 4.3,
        tags: ["Speaking", "Listening", "Collaboration"]
    },
    {
        id: 5,
        title: "Writing Checklist: ELD Standards",
        description: "Checklist aligned with ELD standards for self-assessment and revision.",
        level: "Expanding",
        category: "Checklists",
        type: "PDF",
        url: "/scaffolds/writing-checklist.pdf",
        downloads: 187,
        rating: 4.6,
        tags: ["Writing", "Self-Assessment", "Standards"]
    },
    {
        id: 6,
        title: "Grammar Reference Guide",
        description: "Quick reference for common grammar patterns and sentence structures.",
        level: "Bridging",
        category: "Reference",
        type: "PDF",
        url: "/scaffolds/grammar-guide.pdf",
        downloads: 145,
        rating: 4.4,
        tags: ["Grammar", "Writing", "Reference"]
    }
];

const ScaffoldsPage = () => {
    const [searchTerm, setSearchTerm] = useState("");
    const [selectedLevel, setSelectedLevel] = useState("All");
    const [selectedCategory, setSelectedCategory] = useState("All");
    const [sortBy, setSortBy] = useState("downloads");
    const [sortOrder, setSortOrder] = useState("desc");
    const [expandedDescriptions, setExpandedDescriptions] = useState<Set<number>>(new Set());

    const levels = ["All", "Emerging", "Expanding", "Bridging"];
    const categories = ["All", "Graphic Organizers", "Sentence Frames", "Word Banks", "Discussion Tools", "Checklists", "Reference"];

    const filteredScaffolds = mockScaffolds
        .filter(scaffold =>
            scaffold.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
            scaffold.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
            scaffold.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()))
        )
        .filter(scaffold => selectedLevel === "All" || scaffold.level === selectedLevel)
        .filter(scaffold => selectedCategory === "All" || scaffold.category === selectedCategory)
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

    const toggleDescription = (id: number) => {
        const newSet = new Set(expandedDescriptions);
        if (newSet.has(id)) {
            newSet.delete(id);
        } else {
            newSet.add(id);
        }
        setExpandedDescriptions(newSet);
    };

    const getFileIcon = (type: string) => {
        switch (type) {
            case "PDF": return <FilePdf className="w-5 h-5 text-red-500" />;
            case "Google Doc": return <FileText className="w-5 h-5 text-blue-500" />;
            case "Google Sheet": return <FileSpreadsheet className="w-5 h-5 text-green-500" />;
            default: return <FileText className="w-5 h-5 text-gray-500" />;
        }
    };

    return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            {/* Header */}
            <div className="glass rounded-2xl p-8 mb-8 border border-gray-200/50 dark:border-gray-700/50">
                <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6">
                    <div>
                        <h1 className="text-4xl font-bold bg-gradient-to-r from-primary-600 to-secondary-600 bg-clip-text text-transparent mb-2">
                            Scaffolds Repository
                        </h1>
                        <p className="text-gray-600 dark:text-gray-300 text-lg">
                            Find and download resources to support English Language Development
                        </p>
                    </div>
                    <div className="flex items-center space-x-4">
                        <div className="text-right">
                            <p className="text-sm text-gray-500 dark:text-gray-400">Total Resources</p>
                            <p className="text-2xl font-bold text-primary-600">{mockScaffolds.length}</p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Filters and Search */}
            <div className="glass rounded-2xl p-6 mb-8 border border-gray-200/50 dark:border-gray-700/50">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                    {/* Search */}
                    <div className="lg:col-span-2">
                        <div className="relative">
                            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                            <input
                                type="text"
                                placeholder="Search scaffolds by title, description, or tags..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="w-full pl-10 pr-4 py-3 rounded-lg glass border border-gray-200/50 dark:border-gray-700/50 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                            />
                        </div>
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

                    {/* Category Filter */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Category</label>
                        <select
                            value={selectedCategory}
                            onChange={(e) => setSelectedCategory(e.target.value)}
                            className="w-full px-4 py-3 rounded-lg glass border border-gray-200/50 dark:border-gray-700/50 focus:outline-none focus:ring-2 focus:ring-primary-500"
                        >
                            {categories.map(category => (
                                <option key={category} value={category}>{category}</option>
                            ))}
                        </select>
                    </div>
                </div>

                {/* Sort Options */}
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mt-6 pt-4 border-t border-gray-200/50 dark:border-gray-700/50">
                    <div className="flex items-center space-x-4">
                        <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Sort by:</span>
                        <select
                            value={sortBy}
                            onChange={(e) => setSortBy(e.target.value)}
                            className="px-4 py-2 rounded-lg glass border border-gray-200/50 dark:border-gray-700/50 focus:outline-none focus:ring-2 focus:ring-primary-500"
                        >
                            <option value="downloads">Most Downloaded</option>
                            <option value="rating">Highest Rated</option>
                            <option value="title">Title (A-Z)</option>
                            <option value="level">Level</option>
                        </select>
                        <button
                            onClick={() => setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc')}
                            className="flex items-center space-x-2 px-4 py-2 rounded-lg glass border border-gray-200/50 dark:border-gray-700/50 hover:bg-primary-50 dark:hover:bg-gray-800 interactive"
                        >
                            <Filter className="w-4 h-4" />
                            <span>{sortOrder === 'asc' ? 'Ascending' : 'Descending'}</span>
                        </button>
                    </div>
                    <div className="text-sm text-gray-500 dark:text-gray-400">
                        Showing {filteredScaffolds.length} of {mockScaffolds.length} resources
                    </div>
                </div>
            </div>

            {/* Scaffold Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredScaffolds.map((scaffold) => (
                    <div
                        key={scaffold.id}
                        className="glass rounded-xl p-6 border border-gray-200/50 dark:border-gray-700/50 hover:shadow-lg transition-all duration-300 interactive"
                    >
                        {/* Header */}
                        <div className="flex items-start justify-between mb-4">
                            <div className="flex items-center space-x-3">
                                {getFileIcon(scaffold.type)}
                                <div>
                                    <h3 className="font-bold text-gray-900 dark:text-white text-lg">{scaffold.title}</h3>
                                    <p className="text-sm text-gray-500 dark:text-gray-400">{scaffold.category}</p>
                                </div>
                            </div>
                            <div className="flex items-center space-x-2">
                                <span className={`px-2 py-1 rounded-full text-xs font-medium ${scaffold.level === 'Emerging' ? 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200' :
                                        scaffold.level === 'Expanding' ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200' :
                                            'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
                                    }`}>
                                    {scaffold.level}
                                </span>
                            </div>
                        </div>

                        {/* Description */}
                        <div className="mb-4">
                            <p className={`text-gray-600 dark:text-gray-300 text-sm ${expandedDescriptions.has(scaffold.id) ? '' : 'line-clamp-3'
                                }`}>
                                {scaffold.description}
                            </p>
                            <button
                                onClick={() => toggleDescription(scaffold.id)}
                                className="text-primary-600 hover:text-primary-700 text-sm font-medium mt-2 flex items-center space-x-1"
                            >
                                <span>{expandedDescriptions.has(scaffold.id) ? 'Read less' : 'Read more'}</span>
                                {expandedDescriptions.has(scaffold.id) ? (
                                    <ChevronUp className="w-4 h-4" />
                                ) : (
                                    <ChevronDown className="w-4 h-4" />
                                )}
                            </button>
                        </div>

                        {/* Tags */}
                        <div className="flex flex-wrap gap-2 mb-4">
                            {scaffold.tags.map(tag => (
                                <span key={tag} className="px-2 py-1 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 text-xs rounded-full">
                                    {tag}
                                </span>
                            ))}
                        </div>

                        {/* Footer */}
                        <div className="flex items-center justify-between pt-4 border-t border-gray-200/50 dark:border-gray-700/50">
                            <div className="flex items-center space-x-4 text-sm text-gray-500 dark:text-gray-400">
                                <div className="flex items-center space-x-1">
                                    <Star className="w-4 h-4 text-yellow-500" />
                                    <span>{scaffold.rating}</span>
                                </div>
                                <div className="flex items-center space-x-1">
                                    <Download className="w-4 h-4" />
                                    <span>{scaffold.downloads}</span>
                                </div>
                            </div>
                            <a
                                href={scaffold.url}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="flex items-center space-x-2 bg-primary-600 text-white px-4 py-2 rounded-lg hover:bg-primary-700 transition-colors interactive"
                            >
                                <Download className="w-4 h-4" />
                                <span>Download</span>
                            </a>
                        </div>
                    </div>
                ))}
            </div>

            {filteredScaffolds.length === 0 && (
                <div className="text-center py-12">
                    <div className="glass rounded-xl p-8 border border-gray-200/50 dark:border-gray-700/50">
                        <FileText className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">No scaffolds found</h3>
                        <p className="text-gray-600 dark:text-gray-300">Try adjusting your search criteria or filters.</p>
                    </div>
                </div>
            )}
        </div>
    );
};

export default ScaffoldsPage;