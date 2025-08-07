import { marked } from 'marked'
import parse from "html-react-parser"

export default function MDParse(props: { content: string }) {
  const htmlContent = marked.parse(props.content)
  return (
    <div className='border-l pl-3 bg-slate-50 dark:bg-slate-600 my-2 max-h-[300px] h-fit overflow-y-scroll'>
      {typeof htmlContent === "string" ? parse(htmlContent) : <></>}
    </div>
  )
}