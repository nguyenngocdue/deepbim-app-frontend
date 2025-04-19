import { useEffect, useState } from 'react';
import { useRouter } from '@tanstack/react-router';
import { LanguageProvider } from '@/context/LanguageContext';
import useScrollRestoration from '@/hooks/useScrollRestoration';
import { fetchUserProfile } from '../api';
import Header from '@/sections/ Header';
import { useAppDispatch } from '@/hooks/reduxHooks';
import { clearUser, setCurentUser } from '@/store/slices/AuthSlice';
import { GuestAccessPanel } from '@/components/GuestAccessPanel';
import { useTranslation } from 'react-i18next';
import ConnectorHeading from '@/sections/ConnectorHeading';
import ConnectorMain from '@/sections/ConnectorMain';

interface UserProfile {
  id: number;
  username: string | null;
  email: string;
  createdAt: string;
  updatedAt: string;
}

const ConnectorPage: React.FC = () => {
  useScrollRestoration();
  const { navigate } = useRouter();
  const [user, setUser] = useState<UserProfile | null>(null);
  const dispatch = useAppDispatch();
  const { t } = useTranslation();
  useEffect(() => {
    async function loadUserProfile() {
      const token = localStorage.getItem('access_token');
      if (!token) {
        setUser(null);
        dispatch(clearUser());
        return;
      }
      try {
        const userData = await fetchUserProfile();
        setUser(userData);
        dispatch(setCurentUser(userData));
      } catch (err: any) {
        console.error(err.message);
        setUser(null);
        dispatch(clearUser());
      } 
    }
  
    loadUserProfile();
  }, [dispatch]);

  return (
    <div className="bg-behind h-svh">
      <LanguageProvider>
        <Header/>
        <div className='realative'>
          {!user && (
              <GuestAccessPanel
                message={t("panel_alert.message")}
                actionText={t("panel_alert.action_text")}
                onAction={() => navigate({ to: '/sign-in' })}
                dismissable
              />
            )}
        </div>
        <ConnectorHeading />
        <ConnectorMain/>
      </LanguageProvider>
    </div>
  );
};

export default ConnectorPage;
