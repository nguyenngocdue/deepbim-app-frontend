import useScrollRestoration from '@/hooks/useScrollRestoration';
import ContactUsMain from '@/sections/ContactUsMain';


const ContactUsPage: React.FC = () => {
  useScrollRestoration();
  return (
    <ContactUsMain />
  );
};

export default ContactUsPage;
