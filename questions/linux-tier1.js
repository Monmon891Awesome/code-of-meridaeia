// Linux Terminal Tier 1: Ubuntu Basics
// 15 Questions - Basic Commands, Navigation, File Management

const linuxTier1Basics = [
    // ========== SECTION 1: NAVIGATION ==========
    {
        id: 'linux_t1_1',
        tier: 1,
        chapter: 1,
        category: 'marakathalessa',
        difficulty: 'easy',
        topic: 'Navigation',
        type: 'multiple-choice',
        question: 'What command shows your current working directory?',
        options: ['cwd', 'pwd', 'dir', 'where'],
        correctAnswer: 1,
        explanation: 'pwd = Print Working Directory. Shows the full path of where you are in the filesystem.',
        hints: ['print working directory', 'Three letters'],
        xpReward: 10
    },
    {
        id: 'linux_t1_2',
        tier: 1,
        chapter: 1,
        category: 'marakathalessa',
        difficulty: 'easy',
        topic: 'Navigation',
        type: 'code-typing',
        question: 'Complete the command to change to the home directory',
        template: '__ ~',
        blanks: [
            { position: 0, correctAnswer: 'cd', alternatives: [] }
        ],
        explanation: 'cd = Change Directory. ~ is shorthand for your home directory (/home/username).',
        hints: ['change directory', 'Two letters'],
        xpReward: 10
    },
    {
        id: 'linux_t1_3',
        tier: 1,
        chapter: 1,
        category: 'marakathalessa',
        difficulty: 'easy',
        topic: 'Navigation',
        type: 'multiple-choice',
        question: 'What does "cd .." do?',
        options: [
            'Goes to root directory',
            'Goes to home directory',
            'Goes up one directory (parent)',
            'Goes to previous directory'
        ],
        correctAnswer: 2,
        explanation: '.. means parent directory. "cd .." moves you up one level in the directory tree.',
        hints: ['Two dots = parent', 'Single dot = current'],
        xpReward: 10
    },
    {
        id: 'linux_t1_4',
        tier: 1,
        chapter: 1,
        category: 'marakathalessa',
        difficulty: 'easy',
        topic: 'Navigation',
        type: 'multiple-choice',
        question: 'What does "cd -" do?',
        options: [
            'Goes to root',
            'Goes to home',
            'Goes to previous directory you were in',
            'Creates a new directory'
        ],
        correctAnswer: 2,
        explanation: '"cd -" returns to the last directory you were in. Great for toggling between two directories.',
        hints: ['Like a back button', 'Previous location'],
        xpReward: 15
    },

    // ========== SECTION 2: LISTING & VIEWING ==========
    {
        id: 'linux_t1_5',
        tier: 1,
        chapter: 1,
        category: 'marakathalessa',
        difficulty: 'easy',
        topic: 'Files',
        type: 'multiple-choice',
        question: 'What does "ls -la" show?',
        options: [
            'Only directories',
            'All files including hidden, in long format',
            'Only large files',
            'Only recently modified files'
        ],
        correctAnswer: 1,
        explanation: '-l = long format (permissions, size, date). -a = all files including hidden (starting with .).',
        hints: ['Long + all', 'Hidden files start with dot'],
        xpReward: 15
    },
    {
        id: 'linux_t1_6',
        tier: 1,
        chapter: 1,
        category: 'marakathalessa',
        difficulty: 'easy',
        topic: 'Files',
        type: 'code-typing',
        question: 'Complete the command to view file contents',
        template: '___ myfile.txt',
        blanks: [
            { position: 0, correctAnswer: 'cat', alternatives: ['less', 'more'] }
        ],
        explanation: 'cat displays file contents. For large files, use less or more for pagination.',
        hints: ['concatenate', 'Three letters'],
        xpReward: 10
    },
    {
        id: 'linux_t1_7',
        tier: 1,
        chapter: 1,
        category: 'marakathalessa',
        difficulty: 'easy',
        topic: 'Files',
        type: 'multiple-choice',
        question: 'What command shows the first 10 lines of a file?',
        options: ['top', 'head', 'start', 'first'],
        correctAnswer: 1,
        explanation: 'head shows first lines (default 10). Use head -n 20 for 20 lines. tail shows last lines.',
        hints: ['First part of file', 'Opposite of tail'],
        xpReward: 10
    },

    // ========== SECTION 3: FILE MANAGEMENT ==========
    {
        id: 'linux_t1_8',
        tier: 1,
        chapter: 1,
        category: 'marakathalessa',
        difficulty: 'easy',
        topic: 'File Management',
        type: 'code-typing',
        question: 'Complete the command to create a new directory',
        template: '_____ myproject',
        blanks: [
            { position: 0, correctAnswer: 'mkdir', alternatives: [] }
        ],
        explanation: 'mkdir = Make Directory. Use -p to create parent directories automatically.',
        hints: ['make directory', 'Five letters'],
        xpReward: 10
    },
    {
        id: 'linux_t1_9',
        tier: 1,
        chapter: 1,
        category: 'marakathalessa',
        difficulty: 'easy',
        topic: 'File Management',
        type: 'multiple-choice',
        question: 'What does "cp -r source dest" do?',
        options: [
            'Copies a single file',
            'Copies a directory recursively',
            'Compresses directory',
            'Renames directory'
        ],
        correctAnswer: 1,
        explanation: '-r = recursive. Copies directory and all its contents including subdirectories.',
        hints: ['Recursive = includes subdirs', 'cp copies'],
        xpReward: 15
    },
    {
        id: 'linux_t1_10',
        tier: 1,
        chapter: 1,
        category: 'marakathalessa',
        difficulty: 'medium',
        topic: 'File Management',
        type: 'multiple-choice',
        question: 'What is the difference between rm and rmdir?',
        options: [
            'No difference',
            'rmdir only removes empty directories; rm -r removes directories with contents',
            'rm is faster',
            'rmdir is safer'
        ],
        correctAnswer: 1,
        explanation: 'rmdir removes empty directories only. rm -r removes directory and contents. rm -rf forces without prompts (dangerous!).',
        hints: ['rmdir = empty only', 'rm -r = recursive delete'],
        xpReward: 20
    },
    {
        id: 'linux_t1_11',
        tier: 1,
        chapter: 1,
        category: 'marakathalessa',
        difficulty: 'easy',
        topic: 'File Management',
        type: 'code-typing',
        question: 'Complete the command to move/rename a file',
        template: '__ oldname.txt newname.txt',
        blanks: [
            { position: 0, correctAnswer: 'mv', alternatives: [] }
        ],
        explanation: 'mv = move. Used for both moving files and renaming them.',
        hints: ['Two letters', 'Move = rename when same location'],
        xpReward: 10
    },

    // ========== SECTION 4: HELP & INFO ==========
    {
        id: 'linux_t1_12',
        tier: 1,
        chapter: 1,
        category: 'marakathalessa',
        difficulty: 'easy',
        topic: 'Help',
        type: 'multiple-choice',
        question: 'How do you view the manual for a command?',
        options: ['help ls', 'man ls', 'info ls', 'ls --manual'],
        correctAnswer: 1,
        explanation: 'man = manual pages. Press q to quit, /pattern to search, n for next match.',
        hints: ['Short for manual', 'man command'],
        xpReward: 10
    },
    {
        id: 'linux_t1_13',
        tier: 1,
        chapter: 1,
        category: 'marakathalessa',
        difficulty: 'easy',
        topic: 'Help',
        type: 'code-typing',
        question: 'Complete the command to see quick command help',
        template: 'ls ______',
        blanks: [
            { position: 0, correctAnswer: '--help', alternatives: ['-h'] }
        ],
        explanation: '--help shows brief usage info. Often shorter than full man page.',
        hints: ['Quick help flag', 'Standard option'],
        xpReward: 10
    },
    {
        id: 'linux_t1_14',
        tier: 1,
        chapter: 1,
        category: 'marakathalessa',
        difficulty: 'easy',
        topic: 'System Info',
        type: 'multiple-choice',
        question: 'What command shows disk usage summary?',
        options: ['disk', 'df', 'du', 'space'],
        correctAnswer: 1,
        explanation: 'df = disk free. Shows mounted filesystems and available space. du shows directory sizes.',
        hints: ['disk free', 'Two letters'],
        xpReward: 10
    },
    {
        id: 'linux_t1_15',
        tier: 1,
        chapter: 1,
        category: 'marakathalessa',
        difficulty: 'easy',
        topic: 'System Info',
        type: 'code-typing',
        question: 'Complete the command to show current username',
        template: '______',
        blanks: [
            { position: 0, correctAnswer: 'whoami', alternatives: [] }
        ],
        explanation: 'whoami prints the current username. id shows more details (UID, groups).',
        hints: ['Who am I?', 'One word command'],
        xpReward: 10
    }
];

// Export for use in game
if (typeof module !== 'undefined' && module.exports) {
    module.exports = linuxTier1Basics;
}
