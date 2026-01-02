// Linux Terminal Tier 2: Ubuntu Intermediate
// 15 Questions - Pipes, Permissions, Package Management, Processes

const linuxTier2Intermediate = [
    // ========== SECTION 1: PIPES & REDIRECTION ==========
    {
        id: 'linux_t2_1',
        tier: 2,
        chapter: 2,
        category: 'marakathalessa',
        difficulty: 'medium',
        topic: 'Pipes',
        type: 'multiple-choice',
        question: 'What does the pipe (|) operator do?',
        options: [
            'Combines two files',
            'Passes output of one command as input to another',
            'Creates a logical OR',
            'Redirects to a file'
        ],
        correctAnswer: 1,
        explanation: 'Pipe connects stdout of one command to stdin of another. Example: ls | grep txt',
        hints: ['Command chaining', 'Output → Input'],
        xpReward: 15
    },
    {
        id: 'linux_t2_2',
        tier: 2,
        chapter: 2,
        category: 'marakathalessa',
        difficulty: 'medium',
        topic: 'Pipes',
        type: 'output',
        question: 'What does this command do?',
        code: 'cat access.log | grep "404" | wc -l',
        options: [
            'Shows all lines in access.log',
            'Counts lines containing "404" in access.log',
            'Deletes 404 errors',
            'Filters out 404 errors'
        ],
        correctAnswer: 1,
        explanation: 'cat reads file → grep filters for "404" → wc -l counts lines. Counts 404 errors in the log.',
        hints: ['Each pipe filters further', 'wc -l = line count'],
        xpReward: 20
    },
    {
        id: 'linux_t2_3',
        tier: 2,
        chapter: 2,
        category: 'marakathalessa',
        difficulty: 'medium',
        topic: 'Redirection',
        type: 'multiple-choice',
        question: 'What is the difference between > and >>?',
        options: [
            'No difference',
            '> overwrites file; >> appends to file',
            '>> is faster',
            '> creates file; >> deletes file'
        ],
        correctAnswer: 1,
        explanation: '> redirects and overwrites. >> redirects and appends. Both create the file if it doesn\'t exist.',
        hints: ['Single = overwrite', 'Double = append'],
        xpReward: 15
    },
    {
        id: 'linux_t2_4',
        tier: 2,
        chapter: 2,
        category: 'marakathalessa',
        difficulty: 'medium',
        topic: 'Redirection',
        type: 'code-typing',
        question: 'Redirect both stdout and stderr to a file',
        template: 'command > output.log ___',
        blanks: [
            { position: 0, correctAnswer: '2>&1', alternatives: [] }
        ],
        explanation: '2>&1 redirects stderr (2) to stdout (1). Combined with > output.log, both go to file.',
        hints: ['2 = stderr, 1 = stdout', 'Redirect 2 to where 1 goes'],
        xpReward: 25
    },

    // ========== SECTION 2: PERMISSIONS ==========
    {
        id: 'linux_t2_5',
        tier: 2,
        chapter: 2,
        category: 'marakathalessa',
        difficulty: 'medium',
        topic: 'Permissions',
        type: 'multiple-choice',
        question: 'What does chmod 755 do?',
        options: [
            'Makes file read-only',
            'Owner: rwx, Group: r-x, Others: r-x',
            'Deletes file permissions',
            'Only owner can access'
        ],
        correctAnswer: 1,
        explanation: '7=rwx (4+2+1), 5=r-x (4+1). Owner has full access, group and others can read and execute.',
        hints: ['Octal notation', '4=read, 2=write, 1=execute'],
        xpReward: 20
    },
    {
        id: 'linux_t2_6',
        tier: 2,
        chapter: 2,
        category: 'marakathalessa',
        difficulty: 'medium',
        topic: 'Permissions',
        type: 'code-typing',
        question: 'Make script.sh executable by owner',
        template: 'chmod _____ script.sh',
        blanks: [
            { position: 0, correctAnswer: 'u+x', alternatives: ['+x', '744', '755'] }
        ],
        explanation: 'u+x adds execute permission for user (owner). chmod +x adds for all.',
        hints: ['u = user/owner', '+x = add execute'],
        xpReward: 15
    },
    {
        id: 'linux_t2_7',
        tier: 2,
        chapter: 2,
        category: 'marakathalessa',
        difficulty: 'medium',
        topic: 'Permissions',
        type: 'multiple-choice',
        question: 'What does chown do?',
        options: [
            'Changes file permissions',
            'Changes file owner and/or group',
            'Changes file name',
            'Checks file ownership'
        ],
        correctAnswer: 1,
        explanation: 'chown user:group file changes owner and group. chown user file changes only owner.',
        hints: ['change owner', 'Requires sudo usually'],
        xpReward: 15
    },

    // ========== SECTION 3: PACKAGE MANAGEMENT (Ubuntu/apt) ==========
    {
        id: 'linux_t2_8',
        tier: 2,
        chapter: 2,
        category: 'marakathalessa',
        difficulty: 'medium',
        topic: 'Packages',
        type: 'code-typing',
        question: 'Update package list in Ubuntu',
        template: 'sudo ___ update',
        blanks: [
            { position: 0, correctAnswer: 'apt', alternatives: ['apt-get'] }
        ],
        explanation: 'apt update refreshes the package index. apt upgrade installs updates.',
        hints: ['Advanced Package Tool', 'Run before installing'],
        xpReward: 15
    },
    {
        id: 'linux_t2_9',
        tier: 2,
        chapter: 2,
        category: 'marakathalessa',
        difficulty: 'medium',
        topic: 'Packages',
        type: 'multiple-choice',
        question: 'What is the difference between apt update and apt upgrade?',
        options: [
            'No difference',
            'update refreshes package list; upgrade installs available updates',
            'upgrade is faster',
            'update installs packages'
        ],
        correctAnswer: 1,
        explanation: 'update downloads package information. upgrade actually installs newer versions. Always update before upgrade.',
        hints: ['update = get info', 'upgrade = install updates'],
        xpReward: 20
    },
    {
        id: 'linux_t2_10',
        tier: 2,
        chapter: 2,
        category: 'marakathalessa',
        difficulty: 'easy',
        topic: 'Packages',
        type: 'code-typing',
        question: 'Install a package in Ubuntu',
        template: 'sudo apt _______ nginx',
        blanks: [
            { position: 0, correctAnswer: 'install', alternatives: [] }
        ],
        explanation: 'apt install package-name downloads and installs the package with dependencies.',
        hints: ['Standard install command', 'Resolves dependencies'],
        xpReward: 10
    },

    // ========== SECTION 4: PROCESSES ==========
    {
        id: 'linux_t2_11',
        tier: 2,
        chapter: 2,
        category: 'marakathalessa',
        difficulty: 'medium',
        topic: 'Processes',
        type: 'multiple-choice',
        question: 'What does "ps aux" show?',
        options: [
            'CPU usage only',
            'All running processes for all users with details',
            'Only current user processes',
            'System services only'
        ],
        correctAnswer: 1,
        explanation: 'a = all users, u = user-oriented format, x = include processes without terminal. Shows comprehensive process list.',
        hints: ['Common combo', 'All processes detailed'],
        xpReward: 15
    },
    {
        id: 'linux_t2_12',
        tier: 2,
        chapter: 2,
        category: 'marakathalessa',
        difficulty: 'medium',
        topic: 'Processes',
        type: 'code-typing',
        question: 'Kill a process by PID',
        template: '____ 1234',
        blanks: [
            { position: 0, correctAnswer: 'kill', alternatives: [] }
        ],
        explanation: 'kill sends SIGTERM (graceful stop) by default. kill -9 sends SIGKILL (force stop).',
        hints: ['Terminate process', 'Uses PID'],
        xpReward: 15
    },
    {
        id: 'linux_t2_13',
        tier: 2,
        chapter: 2,
        category: 'marakathalessa',
        difficulty: 'medium',
        topic: 'Processes',
        type: 'multiple-choice',
        question: 'How do you run a command in the background?',
        options: [
            'bg command',
            'command &',
            'nohup command',
            '--background'
        ],
        correctAnswer: 1,
        explanation: '& at the end runs command in background. nohup also prevents hangup signal on logout.',
        hints: ['Ampersand at the end', 'Shell returns immediately'],
        xpReward: 15
    },
    {
        id: 'linux_t2_14',
        tier: 2,
        chapter: 2,
        category: 'marakathalessa',
        difficulty: 'medium',
        topic: 'Processes',
        type: 'multiple-choice',
        question: 'What does htop show that top doesn\'t?',
        options: [
            'Nothing, they\'re identical',
            'Colored, interactive display with mouse support',
            'Only CPU usage',
            'Hard disk information'
        ],
        correctAnswer: 1,
        explanation: 'htop is an improved top: color coded, scrollable, sortable, mouse support, process tree view.',
        hints: ['Enhanced version', 'Interactive'],
        xpReward: 15
    },
    {
        id: 'linux_t2_15',
        tier: 2,
        chapter: 2,
        category: 'marakathalessa',
        difficulty: 'hard',
        topic: 'Processes',
        type: 'output',
        question: 'What does this command do?',
        code: 'ps aux | grep nginx | grep -v grep | awk \'{print $2}\' | xargs kill',
        options: [
            'Starts nginx',
            'Kills all nginx processes',
            'Shows nginx configuration',
            'Restarts nginx'
        ],
        correctAnswer: 1,
        explanation: 'Finds nginx processes → removes grep itself → extracts PIDs → kills them. Pipeline to kill by name.',
        hints: ['Each pipe filters', 'xargs passes to kill'],
        xpReward: 30
    }
];

// Export for use in game
if (typeof module !== 'undefined' && module.exports) {
    module.exports = linuxTier2Intermediate;
}
