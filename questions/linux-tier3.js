// Linux Terminal Tier 3: Ubuntu Advanced
// 15 Questions - Networking, Scripting, System Administration

const linuxTier3Advanced = [
    // ========== SECTION 1: NETWORKING ==========
    {
        id: 'linux_t3_1',
        tier: 3,
        chapter: 3,
        category: 'marakathalessa',
        difficulty: 'medium',
        topic: 'Networking',
        type: 'multiple-choice',
        question: 'What command shows network interfaces in modern Ubuntu?',
        options: ['ifconfig', 'ip addr', 'netstat -i', 'networkctl'],
        correctAnswer: 1,
        explanation: 'ip addr (or ip a) is the modern replacement for ifconfig. Part of iproute2 package.',
        hints: ['ip command family', 'Modern replacement'],
        xpReward: 15
    },
    {
        id: 'linux_t3_2',
        tier: 3,
        chapter: 3,
        category: 'marakathalessa',
        difficulty: 'medium',
        topic: 'Networking',
        type: 'code-typing',
        question: 'Check if a server is reachable',
        template: '____ google.com',
        blanks: [
            { position: 0, correctAnswer: 'ping', alternatives: [] }
        ],
        explanation: 'ping sends ICMP echo requests. Shows latency and packet loss. Ctrl+C to stop.',
        hints: ['Network connectivity test', 'Common diagnostic'],
        xpReward: 10
    },
    {
        id: 'linux_t3_3',
        tier: 3,
        chapter: 3,
        category: 'marakathalessa',
        difficulty: 'hard',
        topic: 'Networking',
        type: 'multiple-choice',
        question: 'What does "ss -tulpn" show?',
        options: [
            'System statistics',
            'TCP/UDP listening ports with process names',
            'SSH connections only',
            'Network speed'
        ],
        correctAnswer: 1,
        explanation: 't=TCP, u=UDP, l=listening, p=process, n=numeric. ss is the modern netstat replacement.',
        hints: ['Socket statistics', 'Like netstat -tulpn'],
        xpReward: 25
    },
    {
        id: 'linux_t3_4',
        tier: 3,
        chapter: 3,
        category: 'marakathalessa',
        difficulty: 'medium',
        topic: 'Networking',
        type: 'code-typing',
        question: 'Download a file from URL',
        template: '_____ https://example.com/file.zip',
        blanks: [
            { position: 0, correctAnswer: 'wget', alternatives: ['curl -O'] }
        ],
        explanation: 'wget downloads files. curl with -O saves to file. Both are essential for scripting.',
        hints: ['Web get', 'Downloads to current directory'],
        xpReward: 15
    },

    // ========== SECTION 2: BASH SCRIPTING ==========
    {
        id: 'linux_t3_5',
        tier: 3,
        chapter: 3,
        category: 'marakathalessa',
        difficulty: 'medium',
        topic: 'Scripting',
        type: 'multiple-choice',
        question: 'What should be the first line of a bash script?',
        options: [
            '#!bash',
            '#!/bin/bash',
            '//bash',
            'start bash'
        ],
        correctAnswer: 1,
        explanation: 'Shebang (#!) specifies the interpreter. #!/bin/bash ensures bash runs the script.',
        hints: ['Shebang line', 'Starts with #!'],
        xpReward: 15
    },
    {
        id: 'linux_t3_6',
        tier: 3,
        chapter: 3,
        category: 'marakathalessa',
        difficulty: 'medium',
        topic: 'Scripting',
        type: 'output',
        question: 'What is the value of $1 in a script?',
        code: `#!/bin/bash
echo "Hello $1"
# Run: ./script.sh World`,
        options: [
            'The script name',
            'The first command line argument ("World")',
            'The number 1',
            'The current directory'
        ],
        correctAnswer: 1,
        explanation: '$1, $2, etc. are positional parameters. $0 is script name, $# is argument count, $@ is all arguments.',
        hints: ['Positional parameters', '$0 is script name'],
        xpReward: 20
    },
    {
        id: 'linux_t3_7',
        tier: 3,
        chapter: 3,
        category: 'marakathalessa',
        difficulty: 'hard',
        topic: 'Scripting',
        type: 'code-typing',
        question: 'Complete the if statement syntax',
        template: `__ [ "$name" = "admin" ]; then
    echo "Welcome admin"
fi`,
        blanks: [
            { position: 0, correctAnswer: 'if', alternatives: [] }
        ],
        explanation: 'Bash if syntax: if [ condition ]; then ... fi. Note spaces around brackets!',
        hints: ['Starts if block', 'Ends with fi'],
        xpReward: 20
    },
    {
        id: 'linux_t3_8',
        tier: 3,
        chapter: 3,
        category: 'marakathalessa',
        difficulty: 'hard',
        topic: 'Scripting',
        type: 'multiple-choice',
        question: 'What does $? contain after running a command?',
        options: [
            'Process ID',
            'Exit status of the last command (0 = success)',
            'Number of arguments',
            'Current user'
        ],
        correctAnswer: 1,
        explanation: '$? holds exit status. 0 means success, non-zero is an error. Essential for error handling.',
        hints: ['Exit status', '0 = success'],
        xpReward: 25
    },

    // ========== SECTION 3: SYSTEM ADMINISTRATION ==========
    {
        id: 'linux_t3_9',
        tier: 3,
        chapter: 3,
        category: 'marakathalessa',
        difficulty: 'medium',
        topic: 'System Admin',
        type: 'code-typing',
        question: 'Manage systemd services - start nginx',
        template: 'sudo _________ start nginx',
        blanks: [
            { position: 0, correctAnswer: 'systemctl', alternatives: [] }
        ],
        explanation: 'systemctl is the systemd service manager. start, stop, restart, enable, status are common commands.',
        hints: ['systemd control', 'Modern service management'],
        xpReward: 15
    },
    {
        id: 'linux_t3_10',
        tier: 3,
        chapter: 3,
        category: 'marakathalessa',
        difficulty: 'medium',
        topic: 'System Admin',
        type: 'multiple-choice',
        question: 'What does "systemctl enable nginx" do?',
        options: [
            'Starts nginx immediately',
            'Makes nginx start automatically on boot',
            'Updates nginx',
            'Shows nginx status'
        ],
        correctAnswer: 1,
        explanation: 'enable creates symlinks for auto-start on boot. start runs it now. Often used together.',
        hints: ['Boot time behavior', 'Doesn\'t start immediately'],
        xpReward: 20
    },
    {
        id: 'linux_t3_11',
        tier: 3,
        chapter: 3,
        category: 'marakathalessa',
        difficulty: 'hard',
        topic: 'System Admin',
        type: 'multiple-choice',
        question: 'Where are systemd service files typically located?',
        options: [
            '/etc/init.d/',
            '/lib/systemd/system/ and /etc/systemd/system/',
            '/usr/bin/',
            '/var/log/'
        ],
        correctAnswer: 1,
        explanation: '/lib/systemd/system/ has package defaults. /etc/systemd/system/ for admin overrides (higher priority).',
        hints: ['Two locations', 'etc has higher priority'],
        xpReward: 25
    },

    // ========== SECTION 4: TEXT PROCESSING ==========
    {
        id: 'linux_t3_12',
        tier: 3,
        chapter: 3,
        category: 'marakathalessa',
        difficulty: 'hard',
        topic: 'Text Processing',
        type: 'output',
        question: 'What does this awk command output?',
        code: `echo "John,25,Engineer" | awk -F',' '{print $2}'`,
        options: ['John', '25', 'Engineer', 'John,25,Engineer'],
        correctAnswer: 1,
        explanation: '-F\',\' sets comma as delimiter. $2 is the second field. awk is powerful for column extraction.',
        hints: ['Field separator is comma', '$2 is second column'],
        xpReward: 25
    },
    {
        id: 'linux_t3_13',
        tier: 3,
        chapter: 3,
        category: 'marakathalessa',
        difficulty: 'hard',
        topic: 'Text Processing',
        type: 'code-typing',
        question: 'Replace all occurrences of "foo" with "bar" in file',
        template: `sed -i 's/foo/bar/__' file.txt`,
        blanks: [
            { position: 0, correctAnswer: 'g', alternatives: [] }
        ],
        explanation: 'g = global (all occurrences). Without g, only first per line. -i edits in place.',
        hints: ['Global flag', 'All occurrences'],
        xpReward: 25
    },
    {
        id: 'linux_t3_14',
        tier: 3,
        chapter: 3,
        category: 'marakathalessa',
        difficulty: 'hard',
        topic: 'Text Processing',
        type: 'multiple-choice',
        question: 'What does "grep -r pattern /path" do?',
        options: [
            'Searches in a single file',
            'Searches recursively through all files in directory',
            'Replaces pattern',
            'Counts pattern occurrences'
        ],
        correctAnswer: 1,
        explanation: '-r = recursive search through directories. Combine with -l to show only filenames, -n for line numbers.',
        hints: ['Recursive search', 'Searches subdirectories'],
        xpReward: 20
    },
    {
        id: 'linux_t3_15',
        tier: 3,
        chapter: 3,
        category: 'marakathalessa',
        difficulty: 'hard',
        topic: 'Cron',
        type: 'multiple-choice',
        question: 'What does "0 2 * * *" mean in a cron expression?',
        options: [
            'Every 2 minutes',
            'At 2:00 AM every day',
            'Every 2 hours',
            'On the 2nd of every month'
        ],
        correctAnswer: 1,
        explanation: 'Format: minute hour day month weekday. 0 2 * * * = minute 0, hour 2, any day/month/weekday = 2:00 AM daily.',
        hints: ['minute hour day month weekday', '5 fields'],
        xpReward: 30
    }
];

// Export for use in game
if (typeof module !== 'undefined' && module.exports) {
    module.exports = linuxTier3Advanced;
}
