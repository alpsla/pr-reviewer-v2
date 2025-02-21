/**
 * Type compatibility patches for GitLab client
 * This file contains type fixes for GitBeaker integration
 */
/* eslint-disable @typescript-eslint/no-explicit-any */

// Import Gitlab type to extend it
import { 
  Gitlab as GitlabOriginal
} from '@gitbeaker/rest';

// Extended Gitlab interface with the missing components we need
export interface Gitlab extends Partial<typeof GitlabOriginal> {
  Users: {
    current(): Promise<any>;
  };
  Projects: {
    show(projectId: string): Promise<any>;
    all(options?: any): Promise<any[]>;
  };
  Groups: {
    projects(groupId: string | number, options?: any): Promise<any[]>;
  };
  MergeRequests: {
    show(projectId: string, mergeRequestIid: number): Promise<any>;
    all(options?: any): Promise<any[]>;
    changes(projectId: string | number, mergeRequestIid: number): Promise<any>;
    commits(projectId: string | number, mergeRequestIid: number): Promise<any[]>;
    approvals(projectId: string | number, mergeRequestIid: number): Promise<any>;
  };
  MergeRequestDiscussions: {
    all(projectId: string | number, mergeRequestIid: number): Promise<any[]>;
  };
  Version: {
    show(): Promise<any>;
  };
}

/**
 * Map visibility values from our API to GitLab's API
 */
export function mapVisibility(visibility?: 'all' | 'public' | 'private'): 'public' | 'private' | 'internal' | undefined {
  if (visibility === 'all') return undefined;
  if (visibility === 'public') return 'public';
  if (visibility === 'private') return 'private';
  return undefined;
}

/**
 * Map PR state values from our API to GitLab's API
 */
export function mapMergeRequestState(state?: 'all' | 'open' | 'closed' | 'merged'): 'opened' | 'closed' | 'locked' | 'merged' | undefined {
  if (state === 'all') return undefined;
  if (state === 'open') return 'opened';
  if (state === 'closed') return 'closed'; 
  if (state === 'merged') return 'merged';
  return undefined;
}
