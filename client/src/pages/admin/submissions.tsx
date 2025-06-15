import { useState, useEffect } from "react";
import { useToast } from "../../components/ui/use-toast";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { format } from "date-fns";
import { apiRequest } from "@/lib/queryClient";

const FIELD_ORDER = [
  "Brand Name",
  "Direct Booking Website",
  "Number of Listings",
  "Countries",
  "Cities / Regions",
  "Logo Upload",
  "Highlight Image",
  "One-line Description",
  "Why Book With You?",
  "Types of Stays",
  "Ideal For",
  "Perks / Amenities",
  "Vibe / Aesthetic",
  "Instagram",
  "Facebook",
  "LinkedIn",
  "TikTok",
  "YouTube / Video Tour",
  "Choose Your Listing Type",
  "Submitted By (Email)",
  "Status",
  "createdTime"
];

export default function AdminSubmissions() {
  const { toast } = useToast();
  const [submissions, setSubmissions] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchSubmissions();
  }, []);

  const fetchSubmissions = async () => {
    try {
      const response = await fetch("/api/submissions");
      const data = await response.json();
      setSubmissions(data);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to fetch submissions",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleApprove = async (id: string) => {
    try {
      await apiRequest("PATCH", "/api/submissions", { id, status: "approved" });
      toast({
        title: "Success",
        description: "Submission approved successfully",
      });
      fetchSubmissions();
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to approve submission",
        variant: "destructive",
      });
    }
  };

  const handleReject = async (id: string) => {
    try {
      await apiRequest("PATCH", "/api/submissions", { id, status: "rejected" });
      toast({
        title: "Success",
        description: "Submission rejected successfully",
      });
      fetchSubmissions();
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to reject submission",
        variant: "destructive",
      });
    }
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  if (!submissions.length) {
    return <div className="container mx-auto py-10">No submissions found.</div>;
  }

  // Get all unique fields from all submissions
  const allFields = Array.from(
    new Set(submissions.flatMap((s) => Object.keys(s)))
  );
  // Order fields as in FIELD_ORDER, then any extras
  const columns = [
    ...FIELD_ORDER.filter((f) => allFields.includes(f)),
    ...allFields.filter((f) => !FIELD_ORDER.includes(f)),
  ];

  return (
    <div className="container mx-auto py-10" style={{ overflowX: "auto" }}>
      <h1 className="text-2xl font-bold mb-6">Airtable-like Submissions Dashboard</h1>
      <div className="rounded-md border overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow>
              {columns.map((field) => (
                <TableHead key={field}>{field}</TableHead>
              ))}
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {submissions.map((submission) => (
              <TableRow key={submission.id}>
                {columns.map((field) => (
                  <TableCell key={field}>
                    {Array.isArray(submission[field])
                      ? submission[field].map((item: any, i: number) =>
                          typeof item === "object" && item.url ? (
                            <a key={i} href={item.url} target="_blank" rel="noopener noreferrer">{item.url}</a>
                          ) : typeof item === "object" && item.name ? (
                            item.name
                          ) : (
                            item
                          )
                        ).join(", ")
                      : typeof submission[field] === "object" && submission[field]?.url ? (
                          <a href={submission[field].url} target="_blank" rel="noopener noreferrer">{submission[field].url}</a>
                        ) : field === "createdTime" && submission[field] ? (
                          format(new Date(submission[field]), "MMM d, yyyy")
                        ) : field === "Status" ? (
                          <Badge variant={
                            submission[field] === "approved" ? "default" :
                            submission[field] === "rejected" ? "destructive" :
                            "secondary"
                          }>
                            {submission[field]}
                          </Badge>
                        ) : (
                          submission[field] ?? ""
                        )}
                  </TableCell>
                ))}
                <TableCell>
                  {submission.Status === "pending" && (
                    <div className="space-x-2">
                      <Button
                        variant="default"
                        size="sm"
                        onClick={() => handleApprove(submission.id)}
                      >
                        Approve
                      </Button>
                      <Button
                        variant="destructive"
                        size="sm"
                        onClick={() => handleReject(submission.id)}
                      >
                        Reject
                      </Button>
                    </div>
                  )}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
} 