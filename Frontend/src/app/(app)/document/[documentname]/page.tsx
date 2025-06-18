'use client';
import React, { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { AxiosError } from 'axios';
import api from '@/lib/api';
import { toast } from 'sonner';
import {
  Card, CardHeader, CardTitle, CardContent,
} from '@/components/ui/card';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';

import { FileDown } from 'lucide-react';
import { useUser } from '@/context/UserContext';
import Delete from '@/components/Delete';

interface ErrorResponse {
  message: string;
}
interface Document {
  id: string;
  filename: string;
  ClouinaryUrl: string;
  createdAt: Date;
  fileType: string;
  public_id_fromCloudinary: string;
  isSaved: boolean;
  savedAt: Date;
  expiresAt: Date;
  fileHash: string;
  isGuest: boolean;
  _id: string;
}
interface TopMatch {
  label: string;
  similarity: number;
}

interface KeyClause {
  chunk_index: number;
  chunk_preview: string;
  top_matches: TopMatch[];
}

interface RiskTerm {
  category: string;
  term: string;
}

function Page() {
  const router = useRouter();
  const { documentname } = useParams();
  const { user, loading } = useUser();

  const [document, setDocument] = useState<Document | null>(null);
  const [summary, setSummary] = useState('');
  const [shortSummary, setShortSummary] = useState('');
  const [keyClauses, setKeyClauses] = useState<KeyClause[]>([]);
  const [riskTerms, setRiskTerms] = useState<RiskTerm[]>([]);
  const [activeTab, setActiveTab] = useState('Summary');
  const [isSaved, setIsSaved] = useState(false);
  const [disableSave, setDisableSave] = useState(false);

  useEffect(() => {
    if (!loading && !user) {
      router.push('/login');
    }
  }, [user, loading, router]);
  useEffect(() => {
    const fetchDocAndAnalysis = async () => {
      try {
        const docRes = await api.get(`${process.env.NEXT_PUBLIC_Backend_Url}/document/get-documents/${documentname}`);
        const fetchedDoc = docRes.data.data[0];
        setDocument(fetchedDoc);
        const analysisRes = await api.post(`${process.env.NEXT_PUBLIC_Backend_Url}/analyze/get-analyzed-document/${documentname}`);
        const { summary, risky_terms, key_clauses } = analysisRes.data.data;

        setSummary(summary.actual_summary);
        setShortSummary(summary.short_summary);
        setRiskTerms(risky_terms[0]?.risks || []);
        setKeyClauses(key_clauses);
      } catch (error) {
        const axiosError = error as AxiosError<ErrorResponse>;
        const msg = axiosError.response?.data.message || "Failed to load document";
        toast.error(msg);
      }
    };

    if (documentname) {
      fetchDocAndAnalysis();
    }
  }, [documentname]);

  const handleSaveSubmit = async () => {
    try {
      const res = await api.post(`${process.env.NEXT_PUBLIC_Backend_Url}/user/${documentname}/save-document`, {});
      toast.success(res.data.data);
      setIsSaved(true);
      setDisableSave(true);
    } catch (error) {
      const axiosError = error as AxiosError<ErrorResponse>;
      if (axiosError.response?.status === 400) {
        toast.error("Guest is not allowed to save document");
      } else {
        toast.error(axiosError.response?.data.message || "Save failed");
      }
    }
  };

  const handleDeleteSubmit = async () => {
    try {
      const res = await api.delete(`${process.env.NEXT_PUBLIC_Backend_Url}/document/get-documents/${documentname}`);
      if (res.data.data.result === "ok") {
        toast.success(res.data.message);
        router.push(`/dashboard/${user?.username}`);
      }
    } catch (error) {
      const axiosError = error as AxiosError<ErrorResponse>;
      toast.error(axiosError.response?.data.message || "Delete failed");
    }
  };

  return (
    <main className='min-h-screen p-4'>
      <div className='flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4'>
        <h1 className='text-3xl font-bold'>
          Viewing: {document ? `${document.filename}.${document.fileType}` : "Loading..."}
        </h1>
        <div className="flex flex-wrap gap-2 sm:mt-8">
          <Button 
          className='cursor-pointer'
          onClick={handleSaveSubmit} disabled={disableSave}>
            {isSaved ? "Document Saved" : "Save Document"} <FileDown className="ml-2" />
          </Button>
          <Delete onConfirm={handleDeleteSubmit} />
        </div>
      </div>

      <div className='grid grid-cols-12 gap-4 mt-6'>
        <div className='col-span-12 sm:col-span-3'>
          <Card className="h-full">
            <CardHeader>
              <CardTitle>{document?.filename ?? "Untitled"}</CardTitle>
            </CardHeader>
            <CardContent>
              <p>Status: Analyzed</p>
              <p>Created: {document?.createdAt ? new Date(document.createdAt).toLocaleDateString() : "Unknown"}</p>
            </CardContent>
          </Card>
        </div>
        <div className='col-span-12 sm:col-span-9'>
          <Card>
            <CardContent>
              <Tabs value={activeTab} onValueChange={setActiveTab}>
                <TabsList className=" mb-4">
                  <TabsTrigger value="Summary"className='cursor-pointer'>Summary</TabsTrigger>
                  <TabsTrigger value="Key clause"className='cursor-pointer'>Key Clauses</TabsTrigger>
                  <TabsTrigger value="Risk flag"className='cursor-pointer'>Risk Flags</TabsTrigger>
                  <TabsTrigger value="chat"className='cursor-pointer'>Chat</TabsTrigger>
                </TabsList>
                <TabsContent value="Summary">
                  <div className="space-y-4">
                    <div className="p-4 border rounded">
                      <h2 className="font-semibold">Short Summary</h2>
                      <p>{shortSummary || "No short summary available."}</p>
                    </div>
                    <div className="p-4 border rounded">
                      <h2 className="font-semibold">Detailed Summary</h2>
                      <p className="whitespace-pre-line">{summary || "No detailed summary available."}</p>
                    </div>
                  </div>
                </TabsContent>
                <TabsContent value="Key clause">
                  {keyClauses.length > 0 ? keyClauses.map((clause, idx) => (
                    <div key={idx} className="p-4 border rounded mb-2">
                      <p><strong>Preview:</strong> {clause.chunk_preview}</p>
                      {clause.top_matches.length > 0 && (
                        <ul className="ml-4 mt-2 space-y-1">
                          {clause.top_matches.map((match, i) => (
                            <li key={i} className="text-sm border p-2 rounded">
                              <p><strong>Clause:</strong> {match.label}</p>
                              <p><strong>Similarity:</strong> {(match.similarity * 100).toFixed(2)}%</p>
                            </li>
                          ))}
                        </ul>
                      )}
                    </div>
                  )) : (
                    <p>No key clauses identified.</p>
                  )}
                </TabsContent>
                <TabsContent value="Risk flag">
                  <div className="space-y-3">
                    <h2 className='font-bold'>Detected Risks: {riskTerms.length}</h2>
                    {riskTerms.map((risk, idx) => (
                      <div key={idx} className="border p-3 rounded shadow-sm">
                        <p><strong>Category:</strong> {risk.category}</p>
                        <p><strong>Term:</strong> {risk.term}</p>
                      </div>
                    ))}
                  </div>
                </TabsContent>
                <TabsContent value="chat" >
                  <p className="text-muted-foreground">Chat UI coming soon…</p>
                </TabsContent>
              </Tabs>
            </CardContent>
          </Card>
        </div>
      </div>
    </main>
  );
}

export default Page;
