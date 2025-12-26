// Kernel Development Questions - Learn OS internals and system programming
const kernelQuestions = [
    // ============ EASY QUESTIONS (10) ============
    {
        id: 'kernel_1',
        category: 'kernel',
        difficulty: 'easy',
        type: 'concept',
        question: 'What is the main difference between user space and kernel space?',
        code: null,
        options: [
            'User space is faster than kernel space',
            'Kernel space has direct hardware access and higher privileges',
            'User space can access all memory addresses',
            'There is no practical difference'
        ],
        correctAnswer: 1,
        explanation: 'Kernel space runs with elevated privileges (ring 0 on x86) and can directly access hardware and all memory. User space (ring 3) must use system calls to request kernel services. This separation provides security and stability.'
    },
    {
        id: 'kernel_2',
        category: 'kernel',
        difficulty: 'easy',
        type: 'concept',
        question: 'What is a system call?',
        code: null,
        options: [
            'A function call between two user programs',
            'An interface for user programs to request services from the kernel',
            'A method to call external APIs',
            'A debugging function'
        ],
        correctAnswer: 1,
        explanation: 'System calls (syscalls) are the interface between user space and kernel space. When a program needs OS services (file I/O, memory allocation, process creation), it makes a syscall which triggers a context switch to kernel mode.'
    },
    {
        id: 'kernel_3',
        category: 'kernel',
        difficulty: 'easy',
        type: 'concept',
        question: 'What is the difference between a process and a thread?',
        code: null,
        options: [
            'Processes are faster than threads',
            'Threads share memory space within a process; processes have separate memory spaces',
            'Threads cannot access files',
            'Processes cannot have multiple threads'
        ],
        correctAnswer: 1,
        explanation: 'A process has its own virtual address space, file descriptors, and resources. Threads within a process share the same address space and resources but have separate stacks and registers. This makes thread creation faster but requires synchronization.'
    },
    {
        id: 'kernel_4',
        category: 'kernel',
        difficulty: 'easy',
        type: 'output',
        question: 'What does the fork() system call return to the child process?',
        code: `pid_t pid = fork();
if (pid == ???) {
    // This is the child process
}`,
        options: [
            '1',
            '-1',
            '0',
            'The parent\'s PID'
        ],
        correctAnswer: 2,
        explanation: 'fork() returns 0 to the child process, the child\'s PID to the parent, and -1 on error. This allows both processes to determine which one they are after the fork.'
    },
    {
        id: 'kernel_5',
        category: 'kernel',
        difficulty: 'easy',
        type: 'concept',
        question: 'What is a file descriptor?',
        code: null,
        options: [
            'A pointer to a file on disk',
            'An integer handle that refers to an open file or I/O resource',
            'The file name stored in memory',
            'A description of file contents'
        ],
        correctAnswer: 1,
        explanation: 'A file descriptor is a small non-negative integer that the kernel uses to identify open files, sockets, pipes, and other I/O resources. Standard descriptors: 0=stdin, 1=stdout, 2=stderr.'
    },
    {
        id: 'kernel_6',
        category: 'kernel',
        difficulty: 'easy',
        type: 'concept',
        question: 'What are the main sections of a process\'s memory layout?',
        code: null,
        options: [
            'Input, Output, Processing',
            'Text (code), Data, Heap, Stack',
            'RAM, ROM, Cache',
            'Primary, Secondary, Tertiary'
        ],
        correctAnswer: 1,
        explanation: 'Process memory layout: Text (executable code), Data (global/static variables), Heap (dynamic memory, grows up), Stack (local variables, function calls, grows down). BSS holds uninitialized globals.'
    },
    {
        id: 'kernel_7',
        category: 'kernel',
        difficulty: 'easy',
        type: 'concept',
        question: 'What is an interrupt?',
        code: null,
        options: [
            'A bug in the program',
            'A signal that causes the CPU to pause current execution and handle an event',
            'A way to stop a program permanently',
            'A type of system call'
        ],
        correctAnswer: 1,
        explanation: 'Interrupts are signals (from hardware or software) that cause the CPU to save its state and execute an interrupt handler. Hardware interrupts come from devices (keyboard, timer), software interrupts are triggered by instructions (syscalls).'
    },
    {
        id: 'kernel_8',
        category: 'kernel',
        difficulty: 'easy',
        type: 'output',
        question: 'After this code runs, how many processes exist?',
        code: `int main() {
    fork();
    fork();
    return 0;
}`,
        options: [
            '2 processes',
            '3 processes',
            '4 processes',
            '1 process'
        ],
        correctAnswer: 2,
        explanation: 'First fork() creates 2 processes. Each of those calls fork() again, creating 4 total processes. Each fork() doubles the number of processes: 1 → 2 → 4.'
    },
    {
        id: 'kernel_9',
        category: 'kernel',
        difficulty: 'easy',
        type: 'concept',
        question: 'What is the purpose of the exec() family of functions?',
        code: null,
        options: [
            'Create a new child process',
            'Replace the current process image with a new program',
            'Execute code in parallel',
            'Terminate the current process'
        ],
        correctAnswer: 1,
        explanation: 'exec() replaces the current process\'s memory image with a new program. The PID stays the same, but the code, data, heap, and stack are replaced. Often used after fork() to run a different program.'
    },
    {
        id: 'kernel_10',
        category: 'kernel',
        difficulty: 'easy',
        type: 'concept',
        question: 'What is a zombie process?',
        code: null,
        options: [
            'A process using too much CPU',
            'A terminated process whose exit status hasn\'t been collected by its parent',
            'A process stuck in an infinite loop',
            'A malicious background process'
        ],
        correctAnswer: 1,
        explanation: 'When a process terminates, it becomes a zombie until its parent calls wait() to collect its exit status. Zombies take minimal resources (just a process table entry) but too many indicate a bug in the parent.'
    },

    // ============ MEDIUM QUESTIONS (12) ============
    {
        id: 'kernel_11',
        category: 'kernel',
        difficulty: 'medium',
        type: 'concept',
        question: 'What is virtual memory and why is it used?',
        code: null,
        options: [
            'Extra RAM installed in the computer',
            'An abstraction that gives each process its own address space, enabling isolation and using disk as extended memory',
            'Memory used only by virtual machines',
            'Cache memory for faster access'
        ],
        correctAnswer: 1,
        explanation: 'Virtual memory maps virtual addresses to physical addresses, giving each process an isolated address space. It allows running programs larger than physical RAM (using disk swap), memory protection, and simplified memory management.'
    },
    {
        id: 'kernel_12',
        category: 'kernel',
        difficulty: 'medium',
        type: 'concept',
        question: 'What happens during a page fault?',
        code: null,
        options: [
            'The program crashes with a segmentation fault',
            'The CPU traps to the kernel, which loads the required page from disk or allocates memory',
            'The page table is deleted',
            'The process is immediately terminated'
        ],
        correctAnswer: 1,
        explanation: 'A page fault occurs when accessing a virtual address not currently in physical memory. The CPU traps to the kernel which: 1) finds the page on disk/allocates it, 2) loads it into a physical frame, 3) updates the page table, 4) restarts the instruction.'
    },
    {
        id: 'kernel_13',
        category: 'kernel',
        difficulty: 'medium',
        type: 'concept',
        question: 'What is copy-on-write (COW)?',
        code: null,
        options: [
            'A way to copy files between processes',
            'An optimization where memory pages are shared until one process modifies them',
            'A write-through cache policy',
            'A file system journaling technique'
        ],
        correctAnswer: 1,
        explanation: 'COW defers copying memory until necessary. After fork(), parent and child share the same physical pages (marked read-only). When either writes, a page fault triggers, and only then is the page copied. This makes fork() very fast.'
    },
    {
        id: 'kernel_14',
        category: 'kernel',
        difficulty: 'medium',
        type: 'concept',
        question: 'What is a context switch?',
        code: null,
        options: [
            'Switching between different programming languages',
            'Saving the state of one process/thread and loading another\'s state to run it',
            'Switching between user mode and kernel mode',
            'Changing the current working directory'
        ],
        correctAnswer: 1,
        explanation: 'A context switch saves CPU state (registers, program counter, stack pointer) of the current process and restores another\'s state. It has overhead (cache invalidation, TLB flush), so minimizing switches improves performance.'
    },
    {
        id: 'kernel_15',
        category: 'kernel',
        difficulty: 'medium',
        type: 'output',
        question: 'What is the output of this code?',
        code: `int main() {
    int x = 10;
    pid_t pid = fork();
    if (pid == 0) {
        x = 20;
    }
    printf("%d ", x);
    return 0;
}`,
        options: [
            '10 only',
            '20 only',
            '10 20 (or 20 10)',
            '10 10'
        ],
        correctAnswer: 2,
        explanation: 'After fork(), parent and child have separate copies of x (due to copy-on-write). Parent prints 10, child prints 20. Order depends on scheduling. Each process has its own memory space.'
    },
    {
        id: 'kernel_16',
        category: 'kernel',
        difficulty: 'medium',
        type: 'concept',
        question: 'What is the Translation Lookaside Buffer (TLB)?',
        code: null,
        options: [
            'A buffer for storing translated code',
            'A cache of recent virtual-to-physical address translations',
            'A buffer for network packet translation',
            'A queue for pending translations'
        ],
        correctAnswer: 1,
        explanation: 'The TLB is a hardware cache that stores recent page table entries (virtual → physical mappings). Without TLB, every memory access would require walking the page table. TLB hits are fast; misses require page table lookup.'
    },
    {
        id: 'kernel_17',
        category: 'kernel',
        difficulty: 'medium',
        type: 'concept',
        question: 'What are the states a process can be in?',
        code: null,
        options: [
            'On, Off, Standby',
            'Running, Ready, Blocked (Waiting), Terminated',
            'Active, Inactive, Paused',
            'User, Kernel, Hybrid'
        ],
        correctAnswer: 1,
        explanation: 'Common process states: Running (executing on CPU), Ready (runnable, waiting for CPU), Blocked/Waiting (waiting for I/O or event), Terminated/Zombie (finished, awaiting cleanup). New is initial state before ready.'
    },
    {
        id: 'kernel_18',
        category: 'kernel',
        difficulty: 'medium',
        type: 'concept',
        question: 'What is the difference between kmalloc() and vmalloc() in the Linux kernel?',
        code: null,
        options: [
            'kmalloc() is for user space, vmalloc() is for kernel',
            'kmalloc() allocates physically contiguous memory, vmalloc() allocates virtually contiguous memory',
            'kmalloc() is slower but safer',
            'vmalloc() can only allocate small amounts'
        ],
        correctAnswer: 1,
        explanation: 'kmalloc() allocates physically contiguous memory (required for DMA). vmalloc() allocates memory that\'s contiguous in virtual space but may be fragmented physically. kmalloc() is faster but limited by physical fragmentation.'
    },
    {
        id: 'kernel_19',
        category: 'kernel',
        difficulty: 'medium',
        type: 'concept',
        question: 'What is a kernel panic?',
        code: null,
        options: [
            'A warning message in the log',
            'An unrecoverable error that forces the kernel to halt',
            'High CPU usage by the kernel',
            'A type of system call'
        ],
        correctAnswer: 1,
        explanation: 'A kernel panic occurs when the kernel detects an error from which it cannot safely recover (null pointer dereference, stack overflow, hardware failure). The system halts to prevent data corruption. Similar to BSOD on Windows.'
    },
    {
        id: 'kernel_20',
        category: 'kernel',
        difficulty: 'medium',
        type: 'concept',
        question: 'What is the purpose of the mmap() system call?',
        code: null,
        options: [
            'Map a GPS location',
            'Map files or devices into the process\'s virtual address space',
            'Create a new filesystem',
            'Monitor memory usage'
        ],
        correctAnswer: 1,
        explanation: 'mmap() creates a mapping between a file (or anonymous memory) and the process\'s virtual address space. This enables memory-mapped file I/O (faster than read/write), shared memory between processes, and dynamic memory allocation.'
    },
    {
        id: 'kernel_21',
        category: 'kernel',
        difficulty: 'medium',
        type: 'concept',
        question: 'What is a semaphore used for in the kernel?',
        code: null,
        options: [
            'Storing error messages',
            'Controlling access to shared resources by maintaining a count of available resources',
            'Encrypting data',
            'Managing file permissions'
        ],
        correctAnswer: 1,
        explanation: 'Semaphores are synchronization primitives with a counter. A process can wait (decrement and block if zero) or signal (increment and wake waiters). Binary semaphores act like mutexes. Counting semaphores limit concurrent access to N resources.'
    },
    {
        id: 'kernel_22',
        category: 'kernel',
        difficulty: 'medium',
        type: 'concept',
        question: 'What is DMA (Direct Memory Access)?',
        code: null,
        options: [
            'A type of RAM',
            'Hardware feature allowing devices to transfer data directly to/from memory without CPU',
            'A debugging mode',
            'Dynamic Memory Allocation'
        ],
        correctAnswer: 1,
        explanation: 'DMA allows hardware devices (disk controllers, network cards) to transfer data directly to/from RAM without CPU involvement. The CPU sets up the transfer, then is free to do other work until a completion interrupt arrives.'
    },

    // ============ HARD QUESTIONS (8) ============
    {
        id: 'kernel_23',
        category: 'kernel',
        difficulty: 'hard',
        type: 'concept',
        question: 'Why are spinlocks preferred over mutexes in interrupt handlers?',
        code: null,
        options: [
            'Spinlocks are faster in all cases',
            'Mutexes can cause the caller to sleep, which is forbidden in interrupt context',
            'Spinlocks use less memory',
            'Mutexes don\'t work with hardware'
        ],
        correctAnswer: 1,
        explanation: 'Interrupt handlers cannot sleep/block because there\'s no process context to schedule. Mutexes may put the thread to sleep if the lock is contended. Spinlocks busy-wait, keeping the CPU active, which is required in interrupt context.'
    },
    {
        id: 'kernel_24',
        category: 'kernel',
        difficulty: 'hard',
        type: 'concept',
        question: 'What is RCU (Read-Copy-Update)?',
        code: null,
        options: [
            'A backup copying mechanism',
            'A synchronization technique allowing concurrent reads with infrequent, deferred writes',
            'A CPU caching policy',
            'A type of lock'
        ],
        correctAnswer: 1,
        explanation: 'RCU allows readers to access data without locks while writers create updated copies. Old data is freed only after all readers finish (grace period). This enables extremely fast reads for read-mostly data structures in the kernel.'
    },
    {
        id: 'kernel_25',
        category: 'kernel',
        difficulty: 'hard',
        type: 'concept',
        question: 'What is a memory barrier (fence)?',
        code: null,
        options: [
            'A physical limit on RAM',
            'An instruction that enforces ordering of memory operations across CPUs',
            'A protection against buffer overflow',
            'Virtual memory page boundary'
        ],
        correctAnswer: 1,
        explanation: 'CPUs and compilers may reorder memory operations for performance. Memory barriers enforce ordering: operations before the barrier complete before those after. Critical for lock-free programming and multi-processor synchronization.'
    },
    {
        id: 'kernel_26',
        category: 'kernel',
        difficulty: 'hard',
        type: 'bugfix',
        question: 'What is the bug in this kernel code?',
        code: `spinlock_t lock;

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
        options: [
            'spin_lock should be spin_trylock',
            'Deadlock: if irq_handler runs while kernel_thread holds lock on same CPU',
            'process_data() should be called after unlock',
            'No bug, code is correct'
        ],
        correctAnswer: 1,
        explanation: 'If an interrupt occurs while kernel_thread holds the lock, irq_handler tries to acquire the same lock on the same CPU, causing deadlock (spinlock spins forever). Solution: use spin_lock_irqsave() to disable interrupts while holding the lock.'
    },
    {
        id: 'kernel_27',
        category: 'kernel',
        difficulty: 'hard',
        type: 'concept',
        question: 'What is the purpose of the Linux kernel\'s CFS (Completely Fair Scheduler)?',
        code: null,
        options: [
            'Scheduling disk I/O operations',
            'Fair CPU time distribution using virtual runtime in a red-black tree',
            'Managing file caches',
            'Scheduling network packets'
        ],
        correctAnswer: 1,
        explanation: 'CFS tracks each task\'s virtual runtime (weighted CPU time). Tasks are stored in a red-black tree sorted by vruntime. The scheduler always picks the task with smallest vruntime (leftmost node), ensuring fair CPU distribution based on priority/weight.'
    },
    {
        id: 'kernel_28',
        category: 'kernel',
        difficulty: 'hard',
        type: 'concept',
        question: 'What are the four conditions required for a deadlock to occur?',
        code: null,
        options: [
            'Speed, Memory, CPU, I/O',
            'Mutual exclusion, Hold and wait, No preemption, Circular wait',
            'Read, Write, Execute, Delete',
            'Init, Run, Block, Terminate'
        ],
        correctAnswer: 1,
        explanation: 'Coffman conditions for deadlock: 1) Mutual exclusion (resource held exclusively), 2) Hold and wait (hold one, wait for another), 3) No preemption (can\'t force release), 4) Circular wait (cycle in wait graph). Prevent any one to avoid deadlock.'
    },
    {
        id: 'kernel_29',
        category: 'kernel',
        difficulty: 'hard',
        type: 'concept',
        question: 'What is the purpose of the inode in a filesystem?',
        code: null,
        options: [
            'Store the file name',
            'Store metadata and block pointers for a file',
            'Cache file contents in memory',
            'Index network connections'
        ],
        correctAnswer: 1,
        explanation: 'An inode contains file metadata (permissions, owner, timestamps, size) and pointers to data blocks. Notably, it does NOT contain the filename - that\'s stored in directory entries that map names to inode numbers.'
    },
    {
        id: 'kernel_30',
        category: 'kernel',
        difficulty: 'hard',
        type: 'output',
        question: 'What problem does this code have?',
        code: `// Thread 1
x = 1;
ready = true;

// Thread 2
while (!ready) {}
assert(x == 1);  // Can this fail?`,
        options: [
            'No problem, x will always be 1',
            'The assertion can fail due to compiler/CPU reordering without memory barriers',
            'The while loop will never exit',
            'x will be 0 because it\'s uninitialized'
        ],
        correctAnswer: 1,
        explanation: 'Without memory barriers, the compiler or CPU may reorder: ready=true could be visible before x=1 is visible to Thread 2. Thread 2 might see ready=true but x=0. Solution: use atomic operations with proper memory ordering (acquire/release).'
    }
];
