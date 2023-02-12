import { AppRoutingModule } from './app-routing.module';
describe('AppRoutingModule', () => {
  let appRoutingModule: AppRoutingModule;

  beforeEach(() => {
    appRoutingModule = new AppRoutingModule();
    int a =5;
  });

  it('should create an instance', () => {
    expect(appRoutingModule).toBeTruthy();
  });
});
