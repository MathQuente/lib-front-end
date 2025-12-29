import userProfilePictureDefault from '../../assets/Default_pfp.svg.png'

export function UserProfilePicture({
  profilePicture,
  userName
}: {
  profilePicture?: string
  userName: string
}) {
  return (
    <div className="absolute top-[58px] left-[16%] sm:top-[60px] sm:left-[16%] md:top-[70px] lg:top-[90px] lg:left-[15%] md:left-[16%] transform -translate-x-1/2 size-16 sm:size-20 md:size-24 lg:size-28 bg-[#272932] rounded-full flex items-center justify-center border-2 border-purple-500">
      <img
        src={profilePicture || userProfilePictureDefault}
        alt={`Foto de perfil de ${userName}`}
        loading="lazy"
        className="size-14 sm:size-16 md:size-20 lg:size-[6.7rem] rounded-full object-cover"
      />
    </div>
  )
}
