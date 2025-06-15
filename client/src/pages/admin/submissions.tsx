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

  // Approve/Reject handlers would go here (if needed)

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
                        ) : (
                          submission[field] ?? ""
                        )}
                  </TableCell>
                ))}
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
} 