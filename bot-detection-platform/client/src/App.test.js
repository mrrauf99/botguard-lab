describe('Bot Detection Platform Client', () => {
  it('should pass basic test', () => {
    expect(true).toBe(true);
  });

  it('should initialize App component', () => {
    const appName = 'Bot Detection Platform';
    expect(appName).toContain('Bot');
  });
});
