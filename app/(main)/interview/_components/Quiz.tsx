"use client"
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { useFetch } from '@/hooks/user-fetch'
import saveQuizResult, { generateQuiz } from '@/services/interview'
import React, { useEffect } from 'react'
import { BarLoader } from 'react-spinners'
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { toast } from 'sonner'
import QuizResult from './QuizResult'
import { Loader2 } from 'lucide-react'

export default function Quiz() {
  const [currentQuestion, setCurrentQuestion] = React.useState(0)
  const [answers, setAnswers] = React.useState<string[]>([])
  const [correctAnser,setCorrectAnswer] = React.useState<string[]>([])
  const [showExplaination, setShowExplanation] = React.useState(false)
  const { loading: isGenerateQuiz,
    data: quizData,
    fn: generateQuizFn, } = useFetch(generateQuiz)

    console.log(answers)

  const { loading: savingQuizResult,
    setData:setResultData,
    data: resultData,
    fn: saveQuizFun, } = useFetch(saveQuizResult)

  useEffect(() => {
    if (quizData && quizData.length) {
      setAnswers(Array(quizData.length).fill(null))
    }
    
  }, [quizData]);

  

  const handleAnswer = (answer: string) => {
    const newAnswers = [...answers]
    newAnswers[currentQuestion] = answer
    setAnswers(newAnswers)
  }

  const calculateScore = () => {
    let correct = 0;
    answers.forEach((answer, index) => {
      if (answer === quizData[index].correctAnswer) {
        correct++;
      }
    });
    return (correct/quizData.length) * 100
  };


  const finishQuiz = async () => {
    let score = calculateScore()
    try {
      await saveQuizFun(quizData, answers, score)
      toast.success('Quiz Completed!')
    } catch (error: any) {
      toast.error(error.message || error)
      console.log('Error during the save quiz record :', error)
    }
  }


  const handleNext = () => {
    if (currentQuestion < quizData.length - 1) {
      setCurrentQuestion(currentQuestion + 1)
      setShowExplanation(false)
    } else {
      finishQuiz()
    }
  }

  const startNewQuiz =()=>{
    setCurrentQuestion(0)
    setAnswers(Array(quizData.length).fill(null))
    setShowExplanation(false)
    generateQuizFn()
    setResultData(null)
  }

  if (resultData) {
    return (
      <div className="mx-2">
        <QuizResult result={resultData}  onStartNew={startNewQuiz} />
      </div>
    );
  }

  if (isGenerateQuiz) {
    return <BarLoader className="mt-4" width={"100%"} color="gray" />;
  }



  if (!quizData || !Array.isArray(quizData) || quizData.length === 0) {
    return (
      <Card className="mx-2">
        <CardHeader>
          <CardTitle>Ready to test your knowledge?</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">
            This quiz contains 10 questions specific to your industry and
            skills. Take your time and choose the best answer for each question.
          </p>
        </CardContent>
        <CardFooter>
          <Button onClick={generateQuizFn} className="w-full">
            Start Quiz
          </Button>
        </CardFooter>
      </Card>
    );
  }



  const question = quizData[currentQuestion] || {
    question: "Question not available",
    options: [],
    explanation: ""
  };


  return (
    <div>
      <Card className="mx-2 w-full">
        <CardHeader>
          <CardTitle>
            Question {currentQuestion + 1} of {quizData.length}
          </CardTitle>
        </CardHeader>
        <CardContent className='space-y-4'>
          <p className="text-lg font-medium">
            {question.question}
          </p>

          <RadioGroup
            className='space-y-2'
            onValueChange={handleAnswer}
            value={answers[currentQuestion]}
          >
            {
              question.options.map((option: string, index: number) => <div key={index} className="flex items-center space-x-2">
                <RadioGroupItem value={option} id={`id-${option}`} />
                <Label htmlFor={`id-${option}`}>{option}</Label>
              </div>
              )
            }
          </RadioGroup>

          {
            showExplaination && (
              <div className='mt-4 bg-muted rounded-lg p-4'>
                <p className='font-medium'>Explanation :</p>
                <p className='text-muted-foreground'>{question.explanation}</p>
              </div>
            )
          }

        </CardContent>
        <CardFooter className='flex items-center justify-between'>
          {!showExplaination && (
            <Button
            className='cursor-pointer'
              variant={'secondary'}
              disabled={!answers[currentQuestion]}
              onClick={() => {
                setShowExplanation(true)

              }} >
              Show Explanation
            </Button>
          )}

          <Button

            variant={'default'}
          className='cursor-pointer relative z-10'
            disabled={!answers[currentQuestion] || savingQuizResult}
            onClick={handleNext} >
      {savingQuizResult ? (
           <>
            <Loader2 className="w-4 h-4"  color="gray" />
            Finishing...
           </>
          ) :
          currentQuestion < quizData.length - 1 ? 'Next Question' : 'Finish'
          }
          </Button>
        </CardFooter>
      </Card>
    </div>
  )
}
