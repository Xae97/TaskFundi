import { NavigatorScreenParams } from '@react-navigation/native';
import { UserRole } from '../types';

export type MainTabParamList = {
  Dashboard: undefined;
  Fundi: undefined;
  Chat: undefined;
  Profile: undefined;
};

export type RootStackParamList = {
  Landing: undefined;
  Login: undefined;
  ForgotPassword: undefined;
  Register: {
    role: UserRole;
  };
  MainTabs: NavigatorScreenParams<MainTabParamList>;
  ServiceDetails: {
    serviceId: string;
  };
  JobDetails: {
    jobId: string;
  };
  CreateJob: undefined;
  ChatDetail: {
    conversationId: string;
  };
  ChatList: undefined;
};