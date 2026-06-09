import userProfilePictureDefault from '../../assets/Default_pfp.svg.png'

export function UserProfilePicture({
  profilePicture,
  userName
}: {
  profilePicture?: string
  userName: string
}) {
  return (
    <div className="absolute left-6 bottom-0 translate-y-1/2 size-16 md:size-20 rounded-full border-2 border-[#7A38CA] bg-[#1A1C26] overflow-hidden flex-shrink-0">
      <img
        src={profilePicture || userProfilePictureDefault}
        alt={`Foto de perfil de ${userName}`}
        loading="lazy"
        className="w-full h-full object-cover"
      />
    </div>
  )
}
