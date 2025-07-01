import React, { useState } from 'react'
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from './ui/dialog'
import { Input } from './ui/input'
import { Label } from './ui/label'
import { Button } from './ui/button'
import { Loader2 } from 'lucide-react'
import { useDispatch, useSelector } from 'react-redux'
import axios from 'axios'
import { USER_API_END_POINT } from '@/utils/constant'
import { setUser } from '@/redux/authSlice'
import { toast } from 'sonner'

const UpdateProfileDialog = ({ open, setOpen }) => {
  const [loading, setLoading] = useState(false)
  const dispatch = useDispatch()
  const { user } = useSelector((store) => store.auth)

  const [input, setInput] = useState({
    fullname: user?.fullname || '',
    email: user?.email || '',
    phoneNumber: user?.phoneNumber || '',
    bio: user?.profile?.bio || '',
    skills: Array.isArray(user?.profile?.skills) ? user.profile.skills : [],
    file: user?.profile?.resume || null,
  })

  const changeEventHandler = (e) => {
    const { name, value } = e.target
    if (name === 'skills') {
      setInput({
        ...input,
        skills: value.split(',').map((skill) => skill.trim()),
      })
    } else {
      setInput({ ...input, [name]: value })
    }
  }

  const fileChangeHandler = (e) => {
    const file = e.target.files?.[0]
    setInput({ ...input, file })
  }

  const onSubmitHandler = async (e) => {
  e.preventDefault()
  setLoading(true)

  const formData = new FormData()
  formData.append('fullname', input.fullname)
  formData.append('email', input.email)
  formData.append('phoneNumber', input.phoneNumber)
  formData.append('bio', input.bio)
  formData.append('skills', input.skills.join(',')) // ✅ fix here

  if (input.file instanceof File) {
    formData.append('file', input.file)
  }

  try {
    const res = await axios.post(`${USER_API_END_POINT}/profile/update`, formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
      withCredentials: true,
    })

    if (res.data.success) {
      dispatch(setUser(res.data.user))
      toast.success(res.data.message)
      setOpen(false)
    }
  } catch (error) {
    console.error('Update error:', error)
    toast.error(error.response?.data?.message || 'Something went wrong')
  } finally {
    setLoading(false)
  }
}


  return (
    <Dialog open={open}>
      <DialogContent
        className="sm:max-w-[425px] bg-white"
        onInteractOutside={() => setOpen(false)}
      >
        <DialogHeader>
          <DialogTitle>Update Profile</DialogTitle>
          <DialogDescription>
            Update your profile details below.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={onSubmitHandler}>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label className="text-right" htmlFor="fullname">
                Name
              </Label>
              <Input
                id="fullname"
                name="fullname"
                value={input.fullname}
                type="text"
                onChange={changeEventHandler}
                className="col-span-3"
              />
            </div>

            <div className="grid grid-cols-4 items-center gap-4">
              <Label className="text-right" htmlFor="email">
                Email
              </Label>
              <Input
                id="email"
                name="email"
                type="email"
                value={input.email}
                onChange={changeEventHandler}
                className="col-span-3"
              />
            </div>

            <div className="grid grid-cols-4 items-center gap-4">
              <Label className="text-right" htmlFor="phoneNumber">
                Ph Number
              </Label>
              <Input
                id="phoneNumber"
                name="phoneNumber"
                type="text"
                value={input.phoneNumber}
                onChange={changeEventHandler}
                className="col-span-3"
              />
            </div>

            <div className="grid grid-cols-4 items-center gap-4">
              <Label className="text-right" htmlFor="bio">
                Bio
              </Label>
              <Input
                id="bio"
                name="bio"
                type="text"
                value={input.bio}
                onChange={changeEventHandler}
                className="col-span-3"
              />
            </div>

            <div className="grid grid-cols-4 items-center gap-4">
              <Label className="text-right" htmlFor="skills">
                Skills
              </Label>
              <Input
                id="skills"
                name="skills"
                type="text"
                value={input.skills.join(', ')}
                onChange={changeEventHandler}
                className="col-span-3"
              />
            </div>

            <div className="grid grid-cols-4 items-center gap-4">
              <Label className="text-right" htmlFor="file">
                Resume
              </Label>
              <Input
                id="file"
                name="file"
                type="file"
                onChange={fileChangeHandler}
                accept="application/pdf"
                className="col-span-3"
              />
            </div>
          </div>

          <DialogFooter>
            {loading ? (
              <Button className="w-full bg-blue-950 text-white my-4" disabled>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Please Wait
              </Button>
            ) : (
              <Button type="submit" className="w-full bg-blue-950 text-white my-4">
                Update
              </Button>
            )}
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}

export default UpdateProfileDialog
