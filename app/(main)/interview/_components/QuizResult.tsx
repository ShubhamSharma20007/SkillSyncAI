import { Button } from '@/components/ui/button'
import { CardContent, CardFooter } from '@/components/ui/card'
import { QuestionInterface } from '@/interface/questionInterface'
import { QuizResultInterface } from '@/interface/QuizInterface'
import { Progress } from '@radix-ui/react-progress'
import { CheckCircle2, Trophy, XCircle } from 'lucide-react'
import React from 'react'

export default function QuizResult({ result, onStartNew }: { result: any, onStartNew: () => void }) {

  return (
    <div className="mx-auto">
      <h1 className="flex items-center gap-2 text-3xl gradient-title">
        <Trophy className="h-6 w-6 text-yellow-500" />
        Quiz Results
      </h1>

      <CardContent className="space-y-6">
        {/* Score Overview */}
        <div className="text-center space-y-2">
          <h3 className="text-2xl font-bold">{result.quizScore.toFixed(1)}%</h3>
          <Progress value={Number(result.quizScore)} className="w-full" />
        </div>

        {/* Improvement Tip */}
        {result.improvementTip && (
          <div className="bg-muted p-4 rounded-lg">
            <p className="font-medium">Improvement Tip:</p>
            <p className="text-muted-foreground">{result.improvementTip}</p>
          </div>
        )}

        {/* Questions Review */}
        <div className="space-y-4">
          <h3 className="font-medium">Question Review</h3>
          {result.questions.map((q: any, index: number) => (
            <div key={index} className="border rounded-lg p-4 space-y-2">
              <div className="flex items-start justify-between gap-2">
                <p className="font-medium">{q.question}</p>
                {q.isCorrect ? (
                  <CheckCircle2 className="h-5 w-5 text-green-500 flex-shrink-0" />
                ) : (
                  <XCircle className="h-5 w-5 text-red-500 flex-shrink-0" />
                )}
              </div>
              <div className="text-sm text-muted-foreground">
                <p>Your answer: {q.userAnswer}</p>
                {!q.isCorrect && <p>Correct answer: {q.answer}</p>}
              </div>
              <div className="text-sm bg-muted p-2 rounded">
                <p className="font-medium">Explanation:</p>
                <p>{q.questionExplanation}</p>
              </div>
            </div>
          ))}
        </div>
      </CardContent>


      <CardFooter className='mt-5'>
        <Button onClick={onStartNew} className="w-full cursor-pointer">
          Start New Quiz
        </Button>
      </CardFooter>

    </div>
  )
}
