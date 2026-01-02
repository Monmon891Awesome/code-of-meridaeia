// Kernel Tier 3: Advanced Kernel Internals
// 15 Questions - Scheduling, File Systems, Advanced Synchronization

const kernelTier3Advanced = [
    // ========== SECTION 1: SCHEDULING ==========
    {
        id: 'kernel_t3_1',
        tier: 3,
        chapter: 3,
        category: 'kernel',
        difficulty: 'hard',
        topic: 'Scheduling',
        type: 'multiple-choice',
        question: 'What is the Linux CFS (Completely Fair Scheduler)?',
        options: [
            'Disk I/O scheduler',
            'Fair CPU distribution using virtual runtime in a red-black tree',
            'File cache scheduler',
            'Network packet scheduler'
        ],
        correctAnswer: 1,
        explanation: 'CFS tracks virtual runtime (weighted CPU time). Uses red-black tree, picks task with smallest vruntime (leftmost node).',
        hints: ['Fair = equal distribution adjusted by priority', 'Red-black tree for O(log n) operations'],
        xpReward: 25
    },
    {
        id: 'kernel_t3_2',
        tier: 3,
        chapter: 3,
        category: 'kernel',
        difficulty: 'hard',
        topic: 'Scheduling',
        type: 'multiple-choice',
        question: 'What are nice values in Linux scheduling?',
        options: [
            'Values that make processes polite',
            'Priority hints: -20 (highest) to +19 (lowest priority)',
            'Time slice durations',
            'Memory allocation limits'
        ],
        correctAnswer: 1,
        explanation: 'Nice value affects scheduling priority. Lower = higher priority. Nice 0 is default. Root can set negative values.',
        hints: ['-20 to +19 range', 'Affects CPU share'],
        xpReward: 20
    },
    {
        id: 'kernel_t3_3',
        tier: 3,
        chapter: 3,
        category: 'kernel',
        difficulty: 'hard',
        topic: 'Scheduling',
        type: 'multiple-choice',
        question: 'What is the difference between real-time and normal scheduling classes?',
        options: [
            'Real-time is slower',
            'Real-time processes have absolute priority over normal processes',
            'Normal processes run faster',
            'No difference in Linux'
        ],
        correctAnswer: 1,
        explanation: 'Real-time (SCHED_FIFO, SCHED_RR) always runs before normal (SCHED_OTHER). Used for time-critical tasks.',
        hints: ['Real-time = guaranteed scheduling', 'Can starve normal processes'],
        xpReward: 25
    },

    // ========== SECTION 2: FILE SYSTEMS ==========
    {
        id: 'kernel_t3_4',
        tier: 3,
        chapter: 3,
        category: 'kernel',
        difficulty: 'hard',
        topic: 'File Systems',
        type: 'multiple-choice',
        question: 'What is an inode?',
        options: [
            'The file name',
            'Metadata and block pointers for a file',
            'A network connection',
            'A process identifier'
        ],
        correctAnswer: 1,
        explanation: 'Inode contains metadata (permissions, owner, timestamps, size) and pointers to data blocks. Filename is in directory entry.',
        hints: ['Metadata container', 'Does NOT contain filename'],
        xpReward: 20
    },
    {
        id: 'kernel_t3_5',
        tier: 3,
        chapter: 3,
        category: 'kernel',
        difficulty: 'hard',
        topic: 'File Systems',
        type: 'multiple-choice',
        question: 'What is journaling in file systems?',
        options: [
            'Keeping a log of file access',
            'Recording changes before applying them for crash recovery',
            'Compressing old files',
            'Encrypting file names'
        ],
        correctAnswer: 1,
        explanation: 'Journaling writes changes to a log first. If crash occurs, replay log to recover. Prevents corruption. Used by ext4, NTFS.',
        hints: ['Crash recovery mechanism', 'Write-ahead logging'],
        xpReward: 25
    },
    {
        id: 'kernel_t3_6',
        tier: 3,
        chapter: 3,
        category: 'kernel',
        difficulty: 'medium',
        topic: 'File Systems',
        type: 'multiple-choice',
        question: 'What is the VFS (Virtual File System)?',
        options: [
            'A virtual disk',
            'An abstraction layer allowing uniform access to different file systems',
            'A version control system',
            'A virus filtering system'
        ],
        correctAnswer: 1,
        explanation: 'VFS provides uniform interface (open, read, write) regardless of underlying filesystem (ext4, NFS, etc.).',
        hints: ['Abstraction layer', 'Allows mixing filesystems'],
        xpReward: 20
    },

    // ========== SECTION 3: ADVANCED SYNCHRONIZATION ==========
    {
        id: 'kernel_t3_7',
        tier: 3,
        chapter: 3,
        category: 'kernel',
        difficulty: 'hard',
        topic: 'Synchronization',
        type: 'multiple-choice',
        question: 'What is RCU (Read-Copy-Update)?',
        options: [
            'A backup mechanism',
            'Lock-free synchronization allowing concurrent reads with deferred writes',
            'A CPU cache policy',
            'A network protocol'
        ],
        correctAnswer: 1,
        explanation: 'RCU: readers access data without locks. Writers create copies. Old data freed after all readers finish (grace period).',
        hints: ['Read-mostly optimization', 'Used heavily in Linux kernel'],
        xpReward: 30
    },
    {
        id: 'kernel_t3_8',
        tier: 3,
        chapter: 3,
        category: 'kernel',
        difficulty: 'hard',
        topic: 'Synchronization',
        type: 'multiple-choice',
        question: 'What is a memory barrier (fence)?',
        options: [
            'A physical limit on RAM',
            'An instruction enforcing memory operation ordering across CPUs',
            'Protection against buffer overflow',
            'Virtual memory page boundary'
        ],
        correctAnswer: 1,
        explanation: 'CPUs/compilers may reorder memory operations. Barriers enforce ordering. Critical for lock-free programming.',
        hints: ['Ordering guarantee', 'Needed for multi-CPU correctness'],
        xpReward: 30
    },
    {
        id: 'kernel_t3_9',
        tier: 3,
        chapter: 3,
        category: 'kernel',
        difficulty: 'hard',
        topic: 'Synchronization',
        type: 'fix-bug',
        question: 'What is the bug in this kernel code?',
        brokenCode: `spinlock_t lock;

void irq_handler(void) {
    spin_lock(&lock);
    process_data();
    spin_unlock(&lock);
}

void kernel_thread(void) {
    spin_lock(&lock);
    // If interrupt occurs here...
    do_work();
    spin_unlock(&lock);
}`,
        errorLine: 10,
        errorMessage: 'Potential deadlock if interrupt occurs while holding lock',
        correctCode: `spinlock_t lock;

void irq_handler(void) {
    spin_lock(&lock);
    process_data();
    spin_unlock(&lock);
}

void kernel_thread(void) {
    spin_lock_irqsave(&lock, flags);
    do_work();
    spin_unlock_irqrestore(&lock, flags);
}`,
        explanation: 'If interrupt fires while kernel_thread holds lock, irq_handler tries to acquire same lock on same CPU → deadlock. Use spin_lock_irqsave to disable interrupts.',
        hints: ['Interrupt on same CPU', 'Disable interrupts while holding'],
        xpReward: 35
    },

    // ========== SECTION 4: KERNEL MODULES ==========
    {
        id: 'kernel_t3_10',
        tier: 3,
        chapter: 3,
        category: 'kernel',
        difficulty: 'medium',
        topic: 'Kernel Modules',
        type: 'multiple-choice',
        question: 'What is a loadable kernel module (LKM)?',
        options: [
            'A user program',
            'Code that can be loaded into the running kernel without reboot',
            'A compressed kernel image',
            'A kernel configuration file'
        ],
        correctAnswer: 1,
        explanation: 'LKMs (like device drivers) extend kernel at runtime. Loaded with insmod/modprobe, removed with rmmod.',
        hints: ['Dynamic kernel extension', 'No reboot needed'],
        xpReward: 20
    },
    {
        id: 'kernel_t3_11',
        tier: 3,
        chapter: 3,
        category: 'kernel',
        difficulty: 'medium',
        topic: 'Kernel Modules',
        type: 'code-typing',
        question: 'Complete the module initialization function signature',
        template: `static int ______ mymodule_init(void) {
    printk(KERN_INFO "Module loaded\\n");
    return 0;
}`,
        blanks: [
            { position: 0, correctAnswer: '__init', alternatives: [] }
        ],
        explanation: '__init marks function as initialization code, which can be freed after init to save memory.',
        hints: ['Special kernel macro', 'Frees memory after init'],
        xpReward: 20
    },
    {
        id: 'kernel_t3_12',
        tier: 3,
        chapter: 3,
        category: 'kernel',
        difficulty: 'hard',
        topic: 'Kernel Debugging',
        type: 'multiple-choice',
        question: 'What is printk() vs printf()?',
        options: [
            'Same thing',
            'printk() is kernel logging with priority levels; printf() is user space',
            'printf() works in kernel',
            'printk() is deprecated'
        ],
        correctAnswer: 1,
        explanation: 'printk() logs to kernel ring buffer with levels (KERN_EMERG to KERN_DEBUG). printf() is only for user space.',
        hints: ['Kernel vs user space', 'Has log levels'],
        xpReward: 20
    },

    // ========== SECTION 5: SECURITY ==========
    {
        id: 'kernel_t3_13',
        tier: 3,
        chapter: 3,
        category: 'kernel',
        difficulty: 'hard',
        topic: 'Security',
        type: 'multiple-choice',
        question: 'What is ASLR (Address Space Layout Randomization)?',
        options: [
            'A compression algorithm',
            'Randomizing memory addresses to make exploits harder',
            'A disk layout scheme',
            'An encryption method'
        ],
        correctAnswer: 1,
        explanation: 'ASLR randomizes stack, heap, library addresses at each program start. Makes buffer overflow exploits unreliable.',
        hints: ['Security feature', 'Prevents address prediction'],
        xpReward: 25
    },
    {
        id: 'kernel_t3_14',
        tier: 3,
        chapter: 3,
        category: 'kernel',
        difficulty: 'hard',
        topic: 'Security',
        type: 'multiple-choice',
        question: 'What are Linux capabilities?',
        options: [
            'CPU features',
            'Fine-grained privileges that can be given to processes instead of full root',
            'Hardware capabilities',
            'Network features'
        ],
        correctAnswer: 1,
        explanation: 'Capabilities split root privileges into pieces (CAP_NET_ADMIN, CAP_SYS_PTRACE, etc.). Allows least privilege.',
        hints: ['Principle of least privilege', 'Finer than root/non-root'],
        xpReward: 25
    },
    {
        id: 'kernel_t3_15',
        tier: 3,
        chapter: 3,
        category: 'kernel',
        difficulty: 'hard',
        topic: 'Security',
        type: 'multiple-choice',
        question: 'What is SELinux?',
        options: [
            'A Linux distribution',
            'A mandatory access control (MAC) security framework',
            'A shell extension',
            'A network protocol'
        ],
        correctAnswer: 1,
        explanation: 'SELinux provides MAC - security policies beyond traditional DAC permissions. Confines processes to minimum privileges.',
        hints: ['Mandatory Access Control', 'NSA-developed'],
        xpReward: 25
    }
];

// Export for use in game
if (typeof module !== 'undefined' && module.exports) {
    module.exports = kernelTier3Advanced;
}
