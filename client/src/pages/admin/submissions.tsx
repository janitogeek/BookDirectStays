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

  return (
    <div className="container mx-auto py-10" style={{ overflowX: "auto" }}>
      <h1 className="text-2xl font-bold mb-6">Property Submissions</h1>
      <div className="rounded-md border overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Brand Name</TableHead>
              <TableHead>Website</TableHead>
              <TableHead>Email</TableHead>
              <TableHead>Description</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Submitted</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {submissions.map((submission) => (
              <TableRow key={submission.id}>
                <TableCell className="font-medium">{submission["Brand Name"]}</TableCell>
                <TableCell>
                  <a href={submission["Direct Booking Website"]} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">
                    {submission["Direct Booking Website"]}
                  </a>
                </TableCell>
                <TableCell>{submission["Submitted By (Email)"]}</TableCell>
                <TableCell>{submission["One-line Description"]}</TableCell>
                <TableCell>
                  <Badge variant={
                    submission.Status === "approved" ? "default" :
                    submission.Status === "rejected" ? "destructive" :
                    "secondary"
                  }>
                    {submission.Status}
                  </Badge>
                </TableCell>
                <TableCell>
                  {format(new Date(submission.createdTime), "MMM d, yyyy")}
                </TableCell>
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