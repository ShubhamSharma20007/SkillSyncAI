"use client";
import { QuizResultInterface } from '@/interface/QuizInterface'
import { useState } from "react";
import { format } from "date-fns";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import QuizResult from './QuizResult';

interface QuizListProps {
  assessments: QuizResultInterface[]
}

const QuizList:React.FC<QuizListProps> =({assessments}) => {
  const router = useRouter();
  const [selectedQuiz, setSelectedQuiz] = useState(null);
  const [isOpen,setIsOpen] = useState(false);
  return (
    <>
     <Card className='bg-background'>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="gradient-title text-3xl md:text-4xl">
                Recent Quizzes
              </CardTitle>
              <CardDescription>
                Review your past quiz performance
              </CardDescription>
            </div>
            <Button onClick={() => router.push("/interview/mock")}>
              Start New Quiz
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {assessments?.map((assessment:any, i) => (
              <Card
                key={i}
                className="cursor-pointer hover:bg-muted/50 transition-colors"
                onClick={() =>{
                  setSelectedQuiz(assessment)
                  setIsOpen(true)
                }}
              >
                <CardHeader>
                  <CardTitle className="gradient-title text-2xl">
                    Quiz {i + 1}
                  </CardTitle>
                  <CardDescription className="flex justify-between w-full">
                    <div>Score: {assessment.quizScore && assessment.quizScore.toFixed(1)}%</div>
                    <div>
                      {format(
                        new Date(assessment.createdAt),
                        "MMMM dd, yyyy HH:mm"
                      )}
                    </div>
                  </CardDescription>
                </CardHeader>
                {assessment.improvementTip && (
                  <CardContent>
                    <p className="text-sm text-muted-foreground">
                      {assessment.improvementTip}
                    </p>
                  </CardContent>
                )}
              </Card>
            ))}
          </div>
        </CardContent>
      </Card>

      <Dialog open={isOpen} onOpenChange={() => setIsOpen(false)}>
        <DialogContent className="max-w-2xl  max-h-[94vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle></DialogTitle>
          </DialogHeader>
          <QuizResult
            result={selectedQuiz}
            onStartNew={() => router.push("/interview/mock")}
          />
        </DialogContent>
      </Dialog>
    </>

  )
}

export default QuizList