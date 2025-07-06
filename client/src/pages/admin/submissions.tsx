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
import { submissionsService } from "@/lib/submissions";

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
      const result = await submissionsService.getSubmissions();
      if (result.data) {
        setSubmissions(result.data);
      } else {
        throw new Error(result.error);
      }
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

  const handleApprove = async (id: number) => {
    try {
      const result = await submissionsService.updateSubmissionStatus(id, "approved");
      if (result.success) {
        // Convert approved submission to listing
        const submission = submissions.find(s => s.id === id);
        if (submission) {
          await submissionsService.convertToListing(submission);
        }
        
        toast({
          title: "Success",
          description: "Submission approved and converted to listing",
        });
        fetchSubmissions();
      } else {
        throw new Error(result.error);
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to approve submission",
        variant: "destructive",
      });
    }
  };

  const handleReject = async (id: number) => {
    try {
      const result = await submissionsService.updateSubmissionStatus(id, "rejected");
      if (result.success) {
        toast({
          title: "Success",
          description: "Submission rejected successfully",
        });
        fetchSubmissions();
      } else {
        throw new Error(result.error);
      }
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
                              <TableHead>Approved</TableHead>
                <TableHead>Status</TableHead>
              <TableHead>Submitted</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {submissions.map((submission) => (
              <TableRow key={submission.id}>
                <TableCell className="font-medium">{submission.name}</TableCell>
                <TableCell>
                  <a href={submission.website} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">
                    {submission.website}
                  </a>
                </TableCell>
                <TableCell>{submission.email}</TableCell>
                <TableCell>{submission.description}</TableCell>
                <TableCell>
                  <Badge variant={submission.approved ? "default" : "secondary"}>
                    {submission.approved ? "Yes" : "No"}
                  </Badge>
                </TableCell>
                <TableCell>
                  <Badge variant={
                    submission.status === "approved" ? "default" :
                    submission.status === "rejected" ? "destructive" :
                    "secondary"
                  }>
                    {submission.status}
                  </Badge>
                </TableCell>
                <TableCell>
                  {format(new Date(submission.created_at), "MMM d, yyyy")}
                </TableCell>
                <TableCell>
                  {!submission.approved && submission.status === "pending" && (
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
                  {submission.approved && (
                    <Badge variant="default" className="text-xs">
                      Auto-approved
                    </Badge>
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