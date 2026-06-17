export type VersionControlFallback = {
  revisionBy: string | null;
  approvedBy: string | null;
  currentVersion: string;
};

export type VersionControlTableOptions = {
  fallback?: VersionControlFallback;
  validity?: string;
};
