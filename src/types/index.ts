export type Json =
  | string
  | number
  | boolean
  | null
  | Json[]
  | { [key: string]: Json };

export type UserMeta = {
  id: string;
  info: {
    name: string;
    color: string;
    picture: string;
    [key: string]: Json;
  };
  [key: string]: Json;
};

export type Session = {
  id: string;
  title: string;
  code: string;
  language: string;
  createdAt: Date;
  updatedAt: Date;
  [key: string]: unknown;
};

export type Annotation = {
  id: string;
  line: number;
  text: string;
  userId: string;
  userInfo: UserMeta["info"];
  createdAt: number;
  [key: string]: Json;
};

export type ChatMessage = {
  id: string;
  text: string;
  userId: string;
  timestamp: number;
  userInfo: UserMeta["info"];
  [key: string]: Json;
};
