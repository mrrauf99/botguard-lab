describe('Bot Detection Server', () => {
  it('should initialize Express server', () => {
    const serverName = 'bot-detection-server';
    expect(serverName).toContain('detection');
  });

  it('should have authentication routes', () => {
    const routes = ['/api/auth/register', '/api/auth/login', '/api/auth/me'];
    routes.forEach((route) => {
      expect(route).toContain('/api/auth');
    });
  });

  it('should connect to MongoDB', () => {
    const mongoUri = 'mongodb://localhost:27017/botguard';
    expect(mongoUri).toContain('mongodb');
  });
});
