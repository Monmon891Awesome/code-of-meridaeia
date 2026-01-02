// Kernel Tier 1: Fundamentals
// 15 Questions - Processes, Memory Basics, System Calls

const kernelTier1Fundamentals = [
    // ========== SECTION 1: PROCESSES ==========
    {
        id: 'kernel_t1_1',
        tier: 1,
        chapter: 1,
        category: 'kernel',
        difficulty: 'easy',
        topic: 'Processes',
        type: 'multiple-choice',
        question: 'What is the difference between a process and a thread?',
        options: [
            'Processes are faster than threads',
            'Threads share memory within a process; processes have separate memory spaces',
            'Threads cannot access files',
            'Processes cannot have multiple threads'
        ],
        correctAnswer: 1,
        explanation: 'A process has its own virtual address space. Threads within a process share the same address space but have separate stacks.',
        hints: ['Threads are "lightweight processes"', 'Sharing memory is key difference'],
        xpReward: 10
    },
    {
        id: 'kernel_t1_2',
        tier: 1,
        chapter: 1,
        category: 'kernel',
        difficulty: 'easy',
        topic: 'Processes',
        type: 'multiple-choice',
        question: 'What does fork() return to the child process?',
        code: `pid_t pid = fork();
if (pid == ???) {
    // This is the child process
}`,
        options: ['1', '-1', '0', 'The parent\'s PID'],
        correctAnswer: 2,
        explanation: 'fork() returns 0 to child, child\'s PID to parent, and -1 on error.',
        hints: ['Child gets 0', 'Parent gets child\'s PID'],
        xpReward: 15
    },
    {
        id: 'kernel_t1_3',
        tier: 1,
        chapter: 1,
        category: 'kernel',
        difficulty: 'medium',
        topic: 'Processes',
        type: 'output',
        question: 'How many processes exist after this code runs?',
        code: `int main() {
    fork();
    fork();
    return 0;
}`,
        options: ['2 processes', '3 processes', '4 processes', '1 process'],
        correctAnswer: 2,
        explanation: 'First fork() creates 2 processes. Each then calls fork(), creating 4 total. Each fork() doubles the count.',
        hints: ['fork() duplicates the process', '2^n where n is number of forks'],
        xpReward: 20
    },
    {
        id: 'kernel_t1_4',
        tier: 1,
        chapter: 1,
        category: 'kernel',
        difficulty: 'easy',
        topic: 'Processes',
        type: 'multiple-choice',
        question: 'What is a zombie process?',
        options: [
            'A process using too much CPU',
            'A terminated process whose exit status hasn\'t been collected by its parent',
            'A process stuck in an infinite loop',
            'A malicious background process'
        ],
        correctAnswer: 1,
        explanation: 'When a process terminates, it becomes a zombie until its parent calls wait() to collect its exit status.',
        hints: ['Dead but not cleaned up', 'Parent needs to "reap" it'],
        xpReward: 10
    },
    {
        id: 'kernel_t1_5',
        tier: 1,
        chapter: 1,
        category: 'kernel',
        difficulty: 'medium',
        topic: 'Processes',
        type: 'multiple-choice',
        question: 'What does exec() do?',
        options: [
            'Creates a new child process',
            'Replaces the current process image with a new program',
            'Executes code in parallel',
            'Terminates the current process'
        ],
        correctAnswer: 1,
        explanation: 'exec() replaces the current process\'s code, data, heap, and stack with a new program. PID stays the same.',
        hints: ['Doesn\'t create new process', 'Replaces current image'],
        xpReward: 15
    },

    // ========== SECTION 2: MEMORY BASICS ==========
    {
        id: 'kernel_t1_6',
        tier: 1,
        chapter: 1,
        category: 'kernel',
        difficulty: 'easy',
        topic: 'Memory',
        type: 'multiple-choice',
        question: 'What are the main sections of a process\'s memory layout?',
        options: [
            'Input, Output, Processing',
            'Text (code), Data, Heap, Stack',
            'RAM, ROM, Cache',
            'Primary, Secondary, Tertiary'
        ],
        correctAnswer: 1,
        explanation: 'Text = executable code, Data = globals, Heap = dynamic memory (grows up), Stack = local vars/calls (grows down).',
        hints: ['Four main sections', 'Heap and stack grow toward each other'],
        xpReward: 10
    },
    {
        id: 'kernel_t1_7',
        tier: 1,
        chapter: 1,
        category: 'kernel',
        difficulty: 'medium',
        topic: 'Memory',
        type: 'multiple-choice',
        question: 'What is the difference between stack and heap memory?',
        options: [
            'They are the same',
            'Stack is automatic and fast; heap is manual and flexible',
            'Heap is faster than stack',
            'Stack uses more memory'
        ],
        correctAnswer: 1,
        explanation: 'Stack: automatic allocation, limited size, LIFO. Heap: manual allocation (malloc/free), larger, slower.',
        hints: ['Local variables go on stack', 'malloc allocates from heap'],
        xpReward: 15
    },
    {
        id: 'kernel_t1_8',
        tier: 1,
        chapter: 1,
        category: 'kernel',
        difficulty: 'easy',
        topic: 'Memory',
        type: 'multiple-choice',
        question: 'What is a file descriptor?',
        options: [
            'A pointer to a file on disk',
            'An integer handle that refers to an open file or I/O resource',
            'The file name stored in memory',
            'A description of file contents'
        ],
        correctAnswer: 1,
        explanation: 'File descriptors are small integers the kernel uses to identify open files, sockets, pipes. 0=stdin, 1=stdout, 2=stderr.',
        hints: ['It\'s just a number', 'Index into kernel\'s table'],
        xpReward: 10
    },

    // ========== SECTION 3: SYSTEM CALLS ==========
    {
        id: 'kernel_t1_9',
        tier: 1,
        chapter: 1,
        category: 'kernel',
        difficulty: 'easy',
        topic: 'System Calls',
        type: 'multiple-choice',
        question: 'What is a system call?',
        options: [
            'A function call between two user programs',
            'An interface for user programs to request services from the kernel',
            'A method to call external APIs',
            'A debugging function'
        ],
        correctAnswer: 1,
        explanation: 'Syscalls are the interface between user space and kernel space. They trigger a context switch to kernel mode.',
        hints: ['User → Kernel interface', 'Examples: read, write, open, fork'],
        xpReward: 10
    },
    {
        id: 'kernel_t1_10',
        tier: 1,
        chapter: 1,
        category: 'kernel',
        difficulty: 'medium',
        topic: 'System Calls',
        type: 'multiple-choice',
        question: 'What is the difference between user space and kernel space?',
        options: [
            'User space is faster',
            'Kernel space has direct hardware access and higher privileges',
            'User space can access all memory',
            'No practical difference'
        ],
        correctAnswer: 1,
        explanation: 'Kernel space (ring 0) has full hardware access. User space (ring 3) must use syscalls. This provides security.',
        hints: ['Privilege levels', 'Protection rings'],
        xpReward: 15
    },
    {
        id: 'kernel_t1_11',
        tier: 1,
        chapter: 1,
        category: 'kernel',
        difficulty: 'easy',
        topic: 'Interrupts',
        type: 'multiple-choice',
        question: 'What is an interrupt?',
        options: [
            'A bug in the program',
            'A signal that causes the CPU to pause and handle an event',
            'A way to stop a program permanently',
            'A type of system call'
        ],
        correctAnswer: 1,
        explanation: 'Interrupts pause execution to handle events. Hardware interrupts come from devices, software interrupts from instructions.',
        hints: ['Signals an event', 'CPU stops current work to handle it'],
        xpReward: 10
    },

    // ========== SECTION 4: PROCESS STATES ==========
    {
        id: 'kernel_t1_12',
        tier: 1,
        chapter: 1,
        category: 'kernel',
        difficulty: 'medium',
        topic: 'Process States',
        type: 'multiple-choice',
        question: 'What are the main states a process can be in?',
        options: [
            'On, Off, Standby',
            'Running, Ready, Blocked (Waiting), Terminated',
            'Active, Inactive, Paused',
            'User, Kernel, Hybrid'
        ],
        correctAnswer: 1,
        explanation: 'Running = on CPU, Ready = runnable but waiting, Blocked = waiting for I/O, Terminated = finished.',
        hints: ['State machine model', 'Scheduler moves between states'],
        xpReward: 15
    },
    {
        id: 'kernel_t1_13',
        tier: 1,
        chapter: 1,
        category: 'kernel',
        difficulty: 'medium',
        topic: 'Process States',
        type: 'multiple-choice',
        question: 'What is a context switch?',
        options: [
            'Switching between programming languages',
            'Saving one process/thread state and loading another\'s to run it',
            'Switching between user and kernel mode',
            'Changing directories'
        ],
        correctAnswer: 1,
        explanation: 'Context switch saves CPU state (registers, PC, stack pointer) of current process and restores another\'s. Has overhead.',
        hints: ['Save and restore state', 'Enables multitasking'],
        xpReward: 15
    },
    {
        id: 'kernel_t1_14',
        tier: 1,
        chapter: 1,
        category: 'kernel',
        difficulty: 'medium',
        topic: 'Signals',
        type: 'multiple-choice',
        question: 'What does SIGKILL do?',
        options: [
            'Sends a termination request that can be caught',
            'Immediately terminates a process - cannot be caught or ignored',
            'Pauses a process',
            'Restarts a process'
        ],
        correctAnswer: 1,
        explanation: 'SIGKILL (signal 9) forces immediate termination. SIGTERM can be caught for cleanup. Use SIGKILL as last resort.',
        hints: ['The "nuclear option"', 'kill -9'],
        xpReward: 15
    },
    {
        id: 'kernel_t1_15',
        tier: 1,
        chapter: 1,
        category: 'kernel',
        difficulty: 'medium',
        topic: 'Scheduling',
        type: 'multiple-choice',
        question: 'What is preemptive scheduling?',
        options: [
            'Scheduling that never interrupts processes',
            'Scheduler can interrupt a running process to run another',
            'Scheduling based on priority only',
            'First-come-first-served scheduling'
        ],
        correctAnswer: 1,
        explanation: 'Preemptive scheduling can interrupt processes (via timer). Non-preemptive waits for process to yield. Modern OSes are preemptive.',
        hints: ['Timer interrupts enable it', 'Prevents one process hogging CPU'],
        xpReward: 15
    }
];

// Export for use in game
if (typeof module !== 'undefined' && module.exports) {
    module.exports = kernelTier1Fundamentals;
}
