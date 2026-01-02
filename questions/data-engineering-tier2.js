// Data Engineering Tier 2: Data Pipelines
// 15 Questions - ETL, Data Lakes, Streaming

const dataEngineeringTier2Pipelines = [
    // ========== SECTION 1: ETL ==========
    {
        id: 'de_t2_1',
        tier: 2,
        chapter: 2,
        category: 'dataEngineering',
        difficulty: 'easy',
        topic: 'ETL',
        type: 'multiple-choice',
        question: 'What does ETL stand for?',
        options: [
            'Encrypted Transfer Layer',
            'Extract, Transform, Load',
            'Efficient Table Lookup',
            'Extended Transaction Log'
        ],
        correctAnswer: 1,
        explanation: 'ETL = Extract (get data from sources), Transform (clean/restructure), Load (store in destination).',
        hints: ['Three steps of data pipeline', 'The backbone of data processing'],
        xpReward: 10
    },
    {
        id: 'de_t2_2',
        tier: 2,
        chapter: 2,
        category: 'dataEngineering',
        difficulty: 'medium',
        topic: 'ETL',
        type: 'multiple-choice',
        question: 'What is the difference between ETL and ELT?',
        options: [
            'No difference',
            'In ELT, data is loaded before transformation',
            'ELT is faster',
            'ETL is only for batch processing'
        ],
        correctAnswer: 1,
        explanation: 'ELT loads raw data first, then transforms in the destination (useful with powerful data warehouses like BigQuery, Snowflake).',
        hints: ['Order of operations matters', 'ELT leverages destination compute power'],
        xpReward: 20
    },
    {
        id: 'de_t2_3',
        tier: 2,
        chapter: 2,
        category: 'dataEngineering',
        difficulty: 'medium',
        topic: 'ETL',
        type: 'multiple-choice',
        question: 'Which transformation is commonly applied during ETL?',
        options: [
            'Encryption only',
            'Data cleaning, deduplication, and schema mapping',
            'Data compression only',
            'Backup creation'
        ],
        correctAnswer: 1,
        explanation: 'Transform phase includes: cleaning (fix errors), deduplication, format conversion, schema mapping, enrichment.',
        hints: ['Making data usable', 'Quality improvements happen here'],
        xpReward: 15
    },

    // ========== SECTION 2: DATA LAKES & WAREHOUSES ==========
    {
        id: 'de_t2_4',
        tier: 2,
        chapter: 2,
        category: 'dataEngineering',
        difficulty: 'medium',
        topic: 'Data Lake',
        type: 'multiple-choice',
        question: 'What is the main difference between a Data Lake and Data Warehouse?',
        options: [
            'They are the same',
            'Data Lake stores raw data; Data Warehouse stores structured, processed data',
            'Data Lake is smaller',
            'Data Warehouse only stores text'
        ],
        correctAnswer: 1,
        explanation: 'Data Lake: schema-on-read, raw data, flexible. Data Warehouse: schema-on-write, cleaned data, optimized for analytics.',
        hints: ['Lake = raw, Warehouse = processed', 'Different use cases'],
        xpReward: 20
    },
    {
        id: 'de_t2_5',
        tier: 2,
        chapter: 2,
        category: 'dataEngineering',
        difficulty: 'hard',
        topic: 'Data Lake',
        type: 'multiple-choice',
        question: 'What is a "data swamp"?',
        options: [
            'A very efficient data lake',
            'A data lake that became unusable due to poor governance',
            'A backup of a data lake',
            'A type of database'
        ],
        correctAnswer: 1,
        explanation: 'Data swamp = data lake with no governance, documentation, or quality control. Data becomes hard to find and trust.',
        hints: ['Negative term', 'Result of poor management'],
        xpReward: 25
    },
    {
        id: 'de_t2_6',
        tier: 2,
        chapter: 2,
        category: 'dataEngineering',
        difficulty: 'medium',
        topic: 'Data Warehouse',
        type: 'multiple-choice',
        question: 'What is the difference between OLTP and OLAP?',
        options: [
            'They are the same',
            'OLTP handles transactions; OLAP handles analytics',
            'OLTP is faster',
            'OLAP only uses SQL'
        ],
        correctAnswer: 1,
        explanation: 'OLTP: optimized for CRUD operations, current data. OLAP: optimized for complex queries, historical data, aggregations.',
        hints: ['T = Transactions, A = Analytics', 'Different optimization goals'],
        xpReward: 20
    },

    // ========== SECTION 3: STREAMING ==========
    {
        id: 'de_t2_7',
        tier: 2,
        chapter: 2,
        category: 'dataEngineering',
        difficulty: 'medium',
        topic: 'Streaming',
        type: 'multiple-choice',
        question: 'What is the difference between batch and stream processing?',
        options: [
            'No difference',
            'Batch processes data in chunks; stream processes data in real-time',
            'Stream is always faster',
            'Batch only works with files'
        ],
        correctAnswer: 1,
        explanation: 'Batch: scheduled processing of accumulated data. Stream: continuous processing as data arrives (real-time).',
        hints: ['Scheduled vs continuous', 'Stream = real-time'],
        xpReward: 15
    },
    {
        id: 'de_t2_8',
        tier: 2,
        chapter: 2,
        category: 'dataEngineering',
        difficulty: 'hard',
        topic: 'Streaming',
        type: 'multiple-choice',
        question: 'What is Apache Kafka primarily used for?',
        options: [
            'Storing files',
            'Distributed streaming platform for real-time data pipelines',
            'Running SQL queries',
            'Container orchestration'
        ],
        correctAnswer: 1,
        explanation: 'Kafka is a distributed event streaming platform for high-throughput, real-time data feeds and event-driven architectures.',
        hints: ['Event streaming', 'Pub-sub messaging'],
        xpReward: 25
    },
    {
        id: 'de_t2_9',
        tier: 2,
        chapter: 2,
        category: 'dataEngineering',
        difficulty: 'medium',
        topic: 'Streaming',
        type: 'multiple-choice',
        question: 'What is a Kafka topic?',
        options: [
            'A discussion forum',
            'A category or feed name to which records are published',
            'A type of database table',
            'A configuration setting'
        ],
        correctAnswer: 1,
        explanation: 'Topics are named feeds. Producers publish to topics, consumers subscribe to topics. Data is partitioned within topics.',
        hints: ['Like a channel or category', 'Messages are organized by topic'],
        xpReward: 20
    },

    // ========== SECTION 4: DATA QUALITY ==========
    {
        id: 'de_t2_10',
        tier: 2,
        chapter: 2,
        category: 'dataEngineering',
        difficulty: 'medium',
        topic: 'Data Quality',
        type: 'multiple-choice',
        question: 'What is data partitioning?',
        options: [
            'Encrypting data',
            'Dividing data into smaller chunks for performance and scalability',
            'Creating backups',
            'Compressing files'
        ],
        correctAnswer: 1,
        explanation: 'Partitioning divides data by key (date, region) for faster queries (scan only relevant partitions) and parallel processing.',
        hints: ['Divide and conquer', 'Query only what you need'],
        xpReward: 15
    },
    {
        id: 'de_t2_11',
        tier: 2,
        chapter: 2,
        category: 'dataEngineering',
        difficulty: 'medium',
        topic: 'Data Quality',
        type: 'multiple-choice',
        question: 'What is data lineage?',
        options: [
            'The age of data',
            'The tracking of data origins and transformations',
            'Data encryption method',
            'Database connection string'
        ],
        correctAnswer: 1,
        explanation: 'Data lineage tracks where data came from, how it was transformed, and where it goes. Essential for debugging and compliance.',
        hints: ['Like ancestry for data', 'Trace the flow'],
        xpReward: 20
    },
    {
        id: 'de_t2_12',
        tier: 2,
        chapter: 2,
        category: 'dataEngineering',
        difficulty: 'medium',
        topic: 'Data Quality',
        type: 'multiple-choice',
        question: 'What is a surrogate key?',
        options: [
            'A key from another table',
            'An artificial key with no business meaning (like auto-increment ID)',
            'A temporary key',
            'An encrypted key'
        ],
        correctAnswer: 1,
        explanation: 'Surrogate keys are system-generated (auto-increment, UUID), unlike natural keys (email, SSN) with real-world meaning.',
        hints: ['No business meaning', 'System-generated'],
        xpReward: 15
    },
    {
        id: 'de_t2_13',
        tier: 2,
        chapter: 2,
        category: 'dataEngineering',
        difficulty: 'hard',
        topic: 'Data Quality',
        type: 'multiple-choice',
        question: 'What is idempotency in data pipelines?',
        options: [
            'Running faster',
            'Producing the same result when run multiple times',
            'Using less memory',
            'Parallel processing'
        ],
        correctAnswer: 1,
        explanation: 'Idempotent pipelines produce the same output regardless of how many times they run. Essential for reliable reprocessing.',
        hints: ['Same input = same output, always', 'Safe to re-run'],
        xpReward: 25
    },
    {
        id: 'de_t2_14',
        tier: 2,
        chapter: 2,
        category: 'dataEngineering',
        difficulty: 'medium',
        topic: 'Normalization',
        type: 'multiple-choice',
        question: 'What is database normalization?',
        options: [
            'Making all values positive',
            'Organizing tables to reduce redundancy and improve integrity',
            'Encrypting the database',
            'Speeding up queries'
        ],
        correctAnswer: 1,
        explanation: 'Normalization reduces data redundancy through forms (1NF, 2NF, 3NF), minimizing update anomalies.',
        hints: ['Reduce duplication', 'Improve data integrity'],
        xpReward: 15
    },
    {
        id: 'de_t2_15',
        tier: 2,
        chapter: 2,
        category: 'dataEngineering',
        difficulty: 'hard',
        topic: 'Normalization',
        type: 'multiple-choice',
        question: 'Why might you denormalize a database?',
        options: [
            'To save storage space',
            'To improve read performance by reducing joins',
            'To improve security',
            'To reduce data'
        ],
        correctAnswer: 1,
        explanation: 'Denormalization trades storage for speed. Pre-computed joins reduce query complexity at the cost of redundancy.',
        hints: ['Opposite of normalization', 'Read performance vs storage'],
        xpReward: 25
    }
];

// Export for use in game
if (typeof module !== 'undefined' && module.exports) {
    module.exports = dataEngineeringTier2Pipelines;
}
