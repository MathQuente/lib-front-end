import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../../hooks/useAuth'
import { useDeleteAccount } from '../../hooks/useDeleteAccount'
import { useUserProfile } from '../../hooks/useUserProfile'
import { Button } from '../button'
import { DeleteAccountDialog } from './deleteAccountDialog'

export function DeleteAccountSection() {
  const { UserProfileResponse } = useUserProfile()
  const { logout } = useAuth()
  const navigate = useNavigate()
  const [open, setOpen] = useState(false)
  const { deleteAccount, isDeleting, needsReauth, errorMessage, resetError } =
    useDeleteAccount()

  const profile = UserProfileResponse?.user
  const confirmationText = profile?.userName || profile?.email
  if (!confirmationText) return null

  const handleOpenChange = (next: boolean) => {
    if (!next) resetError()
    setOpen(next)
  }

  const handleReauth = async () => {
    await logout()
    navigate('/auth?tab=login', { replace: true })
  }

  return (
    <section
      aria-labelledby="delete-account-title"
      className="mx-6 mb-6 pt-6 border-t border-dark-border flex flex-col gap-3"
    >
      <h2 id="delete-account-title" className="text-white font-semibold">
        Excluir conta
      </h2>
      <p className="text-sm text-gray-400">
        Apaga sua conta e seus dados de forma definitiva.
      </p>
      <div>
        <Button type="button" variant="danger" onClick={() => setOpen(true)}>
          Excluir minha conta
        </Button>
      </div>

      <DeleteAccountDialog
        open={open}
        onOpenChange={handleOpenChange}
        confirmationText={confirmationText}
        onConfirm={deleteAccount}
        onEdit={resetError}
        onReauth={handleReauth}
        isLoading={isDeleting}
        needsReauth={needsReauth}
        errorMessage={errorMessage}
      />
    </section>
  )
}
