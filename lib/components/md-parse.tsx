import { marked } from 'marked'
import parse from "html-react-parser"

export default function MDParse(props: { content: string }) {
  const htmlContent = marked.parse(props.content)
  return (
    <div className='border-l px-3 bg-slate-50 dark:bg-slate-600 my-2 max-h-[700px] h-fit overflow-y-scroll text-justify indent-4'>
      {typeof htmlContent === "string" ? parse(htmlContent) : <></>}
    </div>
  )
}