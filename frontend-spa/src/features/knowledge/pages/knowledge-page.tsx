import { useEffect, useMemo, useRef, useState } from "react";
import type { DragEvent } from "react";
import { Link } from "@/shared/router/react-router-compat";
import {
  CheckCircle2,
  Database,
  ExternalLink,
  FileText,
  Loader2,
  Plus,
  Search,
  Trash2,
  Upload,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Progress } from "@/components/ui/progress";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { DashboardLayout, PageHeader } from "@/layouts/dashboard-layout";
import { OperationalIndicator } from "@/shared/components/ui/operational-indicator";
import { getApiErrorMessage } from "@/shared/lib/api-error";
import { useAgents } from "@/features/agents/hooks/use-agents";
import { useDeleteDocument, useDocuments, useUploadDocument } from "../hooks/use-documents";
import type { KnowledgeDocument, KnowledgeDocumentStatus } from "../types/document.types";

const pipelineStages = [
  { label: "Uploaded", statuses: ["uploaded"] },
  { label: "Processing", statuses: ["processing"] },
  { label: "Embedded", statuses: ["embedded"] },
  { label: "Searchable", statuses: ["embedded"] },
];

const acceptedFileTypes = ".pdf,.docx,.txt,.csv,.html";
const acceptedExtensions = new Set(["pdf", "docx", "txt", "csv", "html"]);

export function KnowledgePage() {
  const [isDragging, setIsDragging] = useState(false);
  const dragDepthRef = useRef(0);
  const agents = useAgents();
  const [selectedBotId, setSelectedBotId] = useState<string>();
  const botId = selectedBotId ?? agents.data?.[0]?.id;
  const docs = useDocuments(botId);
  const upload = useUploadDocument(botId);
  const deleteDocument = useDeleteDocument(botId);
  const [progress, setProgress] = useState(0);

  const stats = useMemo(() => {
    const documents = docs.data ?? [];
    return {
      pending: documents.filter((doc) => doc.status === "uploaded").length,
      processing: documents.filter((doc) => doc.status === "processing").length,
      completed: documents.filter((doc) => doc.status === "embedded").length,
      failed: documents.filter((doc) => doc.status === "failed").length,
    };
  }, [docs.data]);

  const isAcceptedFile = (file: File) => {
    const extension = file.name.split(".").pop()?.toLowerCase();
    return Boolean(extension && acceptedExtensions.has(extension));
  };

  const onFile = async (file?: File) => {
    if (!file || !botId || !isAcceptedFile(file)) return;
    setProgress(0);
    try {
      await upload.mutateAsync({ file, onProgress: setProgress });
    } finally {
      setProgress(0);
    }
  };

  const hasFiles = (event: DragEvent<HTMLElement>) =>
    Array.from(event.dataTransfer.types).includes("Files");

  const handleDragEnter = (event: DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    event.stopPropagation();
    if (!hasFiles(event)) return;
    dragDepthRef.current += 1;
    setIsDragging(true);
  };

  const handleDragOver = (event: DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    event.stopPropagation();
    if (!hasFiles(event)) return;
    event.dataTransfer.dropEffect = botId && !upload.isPending ? "copy" : "none";
    setIsDragging(true);
  };

  const handleDragLeave = (event: DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    event.stopPropagation();
    dragDepthRef.current = Math.max(0, dragDepthRef.current - 1);
    if (dragDepthRef.current === 0) setIsDragging(false);
  };

  const handleDrop = (event: DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    event.stopPropagation();
    dragDepthRef.current = 0;
    setIsDragging(false);

    if (upload.isPending) return;
    void onFile(event.dataTransfer.files?.[0]);
  };

  useEffect(() => {
    const preventFileOpen = (event: globalThis.DragEvent) => {
      if (!event.dataTransfer?.types.includes("Files")) return;
      event.preventDefault();
    };

    window.addEventListener("dragover", preventFileOpen);
    window.addEventListener("drop", preventFileOpen);

    return () => {
      window.removeEventListener("dragover", preventFileOpen);
      window.removeEventListener("drop", preventFileOpen);
    };
  }, []);

  return (
    <DashboardLayout>
      <PageHeader
        eyebrow="Knowledge"
        title="Knowledge Base"
        description="Ingest documents into the real backend pipeline and monitor retrieval readiness."
        actions={
          <div className="flex items-center gap-2">
            <Select value={botId} onValueChange={setSelectedBotId}>
              <SelectTrigger className="w-[220px] bg-secondary">
                <SelectValue
                  placeholder={agents.isLoading ? "Loading agents..." : "Select agent"}
                />
              </SelectTrigger>
              <SelectContent>
                {agents.data?.map((agent) => (
                  <SelectItem key={agent.id} value={agent.id}>
                    {agent.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Button asChild variant="outline" className="border-border bg-secondary">
              <Link to="/agents/new">
                <Plus className="mr-1 h-4 w-4" />
                New agent
              </Link>
            </Button>
            <Button
              asChild
              disabled={!botId}
              className="bg-gradient-to-r from-[color:var(--accent-blue)] to-[color:var(--accent-violet)] text-primary-foreground"
            >
              <label>
                <Upload className="mr-1 h-4 w-4" />
                Upload
                <input
                  hidden
                  type="file"
                  accept={acceptedFileTypes}
                  onChange={(event) => {
                    void onFile(event.target.files?.[0]);
                    event.target.value = "";
                  }}
                />
              </label>
            </Button>
          </div>
        }
      />
      <div className="space-y-6 p-6">
        {agents.isError && (
          <div className="rounded-xl border border-destructive/40 bg-destructive/10 p-4 text-sm text-destructive">
            {getApiErrorMessage(
              agents.error,
              "Agents could not be loaded. Sign in again and retry.",
            )}
          </div>
        )}
        {!agents.isLoading && !agents.isError && !agents.data?.length && (
          <div className="rounded-xl border border-border bg-card p-5 elevated">
            <p className="text-sm font-medium">No agents in this workspace</p>
            <p className="mt-1 text-sm text-muted-foreground">
              Create an agent first, then attach knowledge documents to it.
            </p>
            <Button
              asChild
              className="mt-4 bg-gradient-to-r from-[color:var(--accent-blue)] to-[color:var(--accent-violet)] text-primary-foreground"
            >
              <Link to="/agents/new">
                <Plus className="mr-1 h-4 w-4" />
                Create agent
              </Link>
            </Button>
          </div>
        )}
        <div
          role="button"
          tabIndex={0}
          aria-disabled={!botId || upload.isPending}
          onDragEnter={handleDragEnter}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          className={`rounded-xl border-2 border-dashed p-8 text-center transition ${
            isDragging
              ? "border-primary bg-primary/10 shadow-[0_0_0_1px_color-mix(in_oklab,var(--primary)_35%,transparent)]"
              : "border-border bg-surface-1"
          }`}
        >
          <Upload
            className={`mx-auto h-7 w-7 transition ${
              isDragging ? "text-primary" : "text-muted-foreground"
            }`}
          />
          <p className="mt-3 font-medium">Upload files to Cloudinary storage</p>
          <p className="mt-1 text-xs text-muted-foreground">
            PDF, DOCX, CSV, HTML, TXT - uploaded - queued - embedded - searchable
          </p>
          <p className="mt-3 text-xs text-muted-foreground">
            {isDragging ? "Drop the file here to start upload." : "Drag a file here or use Upload."}
          </p>
          {upload.isPending && <Progress value={progress} className="mx-auto mt-4 max-w-md" />}
        </div>

        <div className="rounded-xl border border-border bg-card p-4 elevated">
          <div className="flex items-center justify-between">
            <p className="text-sm font-medium">Ingestion pipeline</p>
            <OperationalIndicator
              state={stats.processing || stats.pending ? "processing" : "healthy"}
              label={stats.processing || stats.pending ? "indexing active" : "retrieval ready"}
            />
          </div>
          <div className="mt-4 grid grid-cols-2 gap-3 md:grid-cols-3 xl:grid-cols-6">
            {pipelineStages.map((stage, index) => (
              <div key={stage.label} className="rounded-lg border border-border bg-surface-1 p-3">
                <p className="text-[10px] font-mono uppercase tracking-wider text-muted-foreground">
                  Stage {index + 1}
                </p>
                <p className="mt-1 text-sm font-medium">{stage.label}</p>
                <p className="mt-2 text-xs text-muted-foreground">
                  {stage.label === "Uploaded"
                    ? stats.pending
                    : stage.label === "Processing"
                      ? stats.processing
                      : stats.completed}{" "}
                  docs
                </p>
              </div>
            ))}
          </div>
        </div>

        <div className="rounded-xl border border-border bg-card elevated">
          <div className="flex items-center justify-between border-b border-border p-4">
            <p className="text-sm font-medium">Documents</p>
            <div className="relative w-64">
              <Search className="pointer-events-none absolute left-2.5 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input placeholder="Filter..." className="h-8 pl-8 bg-secondary/60" />
            </div>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="text-left text-[11px] uppercase tracking-wider text-muted-foreground">
                <tr className="border-b border-border">
                  <th className="px-4 py-3 font-medium">Name</th>
                  <th className="px-4 py-3 font-medium">Type</th>
                  <th className="px-4 py-3 font-medium">Size</th>
                  <th className="px-4 py-3 font-medium">Chunks</th>
                  <th className="px-4 py-3 font-medium">Vectors</th>
                  <th className="px-4 py-3 font-medium">Status</th>
                  <th className="px-4 py-3 font-medium">Actions</th>
                </tr>
              </thead>
              <tbody>
                {docs.data?.map((doc) => (
                  <DocumentRow
                    key={doc.id}
                    doc={doc}
                    onDelete={() => deleteDocument.mutate(doc.id)}
                  />
                ))}
                {!docs.data?.length && (
                  <tr>
                    <td
                      colSpan={7}
                      className="px-4 py-10 text-center text-sm text-muted-foreground"
                    >
                      {botId
                        ? "No documents returned for this agent."
                        : "Create or select an agent to attach knowledge."}
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}

function DocumentRow({ doc, onDelete }: { doc: KnowledgeDocument; onDelete: () => void }) {
  return (
    <tr className="border-b border-border/60 hover:bg-secondary/40">
      <td className="px-4 py-3">
        <div className="flex items-center gap-2">
          <FileText className="h-4 w-4 text-muted-foreground" />
          <span className="font-mono text-xs">{doc.originalName}</span>
        </div>
      </td>
      <td className="px-4 py-3 text-muted-foreground">{doc.mimeType}</td>
      <td className="px-4 py-3 text-muted-foreground">{formatBytes(doc.size)}</td>
      <td className="px-4 py-3 text-muted-foreground">{doc.chunksCreated}</td>
      <td className="px-4 py-3 text-muted-foreground">{doc.vectorsStored}</td>
      <td className="px-4 py-3">
        <DocStatus status={doc.status} />
      </td>
      <td className="px-4 py-3">
        <div className="flex items-center gap-1">
          {doc.cloudinaryUrl && (
            <a
              href={doc.cloudinaryUrl}
              target="_blank"
              rel="noreferrer"
              className="rounded-md p-1.5 text-muted-foreground hover:bg-secondary hover:text-foreground"
              title="Open Cloudinary file"
            >
              <ExternalLink className="h-4 w-4" />
            </a>
          )}
          <button
            type="button"
            onClick={onDelete}
            className="rounded-md p-1.5 text-muted-foreground hover:bg-destructive/10 hover:text-destructive"
            title="Delete document"
          >
            <Trash2 className="h-4 w-4" />
          </button>
        </div>
      </td>
    </tr>
  );
}

function DocStatus({ status }: { status: KnowledgeDocumentStatus }) {
  const map = {
    embedded: {
      className: "text-emerald-300 bg-emerald-500/10",
      icon: <CheckCircle2 className="h-3 w-3" />,
      label: "Searchable",
    },
    processing: {
      className: "text-amber-300 bg-amber-500/10",
      icon: <Loader2 className="h-3 w-3 animate-spin" />,
      label: "Processing",
    },
    uploaded: {
      className: "text-blue-300 bg-blue-500/10",
      icon: <Database className="h-3 w-3" />,
      label: "Uploaded",
    },
    failed: {
      className: "text-destructive bg-destructive/10",
      icon: <Upload className="h-3 w-3" />,
      label: "Failed",
    },
  }[status];

  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full px-2 py-0.5 text-[11px] ${map.className}`}
    >
      {map.icon} {map.label}
    </span>
  );
}

function formatBytes(size: number) {
  if (size < 1024) return `${size} B`;
  if (size < 1024 * 1024) return `${(size / 1024).toFixed(1)} KB`;
  return `${(size / 1024 / 1024).toFixed(1)} MB`;
}
