// Cache tags for CMS-backed reads. Kept in a leaf module (no imports) so the
// Payload config/hooks and the fetchers can both use them without a cycle.
export const TRAINING_SCHEDULE_TAG = "training-schedule";
export const ALV_DOCUMENTS_TAG = "alv-documents";
export const ALV_NOTES_TAG = "alv-notes";
export const TASKS_PDF_TAG = "tasks-pdf";
export const RECRUITMENT_NOTICE_TAG = "recruitment-notice";

export const ALL_CMS_TAGS = [
  TRAINING_SCHEDULE_TAG,
  ALV_DOCUMENTS_TAG,
  ALV_NOTES_TAG,
  TASKS_PDF_TAG,
  RECRUITMENT_NOTICE_TAG,
] as const;
