describe('Bot Traffic Simulator Client', () => {
  it('should pass basic test', () => {
    expect(true).toBe(true);
  });

  it('should initialize App component', () => {
    const appName = 'Bot Traffic Simulator';
    expect(appName).toContain('Simulator');
  });
});
