# Medical Documents for Chatbot — Design Spec

**Date:** 2026-04-29
**Status:** Approved
**Phase:** 13 (medical documents)

## 1. Goal

Add a small, safe document workflow that lets the user upload PDF lab reports, review the extracted lab values, confirm the extraction, and then let the chatbot answer questions using only confirmed lab data.

This phase extends the existing chatbot instead of creating a separate AI experience. The document workflow lives under Settings for MVP so the bottom navigation stays focused and the user has a clear place to manage sensitive health files.

## 2. Scope

Included in this phase:

- Upload PDF lab reports from Settings.
- Store both the original PDF and structured extracted lab data.
- Parse tabular lab-report PDFs into previewable items.
- Require user confirmation before extracted data becomes available to the chatbot.
- Add a chatbot tool for confirmed lab results.
- Make chatbot answers cite that they are based on confirmed lab documents when lab data is used.

Explicitly excluded from this phase:

- Image uploads or OCR for photographed documents.
- Prescriptions, imaging reports, free-form clinical notes, or long narrative medical records.
- Editing individual extracted lab items before confirmation.
- Search, filtering, tagging, or advanced document organization.
- Automatic diagnosis or treatment decisions.
- Parsing unconfirmed documents during chat.

## 3. Product Flow

The MVP document flow is:

1. User opens `Cài đặt`.
2. User taps the `Tài liệu sức khoẻ` section.
3. App shows a document management page.
4. Empty state says the user has no lab documents yet.
5. User taps `Tải PDF xét nghiệm` and selects a PDF.
6. App uploads the original PDF and creates a document record.
7. App calls the parsing backend and shows `Đang đọc tài liệu...`.
8. When parsing succeeds, app shows a preview with extracted lab items.
9. User reviews the preview and taps `Xác nhận tài liệu`.
10. Document status becomes `confirmed`.
11. Chatbot can use the confirmed lab data in later answers.

If parsing fails or the document is not a clear tabular lab report, the document moves to `failed` and the UI explains that the app could not read the file.

## 4. UX Design Requirements

The Settings entry point should be a new section named `Tài liệu sức khoẻ`. It opens a dedicated route for document management instead of embedding upload controls directly inside Settings.

The document page should support these states:

- Empty: no documents yet, with a single upload action.
- Uploading: file is being stored.
- Parsing: backend is extracting lab values.
- Preview: extracted values are ready for confirmation.
- Confirmed list: confirmed documents are visible with file name, parsed lab date when available, and status.
- Failed: document could not be parsed.

The preview should show:

- File name.
- Lab/report date if extracted.
- A compact list or table of extracted lab items.
- A warning that AI extraction can be wrong and the user should compare against the original PDF.
- A primary `Xác nhận tài liệu` action.
- A secondary cancel action.

Because this feature touches UI, the implementation plan must include a Pencil design task before JSX work. The plan must reference the `.pen` design file and exact frames instead of re-describing layout details in prose.

## 5. Data Model

Use Supabase Storage for original PDFs and Postgres for metadata plus structured lab items.

### Storage

Create a private storage bucket, for example `health-documents`.

Store original files under a path shaped like:

```text
<user_id>/<document_id>/original.pdf
```

The path uses `document_id` instead of the original file name as the stable identifier to avoid exposing sensitive names in object paths.

### `health_documents`

Suggested fields:

- `id uuid primary key default gen_random_uuid()`
- `user_id uuid not null references auth.users(id) on delete cascade`
- `document_type text not null default 'lab_report'`
- `status text not null check (status in ('uploaded', 'parsing', 'parsed', 'confirmed', 'failed'))`
- `original_file_name text not null`
- `storage_path text not null`
- `mime_type text not null`
- `file_size_bytes int not null`
- `lab_observed_at date null`
- `parse_error text null`
- `created_at timestamptz not null default now()`
- `updated_at timestamptz not null default now()`
- `confirmed_at timestamptz null`

### `lab_result_items`

Suggested fields:

- `id uuid primary key default gen_random_uuid()`
- `document_id uuid not null references health_documents(id) on delete cascade`
- `user_id uuid not null references auth.users(id) on delete cascade`
- `test_name text not null`
- `value_text text not null`
- `numeric_value numeric null`
- `unit text null`
- `reference_range text null`
- `flag text null`
- `confidence numeric null`
- `source_order int not null default 0`
- `created_at timestamptz not null default now()`

`value_text` is required because lab results are not always numeric. `numeric_value` is optional and should only be filled when parsing is unambiguous.

Both tables must use owner-only RLS. Chatbot tools must join through confirmed documents only.

## 6. PDF Parsing Architecture

Add a Supabase Edge Function named `document-parse`.

The function receives a `document_id`, verifies the authenticated user owns it, downloads the PDF from Storage, extracts text, and calls AI to convert the extracted text into structured JSON.

Recommended function structure:

```text
supabase/functions/document-parse/
  index.ts          # request handler
  pdf.ts            # PDF text extraction
  parser.ts         # AI JSON extraction
  persistence.ts    # document/item writes
  types.ts          # schema and shared types
```

The parser has two separate responsibilities:

1. Extract raw text from the PDF when the PDF has a text layer.
2. Ask AI to normalize that text into structured lab result JSON.

For MVP, scanned PDFs without a readable text layer are treated as unsupported. OCR belongs in a later image/OCR phase.

## 7. AI Parsing Contract

AI parsing is extraction only. It must not interpret health meaning or produce medical advice in the parsing step.

The AI parser should return JSON matching a strict schema:

```ts
type ParsedLabReport = {
  lab_observed_at: string | null;
  items: Array<{
    test_name: string;
    value_text: string;
    numeric_value: number | null;
    unit: string | null;
    reference_range: string | null;
    flag: 'low' | 'high' | 'normal' | 'abnormal' | null;
    confidence: number | null;
  }>;
};
```

Rules:

- Validate AI output with Zod before writing lab items.
- If output fails schema validation, retry once with a schema-repair prompt.
- If the retry fails, set document status to `failed`.
- If no clear lab result table is found, set document status to `failed`.
- Do not infer `flag` unless the PDF includes a clear flag or reference range comparison is straightforward.
- Do not invent missing units, reference ranges, or dates.
- Preserve uncertain values as text instead of forcing numeric parsing.

The preview should surface low-confidence items with a warning, but MVP still uses a document-level confirmation action rather than per-item editing.

## 8. Chatbot Integration

Extend `chat-send` with a new tool:

```ts
get_confirmed_lab_results({
  from_date?: string,
  to_date?: string,
  names?: string[]
})
```

The tool must return only rows from documents where:

- `health_documents.user_id = auth.uid()`
- `health_documents.status = 'confirmed'`
- `lab_result_items.document_id = health_documents.id`

Chatbot behavior requirements:

- Use confirmed lab results when the user asks about lab values, trends, or document-backed health context.
- Mention that the answer is based on confirmed lab documents when the tool is used.
- Prefer short, clear Vietnamese explanations.
- Avoid diagnosis certainty.
- For abnormal values or treatment questions, advise the user to discuss with a doctor.
- If the user asks about a newly uploaded but unconfirmed document, explain that the document must be confirmed before the chatbot can use it.

The chatbot must not read raw PDFs directly during a chat response in this phase.

## 9. Safety and Privacy

This phase handles sensitive health data. Requirements:

- Accept only `application/pdf` uploads.
- Enforce a clear file size limit, initially 10MB.
- Use private storage and signed access only when the app needs to show or download the original file.
- Keep original PDFs and parsed rows tied to `user_id`.
- Use owner-only RLS on metadata and lab items.
- Do not store parsed lab data inside chat history.
- Do not expose original storage paths in chatbot answers.
- Do not allow unconfirmed parsed data to affect chatbot responses.

Medical safety requirements:

- The app frames parsing as AI-assisted extraction, not a medical diagnosis.
- Preview copy tells the user to compare extracted values against the original PDF.
- Chatbot answers based on labs must avoid definitive diagnosis.
- Urgent or severe symptoms still follow the existing chatbot emergency safety rules.

## 10. Error Handling

Expected failure states:

- File is not a PDF: reject before upload or immediately after selection.
- File is too large: reject with a clear message.
- Upload fails: show retryable upload error.
- PDF has no extractable text: mark failed with unsupported scanned-PDF copy.
- AI parser returns invalid JSON twice: mark failed.
- No lab table is found: mark failed.
- User cancels preview: keep or archive the uploaded document according to the implementation plan, but it must not become confirmed.

The UI should keep error copy short and natural in Vietnamese.

## 11. Verification

Required verification before completion:

1. Upload a valid PDF lab report.
2. Parse it into a preview.
3. Confirm the document.
4. Verify confirmed lab items are persisted with the correct `user_id`.
5. Verify chatbot can call the confirmed lab results tool.
6. Verify chatbot does not use unconfirmed documents.
7. Verify invalid PDF type and oversized PDF are rejected.
8. Verify an unsupported scanned PDF or non-lab PDF enters the failed state.
9. Run repository verification commands required by `AGENTS.md`: `yarn format`, `yarn lint`, and `yarn build` for app-impacting implementation.

## 12. Future Extensions

Likely follow-up phases:

- Image upload and OCR for photographed lab reports.
- Per-item edit before confirmation.
- Document search and filters.
- Trend charts for selected lab indicators.
- Support for prescriptions and medication reconciliation.
- Support for long-form clinical notes with a separate parser contract.
