module.exports = {
    serverHost: '0.0.0.0',
    serverPort: 3950,
    frontendDb: {
        host: 'localhost',
        port: 5432,
        user: 'postgres',
        pwd: 'postgres',
        db: 'frontend',
        pool: { min: 0, max: 5 },
    },
};
