import { useEffect, useState } from 'react'
import axios from 'axios'
import { USER_API_END_POINT } from '@/utils/constant'

const useGetAppliedJobs = () => {
  const [appliedJobs, setAppliedJobs] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchAppliedJobs = async () => {
      try {
        const res = await axios.get(`${USER_API_END_POINT}/application/get`, {
          withCredentials: true // ✅ required to send cookies
        })
        setAppliedJobs(res.data.appliedJobs)
      } catch (error) {
        console.error(error)
      } finally {
        setLoading(false)
      }
    }

    fetchAppliedJobs()
  }, [])

  return { appliedJobs, loading }
}

export default useGetAppliedJobs
