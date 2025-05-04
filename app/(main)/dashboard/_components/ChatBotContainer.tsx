
import * as React from "react"
import { Send } from "lucide-react"
import { cn } from "@/lib/utils"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { useEffect } from "react"
import { Textarea } from "@/components/ui/textarea"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from "@/components/ui/card"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { useSocket } from "@/context/SocketContext"
import { useForm } from "react-hook-form"
import Loader from "@/components/Loader"
import { useUser } from "@clerk/nextjs";
import Lottie from 'react-lottie';
import * as animationData from '../../../../lottie/emptyChat.json'
import { toast } from "sonner"
type VisibityDispatcherProps = {
  setVisible: React.Dispatch<React.SetStateAction<boolean>>,
  visible: boolean
}


export function ChatBotResetChatDialog() {
  return (
    <Dialog>
      <DialogTrigger>
        <Button
          size={'sm'} className="cursor-pointer " variant={'destructive'} >
          Reset
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Are you absolutely sure?</DialogTitle>
          <DialogDescription>
            This action cannot be undone. This will permanently delete your account
            and remove your data from our servers.
          </DialogDescription>
        </DialogHeader>
      </DialogContent>
    </Dialog>

  )
}


export function ChatBotContainer(VisibityDispatcherProps: VisibityDispatcherProps) {
  const { user } = useUser();
  const { isConnected, hasStreamingMessageRef, messages, sendMessage, streaming ,error} = useSocket();
  let chatContainer = React.useRef<HTMLDivElement | null>(null)
  const { watch, register, handleSubmit, reset, getValues, formState: { errors } } = useForm({
    defaultValues: {
      message: ''
    }
  })




  const messageWatch = watch('message')
  function onSubmit() {
    const msg = getValues("message").trim();
    if (!msg) return;
    sendMessage(msg)
    reset();
  }

  useEffect(()=>{
    if(error?.length){
      toast.error(error)
    }
  },[error])

  useEffect(() => {
    if (chatContainer.current) {
      chatContainer.current.scrollTop = chatContainer.current.scrollHeight;
    }
  }, [messages])

  function handlFormatMessage(message: any) {
    if(!message.content) return null;

    const content = message.content.replace(/\\n/g, "\n");
    return content.split("\n").map((line:string, lineIndex:number) => {
      const formattedLine = line.replace(/\*\*(.*?)\*\*/g, '<strong>$1 </strong> ');
      
      return (
        <div
          key={lineIndex}
          className={cn("flex items-center space-x-2")}
        >
          <span dangerouslySetInnerHTML={{ __html: formattedLine }} />
        </div>
      );
    });
  }
  const defaultOptions = {
    loop: true,
    autoplay: true, 
    animationData: animationData,
    rendererSettings: {
      preserveAspectRatio: 'xMidYMid slice',
    
    }
  };

  // React.useLayoutEffect(()=>{
  //     let messagesArray = [...messages]
  //     if(messages.length > 0 && messages){
  //       const groupByDate = Object.groupBy(messagesArray,(message)=>{
  //         const date = new Date(message.createdAt!)
  //         return format(date, 'MMMM dd, yyyy')
  //       })
  //       const formattedMessage = Object.entries(groupByDate).map(([date, messages])=>{
  //         return {
  //           date,
  //           messages
  //         }
  //       }).sort((a,b)=>{
  //         return new Date(a.date).getTime() - new Date(b.date).getTime()
  //       })
  //       if(formattedMessage.length > 0 && formattedMessage){
  //        setMessages(formattedMessage as any[])
  //       }
  //     }else{
  //       setMessages([])
  //     }


  //   },[])
  return (
    <>
      <Card className="max-w-sm w-full fixed bottom-16 right-5 z-[20]" vocab="english">
        <CardHeader className="flex flex-row items-center justify-between">
          {
            user && user.firstName && user.lastName && (
              <div className="flex items-center space-x-4">
                <Avatar>
                  <AvatarImage src={user.imageUrl} alt="Image" />
                  <AvatarFallback>{user.firstName[0].toUpperCase() + user?.lastName[0].toUpperCase()}</AvatarFallback>
                </Avatar>
                <div>
                  <p className="text-sm font-medium leading-none">{user.fullName}</p>
                  <p className="text-sm text-muted-foreground">{user.primaryEmailAddress?.emailAddress}</p>
                </div>
              </div>
            )
          }
          {/*  For Reset the chat dialog box */}
          {/* <ChatBotResetChatDialog /> */}
        </CardHeader>
        <CardContent className="h-[50vh] overflow-y-auto " ref={chatContainer}>

  {messages.length >0 ? 
<div className="space-y-4">
{messages.map((message, index) => {
    const isStreamingMessage = message.role === "assistant" && streaming && index === messages.length - 1;
    const shouldDisplay = message.content || isStreamingMessage;  
    if (!shouldDisplay) return null;
    return (
      <div
        key={index}
        className={cn(
          "flex w-max max-w-[90%] flex-col gap-2 rounded-lg px-3 py-2 text-sm",
          message.role === "user"
            ? "ml-auto bg-primary text-primary-foreground"
            : "bg-muted"
        )}
      >
        {message.role === "assistant" && isStreamingMessage && (!hasStreamingMessageRef.current || message.functionCall) ? (
          <Loader />
        ) : (
          handlFormatMessage(message)
        )}
      </div>
    );
  })}
</div>
: <div className="flex flex-col items-center justify-center h-full w-full">
<Lottie
speed={0.8}
options={defaultOptions}/> 


</div> 
}
          
        </CardContent>
        <CardFooter>
          <div className="flex w-full items-center space-x-2">
            {/* <Input
              autoComplete="off"
              spellCheck="true"
              onKeyUp={(e) => {
                if (e.key.toLowerCase() === 'enter' && !e.shiftKey) {
                  handleSubmit(onSubmit)()
                }
              }}
              id="message" {...register('message', {
                required: true,
                minLength: {
                  value: 2,
                  message: 'Message must be at least 2 character long',
                }
              })} placeholder="Type your message..." className="flex-1" /> */}
              <Textarea 
               autoComplete="off"
               disabled={streaming}
               spellCheck
               onKeyUp={(e) => {
                 if ((e.key.toLowerCase() === 'enter' && !e.shiftKey)) {
                   handleSubmit(onSubmit)()
                 }
                
               }}
               id="message" {...register('message', {
                 required: true,
                 minLength: {
                   value: 2,
                   message: 'Message must be at least 2 character long',
                 }
                })} className="max-h-8 resize-none overflow-y-auto flex-1" placeholder={
                  !messages.length ? "Kickstart your first chat!": 'Type your message...'
                }   
              />

            <Button
              disabled={!messageWatch && isConnected || streaming ||  !!errors.message || getValues('message').trim().length < 2} size="icon" onClick={handleSubmit(onSubmit)}>
              <Send className="h-4 w-4" />
              <span className="sr-only">Send</span>
            </Button>
          </div>
        </CardFooter>
        {/* {errors.message && (
                <p className="text-sm text-red-500">
                  {errors.message.message}
                </p>
              )} */}
      </Card>
    </>
  )
}
