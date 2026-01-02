// Kernel Tier 2: Virtual Memory & Synchronization
// 15 Questions - Virtual Memory, Page Tables, Locks

const kernelTier2VirtualMemory = [
    // ========== SECTION 1: VIRTUAL MEMORY ==========
    {
        id: 'kernel_t2_1',
        tier: 2,
        chapter: 2,
        category: 'kernel',
        difficulty: 'medium',
        topic: 'Virtual Memory',
        type: 'multiple-choice',
        question: 'What is virtual memory?',
        options: [
            'Extra RAM installed in the computer',
            'An abstraction giving each process its own address space',
            'Memory used only by virtual machines',
            'Cache memory for faster access'
        ],
        correctAnswer: 1,
        explanation: 'Virtual memory maps virtual addresses to physical. Each process sees isolated address space. Disk can extend RAM.',
        hints: ['Abstraction layer', 'Process isolation'],
        xpReward: 15
    },
    {
        id: 'kernel_t2_2',
        tier: 2,
        chapter: 2,
        category: 'kernel',
        difficulty: 'medium',
        topic: 'Virtual Memory',
        type: 'multiple-choice',
        question: 'What happens during a page fault?',
        options: [
            'The program crashes',
            'CPU traps to kernel, which loads the required page from disk',
            'Page table is deleted',
            'Process is immediately terminated'
        ],
        correctAnswer: 1,
        explanation: 'Page fault: CPU traps to kernel → find page on disk → load into RAM → update page table → restart instruction.',
        hints: ['Not always an error', 'Triggers kernel intervention'],
        xpReward: 20
    },
    {
        id: 'kernel_t2_3',
        tier: 2,
        chapter: 2,
        category: 'kernel',
        difficulty: 'hard',
        topic: 'Virtual Memory',
        type: 'multiple-choice',
        question: 'What is the TLB (Translation Lookaside Buffer)?',
        options: [
            'A buffer for storing translated code',
            'A cache of recent virtual-to-physical address translations',
            'A buffer for network packets',
            'A queue for pending translations'
        ],
        correctAnswer: 1,
        explanation: 'TLB is a hardware cache storing recent page table entries. TLB hit = fast, TLB miss = walk page table (slow).',
        hints: ['Cache for address translation', 'Hardware optimization'],
        xpReward: 25
    },
    {
        id: 'kernel_t2_4',
        tier: 2,
        chapter: 2,
        category: 'kernel',
        difficulty: 'medium',
        topic: 'Virtual Memory',
        type: 'multiple-choice',
        question: 'What is copy-on-write (COW)?',
        options: [
            'A way to copy files',
            'Memory pages are shared until one process modifies them',
            'A write-through cache policy',
            'A file system journaling technique'
        ],
        correctAnswer: 1,
        explanation: 'COW defers copying. After fork(), parent/child share pages (read-only). On write, page fault triggers copy. Makes fork() fast.',
        hints: ['Optimization technique', 'Share until write'],
        xpReward: 20
    },
    {
        id: 'kernel_t2_5',
        tier: 2,
        chapter: 2,
        category: 'kernel',
        difficulty: 'medium',
        topic: 'Virtual Memory',
        type: 'output',
        question: 'What is the output?',
        code: `int x = 10;
pid_t pid = fork();
if (pid == 0) {
    x = 20;
}
printf("%d ", x);`,
        options: ['10 only', '20 only', '10 20 (or 20 10)', '10 10'],
        correctAnswer: 2,
        explanation: 'After fork(), parent and child have separate copies of x (due to COW). Parent prints 10, child prints 20.',
        hints: ['Separate address spaces', 'Order depends on scheduling'],
        xpReward: 25
    },

    // ========== SECTION 2: MEMORY ALLOCATION ==========
    {
        id: 'kernel_t2_6',
        tier: 2,
        chapter: 2,
        category: 'kernel',
        difficulty: 'hard',
        topic: 'Memory Allocation',
        type: 'multiple-choice',
        question: 'What is the difference between kmalloc() and vmalloc() in Linux?',
        options: [
            'kmalloc() is for user space',
            'kmalloc() allocates physically contiguous memory; vmalloc() is virtually contiguous',
            'kmalloc() is slower',
            'vmalloc() only allocates small amounts'
        ],
        correctAnswer: 1,
        explanation: 'kmalloc(): physically contiguous (required for DMA). vmalloc(): virtually contiguous, may be physically fragmented.',
        hints: ['Physical vs virtual contiguity', 'DMA needs kmalloc'],
        xpReward: 25
    },
    {
        id: 'kernel_t2_7',
        tier: 2,
        chapter: 2,
        category: 'kernel',
        difficulty: 'medium',
        topic: 'Memory Allocation',
        type: 'multiple-choice',
        question: 'What is mmap() used for?',
        options: [
            'Mapping GPS coordinates',
            'Mapping files or devices into process virtual address space',
            'Creating a new filesystem',
            'Monitoring memory usage'
        ],
        correctAnswer: 1,
        explanation: 'mmap() creates mappings between files and memory. Enables memory-mapped I/O, shared memory, and dynamic allocation.',
        hints: ['Memory-mapped files', 'Also used for anonymous mappings'],
        xpReward: 20
    },

    // ========== SECTION 3: SYNCHRONIZATION ==========
    {
        id: 'kernel_t2_8',
        tier: 2,
        chapter: 2,
        category: 'kernel',
        difficulty: 'medium',
        topic: 'Synchronization',
        type: 'multiple-choice',
        question: 'What is a mutex?',
        options: [
            'A type of memory allocation',
            'A lock that ensures only one thread accesses a resource at a time',
            'A debugging tool',
            'A network protocol'
        ],
        correctAnswer: 1,
        explanation: 'Mutex = mutual exclusion. One thread can hold it at a time. Others block until it\'s released.',
        hints: ['Mutual exclusion', 'Prevents race conditions'],
        xpReward: 15
    },
    {
        id: 'kernel_t2_9',
        tier: 2,
        chapter: 2,
        category: 'kernel',
        difficulty: 'medium',
        topic: 'Synchronization',
        type: 'multiple-choice',
        question: 'What is a semaphore?',
        options: [
            'A debugging flag',
            'A counter-based synchronization primitive',
            'A type of memory barrier',
            'An error message'
        ],
        correctAnswer: 1,
        explanation: 'Semaphore has a counter. Wait decrements (blocks if 0). Signal increments. Binary semaphore = mutex. Counting limits concurrent access.',
        hints: ['Counter-based', 'Can allow N concurrent accessors'],
        xpReward: 15
    },
    {
        id: 'kernel_t2_10',
        tier: 2,
        chapter: 2,
        category: 'kernel',
        difficulty: 'hard',
        topic: 'Synchronization',
        type: 'multiple-choice',
        question: 'What is a spinlock?',
        options: [
            'A lock that rotates between threads',
            'A lock that busy-waits (spins) until acquired',
            'A lock that spins the CPU fan',
            'A lock that times out after spinning'
        ],
        correctAnswer: 1,
        explanation: 'Spinlock busy-waits on the CPU rather than sleeping. Good for short critical sections. Used in interrupt handlers.',
        hints: ['Active waiting', 'No context switch'],
        xpReward: 20
    },
    {
        id: 'kernel_t2_11',
        tier: 2,
        chapter: 2,
        category: 'kernel',
        difficulty: 'hard',
        topic: 'Synchronization',
        type: 'multiple-choice',
        question: 'Why use spinlock vs mutex?',
        options: [
            'Spinlocks are always faster',
            'Spinlocks: short holds, no sleeping. Mutex: longer holds, can sleep.',
            'Mutex is only for user space',
            'No practical difference'
        ],
        correctAnswer: 1,
        explanation: 'Spinlock: busy-waits (good for short critical sections, interrupt context). Mutex: sleeps (good for longer waits).',
        hints: ['Context determines choice', 'Can\'t sleep in interrupt handlers'],
        xpReward: 25
    },

    // ========== SECTION 4: DEADLOCKS ==========
    {
        id: 'kernel_t2_12',
        tier: 2,
        chapter: 2,
        category: 'kernel',
        difficulty: 'hard',
        topic: 'Deadlocks',
        type: 'multiple-choice',
        question: 'What are the four conditions for deadlock?',
        options: [
            'Speed, Memory, CPU, I/O',
            'Mutual exclusion, Hold and wait, No preemption, Circular wait',
            'Read, Write, Execute, Delete',
            'Init, Run, Block, Terminate'
        ],
        correctAnswer: 1,
        explanation: 'Coffman conditions: All four must hold for deadlock. Prevent any one to avoid deadlock.',
        hints: ['Coffman conditions', 'Break any one to prevent deadlock'],
        xpReward: 25
    },
    {
        id: 'kernel_t2_13',
        tier: 2,
        chapter: 2,
        category: 'kernel',
        difficulty: 'medium',
        topic: 'Deadlocks',
        type: 'multiple-choice',
        question: 'How can you prevent circular wait deadlock?',
        options: [
            'Use more locks',
            'Always acquire locks in the same global order',
            'Never use locks',
            'Use spinlocks instead of mutexes'
        ],
        correctAnswer: 1,
        explanation: 'Lock ordering prevents circular wait. If all threads acquire locks in same order, cycles can\'t form.',
        hints: ['Ordering discipline', 'Prevents cycles in wait graph'],
        xpReward: 20
    },
    {
        id: 'kernel_t2_14',
        tier: 2,
        chapter: 2,
        category: 'kernel',
        difficulty: 'medium',
        topic: 'DMA',
        type: 'multiple-choice',
        question: 'What is DMA (Direct Memory Access)?',
        options: [
            'A type of RAM',
            'Hardware transfers data directly to memory without CPU',
            'A debugging mode',
            'Dynamic Memory Allocation'
        ],
        correctAnswer: 1,
        explanation: 'DMA lets devices transfer data directly to/from RAM without CPU intervention. CPU sets up transfer, then is free to do other work.',
        hints: ['Offloads CPU', 'Used by disk, network cards'],
        xpReward: 15
    },
    {
        id: 'kernel_t2_15',
        tier: 2,
        chapter: 2,
        category: 'kernel',
        difficulty: 'hard',
        topic: 'Kernel Panic',
        type: 'multiple-choice',
        question: 'What is a kernel panic?',
        options: [
            'A warning message',
            'An unrecoverable error that forces the kernel to halt',
            'High CPU usage',
            'A type of system call'
        ],
        correctAnswer: 1,
        explanation: 'Kernel panic: unrecoverable error. System halts to prevent data corruption. Like Windows BSOD.',
        hints: ['Critical failure', 'System must stop'],
        xpReward: 20
    }
];

// Export for use in game
if (typeof module !== 'undefined' && module.exports) {
    module.exports = kernelTier2VirtualMemory;
}
