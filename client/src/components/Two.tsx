import { useEffect } from 'react'

export default function Two() {
    useEffect(() => {
        console.log('two mounted')
        
        return () => {
            console.log('two unmounted')
        }
    }, [])
  return (
    <div>
    page Two
  </div>
  )
}
