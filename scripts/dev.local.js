process.env.NODE_ENV = process.env.NODE_ENV || 'development';
process.env.SKIP_DATABASE_BOOTSTRAP = 'true';
process.env.SKIP_KAFKA_BOOTSTRAP = 'true';
process.env.SKIP_JOBS_BOOTSTRAP = 'true';
process.env.SKIP_LISTENERS_BOOTSTRAP = 'true';

await import('../src/server.js');
