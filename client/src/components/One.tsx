import { useEffect } from 'react'

export default function One() {
    useEffect(() => {
        console.log('one mounted')
        return () => {
            console.log('one unmounted')
        }
    }, [])
  return (
    <div>
      page one
    </div>
  )
}
