"use client";

import { useRouter } from "next/navigation";
import { format } from "date-fns";
import { Eye, Trash2 } from "lucide-react";
import { toast } from "sonner";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { deleteCoverLetter } from "@/services/cover-letter";
import { useEffect } from "react";

export default function CoverLetterList({ coverLetters }:{coverLetters:any[]}) {
  const router = useRouter();

  const handleDelete = async (id:string) => {
    try {
      await deleteCoverLetter(id);
      toast.success("Cover letter deleted successfully!");
      router.refresh();
    } catch (error:any) {
      toast.error(error.message || "Failed to delete cover letter");
    }
  };

  if (!coverLetters?.length) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>No Cover Letters Yet</CardTitle>
          <CardDescription>
            Create your first cover letter to get started
          </CardDescription>
        </CardHeader>
      </Card>
    );
  }
  useEffect(()=>{
    router.refresh()
  },[])
  
  return (
    <div className="space-y-4">
      {coverLetters.map((letter) => (
        <Card key={letter._id} className="group relative ">
          <CardHeader>
            <div className="flex items-start justify-between">
              <div>
                <CardTitle className="text-xl gradient-title capitalize">
                  {letter.jobTitle} at {letter.companyName}
                </CardTitle>
                <CardDescription>
                  Created {format(new Date(letter.createdAt), "PPP")}
                </CardDescription>
              </div>
              <div className="flex space-x-2">
                <AlertDialog>
                  <Button
                  className="cursor-pointer"
                    variant="outline"
                    size="icon"
                    onClick={() => router.push(`/ai-cover-letter/${letter._id}`)}
                  >
                    <Eye className="h-4 w-4" />
                  </Button>
                  <AlertDialogTrigger asChild>
                    <Button variant="destructive" size="icon"  className="cursor-pointer">
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </AlertDialogTrigger>
                  <AlertDialogContent>
                    <AlertDialogHeader>
                      <AlertDialogTitle>Delete Cover Letter?</AlertDialogTitle>
                      <AlertDialogDescription>
                        This action cannot be undone. This will permanently
                        delete your cover letter for {letter.jobTitle} at{" "}
                        {letter.companyName}.
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                      <AlertDialogCancel>Cancel</AlertDialogCancel>
                      <AlertDialogAction
                        onClick={() => handleDelete(letter._id)}
                        className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                      >
                        Delete
                      </AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-muted-foreground text-sm line-clamp-3">
              {letter.jobDescription}
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}