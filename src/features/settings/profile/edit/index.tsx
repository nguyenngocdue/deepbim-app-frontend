import ContentSection from '../../components/content-section'
import EditProfilePage from './EditProfile'

export default function SettingsProfile() {
  return (
    <ContentSection
      title='Profile'
      desc='This is how others will see you on the site.'
    >
      <EditProfilePage />
    </ContentSection>
  )
}
